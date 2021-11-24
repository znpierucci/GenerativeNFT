const fs = require("fs");
const myArgs = process.argv.slice(2);
const {createCanvas, loadImage} = require("canvas");
const {layers, width, height} = require("./feature_models/config.js")
const console = require("console");
const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

//first argument after <node index.js> will determine number of NFTs to be generated
const nftCount = myArgs.length > 0 ? (myArgs[0]) : 1;

var metadataList = [];
var attributesList = [];
var dnaList = [];

//add metadata to NFT
const addMetadata = (_dna, _nftCount) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: _dna,
        id: _nftCount,
        date: dateTime,
        attributes: attributesList,
    };
    metadataList.push(tempMetadata);
    attributesList = [];
};

const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        name: selectedElement.name,
        rarity: selectedElement.rarity,
    });
};

const loadLayerImage = async (_layer) => {
    return new Promise(async(resolve) => {
        const image = await loadImage(`${_layer.location}${_layer.selectedElement.fileName}`);
        resolve({layer: _layer, loadedImage: image})
    });
};

const drawElement = (_element) => {
    context.drawImage(
        _element.loadedImage, 
        _element.layer.position.x, 
        _element.layer.position.y, 
        _element.layer.size.width, 
        _element.layer.size.height
    );
    addAttributes(_element);
};

const constructLayerToDNA = (_dna, _layers) => {
    let dnaSegment = _dna.toString().match(/.{1,2}/g);
    let mappedDNAToLayers = _layers.map((layer) => {
        let selectedElement = layer.elements[parseInt(dnaSegment) % layer.elements.length]
        return {
            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement
        };
    });
    return mappedDNAToLayers;
};

// const signImage = () => {
//     context.fillStyle = "#000000";
//     context.font = "bold 30pt Courier";
//     context.textBaseline = "top";
//     context.textAlign = "left";
//     context.fillText(_sig, 40, 40);
// };

// const genColor = () => {
//     let hue = Math.floor(Math.random() * 360);
//     let pastel = `hsl(${hue}, 100%, 85%)`;
//     return pastel;
// }

// const drawBackground = () => {
//     context.fillStyle = genColor()";
//     context.fillRect(0, 0, width, height);
// };

//save each image
const saveImage = (_nftCount) => {
    fs.writeFileSync(`./output/test#${_nftCount}.png`, canvas.toBuffer("image/png"));
};

//check for unique DNA
const isDNAUnique = (_dnaList = [], _dna = []) => {
    let foundDNA = _dnaList.find((i) => i === _dna);
    return foundDNA == undefined ? true : false;
};

//create each NFT's DNA
const createDNA = (_length) => {
    let random = Math.floor(Number(`1e${_length}`) + Math.random() * Number(`9e${_length}`));
    return random;
};

//write our metadata
const writeMetaData = (_data) => {
    //TODO: format it better
    fs.writeFileSync("./output/metadata.json", _data);
};

//loop for each layer of each nft and draw
const startBatch = async () => {
    writeMetaData("");
    let currentNFT = 1;
    while (currentNFT <= nftCount) {
        let newDNA = createDNA(layers.length * 2 - 1);
        if (isDNAUnique(dnaList, newDNA)) {
            let results = constructLayerToDNA(newDNA, layers);
            let loadedElements = [];
            results.forEach((layer) => {
                loadedElements.push(loadLayerImage(layer));
            });
            await Promise.all(loadedElements).then((elementArray) => {
                //drawBackground();
                elementArray.forEach((element) => {
                    drawElement(element);
                });
                saveImage(currentNFT);
                addMetadata(newDNA, currentNFT);
            });
            console.log("creating nft " + currentNFT);
            dnaList.push(newDNA);
            currentNFT++;
        }
    }
    writeMetaData(JSON.stringify(metadataList));
};

//start script!
startBatch();

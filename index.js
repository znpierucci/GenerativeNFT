const fs = require("fs");
const {createCanvas, loadImage} = require("canvas");
const { layers, width, height,
    projectName, description, baseImageUri, 
    totalNFTCount} = require("./feature_models/config.js");
const console = require("console");
const { SSL_OP_LEGACY_SERVER_CONNECT } = require("constants");
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");
var metadataList = [];
var attributesList = [];
var dnaList = [];

//add metadata to NFT
const addMetadata = (_dna, _nftCount) => {
    let dateTime = Date.now();
    let tempMetadata = {
        dna: _dna.join(""),
        name: `${projectName} #${_nftCount}`,
        description: description,
        image: `${baseImageUri}/${_nftCount}`,
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
        const image = await loadImage(`${_layer.selectedElement.path}`);
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

const constructLayerToDNA = (_dna = [], _layers = [], _rarities = []) => {
    let mappedDNAToLayers = _layers.map((layer, index) => {
        let selectedElement = layer.elements[_rarities[index]][_dna[index]];
        return {
            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement
        };
    });
    return mappedDNAToLayers;
};

//save each image
const saveImage = (_nftCount) => {
    fs.writeFileSync(`./output/${projectName}#${_nftCount}.png`, canvas.toBuffer("image/png"));
};

//chooses rarity
const chooseRarity = () => {
    rarityNum = Math.random();
    if (rarityNum < 0.2) {
      return "legendary";
    } else if (rarityNum < 0.4) {
      return "super_rare";
    } else if (rarityNum < 0.6) {
      return "rare";
    } else if (rarityNum < 0.8) {
      return "uncommon";
    } else {
      return "common";
    }
};

//generate rarities based on how many layers exist
const generateRarityArray = (_amount) => {
    let rarities = [];
    let count = 0;
    while (count < _amount) {
        let rarity = chooseRarity();
        console.log(rarity);
        rarities.push(rarity);
        count++;
    }
    return rarities;
};

//check for unique DNA
const isDNAUnique = (_dnaList = [], _dna = []) => {
    let foundDNA = _dnaList.find((i) => i.join("") === _dna.join(""));
    return foundDNA == undefined ? true : false;
};

//create each NFT's DNA
const createDNA = (_layers, _rarities = []) => {
    let random = [];
    _layers.forEach((layer, index) => {
        let num = Math.floor(Math.random() * layer.elements[_rarities[index]].length);
        random.push(num);
    });
    return random;
};

//write our metadata
const writeMetaData = (_data) => {
    fs.writeFileSync("./output/metadata.json", _data);
};

//loop for each layer of each nft and draw
const startBatch = async () => {
    writeMetaData("");
    let currentNFT = 1;
    while (currentNFT <= totalNFTCount) {
        let rarities = generateRarityArray(layers.length);
        let newDNA = createDNA(layers, rarities);
        //if (isDNAUnique(dnaList, newDNA)) {
            let results = constructLayerToDNA(newDNA, layers, rarities);
            let loadedElements = [];
            results.forEach((layer) => {
                loadedElements.push(loadLayerImage(layer));
            });
            await Promise.all(loadedElements).then((elementArray) => {
                //context.clearRect(0, 0, width, height);
                //drawBackground();
                elementArray.forEach((element) => {
                    drawElement(element);
                });
                //signImage(`#${currentNFT}`);
                saveImage(currentNFT);
                addMetadata(newDNA, currentNFT);
            });
            console.log("Created NFT #" + currentNFT);
            dnaList.push(newDNA);
            currentNFT++;
        //} else {
        //    console.log("DNA Exists!");
        //}
    }
    writeMetaData(JSON.stringify(metadataList));
};

//start script!
startBatch();





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
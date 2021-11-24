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

var metadata = [];
var attributes = [];
var hash = [];
var decodedHash =[];
var dnaList = [];
var rarity = "";

//add metadata to NFT
const addMetadata = (_nftCount) => {
    let dateTime = Date.now();
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        id: _nftCount,
        date: dateTime,
        attributes: attributes,
    };
    metadata.push(tempMetadata);
    attributes = [];
    hash = [];
    decodedHash = [];
};

const addAttributes = (_element, _layer) => {
    let tempAttributes = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rarity: _element.rarity,
    };
    attributes.push(tempAttributes);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push({[_layer.id]: _element.id});
};

const chooseRarity = () => {
    rarityNum = Math.random();
    switch (rarityNum) {
        case rarityNum < 0.005:
            rarity = "legendary";
            break;
        case rarityNum < 0.01:
            rarity = "super rare";
            break;
        case rarityNum < 0.1:
            rarity = "rare";
            break;
        case rarityNum < 0.4:
            rarity = "uncommon";
            break;
        default:
            rarity = "common";
    }
}

//draw each layer
const drawLayer = async (_layer, _nftCount) => {
    //TODO: insert random function with weight
    chooseRarity();
    //choose from rarity
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    context.drawImage(image, _layer.position.x, _layer.position.y, _layer.size.width, _layer.size.height);
    saveImage(canvas, _nftCount);
};

//save each image
const saveImage = (_canvas, _nftCount) => {
    fs.writeFileSync(`./output/test#${_nftCount}.png`, _canvas.toBuffer("image/png"));
};

//check for unique DNA
// const isDNAUnique = (_dnaList = [], _dna = []) => {
//     let foundDNA = _dnaList.find((i) => i.join("") === _dna.join(""));
//     return foundDNA == undefined ? true : false;
// };

//create each NFT's DNA
// const createDNA = (_length) => {
//     let random = Math.floor(Number(`1e${_length}`) + Math.random() * Number(`9e${_length}`));
//     return random;
// };

//write our metadata
const writeMetaData = () => {
    //TODO: format it better
    fs.writeFileSync("./output/metadata.json", JSON.stringify(metadata));
};

//loop for each layer of each nft and draw
const startBatch = () => {
    let currentNFT = 1;
    while (currentNFT <= nftCount) {
        layers.forEach(layer => {
            drawLayer(layer, currentNFT);
        })
        addMetadata(currentNFT);
        console.log("creating nft " + currentNFT);
        currentNFT++;
    }
};

//start script!
startBatch();
writeMetaData();

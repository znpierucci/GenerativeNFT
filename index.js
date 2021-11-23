const fs = require("fs");
const myArgs = process.argv.slice(2);
const {createCanvas, loadImage} = require("canvas");
const {layers, width, height} = require("./FeatureModels/config.js")
const console = require("console");
const canvas = createCanvas(width, height);
const context = canvas.getContext("2d");

//first argument after <node index.js> will determine number of NFTs to be generated
const nftCount = myArgs.length > 0 ? (myArgs[0]) : 1;

var metadata = [];
var attributes = [];
var hash = [];
var decodedHash =[];

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

//draw each layer
const drawLayer = async (_layer, _nftCount) => {
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

//loop for each layer of each nft and draw
for (let i = 1; i <= nftCount; i++) {
    layers.forEach(layer => {
        drawLayer(layer, i);
    })
    addMetadata(i);
    console.log("creating nft " + i);
}

//error handling metadata file write
fs.readFile("./output/metadata.json", (err, data) => {
    if (err) throw err;
    fs.writeFileSync("./output/metadata.json", JSON.stringify(metadata));
});

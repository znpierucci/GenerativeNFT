const fs = require("fs");
const {createCanvas, loadImage} = require("canvas");
var crypto = require('crypto');
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
const addMetadata = (_newDNA, _nftCount) => {
    let dateTime = Date.now();
    let tempMetadata = {
        hash: crypto.createHash('sha256').update(_newDNA.join("")).digest('hex'),
        name: `${projectName} #${_nftCount}`,
        description: description,
        image: `${baseImageUri}/${projectName}#${_nftCount}.png`,
        id: _nftCount,
        date: dateTime,
        attributes: attributesList,
    };
    metadataList.push(tempMetadata);
    attributesList = [];
};

//add the attributes to the list to be used in metadata
const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        type: selectedElement.type,
        name: selectedElement.name,
        rarity: selectedElement.rarity,
    });
};

//loads each layers image
const loadLayerImage = async (_layer) => {
    return new Promise(async(resolve) => {
        const image = await loadImage(`${_layer.selectedElement.path}`);
        resolve({layer: _layer, loadedImage: image})
    });
};

//draws the element onto the image - called on each layer of each nft
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

//creates a layer based off of the file location and rarity
const constructLayerFromLocation = (_location = [], _layers = [], _rarities = []) => {
    let mappedLocationToLayers = _layers.map((layer, index) => {
        let selectedElement = layer.elements[_rarities[index]][_location[index]];
        return {
            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement
        };
    });
    return mappedLocationToLayers;
};

//save each image
const saveImage = (_nftCount) => {
    fs.writeFileSync(`./output/${projectName}#${_nftCount}.png`, canvas.toBuffer("image/png"));
};

//chooses rarity based off RNG and weights
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

//generate a rarity for each layer
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

//check for unique file locations
const isLocationUnique = (_dnaList = [], _newDNA = []) => {
    let found = _dnaList.find((i) => i.join("") === _newDNA.join(""));
    return found == undefined ? true : false;
};

//creates a list of DNA based off of the rarity and location of attribute file
const createDNAList = (_newLocation = [], _rarities = []) => {
    let dna = [];
    _rarities.forEach((rarity, index) => {
        let current = _newLocation[index]+rarity;
        dna.push(current);
    });
    return dna;
};

//create each NFT's Location
const createLocation = (_layers, _rarities = []) => {
    let random = [];
    _layers.forEach((layer, index) => {
        //choose random attribute
        let num = Math.floor(Math.random() * layer.elements[_rarities[index]].length);
        random.push(num);
    });
    return random;
};

//write our metadata
const writeMetaData = (_data) => {
    fs.writeFileSync("./output/metadata.json", _data);
};

//write metadata to single file
const saveMetadataSingleFile = (_nftCount) => {
    fs.writeFileSync(`./output/${projectName}#${_nftCount}.json`, 
    JSON.stringify(metadataList.find(meta => meta.id == _nftCount))
    );
};

//loop for each layer of each nft and draw
const startBatch = async () => {
    writeMetaData("");
    let currentNFT = 1;
    while (currentNFT <= totalNFTCount) {
        let rarities = generateRarityArray(layers.length);
        let newLocation = createLocation(layers, rarities);
        let newDNA = createDNAList(newLocation, rarities);
        if (isLocationUnique(dnaList, newDNA)) {
            let results = constructLayerFromLocation(newLocation, layers, rarities);
            let loadedElements = [];
            results.forEach((layer) => {
                loadedElements.push(loadLayerImage(layer));
            });
            await Promise.all(loadedElements).then((elementArray) => {
                elementArray.forEach((element) => {
                    drawElement(element);
                });
                saveImage(currentNFT);
                addMetadata(newDNA, currentNFT);
                saveMetadataSingleFile(currentNFT);
                console.log("Created NFT #" + currentNFT);
            });
            dnaList.push(newDNA);
            currentNFT++;
        } else {
            console.log("NFT Permutation Already Exists! Rerolling Features...");
        }
    }
    console.log(dnaList);
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

//context.clearRect(0, 0, width, height);
//drawBackground();
//signImage(`#${currentNFT}`);
const fs = require("fs");
const dir = __dirname;

const width = 1000;
const height = 1000;

//chooses rarity
const chooseRarity = () => {
  rarityNum = Math.random();
  if (rarityNum < 0.2) {
    console.log("made it to legendary");
    return "legendary";
  } else if (rarityNum < 0.4) {
    console.log("made it to super rare");
    return "super_rare";
  } else if (rarityNum < 0.6) {
    console.log("made it to rare");
    return "rare";
  } else if (rarityNum < 0.8) {
    return "uncommon";
    console.log("made it to uncommon");
  } else {
    console.log("made it to common");
    return "common";
  }
}

//remove the rarity and file extension of the image - file must be png/jpg (3 chars long)
const cleanName = _str => {
    let name = _str.slice(0, -4);
    return name;
  };

//
const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                id: index + 1,
                name: cleanName(i),
                fileName: i,
                //rarity: getRarity(i),
            };
        });
};

//layers of the NFT in order
const layers = [
    {
        id: 1,
        name: "background",
        location: `${dir}/backgrounds/${chooseRarity()}/`,
        elements: getElements(`${dir}/backgrounds/${chooseRarity()}/`),
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
    {
        id: 2,
        name: "base model",
        location: `${dir}/base_models/${chooseRarity()}/`,
        elements: getElements(`${dir}/base_models/${chooseRarity()}/`),
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
];

module.exports = {layers, width, height};
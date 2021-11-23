const fs = require("fs");
const dir = __dirname;

const width = 1000;
const height = 1000;

//rarity file extensions
const rarity = [
    {key: "", val: "common"},
    {key: "_uncommon", val: "uncommon"},
    {key: "_rare", val: "rare"},
    {key: "_super", val: "super rare"},
    {key: "_legendary", val: "legendary"},
];

//checks for rarity filename ending
const getRarity = _str => {
    let itemRarity;
  
    rarity.forEach((r) => {
      if (_str.includes(r.key)) {
        itemRarity = r.val;
      }
    });
  
    return itemRarity;
  };

//remove the rarity and file extension of the image - file must be png/jpg (3 chars long)
const cleanName = _str => {
    let name = _str.slice(0, -4);
    rarity.forEach((r) => {
      name = name.replace(r.key, "");
    });
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
                rarity: getRarity(i),
            };
        });
};

//layers of the NFT in order
const layers = [
    {
        id: 1,
        name: "background",
        location: `${dir}/backgrounds/`,
        elements: getElements(`${dir}/backgrounds/`),
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
    {
        id: 2,
        name: "base model",
        location: `${dir}/base_models/`,
        elements: getElements(`${dir}/base_models/`),
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
];

module.exports = {layers, width, height};
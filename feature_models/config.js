const fs = require("fs");
const path = require("path");
const dir = __dirname;

const width = 1000;
const height = 1000;

const projectName = "Pooch";
const description = "This NFT was made by Pooch.";
const baseImageUri = "https://pooch/nft";
const totalNFTCount = 5;

//remove the file extension of the image - file must be png/jpg (3 chars long)
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

//get the attribute type - travel 2 directories backward
const getAttributeType = (_path) => {
  let attribute = _path.split('/');
  attribute = attribute[attribute.length - 3];
  return attribute.substring(2);
}

//get rarity
const getRarity = (_path) => {
  if (_path.includes("/legendary/")) {
    return "legendary";
  } else if (_path.includes("/super_rare/")) {
    return "super rare";
  } else if (_path.includes("/rare/")) {
    return "rare";
  } else if (_path.includes("/uncommon/")) {
    return "uncommon";
  } else if (_path.includes("/common/")) {
    return "common";
  } else {
    return "undefined"
  }
}

//get the elements
const getElements = (path) => {
  return fs
      .readdirSync(path)
      .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
      .map((i, index) => {
          return {
              type: getAttributeType(path),
              name: cleanName(i),
              rarity: getRarity(path),
              path: `${path}${i}`,
          };
      });
};

//layers of the NFT in order
const layers = [
  {
      elements: {
        common: getElements(`${dir}/1-background/common/`),
        uncommon: getElements(`${dir}/1-background/uncommon/`),
        rare: getElements(`${dir}/1-background/rare/`),
        super_rare: getElements(`${dir}/1-background/super_rare/`),
        legendary: getElements(`${dir}/1-background/legendary/`)
      },
      position: {x: 0, y: 0},
      size: {width: width, height: height},
  },
  {
    elements: {
      common: getElements(`${dir}/2-suit/common/`),
      uncommon: getElements(`${dir}/2-suit/uncommon/`),
      rare: getElements(`${dir}/2-suit/rare/`),
      super_rare: getElements(`${dir}/2-suit/super_rare/`),
      legendary: getElements(`${dir}/2-suit/legendary/`)
    },
      position: {x: 0, y: 0},
      size: {width: width, height: height},
  },
  {
    elements: {
      common: getElements(`${dir}/3-skin/common/`),
      uncommon: getElements(`${dir}/3-skin/uncommon/`),
      rare: getElements(`${dir}/3-skin/rare/`),
      super_rare: getElements(`${dir}/3-skin/super_rare/`),
      legendary: getElements(`${dir}/3-skin/legendary/`)
    },
      position: {x: 0, y: 0},
      size: {width: width, height: height},
  },
  {
    elements: {
      common: getElements(`${dir}/4-mouth/common/`),
      uncommon: getElements(`${dir}/4-mouth/uncommon/`),
      rare: getElements(`${dir}/4-mouth/rare/`),
      super_rare: getElements(`${dir}/4-mouth/super_rare/`),
      legendary: getElements(`${dir}/4-mouth/legendary/`)
    },
      position: {x: 0, y: 0},
      size: {width: width, height: height},
  },
  {
    elements: {
      common: getElements(`${dir}/5-eyes/common/`),
      uncommon: getElements(`${dir}/5-eyes/uncommon/`),
      rare: getElements(`${dir}/5-eyes/rare/`),
      super_rare: getElements(`${dir}/5-eyes/super_rare/`),
      legendary: getElements(`${dir}/5-eyes/legendary/`)
    },
      position: {x: 0, y: 0},
      size: {width: width, height: height},
  },
];

module.exports = {
  layers, 
  width, 
  height,
  projectName,
  description, 
  baseImageUri, 
  totalNFTCount
};
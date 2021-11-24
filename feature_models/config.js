const fs = require("fs");
const dir = __dirname;

const width = 1000;
const height = 1000;
const description = "This NFT was made by Pooch.";
const baseImageUri = "https://pooch/nft";
const startEditionFrom = 1;
const endEditionAt = 5;
const totalNFTCount = 5;

const rarityWeights = [
  {
    value: "legendary",
    from: 1,
    to: 1,
  },
  {
    value: "super_rare",
    from: 2,
    to: 2,
  },
  {
    value: "rare",
    from: 3,
    to: 3,
  },
  {
    value: "uncommon",
    from: 4,
    to: 4,
  },
  {
    value: "common",
    from: 5,
    to: totalNFTCount,
  },
];

//remove the file extension of the image - file must be png/jpg (3 chars long)
const cleanName = _str => {
    let name = _str.slice(0, -4);
    return name;
  };

//get the elements
const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                name: cleanName(i),
                path: `${path}/${i}`,
            };
        });
};

//layers of the NFT in order
const layers = [
    {
        elements: {
          common: getElements(`${dir}/backgrounds/common`),
          uncommon: getElements(`${dir}/backgrounds/uncommon`),
          rare: getElements(`${dir}/backgrounds/rare`),
          super_rare: getElements(`${dir}/backgrounds/super_rare`),
          legendary: getElements(`${dir}/backgrounds/legendary`)
        },
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
    {
      elements: {
        common: getElements(`${dir}/base_models/common`),
        uncommon: getElements(`${dir}/base_models/uncommon`),
        rare: getElements(`${dir}/base_models/rare`),
        super_rare: getElements(`${dir}/base_models/super_rare`),
        legendary: getElements(`${dir}/base_models/legendary`)
      },
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
];

module.exports = {
  layers, 
  width, 
  height,
  description, 
  baseImageUri, 
  totalNFTCount, 
  startEditionFrom, 
  endEditionAt,
  rarityWeights
};
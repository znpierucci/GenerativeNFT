const fs = require("fs");
const dir = __dirname;

const width = 1000;
const height = 1000;
const description = "This NFT was made by Pooch.";
const baseImageUri = "https://pooch/nft";
const totalNFTCount = 5;

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
          common: getElements(`${dir}/1-backgrounds/common`),
          uncommon: getElements(`${dir}/1-backgrounds/uncommon`),
          rare: getElements(`${dir}/1-backgrounds/rare`),
          super_rare: getElements(`${dir}/1-backgrounds/super_rare`),
          legendary: getElements(`${dir}/1-backgrounds/legendary`)
        },
        position: {x: 0, y: 0},
        size: {width: width, height: height},
    },
    {
      elements: {
        common: getElements(`${dir}/2-base_models/common`),
        uncommon: getElements(`${dir}/2-base_models/uncommon`),
        rare: getElements(`${dir}/2-base_models/rare`),
        super_rare: getElements(`${dir}/2-base_models/super_rare`),
        legendary: getElements(`${dir}/2-base_models/legendary`)
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
  totalNFTCount
};
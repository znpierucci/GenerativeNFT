const fs = require("fs");
const {createCanvas, loadImage} = require("canvas");
const canvas = createCanvas(1000, 1000);
const context = canvas.getContext("2d");

const drawImage = async () => {
    const image = await loadImage("./FeatureModels/BaseModels/beanos.png");
    context.drawImage(image, 0, 0, 1000, 1000);
    console.log("completed draw.");
    saveImage(canvas);
};

const saveImage = (_canvas) => {
    fs.writeFileSync("./ResultImages/test.png", _canvas.toBuffer("image/png"));
    console.log("completed save.");
};

drawImage();
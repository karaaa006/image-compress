"use strict";

import fs from "fs";
import sharp from "sharp";

const IMG_DIR = "./data";

function addSuffixToFileName(fileName, suffix = "_suffix") {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return `${fileName}${suffix}`;
  } else {
    const fileNameWithoutExtension = fileName.slice(0, lastDotIndex);
    const fileExtension = fileName.slice(lastDotIndex);
    return `${fileNameWithoutExtension}${suffix}${fileExtension}`;
  }
}

async function processFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = dir + "/" + file;

    if (fs.statSync(filePath).isDirectory()) {
      await processFiles(filePath, files_);
    } else {
      if (file.includes(".webp")) {
        const image = sharp(filePath);
        const imageMetadata = await image.metadata();

        if (imageMetadata.width > 1900 || imageMetadata.height > 1400) {
          await sharp(filePath)
            .resize(1900, 1400, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            .toBuffer((err, buffer, info) => {
              fs.writeFile(filePath, buffer, (e) => console.log(e));
              console.log(filePath);
            });
        }
      }
    }
  }

  return files_;
}

processFiles(IMG_DIR);

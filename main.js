const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir("unzipped"))
  .then((pngFilePaths) => {
      const convertList = pngFilePaths.map((image) => {
        return IOhandler.grayScale(image, `${pathProcessed}/${image.slice(9)}`);
      });
      return Promise.all(convertList);
  })
  .then(() => console.log("Grayscale operation completed successfully."))
  .catch((err) => console.error("Error:", err));
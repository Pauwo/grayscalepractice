/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const AdmZip = require("adm-zip");
const fs = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
PNG = require("pngjs").PNG,
path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    // Create the output directory if it doesn't exist
    fs.mkdir(pathOut, { recursive: true })
      .then(() => {
        const zip = new AdmZip(pathIn);

        // Extract the files
        zip.extractAllTo(pathOut, /*overwrite=*/ true);

        console.log("Extraction operation complete");
        resolve();
      })
      .catch((err) => {
        console.error("Error during extraction:", err);
        reject(err);
      });
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir)
    .then((files) => {
      const pngFiles = files
        .filter((file) => path.extname(file).toLowerCase() === ".png")
        .map((file) => path.join(dir, file));
      return pngFiles;
    })
    .catch((err) => {
      throw err;
    });
};


/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
// const grayScale = (pathIn, pathOut) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(pathIn)
//       .then((inputBuffer) => {
//         const inputImage = new PNG({
//           filterType: 4,
//         });
//         try {
//           inputImage.parse(inputBuffer);
//         } catch (parseError) {
//           // Handle the parseError here
//           reject(`Error parsing PNG: ${parseError}`);
//           return;
//         }

//         for (let y = 0; y < inputImage.height; y++) {
//           for (let x = 0; x < inputImage.width; x++) {
//             const idx = (inputImage.width * y + x) << 2;
//             const grayValue = (inputImage.data[idx] + inputImage.data[idx + 1] + inputImage.data[idx + 2]) / 3;
//             inputImage.data[idx] = grayValue;
//             inputImage.data[idx + 1] = grayValue;
//             inputImage.data[idx + 2] = grayValue;
//           }
//         }

//         const outputBuffer = Buffer.from(inputImage.data.buffer);

//         fs.writeFile(pathOut, outputBuffer)
//           .then(() => {
//             console.log("Grayscale operation complete");
//             resolve();
//           })
//           .catch((err) => reject(err));
//       })
//       .catch((err) => reject(err));
//   });
// };

const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const grayValue = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = grayValue;
            this.data[idx + 1] = grayValue;
            this.data[idx + 2] = grayValue;
          }
        }
        this.pack().pipe(createWriteStream(pathOut))
        resolve()
      })
  });
};


const zipFilePath = path.join(__dirname, "myfile.zip");
const outputDir = path.join(__dirname, "unzipped");

unzip(zipFilePath, outputDir)
  .then(() => console.log("Extraction completed successfully."))
  .then(() => readDir("unzipped"))
  .then((pngFilePaths) => {
      console.log("List of PNG files:");
      console.log(pngFilePaths)
      const convertPromises = pngFilePaths.map((image) => {
        return grayScale(image, `grayscaled/${image.slice(9)}`);
      });
      return Promise.all(convertPromises);
  })
  .then(() => console.log("Grayscale operation completed successfully."))
  .catch((err) => console.error("Error:", err));

module.exports = {
  unzip,
  readDir,
  grayScale,
};






// const path = require("path");
// /*
//  * Project: Milestone 1
//  * File Name: main.js
//  * Description:
//  *
//  * Created Date:
//  * Author:
//  *
//  */

// const IOhandler = require("./IOhandler");
// const zipFilePath = path.join(__dirname, "myfile.zip");
// const pathUnzipped = path.join(__dirname, "unzipped");
// const pathProcessed = path.join(__dirname, "grayscaled");
// const unzipper = require("unzipper");
// const fs = require("fs")


// // Read each png file...
// // 
// fs.createReadStream(zipFilePath)
//     .pipe(unzipper.Extract({ path: "./unzipped" })) // transformStream

// IOhandler.unzip()
//     .then(() => IOhandler.readDir())
//     .then(() => IOhandler.grayScale())
//     .catch((err) => console.log(err))


// var fs = require("fs"),
//   PNG = require("pngjs").PNG;

// const readStream = fs.createReadStream("in.png");
// const pngStream = new PNG().on("parsed", handleGrayScale);
// this.pack().pipe(fs.createReadStream("out.png"))

// function handleGrayScale(params) {
    
// }
//   .pipe(
//     new PNG({
//       filterType: 4,
//     })
//   )
//   .on("parsed", function () {
//     for (var y = 0; y < this.height; y++) {
//       for (var x = 0; x < this.width; x++) {
//         var idx = (this.width * y + x) << 2;

//         // invert color
//         this.data[idx] = 255 - this.data[idx];              // R
//         this.data[idx + 1] = 255 - this.data[idx + 1];      // G
//         this.data[idx + 2] = 255 - this.data[idx + 2];      // B

//         // and reduce opacity
//         this.data[idx + 3] = this.data[idx + 3] >> 1;       // A
//       }
//     }

//     this.pack().pipe(fs.createWriteStream("out.png"));
//   });
// // need to use promises make sure you use promises
//   // 6 << 2 (basically 6*4)

//   // Step 1: Read the zip file
//   // Step 2: Unzip the zip file
//   // Step 3: Read all the png images from unzipped foler
//   // Step 4: Send them to the grayscale filter function
//   // Step 5: After ALL IMAGES have SUCCESSFULLY been grayScaled, show a success message.
//   // ALL ERRORS MUST SHOW IN .catch IN PROMISE CHAIN

//   ["img1.png","img2.png","img3.png",].forEach(img => {
//     grayScale(img); // shows success message too early
//   })

//   grayScale("img1.png")
//     .then(() => grayScale("img2.png"))
//     .then(() => grayScale("img3.png"))
//     .then(() => console.log("ALL images done!"))
// // the one below is faster
// [grayScale("img1.png"),grayScale("img2.png"),grayScale("img3.png")]
//     .then(() => console.log("ALL images done!"))
// // use promise.all

// //create .gitignore to avoid sending node_modules in github
// // in .gitignore type node_modules

// // HANDLE ERRORS AND BREAK UP CODE INTO FUNCTIONS



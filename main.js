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



var fs = require("fs"),
  PNG = require("pngjs").PNG;

fs.createReadStream("in.png")
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;

        // invert color
        this.data[idx] = 255 - this.data[idx];              // R
        this.data[idx + 1] = 255 - this.data[idx + 1];      // G
        this.data[idx + 2] = 255 - this.data[idx + 2];      // B

        // and reduce opacity
        this.data[idx + 3] = this.data[idx + 3] >> 1;       // A
      }
    }

    this.pack().pipe(fs.createWriteStream("out.png"));
  });
// need to use promises make sure you use promises
  // 6 << 2 (basically 6*4)

  // Step 1: Read the zip file
  // Step 2: Unzip the zip file
  // Step 3: Read all the png images from unzipped foler
  // Step 4: Send them to the grayscale filter function
  // Step 5: After ALL IMAGES have SUCCESSFULLY been grayScaled, show a success message.
  // ALL ERRORS MUST SHOW IN .catch IN PROMISE CHAIN

  ["img1.png","img2.png","img3.png",].forEach(img => {
    grayScale(img); // shows success message too early
  })

  grayScale("img1.png")
    .then(() => grayScale("img2.png"))
    .then(() => grayScale("img3.png"))
    .then(() => console.log("ALL images done!"))
// the one below is faster
[grayScale("img1.png"),grayScale("img2.png"),grayScale("img3.png")]
    .then(() => console.log("ALL images done!"))
// use promise.all

//create .gitignore to avoid sending node_modules in github
// in .gitignore type node_modules


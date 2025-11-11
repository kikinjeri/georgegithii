const fs = require('fs');
const path = require('path');

// Point to the gallery folder
const galleryFolder = path.join(__dirname, 'images', 'gallery');
const outputFile = path.join(__dirname, 'galleryImages.json');

fs.readdir(galleryFolder, (err, files) => {
  if (err) return console.error(err);

  const images = files
    .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f)) // only image files
    .map(f => `images/gallery/${f.replace(/ /g, "_").replace(/&/g,"and")}`); // replace spaces and &

  fs.writeFile(outputFile, JSON.stringify(images, null, 2), err => {
    if (err) console.error(err);
    else console.log("galleryImages.json generated from images/gallery!");
  });
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Parse JSON body
app.use(bodyParser.json());

const tributesFile = path.join(__dirname, 'tributes.json');
const galleryFolder = path.join(__dirname, 'images', 'gallery');

// ------------------ TRIBUTES ------------------

// GET all tributes
app.get('/api/tributes', (req, res) => {
  fs.readFile(tributesFile, 'utf8', (err, data) => {
    if (err) return res.json([]);
    res.json(JSON.parse(data));
  });
});

// POST a tribute
app.post('/api/tributes', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Name and message required' });

  fs.readFile(tributesFile, 'utf8', (err, data) => {
    let tributes = [];
    if (!err) tributes = JSON.parse(data);

    tributes.push({ name, message, date: new Date().toISOString() });

    fs.writeFile(tributesFile, JSON.stringify(tributes, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to save tribute' });
      res.json({ success: true });
    });
  });
});

// DELETE a tribute by timestamp
app.delete('/api/tributes/:timestamp', (req, res) => {
  const ts = req.params.timestamp;

  fs.readFile(tributesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read tributes' });

    let tributes = JSON.parse(data);
    const filtered = tributes.filter(t => t.date !== ts);

    fs.writeFile(tributesFile, JSON.stringify(filtered, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Failed to delete tribute' });
      res.json({ success: true });
    });
  });
});

// ------------------ GALLERY ------------------

// GET gallery images dynamically
app.get('/api/gallery', (req, res) => {
  fs.readdir(galleryFolder, (err, files) => {
    if (err) return res.status(500).json([]);

    const images = files
      .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
      .map(f => `images/gallery/${f.replace(/ /g, "_").replace(/&/g, "and")}`);

    res.json(images);
  });
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


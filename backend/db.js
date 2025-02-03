const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./image_to_pdf.db', (err) => {
  if (err) {
    console.error("Error opening the database: " + err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create the necessary tables if not already created
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pdf_filename TEXT NOT NULL,
    pdf_filepath TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_ids TEXT
  )`);
});

// Function to insert image metadata into the database
const addImage = (filename, filepath) => {
  const query = `INSERT INTO images (filename, filepath) VALUES (?, ?)`;
  db.run(query, [filename, filepath], function (err) {
    if (err) {
      console.error("Error inserting image:", err.message);
    } else {
      console.log(`Image added with ID: ${this.lastID}`);
    }
  });
};

// Function to add conversion metadata into the database
const addConversion = (pdf_filename, pdf_filepath, image_ids) => {
  const query = `INSERT INTO conversions (pdf_filename, pdf_filepath, image_ids) VALUES (?, ?, ?)`;
  db.run(query, [pdf_filename, pdf_filepath, image_ids], function (err) {
    if (err) {
      console.error("Error inserting conversion:", err.message);
    } else {
      console.log(`Conversion added with ID: ${this.lastID}`);
    }
  });
};

module.exports = { db, addImage, addConversion };

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import cors from "cors";

const app = express();
const PORT = 3000;

// Use CORS to allow requests from the React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Set the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle image uploads
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Ensure 'uploads' directory exists
}
app.post("/upload", upload.array("images"), (req, res) => {
  const uploadedFiles = req.files;
  try {
    for (const file of uploadedFiles) {
      const newFilename = file.originalname;
      const newPath = path.join("uploads", newFilename);
      fs.renameSync(file.path, newPath);
    }
    res.status(200).send("Images uploaded successfully!");
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).send("Error uploading images.");
  }
});

// Endpoint to download images as a zip file
app.get("/download", (req, res) => {
  const zipFileName = "images.zip";
  const output = fs.createWriteStream(zipFileName);
  const archive = archiver("zip");

  output.on("close", () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log(
      "Archiver has been finalized and the output file descriptor has closed."
    );
    res.download(zipFileName, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      // Optionally delete the zip file after download
      fs.unlink(zipFileName, (err) => {
        if (err) console.error("Error deleting zip file:", err);
      });
    });
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  // Add all files from the uploads directory to the zip
  archive.directory("uploads/", false);
  archive.finalize();
});

// Serve static files (optional)
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

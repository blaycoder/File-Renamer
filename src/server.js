import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import process from "process";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_SECRET_KEY,
});

// Endpoint to fetch resources from Cloudinary
app.get("/cloudinary/resources", async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:uploads") // Adjust to your folder
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources from Cloudinary:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch resources from Cloudinary" });
  }
});

app.get("/cloudinary/test", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res
      .status(200)
      .json({ message: "Cloudinary connection successful!", result });
  } catch (error) {
    console.error("Cloudinary connection failed:", error);
    res.status(500).json({ error: "Failed to connect to Cloudinary" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

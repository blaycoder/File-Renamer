import express from "express";
import axios from "axios";
import "dotenv/config";
import { Buffer } from "buffer";
import process from "process";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

app.post("/api/create-folder", async (req, res) => {
  const name = "upload-folder";
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/folders/${name}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.VITE_CLOUDINARY_API_KEY +
              ":" +
              process.env.VITE_CLOUDINARY_SECRET_KEY
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "Error creating folder:",
      error.response?.data || error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

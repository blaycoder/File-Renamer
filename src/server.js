import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();
const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
const secretKey = process.env.VITE_CLOUDINARY_SECRET_KEY;

app.post("/api/create-folder", async (req, res) => {
  const name = "upload-folder";
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/folders/${name}`,
      {}, // Axios requires an empty body for POST if no payload
      {
        auth: {
          username: apiKey,
          password: secretKey,
        },
        headers: {
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
  console.log(secretKey);
  console.log(`🚀 Server is running on port ${PORT}`);
});

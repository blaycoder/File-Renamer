import { useState } from "react";
// import axios from "axios";
// import {v2 as cloudinary} from "cloudinary";
import { Form, Input, InputNumber, Upload, message, Button } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import Header from "./components/Header";

export default function App() {
  const [baseFilename, setBaseFilename] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { Dragger } = Upload;

  const handleImageUpload = async ({ file, onSuccess, onError }) => {
    if (!file) {
      message.error("Please select an image to upload");
      return;
    }

    // const newFilename = `${baseFilename}_${
    //   fileList.length + 1
    // }${file.name.substring(file.name.lastIndexOf("."))}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json(); // Parse JSON response
      setUploadedImages((prev) => [...prev, data.public_id]); // Save image public_id
      onSuccess(data); // Call onSuccess with response data
      message.success(`${data.original_filename} uploaded successfully`);
    } catch (error) {
      message.error("Failed to upload image");
      console.error("Error uploading image:", error.message);
      onError(error); // Call onError with error
    }
  };

  const props = {
    name: "file",
    accept: "image/*",
    multiple: true,
    customRequest: handleImageUpload,
    onChange(info) {
      const { fileList: updatedFileList } = info;
      setFileList(updatedFileList);

      if (info.file.status === "done") {
        setUploadStatus(false);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

const handleDownload = async () => {
  try {
    const response = await fetch("http://localhost:3000/cloudinary/resources");
    if (!response.ok) {
      throw new Error("Failed to fetch Cloudinary resources");
    }
    const data = await response.json();
    console.log("Cloudinary Resources:", data);
    message.success("Successfully fetched Cloudinary resources!");
  } catch (error) {
    console.error("Error downloading the images:", error);
    message.error("Error downloading the images.");
  }
};

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold underline">File Upload and Rename</h1>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
      >
        <Form.Item label="Base Filename">
          <Input
            value={baseFilename}
            onChange={(e) => setBaseFilename(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Number of Images">
          <InputNumber
            min={1}
            value={imageCount}
            onChange={(value) => setImageCount(value)}
          />
        </Form.Item>

        <Form.Item label="Upload Images">
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </Form.Item>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          disabled={uploadStatus}
        >
          Download Images as ZIP
        </Button>
      </Form>
    </div>
  );
}

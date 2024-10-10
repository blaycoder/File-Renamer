import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, InputNumber, Upload, message, Button } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

export default function App() {
  const [baseFilename, setBaseFilename] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(true);
  const { Dragger } = Upload;

  // Log files when they change
  useEffect(() => {
    if (files.length > 0) {
      setFiles(files)
      console.log("Updated files:", files); // This will log the correct files
    }
  }, [files]); // This useEffect triggers when 'files' changes

  // Custom file upload handler with renaming logic
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    console.log(files)
    // Loop through the uploaded files and rename
    Array.from(files).forEach((baseFile, index) => {
      const newFilename = `${baseFilename}_${index+1}${baseFile.name.substring(
        baseFile.name.lastIndexOf(".")
      )}`;
      formData.append("images", baseFile, newFilename);
    });
    
    try {
      await axios.post("http://localhost:3000/upload", formData);
      // console.log(formData)
      onSuccess("File uploaded successfully");
      message.success(`${file.name} uploaded and renamed successfully`);
    } catch (error) {
      console.error("Error uploading file:", error);
      onError("Error uploading file");
      message.error(`Error uploading ${file.name}`);
    }
  };

  const props = {
    name: "file",
    accept: "image/*",
    multiple: true,
    customRequest: handleUpload, // Use custom request for file uploads
    onChange(info) {
      const { status } = info.file;
      const { fileList } = info;
      if (status === "done") {
        setUploadStatus(false); // Enable the download button after upload
        setFiles(fileList); // Keep track of uploaded files
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get("http://localhost:3000/download", {
        responseType: "blob", // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "images.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the images:", error);
      alert("Error downloading the images.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-bold underline">File Upload and Rename</h1>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
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
          disabled={uploadStatus} // Button is disabled until files are uploaded
        >
          Download Images as ZIP
        </Button>
      </Form>
    </div>
  );
}

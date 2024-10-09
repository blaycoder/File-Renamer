import { useState } from "react";
import axios from "axios";
import { Form, Input, InputNumber, Upload, message, Button } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

function App() {
  const [baseFilename, setBaseFilename] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(true);
  const { Dragger } = Upload;

  // Custom file upload handler with renaming logic
  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();

    //Loop through the uploaded files and rename
    for (let file_counter = 0; file_counter < files.length; file_counter++) {
      console.log(file_counter);
    }

    // Generate a new filename with baseFilename and index
    const index = files.length + 1; // Track the index for naming
    const newFilename = `${baseFilename}_${index}${file.name.substring(
      file.name.lastIndexOf(".")
    )}`;

    // Append the file to the FormData with the new filename
    formData.append("images", file, newFilename);

    try {
      await axios.post("http://localhost:3000/upload", formData);
      onSuccess("File uploaded successfully");
      message.success(`${file.name} uploaded and renamed  successfully`);
    } catch (error) {
      console.error("Error uploading file:", error);
      onError("Error uploading file");
      message.error(`Error uploading ${newFilename}`);
    }
  };

  const props = {
    name: "file",
    accept: "image/*",
    multiple: true,
    customRequest: handleUpload, // Use custom request for file uploads
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        setUploadStatus(false); // Enable the download button after upload
        setFiles(info.fileList); // Keep track of uploaded files
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

export default App;

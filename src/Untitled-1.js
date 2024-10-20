import { useState } from "react";
import axios from "axios";
import { Form, Input, InputNumber, Upload, message, Button, Flex } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

function App() {
  const [baseFilename, setBaseFilename] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(true);
  const { Dragger } = Upload;

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    // Generate a new filename with baseFilename and index
    const index = files.length + 1; // Track the index for naming
    const newFilename = `${baseFilename}_${index}${file.name.substring(
      file.name.lastIndexOf(".")
    )}`;

    // Append the file to the FormData with the new filename
    formData.append("images", file, newFilename);

    try {
      await axios.post("http://localhost:3000/upload", formData);
      onSuccess("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      onError("Error uploading images.");
    }
  };

  const props = {
    name: "file",
    accept: "image/*",
    multiple: true,
    customRequest: handleUpload,
    onChange(info) {
      const { status } = info.file;
      if (info.fileList.length !== imageCount) {
        alert(`Please upload exactly ${imageCount} images.`);
        message.error(`${info.file.name} file upload failed.`);
        return;
      }
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setUploadStatus(false);
        setFiles(info.fileList);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  // const normFile = (e) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

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
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
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
        <Form.Item label="Input">
          <Input />
        </Form.Item>

        <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
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
        <Flex gap="small">
          <Button color="primary" variant="solid" onClick={handleUpload}>
            Start Rename
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={uploadStatus}
          >
            Download Images as ZIP
          </Button>
        </Flex>
      </Form>
      <h1>Upload Images</h1>
      <input
        type="text"
        placeholder="Enter base filename"
        value={baseFilename}
        onChange={(e) => setBaseFilename(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Number of images"
        value={imageCount}
        onChange={(e) => setImageCount(Number(e.target.value))}
        required
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        required
      />
      {/* <button onClick={handleUpload}>Upload Images</button> */}
      <button onClick={handleDownload}>Download Images as ZIP</button>
    </div>
  );
}

export default App;

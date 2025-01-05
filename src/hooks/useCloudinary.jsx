import { useState } from "react";
import axios from "axios";

const useCloudinary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createFolder = async (folderName) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-folder",
        {
          folderName,
        }
      );

      setData(response.data);
      console.log("Folder created:", response.data);
    } catch (err) {
      console.error(
        "Error creating folder:",
        err.response?.data || err.message
      );
      setError(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFolder,
    isLoading,
    error,
    data,
  };
};

export default useCloudinary;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

const FaceUpload = () => {
  const [name, setName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);

      // Generate preview URLs
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));

      setFiles(selectedFiles);
      setPreviews(previews);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || files.length === 0) {
      alert('Please provide a name and upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    files.forEach((file) => formData.append('images', file));

    try {
      setIsLoading(true); // Show loader
      toast.success('Please wait. Uploading images may take sometime.');
      const response = await api.post('/faces/add-face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files.');
    } finally {
      setName('');
      setFiles([]);
      setPreviews([]);
      setIsLoading(false); // Hide loader
      // Clear the file input field
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Clear file input
      }
    }
  };

  return (
    <div>
      <h2>Upload Face Data</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* File Input */}
        <div>
          <label htmlFor="images">Upload Images:</label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Image Previews */}
        <div>
          {previews.map((preview, index) => (
            <div key={index}>
              <img src={preview} alt={`preview-${index}`} />
            </div>
          ))}
        </div>

        {/* Loader */}
        {isLoading && <div className="loader"></div>}

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {!isLoading ? 'Upload' : 'Uploading...'}
        </button>
      </form>
    </div>
  );
};

export default FaceUpload;

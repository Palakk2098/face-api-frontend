import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api';

interface Result {
  name: string;
  distance: number;
  filePaths: string[];
}

const RecognizeFace: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle file input change and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.includes('image/')) {
        toast.error('Only image type files are allowed.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Generate a preview URL
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please provide an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsLoading(true); // Show loader
      setResults([]); // Clear previous results
      toast.success('Please wait. Recognizing image may take sometime.');
      const response = await api.post('/faces/recognize-face', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResults(response.data.matches || []);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to recognize face.');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div>
      <h2>Recognize Face</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Recognize Face'}
        </button>
      </form>

      {preview && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={preview} alt="Uploaded Preview" />
        </div>
      )}

      {/* Loader */}
      {isLoading && <div className="loader"></div>}

      {results ? (
        results.length > 0 ? (
          <div>
            <h3>Results:</h3>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  <p>
                    <strong>Name:</strong> {result.name},
                    <strong> Distance:</strong> {result.distance.toFixed(2)}
                  </p>
                  <div>
                    {result.filePaths.map((filePath, i) => (
                      <img
                        key={i}
                        src={`${api.defaults.baseURL}/${filePath}`} // Assuming API serves files statically
                        alt={`${result.name} ${i + 1}`}
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !isLoading && (
            <div>Sorry! No matching records found for the uploaded image.</div>
          )
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default RecognizeFace;

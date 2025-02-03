import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  

const App = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  // Handle Image Selection from File Input (Click Upload)
  const handleImageUpload = (event) => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];
    const files = Array.from(event.target.files);

    // Filter out unsupported files
    const invalidFiles = files.filter(file => !allowedFormats.includes(file.type));

    if (invalidFiles.length > 0) {
      alert("❌ Invalid file format! Please upload PNG, JPG, JPEG, or SVG images.");
      return;
    }

    // If all files are valid, update the state
    setSelectedImages(prevImages => [...prevImages, ...files]);
  };

  // Handle Drag and Drop
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFileValidation(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // File Validation Function for Drag and Drop
  const handleFileValidation = (files) => {
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg'];
    const invalidFiles = files.filter(file => !allowedFormats.includes(file.type));

    if (invalidFiles.length > 0) {
      alert("❌ Invalid file format! Please upload PNG, JPG, JPEG, or SVG images.");
      return;
    }

    setSelectedImages(prevImages => [...prevImages, ...files]);
  };

  // Convert Images to PDF Function
  const handleConvertToPdf = async () => {
    if (selectedImages.length === 0) {
      alert("Please upload images first.");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post('http://localhost:5000/convert-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'  // Ensure we get binary data for download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error converting to PDF:', error);
    }
  };

  return (
    <div className="container">
      <h2>Image to PDF Converter</h2>

      {/* Drag and Drop Area */}
      <div 
        className="upload-container"
        onDrop={handleDrop} 
        onDragOver={handleDragOver}
      >
        <p>Drag & Drop</p>
      </div>

      {/* File Input for Click Upload */}
      <input 
        type="file" 
        multiple 
        accept="image/png, image/jpeg, image/jpg, image/svg" 
        onChange={handleImageUpload} 
        className="file-input"
        style={{ display: 'none' }} // Hide file input, let user click on the upload area
      />
      <p style={{fontWeight:'bolder'}}>You can choose more than one image.</p>

      {/* Visible Area for Clicking to Upload */}
      <button onClick={() => document.querySelector('.file-input').click()} className="upload-button">
        Click to Upload Images
      </button>

      <div className="image-preview">
        {selectedImages.length > 0 && (
          <div>
            <h3>Selected Images</h3>
            <div className="preview-container">
              {selectedImages.map((image, index) => (
                <div key={index} className="image-item">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={image.name} 
                    className="preview-img"
                  />
                  <p>{image.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="convert-button" onClick={handleConvertToPdf}>
        Convert to PDF
      </button>
    </div>
  );
};

export default App;

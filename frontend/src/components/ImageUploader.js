import React from 'react';

const ImageUploader = ({ setImageData, imageData = [] }) => {
  // Ensure imageData is always an array
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const imageArray = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setImageData(imageArray);
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      <div>
        {imageData && imageData.length > 0 ? (
          imageData.map((image, index) => (
            <div key={index}>
              <img src={image.url} alt={image.name} width="100" />
              <p>{image.name}</p>
            </div>
          ))
        ) : (
          <p>No images uploaded yet</p>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;

import React from "react";
import axios from "axios";

const PdfPreview = ({ images, setPdfUrl }) => {
  const generatePdf = async () => {
    const { data } = await axios.post("http://localhost:5000/convert-to-pdf", { images });
    setPdfUrl(data.pdfUrl);
  };

  return (
    <div>
      {images.length > 0 && <button onClick={generatePdf}>Generate PDF</button>}
    </div>
  );
};

export default PdfPreview;

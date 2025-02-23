import { useState } from "react";
import imageCompression from "browser-image-compression";
import { FaCloudUploadAlt, FaDownload, FaCompress, FaExchangeAlt } from "react-icons/fa";

export default function ImageTool() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [format, setFormat] = useState("webp");
  const [mode, setMode] = useState(null); // "compress" or "convert"

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCompressedFile(null);
      setConvertedFile(null);
    }
  };

  const handleCompression = async () => {
    if (!selectedFile) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(selectedFile, options);
      setCompressedFile(compressed);
    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  const handleConversion = () => {
    if (!selectedFile) return;

    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        setConvertedFile(blob);
      }, `image/${format}`);
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-3xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Image Compressor & Converter</h1>

        {/* Upload Image Section */}
        <div className="mb-4">
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
            <FaCloudUploadAlt /> Upload Image
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {selectedFile && <p className="text-gray-600 text-sm mt-2">Selected: {selectedFile.name}</p>}
        </div>

        {/* Mode Selection */}
        {selectedFile && !mode && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setMode("compress")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-600 transition"
            >
              <FaCompress /> Compress Image
            </button>
            <button
              onClick={() => setMode("convert")}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-purple-600 transition"
            >
              <FaExchangeAlt /> Convert Image
            </button>
          </div>
        )}

        {/* Compression Section */}
        {mode === "compress" && selectedFile && (
          <div className="bg-gray-100 p-4 rounded-lg mt-4 shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Compress Image</h2>
            <button
              onClick={handleCompression}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition w-full"
            >
              <FaCompress /> Compress
            </button>
          </div>
        )}

        {compressedFile && mode === "compress" && (
          <a
            href={URL.createObjectURL(compressedFile)}
            download="compressed-image.jpg"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition "
          >
            <FaDownload /> Download Compressed Image
          </a>
        )}

        {/* Conversion Section */}
        {mode === "convert" && selectedFile && (
          <div className="bg-gray-100 p-4 rounded-lg mt-4 shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Convert Image</h2>
            <div className="flex justify-center mb-3">
              <select
                onChange={(e) => setFormat(e.target.value)}
                value={format}
                className="border p-2 rounded-md w-full"
              >
                <option value="webp">WEBP</option>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <button
              onClick={handleConversion}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition w-full"
            >
              <FaExchangeAlt /> Convert to {format.toUpperCase()}
            </button>
          </div>
        )}

        {convertedFile && mode === "convert" && (
          <a
            href={URL.createObjectURL(convertedFile)}
            download={`converted.${format}`}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <FaDownload /> Download Converted Image
          </a>
        )}

        {/* Reset Button */}
        {(compressedFile || convertedFile) && (
          <button
            onClick={() => {
              setSelectedFile(null);
              setCompressedFile(null);
              setConvertedFile(null);
              setMode(null);
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

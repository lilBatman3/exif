import React, { useState, useCallback } from 'react';
import { UploadedImage } from '../types';
import { getExifData } from '../services/exifService';
import { ImageUploader } from './ImageUploader';
import { ImageDetail } from './ImageDetail';

interface TryPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export const TryPage: React.FC<TryPageProps> = ({ onBack, onLoginClick }) => {
  const [image, setImage] = useState<UploadedImage | null>(null);

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    const newImage: UploadedImage = {
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file: file,
      url: URL.createObjectURL(file),
      exifData: null,
      isLoading: true,
      error: null,
    };
    setImage(newImage);

    try {
      const data = await getExifData(newImage.file);
      if (Object.keys(data).length === 0) {
        setImage((prevImage) => prevImage ? { ...prevImage, exifData: {}, error: "No EXIF data was found in this image.", isLoading: false } : null);
      } else {
        setImage((prevImage) => prevImage ? { ...prevImage, exifData: data, isLoading: false } : null);
      }
    } catch (e: any) {
      console.error(e);
      setImage((prevImage) => prevImage ? { ...prevImage, error: "Could not parse EXIF data from this image.", isLoading: false } : null);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
  }, [image]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-7xl flex justify-between items-center mb-8">
        <button 
          onClick={onBack} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
          title="Go back to the introduction"
        >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Home</span>
        </button>
        <button
          onClick={onLoginClick}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
          title="Log in to access all features"
        >
          <i className="fas fa-sign-in-alt"></i>
          <span>Login for Full Features</span>
        </button>
      </header>
      
      <main className="w-full max-w-7xl flex-grow">
        {image ? (
          <ImageDetail image={image} onReset={handleReset} resetButtonText="Try Another Image" />
        ) : (
           <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
              <i className="fas fa-vial text-5xl text-pink-500 mb-4" title="Trial Mode"></i>
              <h2 className="text-4xl font-extrabold text-gray-800">Try RD Exchangeable</h2>
              <p className="text-lg text-gray-500 mt-2">Upload a single image to see how it works. No account needed.</p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} multiple={false} />
          </div>
        )}
      </main>
      <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 text-sm">
        <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
      </footer>
    </div>
  );
};
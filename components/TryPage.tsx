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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-7xl flex justify-between items-center mb-8">
        <button 
          onClick={onBack} 
          className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
          title="Go back to the introduction"
        >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back to Home</span>
        </button>
        <button
          onClick={onLoginClick}
          className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
          title="Log in to access all features"
        >
          <i className="fas fa-sign-in-alt"></i>
          <span className="hidden sm:inline">Login for Full Features</span>
           <span className="sm:hidden">Login</span>
        </button>
      </header>
      
      <main className="w-full max-w-7xl flex-grow">
        {image ? (
          <ImageDetail image={image} onReset={handleReset} resetButtonText="Try Another Image" />
        ) : (
           <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700">
              <i className="fas fa-vial text-5xl text-gray-500 mb-4" title="Trial Mode"></i>
              <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Try RD Exchangeable</h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Upload a single image to see how our EXIF analysis works. No account needed.</p>
               <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">Note: EXIF data removal and multi-image processing require a free account.</p>
            </div>
            <ImageUploader onImageUpload={handleImageUpload} multiple={false} />
          </div>
        )}
      </main>
      <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
        <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
      </footer>
    </div>
  );
};
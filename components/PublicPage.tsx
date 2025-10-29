import React, { useState, useCallback } from 'react';
import { UploadedImage } from '../types';
import { getExifData } from '../services/exifService';
import { ImageUploader } from './ImageUploader';
import { ImageDetail } from './ImageDetail';

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300 h-full">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-500 text-white mb-4">
      <i className={`fas ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);


interface PublicPageProps {
  onLoginClick: () => void;
}

export const PublicPage: React.FC<PublicPageProps> = ({ onLoginClick }) => {
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
        throw new Error("No EXIF data found.");
      }
      setImage((prevImage) => prevImage ? { ...prevImage, exifData: data, isLoading: false } : null);
    } catch (e: any) {
      console.error(e);
      setImage((prevImage) => prevImage ? { ...prevImage, error: e.message || "An error occurred.", isLoading: false } : null);
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
        <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 flex items-center gap-3">
          <i className="fas fa-camera-retro"></i>
          <span>RD Exchangeable</span>
        </h1>
        <button
          onClick={onLoginClick}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <i className="fas fa-sign-in-alt"></i>
          <span className="hidden sm:inline">Login for Full Features</span>
           <span className="sm:hidden">Login</span>
        </button>
      </header>

      <main className="w-full max-w-7xl flex-grow">
        {image ? (
          <ImageDetail image={image} onReset={handleReset} resetButtonText="Analyze Another Image" />
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800">Take Control of Your Photo's Hidden Data</h2>
              <p className="text-lg text-gray-500 mt-4 max-w-3xl mx-auto">
                RD Exchangeable helps protect your privacy by revealing the hidden metadata in your photos. Upload an image to see what data you're sharing, or log in to remove it from multiple images at once.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureCard icon="fa-search" title="Extract EXIF Data">
                Uncover hidden data like camera model, settings, and timestamps.
              </FeatureCard>
              <FeatureCard icon="fa-map-marked-alt" title="View Geolocation">
                See the exact location where your photo was taken on an interactive map.
              </FeatureCard>
              <FeatureCard icon="fa-user-shield" title="Protect Your Privacy">
                Easily remove all metadata from your photos before sharing them online.
              </FeatureCard>
              <FeatureCard icon="fa-images" title="Batch Processing">
                Login to analyze EXIF data for multiple images at once efficiently.
              </FeatureCard>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Try It Now</h2>
              <ImageUploader onImageUpload={handleImageUpload} multiple={false} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 text-sm">
        <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
      </footer>
    </div>
  );
};
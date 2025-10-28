import React from 'react';
import { UploadedImage } from '../types';
import { ExifDisplay } from './ExifDisplay';

interface ImageDetailProps {
  image: UploadedImage;
  onReset: () => void;
}

export const ImageDetail: React.FC<ImageDetailProps> = ({ image, onReset }) => {
  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <button
          onClick={onReset}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <i className="fas fa-file-upload"></i>
          <span>Analyze Other Images</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">Your Selected Image</h2>
            <img src={image.url} alt={image.file.name} className="max-w-full max-h-[60vh] rounded-lg object-contain" />
        </div>
        <div className="flex flex-col">
            {image.isLoading && (
                <div className="flex items-center justify-center h-full bg-white rounded-xl p-6 border border-gray-200">
                    <i className="fas fa-spinner fa-spin text-4xl text-pink-500"></i>
                    <p className="ml-4 text-xl">Analyzing image...</p>
                </div>
            )}
            {image.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">{image.error}</div>}
            {image.exifData && <ExifDisplay data={image.exifData} imageUrl={image.url} />}
        </div>
      </div>
    </div>
  );
};
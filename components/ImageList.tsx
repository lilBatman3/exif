import React from 'react';
import { UploadedImage } from '../types';

interface ImageListProps {
  images: UploadedImage[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, selectedImageId, onSelectImage }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full">
      <h2 className="text-xl font-semibold mb-4 text-pink-600 border-b border-gray-200 pb-2">Uploaded Images</h2>
      <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
        {images.map(image => (
          <button
            key={image.id}
            onClick={() => onSelectImage(image.id)}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors duration-200 ${selectedImageId === image.id ? 'bg-pink-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            title={`Select image: ${image.file.name}`}
          >
            <img src={image.url} alt={image.file.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <p className={`text-sm font-medium truncate ${selectedImageId === image.id ? 'text-white' : 'text-gray-900'}`}>{image.file.name}</p>
              <div className={`text-xs ${selectedImageId === image.id ? 'text-pink-100' : 'text-gray-500'}`}>
                {image.isLoading && <span title="Analyzing..."><i className="fas fa-spinner fa-spin mr-1"></i> Loading...</span>}
                
                {!image.isLoading && image.error && (
                  <span 
                    className={image.error.includes('No EXIF') ? '' : (selectedImageId === image.id ? 'text-red-300' : 'text-red-500')}
                    title={image.error}
                  >
                    <i className={`fas ${image.error.includes('No EXIF') ? 'fa-info-circle' : 'fa-exclamation-circle'} mr-1`}></i> 
                    {image.error.includes('No EXIF') ? 'No Data' : 'Error'}
                  </span>
                )}
                
                {!image.isLoading && !image.error && image.exifData && (
                  <span className={selectedImageId === image.id ? 'text-white' : 'text-green-600'} title="Analysis complete">
                    <i className="fas fa-check-circle mr-1"></i> Analyzed
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
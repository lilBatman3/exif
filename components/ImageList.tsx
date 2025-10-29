import React from 'react';
import { UploadedImage } from '../types';

interface ImageListProps {
  images: UploadedImage[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
}

export const ImageList: React.FC<ImageListProps> = ({ images, selectedImageId, onSelectImage }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b-2 border-gray-100 dark:border-gray-700 pb-3">Uploaded Images</h2>
      <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-2">
        {images.map(image => (
          <button
            key={image.id}
            onClick={() => onSelectImage(image.id)}
            className={`w-full text-left p-3 rounded-lg flex items-center gap-4 transition-all duration-300 ease-in-out transform ${selectedImageId === image.id ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 shadow-md' : 'bg-gray-50 hover:bg-gray-200 hover:scale-[1.02] text-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-700 dark:text-gray-200'}`}
            title={`Select image: ${image.file.name}`}
          >
            <img src={image.url} alt={image.file.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0 border-2 border-white/50" />
            <div className="flex-grow overflow-hidden">
              <p className={`text-sm font-medium truncate ${selectedImageId === image.id ? 'text-white dark:text-gray-900' : 'text-gray-900 dark:text-gray-100'}`}>{image.file.name}</p>
              <div className={`text-xs mt-1 ${selectedImageId === image.id ? 'text-gray-200 dark:text-gray-700' : 'text-gray-500 dark:text-gray-400'}`}>
                {image.isLoading && <span title="Analyzing..."><i className="fas fa-spinner fa-spin mr-1"></i> Loading...</span>}
                
                {!image.isLoading && image.error && (
                  <span 
                    className={image.error.includes('No EXIF') ? '' : (selectedImageId === image.id ? 'text-red-300' : 'text-red-500 dark:text-red-400')}
                    title={image.error}
                  >
                    <i className={`fas ${image.error.includes('No EXIF') ? 'fa-info-circle' : 'fa-exclamation-circle'} mr-1`}></i> 
                    {image.error.includes('No EXIF') ? 'No Data' : 'Error'}
                  </span>
                )}
                
                {!image.isLoading && !image.error && image.exifData && (
                  <span className={selectedImageId === image.id ? 'text-white dark:text-gray-900' : 'text-green-600 dark:text-green-400'} title="Analysis complete">
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
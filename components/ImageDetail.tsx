import React from 'react';
import { UploadedImage } from '../types';
import { ExifDisplay } from './ExifDisplay';
import { ExifRemovalPanel } from './ExifRemovalPanel';

interface ImageDetailProps {
  image: UploadedImage;
  onReset: () => void;
  resetButtonText?: string;
  onDownloadCleaned?: (tagsToRemove: Set<string>, applyToAll: boolean) => void;
  imageCount?: number;
}

export const ImageDetail: React.FC<ImageDetailProps> = ({ image, onReset, resetButtonText = 'Analyze Other Images', onDownloadCleaned, imageCount = 1 }) => {
  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <button
          onClick={onReset}
          className="bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 border border-gray-300 dark:border-gray-600 shadow-sm"
          title="Clear current images and upload new ones"
        >
          <i className="fas fa-redo-alt"></i>
          <span>{resetButtonText}</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">{image.file.name}</h2>
            <div className="w-full flex-grow flex items-center justify-center">
                 <img src={image.url} alt={image.file.name} className="max-w-full max-h-[60vh] rounded-lg object-contain shadow-2xl" />
            </div>
        </div>
        <div className="flex flex-col gap-8">
            {image.isLoading && (
                <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <i className="fas fa-spinner fa-spin text-5xl text-gray-500"></i>
                    <p className="ml-4 text-xl mt-4">Analyzing image...</p>
                </div>
            )}
            {image.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-center shadow-md dark:bg-red-900/50 dark:border-red-600 dark:text-red-300">{image.error}</div>}
            {image.exifData && onDownloadCleaned && (
              <>
                <ExifDisplay data={image.exifData} />
                <ExifRemovalPanel
                  exifData={image.exifData}
                  onDownload={onDownloadCleaned}
                  imageCount={imageCount}
                />
              </>
            )}
             {image.exifData && !onDownloadCleaned && (
               <ExifDisplay data={image.exifData} />
            )}
        </div>
      </div>
    </div>
  );
};
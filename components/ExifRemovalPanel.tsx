import React, { useState, useMemo, useEffect } from 'react';
import { ExifData } from '../types';

interface ExifRemovalPanelProps {
  exifData: ExifData;
  onDownload: (tagsToRemove: Set<string>, applyToAll: boolean) => void;
  imageCount: number;
}

const EXIF_CATEGORIES: { [key: string]: string[] } = {
  'Basic Information': ['Make', 'Model', 'DateTime', 'DateTimeOriginal', 'PixelXDimension', 'PixelYDimension', 'Software', 'Artist', 'Copyright'],
  'Shooting Settings': ['ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength', 'Flash'],
  'Geolocation': ['gps']
};

const FRIENDLY_NAMES: { [key: string]: string } = {
  Make: 'Camera Make',
  Model: 'Camera Model',
  DateTime: 'Date Modified',
  DateTimeOriginal: 'Date Taken',
  PixelXDimension: 'Width',
  PixelYDimension: 'Height',
  Software: 'Software',
  Artist: 'Artist',
  Copyright: 'Copyright',
  ExposureTime: 'Exposure Time',
  FNumber: 'Aperture (F-Number)',
  ISOSpeedRatings: 'ISO',
  FocalLength: 'Focal Length',
  Flash: 'Flash',
  gps: 'GPS Location'
};


export const ExifRemovalPanel: React.FC<ExifRemovalPanelProps> = ({ exifData, onDownload, imageCount }) => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedTags(new Set());
  }, [exifData]);

  const availableTags = useMemo(() => {
    return Object.keys(exifData).filter(key => exifData[key as keyof ExifData] !== undefined && exifData[key as keyof ExifData] !== null);
  }, [exifData]);
  
  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedTags(new Set(availableTags));
  };
  
  const handleDeselectAll = () => {
    setSelectedTags(new Set());
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Privacy Control</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select the metadata you want to remove. A new, clean copy of the image will be downloaded.</p>
      
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
        {Object.entries(EXIF_CATEGORIES).map(([category, tags]) => {
          const relevantTags = tags.filter(tag => availableTags.includes(tag));
          if (relevantTags.length === 0) return null;

          return (
            <div key={category}>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mt-2 text-sm">{category}</h4>
              {relevantTags.map(tag => (
                <label key={tag} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.has(tag)}
                    onChange={() => handleTagChange(tag)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{FRIENDLY_NAMES[tag] || tag}</span>
                </label>
              ))}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={handleSelectAll} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-3 rounded-md transition-colors" title="Select all available metadata fields for removal">Select All</button>
        <button onClick={handleDeselectAll} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-medium py-1 px-3 rounded-md transition-colors" title="Clear all selections">Deselect None</button>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onDownload(selectedTags, false)}
          disabled={selectedTags.size === 0}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
          title="Remove selected data from this image and download it"
        >
          <i className="fas fa-download"></i>
          <span>Remove Data & Download Image</span>
        </button>
        {imageCount > 1 && (
          <button
            onClick={() => onDownload(selectedTags, true)}
            disabled={selectedTags.size === 0}
            className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
            title="Apply selection to all uploaded images and download them"
          >
            <i className="fas fa-file-archive"></i>
            <span>Apply to All ({imageCount}) & Download</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">Note: Selective removal is most effective with JPEG files. For other formats (e.g., PNG), or if an error occurs, all metadata will be stripped to ensure privacy.</p>
    </div>
  );
};
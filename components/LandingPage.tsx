import React from 'react';
import { ImageUploader } from './ImageUploader';

interface LandingPageProps {
  onImageUpload: (files: FileList) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode; tooltip: string; }> = ({ icon, title, children, tooltip }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700 transform hover:-translate-y-2 transition-transform duration-300 text-center">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400 mb-4 mx-auto">
      <i className={`fas ${icon} text-3xl`} title={tooltip}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onImageUpload }) => {
  return (
    <div className="space-y-16">
       <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Welcome to Your Privacy Dashboard</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Start by uploading your images below to analyze their hidden metadata.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard icon="fa-search" title="Extract EXIF Data" tooltip="View hidden metadata">
          Uncover hidden data in your photos, like camera model, settings, and the exact time of the shot.
        </FeatureCard>
        <FeatureCard icon="fa-map-marked-alt" title="View Geolocation" tooltip="See where a photo was taken">
          If the image contains GPS coordinates, see the location where it was taken on an interactive map.
        </FeatureCard>
        <FeatureCard icon="fa-user-shield" title="Protect Your Privacy" tooltip="Remove sensitive data">
          Easily strip all metadata (EXIF) from your photos before sharing to protect your privacy.
        </FeatureCard>
         <FeatureCard icon="fa-images" title="Multi-Image Support" tooltip="Analyze multiple images at once">
          Analyze EXIF data for a batch of images at once, and browse the results efficiently.
        </FeatureCard>
      </div>
      <div>
        <ImageUploader onImageUpload={onImageUpload} />
      </div>
    </div>
  );
};
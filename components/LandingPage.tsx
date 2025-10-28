import React from 'react';
import { ImageUploader } from './ImageUploader';

interface LandingPageProps {
  onImageUpload: (files: FileList) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-500 text-white mb-4">
      <i className={`fas ${icon} text-2xl`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onImageUpload }) => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard icon="fa-search" title="Extract EXIF Data">
          Uncover hidden data in your photos, like camera model, settings, and the exact time of the shot.
        </FeatureCard>
        <FeatureCard icon="fa-map-marked-alt" title="View Geolocation">
          If the image contains GPS coordinates, see the location where it was taken on an interactive map.
        </FeatureCard>
        <FeatureCard icon="fa-user-shield" title="Protect Your Privacy">
          Easily strip all metadata (EXIF) from your photos before sharing to protect your privacy.
        </FeatureCard>
         <FeatureCard icon="fa-images" title="Multi-Image Support">
          Analyze EXIF data for a batch of images at once, and browse the results efficiently.
        </FeatureCard>
      </div>
      <div>
        <ImageUploader onImageUpload={onImageUpload} />
      </div>
    </div>
  );
};
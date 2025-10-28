import React, { useState } from 'react';
import { ExifData } from '../types';
import { MapDisplay } from './MapDisplay';

interface ExifDisplayProps {
  data: ExifData;
  imageUrl: string;
}

const DataRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-right">{value}</dd>
  </div>
);

interface AccordionSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon, isOpen, onToggle, children }) => {
  // Filter out null/undefined children to avoid rendering empty rows
  const validChildren = React.Children.toArray(children).filter(child => child);

  if (validChildren.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
      <h2>
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-between w-full px-4 py-4 sm:px-6 text-left font-medium text-pink-600 bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-3">
            <i className={`fas ${icon}`}></i>
            <span>{title}</span>
          </span>
          <i className={`fas fa-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>
      </h2>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="px-6">
            {validChildren}
          </dl>
        </div>
      </div>
    </div>
  );
};


export const ExifDisplay: React.FC<ExifDisplayProps> = ({ data, imageUrl }) => {
  const [openSections, setOpenSections] = useState({
    basic: true,
    shooting: false,
    gps: !!data.gps,
  });

  const handleToggle = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const handleRemoveExifAndDownload = () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'image_without_exif.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.src = imageUrl;
  };
  
  const formatExposureTime = (value?: number) => {
    if (value === undefined || value === null) return null;
    if (value < 1) {
      return `1/${Math.round(1/value)} sec`;
    }
    return `${value} sec`;
  }
  
  return (
    <div className="space-y-4">
      <AccordionSection
        title="Basic Information"
        icon="fa-info-circle"
        isOpen={openSections.basic}
        onToggle={() => handleToggle('basic')}
      >
        {data.Make && <DataRow label="Make" value={data.Make} />}
        {data.Model && <DataRow label="Model" value={data.Model} />}
        {data.DateTimeOriginal && <DataRow label="Date Taken" value={data.DateTimeOriginal} />}
        {data.PixelXDimension && data.PixelYDimension && <DataRow label="Dimensions" value={`${data.PixelXDimension} x ${data.PixelYDimension} pixels`} />}
        {data.Software && <DataRow label="Software" value={data.Software} />}
        {data.Artist && <DataRow label="Artist" value={data.Artist} />}
        {data.Copyright && <DataRow label="Copyright" value={data.Copyright} />}
      </AccordionSection>

      <AccordionSection
        title="Shooting Settings"
        icon="fa-sliders-h"
        isOpen={openSections.shooting}
        onToggle={() => handleToggle('shooting')}
      >
        {data.ExposureTime !== undefined && <DataRow label="Exposure Time" value={formatExposureTime(data.ExposureTime)} />}
        {data.FNumber && <DataRow label="Aperture" value={`f/${data.FNumber}`} />}
        {data.ISOSpeedRatings && <DataRow label="ISO" value={data.ISOSpeedRatings} />}
        {data.FocalLength && <DataRow label="Focal Length" value={`${data.FocalLength} mm`} />}
        {data.Flash && <DataRow label="Flash" value={data.Flash} />}
      </AccordionSection>
      
      {data.gps && (
        <AccordionSection
          title="Geolocation"
          icon="fa-map-marker-alt"
          isOpen={openSections.gps}
          onToggle={() => handleToggle('gps')}
        >
          <DataRow label="Latitude" value={data.gps.latitude.toFixed(6)} />
          <DataRow label="Longitude" value={data.gps.longitude.toFixed(6)} />
          <div className="pt-4">
            <MapDisplay lat={data.gps.latitude} lon={data.gps.longitude} />
          </div>
        </AccordionSection>
      )}

       <div className="pt-2">
          <button
            onClick={handleRemoveExifAndDownload}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <i className="fas fa-download"></i>
            <span>Remove EXIF & Download</span>
          </button>
        </div>
    </div>
  );
};
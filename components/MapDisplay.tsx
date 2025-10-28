import React from 'react';

interface MapDisplayProps {
  lat: number;
  lon: number;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon }) => {
  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-gray-200">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={mapUrl}
        title="Location on Map"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
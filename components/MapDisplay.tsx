import React from 'react';

interface MapDisplayProps {
  lat: number;
  lon: number;
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lon }) => {
  if (isNaN(lat) || isNaN(lon)) {
    return null;
  }
  
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  return (
    <div>
      <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={osmEmbedUrl}
          title="Location on Map"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
       <div className="mt-3 text-center">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          title="View location on Google Maps in a new tab"
        >
          <i className="fas fa-external-link-alt"></i>
          <span>View on Google Maps</span>
        </a>
      </div>
    </div>
  );
};
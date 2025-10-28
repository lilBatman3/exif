import { ExifData, GpsData } from '../types';

declare const EXIF: any;

const toDecimal = (gpsData: number[], ref: string): number => {
    if (!gpsData || gpsData.length !== 3) return 0;
    const decimal = gpsData[0] + gpsData[1] / 60 + gpsData[2] / 3600;
    if (ref === 'S' || ref === 'W') {
        return -decimal;
    }
    return decimal;
};


export const getExifData = (imageFile: File): Promise<ExifData> => {
  return new Promise((resolve, reject) => {
    EXIF.getData(imageFile, function(this: any) {
      try {
        const allTags = EXIF.getAllTags(this);
        if (!allTags || Object.keys(allTags).length === 0) {
            resolve({});
            return;
        }

        const gpsLatitude = allTags.GPSLatitude;
        const gpsLatitudeRef = allTags.GPSLatitudeRef;
        const gpsLongitude = allTags.GPSLongitude;
        const gpsLongitudeRef = allTags.GPSLongitudeRef;

        let gps: GpsData | undefined;

        if (gpsLatitude && gpsLatitudeRef && gpsLongitude && gpsLongitudeRef) {
          const latitude = toDecimal(gpsLatitude, gpsLatitudeRef);
          const longitude = toDecimal(gpsLongitude, gpsLongitudeRef);
          if(!isNaN(latitude) && !isNaN(longitude)) {
              gps = { latitude, longitude };
          }
        }
        
        const formattedData: ExifData = {
            Make: allTags.Make,
            Model: allTags.Model,
            DateTime: allTags.DateTime,
            DateTimeOriginal: allTags.DateTimeOriginal,
            ExposureTime: allTags.ExposureTime,
            FNumber: allTags.FNumber,
            ISOSpeedRatings: allTags.ISOSpeedRatings,
            FocalLength: allTags.FocalLength,
            Flash: allTags.Flash,
            PixelXDimension: allTags.PixelXDimension,
            PixelYDimension: allTags.PixelYDimension,
            Orientation: allTags.Orientation,
            Artist: allTags.Artist,
            Copyright: allTags.Copyright,
            Software: allTags.Software,
            gps,
        };
        
        // Remove undefined properties
        Object.keys(formattedData).forEach(key => {
            const typedKey = key as keyof ExifData;
            if (formattedData[typedKey] === undefined) {
                delete formattedData[typedKey];
            }
        });

        resolve(formattedData);
      } catch (error) {
        reject(error);
      }
    });
  });
};
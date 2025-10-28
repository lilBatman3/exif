export interface GpsData {
  latitude: number;
  longitude: number;
}

export interface ExifData {
  Make?: string;
  Model?: string;
  DateTime?: string;
  DateTimeOriginal?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISOSpeedRatings?: number;
  FocalLength?: number;
  Flash?: string;
  PixelXDimension?: number;
  PixelYDimension?: number;
  Orientation?: number;
  Artist?: string;
  Copyright?: string;
  Software?: string;
  gps?: GpsData;
  [key: string]: any;
}

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  exifData: ExifData | null;
  isLoading: boolean;
  error: string | null;
}

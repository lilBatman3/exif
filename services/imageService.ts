// piexif.js is loaded from a CDN in index.html
declare const piexif: any;

const canvasBasedRemoval = (imageUrl: string, fileName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        const cleanFileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
                        link.download = `${cleanFileName}_privacy_protected.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        resolve();
                    } else {
                        reject(new Error("Canvas toBlob failed."));
                    }
                }, 'image/jpeg', 0.95);
            } else {
                reject(new Error("Could not get canvas context."));
            }
        };
        img.onerror = () => {
            reject(new Error("Failed to load image for processing."));
        };
        img.src = imageUrl;
    });
};

export const downloadImageWithoutExif = (imageFile: File, tagsToRemove: Set<string>): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fallback = () => canvasBasedRemoval(URL.createObjectURL(imageFile), imageFile.name).then(resolve).catch(reject);

        if (imageFile.type !== 'image/jpeg' || typeof piexif === 'undefined' || typeof piexif.load === 'undefined') {
            if (imageFile.type !== 'image/jpeg') {
                console.warn('Selective removal only supported for JPEG. Falling back to removing all EXIF data.');
            }
            if (typeof piexif === 'undefined' || typeof piexif.load === 'undefined') {
                console.error('piexif.js library not loaded correctly. Falling back to removing all EXIF data.');
            }
            return fallback();
        }

        // Define tagMap inside, using piexif constants for robustness.
        const tagMap: { [key: string]: [string, number] } = {
            'Make': ['0th', piexif.ImageIFD.Make],
            'Model': ['0th', piexif.ImageIFD.Model],
            'Software': ['0th', piexif.ImageIFD.Software],
            'Artist': ['0th', piexif.ImageIFD.Artist],
            'Copyright': ['0th', piexif.ImageIFD.Copyright],
            'DateTime': ['0th', piexif.ImageIFD.DateTime],
            'DateTimeOriginal': ['Exif', piexif.ExifIFD.DateTimeOriginal],
            'PixelXDimension': ['Exif', piexif.ExifIFD.PixelXDimension],
            'PixelYDimension': ['Exif', piexif.ExifIFD.PixelYDimension],
            'ExposureTime': ['Exif', piexif.ExifIFD.ExposureTime],
            'FNumber': ['Exif', piexif.ExifIFD.FNumber],
            'ISOSpeedRatings': ['Exif', piexif.ExifIFD.ISOSpeedRatings],
            'FocalLength': ['Exif', piexif.ExifIFD.FocalLength],
            'Flash': ['Exif', piexif.ExifIFD.Flash],
        };


        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string;
            if (!imageDataUrl) {
                return reject(new Error("Could not read image file."));
            }

            try {
                const exifObj = piexif.load(imageDataUrl);
                
                for (const tag of tagsToRemove) {
                    if (tag === 'gps') {
                        delete exifObj['GPS'];
                    } else if (tagMap[tag]) {
                        const [ifd, tagId] = tagMap[tag];
                        if (exifObj[ifd]) {
                            delete exifObj[ifd][tagId];
                        }
                    }
                }

                const newExifStr = piexif.dump(exifObj);
                const newImageDataUrl = piexif.insert(newExifStr, imageDataUrl);

                fetch(newImageDataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        const cleanFileName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.')) || imageFile.name;
                        link.download = `${cleanFileName}_privacy_protected.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        resolve();
                    })
                    .catch(reject);

            } catch (error) {
                console.error("piexif.js error, falling back to full removal:", error);
                return fallback();
            }
        };

        reader.onerror = () => {
            reject(new Error("FileReader failed to read the file."));
        };

        reader.readAsDataURL(imageFile);
    });
};
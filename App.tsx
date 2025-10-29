import React, { useState, useCallback } from 'react';
import { UploadedImage } from './types';
import { getExifData } from './services/exifService';
import { downloadImageWithoutExif } from './services/imageService';
import { Login } from './components/Login';
import { IntroductionPage } from './components/IntroductionPage';
import { TryPage } from './components/TryPage';
import { LandingPage } from './components/LandingPage';
import { ImageList } from './components/ImageList';
import { ImageDetail } from './components/ImageDetail';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [view, setView] = useState<'introduction' | 'try' | 'login'>('introduction');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (files: FileList) => {
    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file: file,
      url: URL.createObjectURL(file),
      exifData: null,
      isLoading: true,
      error: null,
    }));

    setUploadedImages(newImages);
    if (newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }

    newImages.forEach(async (image) => {
      try {
        const data = await getExifData(image.file);
        if (Object.keys(data).length === 0) {
           setUploadedImages((prevImages) =>
            prevImages.map((img) =>
              img.id === image.id
                ? { ...img, exifData: {}, error: "No EXIF data was found in this image.", isLoading: false }
                : img
            )
          );
        } else {
          setUploadedImages((prevImages) =>
            prevImages.map((img) =>
              img.id === image.id ? { ...img, exifData: data, isLoading: false } : img
            )
          );
        }
      } catch (e: any) {
        console.error(e);
        setUploadedImages((prevImages) =>
          prevImages.map((img) =>
            img.id === image.id
              ? { ...img, error: "Could not parse EXIF data from this image.", isLoading: false }
              : img
          )
        );
      }
    });
  }, []);

  const handleReset = useCallback(() => {
    // Revoke object URLs to prevent memory leaks
    uploadedImages.forEach(image => URL.revokeObjectURL(image.url));
    setUploadedImages([]);
    setSelectedImageId(null);
  }, [uploadedImages]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    handleReset();
    setIsAuthenticated(false);
    setView('introduction');
  };

  const handleSelectImage = (id: string) => {
    setSelectedImageId(id);
  };

  const handleDownloadCleaned = useCallback(async (tagsToRemove: Set<string>, applyToAll: boolean) => {
    const imagesToProcess = applyToAll 
      ? uploadedImages.filter(img => img.exifData && Object.keys(img.exifData).length > 0)
      : uploadedImages.filter(img => img.id === selectedImageId);

    if (imagesToProcess.length === 0) {
      alert("No image with EXIF data was selected to process.");
      return;
    }

    for (const image of imagesToProcess) {
        try {
            await downloadImageWithoutExif(image.file, tagsToRemove);
        } catch (error) {
            console.error("Failed to download cleaned image:", image.file.name, error);
            alert(`Could not process and download ${image.file.name}. See console for details.`);
        }
    }
  }, [uploadedImages, selectedImageId]);

  if (!isAuthenticated) {
    switch(view) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setView('introduction')} />;
      case 'try':
        return <TryPage onBack={() => setView('introduction')} onLoginClick={() => setView('login')} />;
      case 'introduction':
      default:
        return <IntroductionPage onLoginClick={() => setView('login')} onTryClick={() => setView('try')} />;
    }
  }

  const selectedImage = uploadedImages.find(img => img.id === selectedImageId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-7xl text-center mb-8 relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-600">
          <i className="fas fa-camera-retro mr-3"></i>
          RD Exchangeable
        </h1>
        {uploadedImages.length === 0 && (
           <p className="text-lg text-gray-500 mt-2">
            Upload your images to analyze their hidden metadata
          </p>
        )}
         <button
            onClick={handleLogout}
            className="absolute top-0 right-0 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
            aria-label="Logout"
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
      </header>

      <main className="w-full max-w-7xl flex-grow">
        {uploadedImages.length === 0 ? (
          <LandingPage onImageUpload={handleImageUpload} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="lg:col-span-1 xl:col-span-1">
              <ImageList 
                images={uploadedImages}
                selectedImageId={selectedImageId}
                onSelectImage={handleSelectImage}
              />
            </div>
            <div className="lg:col-span-2 xl:col-span-3">
              {selectedImage ? (
                <ImageDetail 
                  image={selectedImage}
                  onReset={handleReset}
                  onDownloadCleaned={handleDownloadCleaned}
                  imageCount={uploadedImages.length}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-xl p-6 border border-gray-200">
                  <p className="text-xl text-gray-500">Please select an image to view its details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
       <footer className="w-full max-w-5xl text-center mt-12 text-gray-500 text-sm">
          <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
        </footer>
    </div>
  );
};

export default App;
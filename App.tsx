import React, { useState, useCallback, useEffect } from 'react';
import { UploadedImage } from './types';
import { getExifData } from './services/exifService';
import { downloadImageWithoutExif } from './services/imageService';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { IntroductionPage } from './components/IntroductionPage';
import { TryPage } from './components/TryPage';
import { LandingPage } from './components/LandingPage';
import { ImageList } from './components/ImageList';
import { ImageDetail } from './components/ImageDetail';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [view, setView] = useState<'introduction' | 'try' | 'login' | 'register'>('introduction');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('rd-theme')) {
      return localStorage.getItem('rd-theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rd-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rd-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

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
        return <Login onLoginSuccess={handleLoginSuccess} onBack={() => setView('introduction')} onGoToRegister={() => setView('register')} />;
      case 'register':
        return <Register onRegisterSuccess={() => setView('login')} onBackToLogin={() => setView('login')} />;
      case 'try':
        return <TryPage onBack={() => setView('introduction')} onLoginClick={() => setView('login')} />;
      case 'introduction':
      default:
        return <IntroductionPage onLoginClick={() => setView('login')} onTryClick={() => setView('try')} />;
    }
  }

  const selectedImage = uploadedImages.find(img => img.id === selectedImageId);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <header className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
              <i className="fas fa-camera-retro"></i>
              RD Exchangeable
            </h1>
            <div className="flex items-center gap-4">
               <button
                  onClick={toggleTheme}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold w-10 h-10 rounded-full transition-colors duration-300 flex items-center justify-center"
                  aria-label="Toggle theme"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
              </button>
              <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                  aria-label="Logout"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
        </div>
      </header>
      
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
                <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-xl text-gray-500 dark:text-gray-400">Please select an image to view its details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
       <footer className="w-full max-w-5xl mx-auto text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
        </footer>
    </div>
  );
};

export default App;
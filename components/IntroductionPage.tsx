import React from 'react';

interface IntroductionPageProps {
  onLoginClick: () => void;
  onTryClick: () => void;
}

const InfoCard: React.FC<{ icon: string, title: string, children: React.ReactNode, tooltip: string }> = ({ icon, title, children, tooltip }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full">
            <i className={`fas ${icon} text-2xl text-pink-600`} title={tooltip}></i>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{children}</p>
        </div>
    </div>
);


export const IntroductionPage: React.FC<IntroductionPageProps> = ({ onLoginClick, onTryClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl text-center">
         <header className="mb-10">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-pink-600 flex items-center justify-center gap-4">
            <i className="fas fa-user-secret" title="RD Exchangeable - Privacy First"></i>
            <span>RD Exchangeable</span>
            </h1>
            <p className="text-xl text-gray-500 mt-4">Your ultimate tool for analyzing and managing photo metadata to protect your privacy.</p>
        </header>

        <main className="w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-left">
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">
            RD Exchangeable is a vital tool for digital privacy. Every photo you take contains hidden data (EXIF), including sensitive details like GPS location, camera model, and capture time. Our platform allows you to view this data, understand what you're sharing, and easily remove it to protect your personal information before posting images online.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <InfoCard icon="fa-home" title="Introduction Page" tooltip="Introduction to EXIF data">
                    An overview of the site's importance and privacy-protection features.
                </InfoCard>
                <InfoCard icon="fa-flask" title="Try Page" tooltip="Try the analyzer">
                    Upload a single image to analyze its data without logging in.
                </InfoCard>
                <InfoCard icon="fa-user-circle" title="Login & Dashboard" tooltip="Login for full features">
                    Create an account to unlock the full potential, including batch uploads.
                </InfoCard>
                <InfoCard icon="fa-shield-alt" title="Privacy Control" tooltip="Privacy controls">
                   Easily remove sensitive data and download clean, secure images.
                </InfoCard>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
                onClick={onTryClick}
                className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                title="Try analyzing one image without logging in"
            >
                <i className="fas fa-vial"></i>
                <span>Try It Now</span>
            </button>
            <button
                onClick={onLoginClick}
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                title="Access the full application with all features"
            >
                <i className="fas fa-sign-in-alt"></i>
                <span>Login / Register</span>
            </button>
            </div>
        </main>

        <footer className="w-full text-center mt-12 text-gray-500 text-sm">
            <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
        </footer>
      </div>
    </div>
  );
};
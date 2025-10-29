import React from 'react';

interface IntroductionPageProps {
  onLoginClick: () => void;
  onTryClick: () => void;
}

const StepCard: React.FC<{ icon: string, title: string, children: React.ReactNode, step: number }> = ({ icon, title, children, step }) => (
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700 text-center transform hover:-translate-y-2 transition-transform duration-300 h-full">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-gray-800 text-white dark:bg-gray-700 rounded-full font-bold text-xl shadow-lg border-4 border-white dark:border-gray-800">
            {step}
        </div>
        <div className="mt-8">
            <i className={`fas ${icon} text-4xl text-gray-600 dark:text-gray-400 mb-4`}></i>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{children}</p>
        </div>
    </div>
);

export const IntroductionPage: React.FC<IntroductionPageProps> = ({ onLoginClick, onTryClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-white text-center p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2564&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10">
           <h1 className="text-4xl sm:text-6xl font-extrabold flex items-center justify-center gap-4 mb-4">
              <i className="fas fa-camera-retro" title="RD Exchangeable"></i>
              RD Exchangeable
          </h1>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">
              Share Your Photos,
              <br/>
              <span className="text-gray-300">Not Your Data.</span>
          </h2>
          <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
              RD Exchangeable reveals the hidden EXIF metadata in your images—like location and camera details—so you can remove it in seconds and protect your privacy online.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                  onClick={onTryClick}
                  className="w-full sm:w-auto bg-white hover:bg-gray-200 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                  title="Try analyzing one image without logging in"
              >
                  <i className="fas fa-vial"></i>
                  <span>Try It Now</span>
              </button>
              <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg border border-white/50"
                  title="Access the full application with all features"
              >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login for Full Features</span>
              </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <main>
            {/* How It Works Section */}
            <section className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Simple Steps to Privacy</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">In just a few clicks, you can take full control of your image data.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                    <StepCard icon="fa-cloud-upload-alt" title="Upload Image(s)" step={1}>
                        Drag and drop one or more images. We'll instantly start analyzing them for hidden metadata.
                    </StepCard>
                    <StepCard icon="fa-search-location" title="Analyze Data" step={2}>
                        View all hidden data—GPS, camera settings, and more—in a clear, organized view.
                    </StepCard>
                    <StepCard icon="fa-shield-alt" title="Protect & Download" step={3}>
                        Select which data to remove, or strip it all. Download a clean, private version of your photo.
                    </StepCard>
                </div>
            </section>
        </main>
      </div>

      <footer className="w-full bg-gray-50 dark:bg-gray-900 text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Developed by a Senior Frontend Engineer specializing in React &amp; Gemini API.</p>
      </footer>
    </div>
  );
};
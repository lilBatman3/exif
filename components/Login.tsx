import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onGoToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack, onGoToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const usersRaw = localStorage.getItem('rd_exchangeable_users');
        const users = usersRaw ? JSON.parse(usersRaw) : [];

        const foundUser = users.find((user: any) => user.username === username && user.password === password);
        
        // Fallback for original demo user if no users are registered yet
        if (foundUser || (users.length === 0 && username === 'user' && password === 'password')) {
            onLoginSuccess();
        } else {
            setError('Invalid username or password');
        }
    } catch (e) {
        setError('An error occurred during login. Please try again.');
        console.error("Login error:", e);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-black">
      {/* Left visual panel */}
      <div 
        className="hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center p-12 text-white relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=2574&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight tracking-tight">Unlock Your Workflow</h1>
          <p className="text-xl max-w-md font-light">
            Log in to access batch processing, advanced privacy controls, and manage all your photos in one place.
          </p>
        </div>
      </div>

      {/* Right login form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 relative">
            <button 
              onClick={onBack} 
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors text-sm font-medium flex items-center gap-2" 
              title="Go back to the introduction page"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
            <div className="text-center mb-8 pt-8">
              <i className="fas fa-camera-retro text-5xl text-gray-700 dark:text-gray-300 mb-4"></i>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Log in to your RD Exchangeable account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3" title="Username">
                    <i className="fas fa-user text-gray-400"></i>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3" title="Password">
                    <i className="fas fa-lock text-gray-400"></i>
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg p-3 text-center flex items-center justify-center gap-2 dark:bg-red-900/50 dark:border-red-600 dark:text-red-300">
                   <i className="fas fa-exclamation-triangle"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  title="Log in to your account"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button onClick={onGoToRegister} className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 underline">
                        Sign up
                    </button>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
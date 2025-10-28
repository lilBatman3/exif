import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication
    if (username === 'user' && password === 'password') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
             <i className="fas fa-camera-retro text-5xl text-pink-500 mb-4"></i>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to EXIF Viewer</h1>
            <p className="text-gray-500 mt-2">Log in to continue</p>
            <p className="text-xs text-gray-400 mt-4">(Use: user / password)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                   <i className="fas fa-user text-gray-400"></i>
                 </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-300 text-gray-900 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
               <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                   <i className="fas fa-lock text-gray-400"></i>
                 </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-100 border border-gray-300 text-gray-900 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
               </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                 <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const usersRaw = localStorage.getItem('rd_exchangeable_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      if (users.find((user: any) => user.username === username)) {
        setError('Username already exists. Please choose another.');
        return;
      }

      users.push({ username, password });
      localStorage.setItem('rd_exchangeable_users', JSON.stringify(users));
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);

    } catch (e) {
      setError('An error occurred during registration. Please try again.');
      console.error("Registration error:", e);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-black">
      {/* Left visual panel */}
      <div 
        className="hidden lg:flex w-1/2 bg-cover bg-center items-center justify-center p-12 text-white relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=2574&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="z-10 text-center">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight tracking-tight">Create Your Account</h1>
          <p className="text-xl max-w-md font-light">
            Join RD Exchangeable to gain full control over your photos' privacy with batch processing and advanced tools.
          </p>
        </div>
      </div>

      {/* Right registration form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <i className="fas fa-camera-retro text-5xl text-gray-700 dark:text-gray-300 mb-4"></i>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign Up</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Create an account to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3" title="Username">
                    <i className="fas fa-user text-gray-400"></i>
                  </span>
                  <input
                    id="username-reg"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Choose a username"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3" title="Password">
                    <i className="fas fa-lock text-gray-400"></i>
                  </span>
                  <input
                    id="password-reg"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password (min 6 chars)"
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
               <div>
                <label htmlFor="confirm-password-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3" title="Confirm Password">
                    <i className="fas fa-lock text-gray-400"></i>
                  </span>
                  <input
                    id="confirm-password-reg"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
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

              {success && (
                 <div className="bg-green-100 border border-green-300 text-green-700 text-sm rounded-lg p-3 text-center flex items-center justify-center gap-2 dark:bg-green-900/50 dark:border-green-600 dark:text-green-300">
                   <i className="fas fa-check-circle"></i>
                  <span>{success}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={!!success}
                  className="w-full bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                  title="Create your account"
                >
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button onClick={onBackToLogin} className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 underline">
                        Login
                    </button>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
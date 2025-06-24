import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative z-10 text-center py-16 mb-8">
      <div className="relative">
        {/* Main Title with Letter Spacing Effect */}
        <div className="mb-6">
          <h1 className="font-['Orbitron'] text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-400 tracking-[0.2em] mb-2">
            STUDI.IO
          </h1>
          
          {/* Subtle underline accent */}
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full opacity-80"></div>
          </div>
        </div>
        
        {/* Tagline with Modern Typography */}
        <div className="relative">
          <p className="font-['Poppins'] text-xl md:text-2xl font-light text-gray-300 tracking-wider">
            <span className="text-cyan-400 font-medium">Automate</span>
            <span className="mx-3 text-gray-500">•</span>
            <span className="text-white font-medium">Learn</span>
            <span className="mx-3 text-gray-500">•</span>
            <span className="text-pink-400 font-medium">Conquer</span>
          </p>
        </div>
        
        {/* Geometric accent elements */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full opacity-60"></div>
      </div>
    </header>
  );
};

export default Header;
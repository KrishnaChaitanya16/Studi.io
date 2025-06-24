import React from 'react';
import { Zap, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 border-t border-white/10">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-['Poppins']">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-pink-500" />
          <span>using</span>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium">Murf AI</span>
          </div>
          <span>+</span>
          <span className="text-pink-400 font-medium">GPT</span>
          <span>+</span>
          <span className="text-cyan-400 font-medium">Python</span>
        </div>
        
        <div className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        
        <p className="text-xs text-gray-500 font-['Poppins']">
          Transform your content into engaging lectures with AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
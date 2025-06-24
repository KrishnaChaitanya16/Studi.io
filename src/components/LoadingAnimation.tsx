import React from 'react';
import { Brain, Zap, Cpu, Sparkles } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12">
      {/* Main loading animation with enhanced design */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 w-40 h-40 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-transparent to-pink-400 animate-spin opacity-60"></div>
        <div className="absolute inset-1 w-38 h-38 rounded-full border-2 border-transparent bg-gradient-to-l from-pink-400 via-transparent to-cyan-400 animate-spin opacity-40" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        
        {/* Inner pulsing circles */}
        <div className="absolute inset-4 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute inset-6 w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500/30 to-pink-500/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Center icon with glow */}
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-pink-500/10 backdrop-blur-lg border border-white/20 flex items-center justify-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-pink-400 animate-bounce" />
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-8 left-8 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
        <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}></div>
        <div className="absolute bottom-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}></div>
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.9s', animationDuration: '2.4s' }}></div>
      </div>

      {/* Enhanced loading text */}
      <div className="text-center space-y-6">
        <h2 className="font-['Orbitron'] text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-wide">
          GENERATING YOUR AI LECTURE
        </h2>
        
        {/* Progress steps with icons */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="font-['Poppins'] text-sm">Processing content</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-3 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/30">
              <Zap className="w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="font-['Poppins'] text-sm">Synthesizing voice</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="font-['Poppins'] text-sm">Creating presentation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced animated waveform */}
      <div className="flex items-end gap-2 h-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-cyan-500 to-pink-500 rounded-full animate-pulse shadow-lg"
            style={{
              width: '6px',
              height: `${Math.sin(i * 0.5) * 30 + 40}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.5s',
              filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.3))'
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced progress bar */}
      <div className="w-full max-w-lg">
        <div className="relative bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 rounded-full animate-pulse opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-['Poppins']">
          <span>Initializing AI...</span>
          <span>Please wait</span>
        </div>
      </div>

      {/* Subtle background glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
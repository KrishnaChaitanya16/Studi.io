import React, { useState, useEffect } from 'react';
import { Brain, Zap, Cpu, Sparkles, Check } from 'lucide-react';

interface LoadingAnimationProps {
  onStepComplete?: (step: number) => void;
  onAllComplete?: () => void;
  currentStep?: number;
  forceStep?: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  onStepComplete,
  onAllComplete,
  currentStep: externalStep,
  forceStep
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { icon: Cpu, text: 'Processing content', color: 'cyan' },
    { icon: Zap, text: 'Synthesizing voice', color: 'pink' },
    { icon: Sparkles, text: 'Creating presentation', color: 'cyan' }
  ];

  const currentStep = forceStep !== undefined
    ? forceStep
    : externalStep !== undefined
    ? externalStep
    : internalStep;

  // Auto step for demo/testing mode
  useEffect(() => {
    if (externalStep === undefined && forceStep === undefined) {
      const timer = setTimeout(() => {
        if (internalStep < steps.length) {
          setCompletedSteps(prev => [...prev, internalStep]);
          setInternalStep(prev => prev + 1);
          onStepComplete?.(internalStep);

          if (internalStep === steps.length - 1) {
            onAllComplete?.();
          }
        }
      }, 2000 + Math.random() * 1000);

      return () => clearTimeout(timer);
    }
  }, [internalStep, externalStep, forceStep, onStepComplete, onAllComplete, steps.length]);

  // Track completed steps correctly when forceStep or externalStep is used
  useEffect(() => {
    if (externalStep !== undefined || forceStep !== undefined) {
      setCompletedSteps(prev => {
        const updated = [...prev];
        for (let i = 0; i < currentStep; i++) {
          if (!updated.includes(i)) {
            updated.push(i);
          }
        }
        return updated;
      });
    }
  }, [currentStep, externalStep, forceStep]);

  // Trigger onAllComplete when all steps are done
  useEffect(() => {
    if (completedSteps.length === steps.length) {
      onAllComplete?.();
    }
  }, [completedSteps, steps.length, onAllComplete]);

  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep && currentStep < steps.length) return 'active';
    return 'pending';
  };

  const progressPercentage = Math.min(
    Math.round((completedSteps.length / steps.length) * 100),
    100
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12">
      {/* Main rotating visual */}
      <div className="relative">
        <div className="absolute inset-0 w-40 h-40 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-transparent to-pink-400 animate-spin opacity-60"></div>
        <div className="absolute inset-1 w-38 h-38 rounded-full border-2 border-transparent bg-gradient-to-l from-pink-400 via-transparent to-cyan-400 animate-spin opacity-40" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        <div className="absolute inset-4 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute inset-6 w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500/30 to-pink-500/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="relative w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-pink-500/10 backdrop-blur-lg border border-white/20 flex items-center justify-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-pink-400 animate-bounce" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-8 left-8 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-70" />
        <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-8 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-8 right-8 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.9s' }} />
      </div>

      {/* Heading */}
      <div className="text-center space-y-6">
        <h2 className="font-['Orbitron'] text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 tracking-wide">
          GENERATING YOUR AI LECTURE
        </h2>

        {/* Step indicators */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const IconComponent = step.icon;

            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isPending = status === 'pending';

            return (
              <div 
                key={index}
                className={`flex items-center justify-center gap-4 text-gray-300 transition-all duration-500 ${
                  isPending ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20' 
                    : isActive
                    ? step.color === 'cyan'
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                      : 'bg-pink-500/10 border-pink-500/30 shadow-lg shadow-pink-500/20'
                    : 'bg-gray-500/10 border-gray-500/30'
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <IconComponent 
                      className={`w-5 h-5 ${
                        isActive 
                          ? step.color === 'cyan'
                            ? 'text-cyan-400 animate-pulse' 
                            : 'text-pink-400 animate-pulse'
                          : 'text-gray-500'
                      }`}
                    />
                  )}
                  <span className={`font-['Poppins'] text-sm font-medium ${
                    isCompleted 
                      ? 'text-green-400' 
                      : isActive 
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}>
                    {step.text}
                    {isCompleted && ' ✓'}
                    {isActive && '...'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waveform */}
      <div className="flex items-end gap-2 h-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-t from-cyan-500 to-pink-500 rounded-full animate-pulse shadow-lg"
            style={{
              width: '6px',
              height: `${Math.sin(i * 0.5 + Date.now() * 0.001) * 20 + 30}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1.5s',
              filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.3))'
            }}
          ></div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-lg">
        <div className="relative bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/10">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%`, opacity: 0.8 }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-['Poppins']">
          <span>
            {currentStep >= steps.length 
              ? 'Ready!' 
              : currentStep < steps.length 
              ? `${steps[currentStep].text}...`
              : 'Initializing...'
            }
          </span>
          <span>{progressPercentage}%</span>
        </div>
      </div>

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

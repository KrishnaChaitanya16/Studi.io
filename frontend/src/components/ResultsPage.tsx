import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ArrowLeft, ArrowRight, FileQuestion } from 'lucide-react';

interface ResultsPageProps {
  lectureData: {
    flashcards: Array<{ question: string; answer: string }>;
    flashcard_audio: string[];
    mcqs: Array<{ question: string; options: string[]; answer: number }>;
  };
}

const ResultsPage: React.FC<ResultsPageProps> = ({ lectureData }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
    }
    setIsFlipped(false); // Reset flip state when card changes
  }, [currentCard]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (!submitted) {
      setQuizAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    }
  };

  const handleNext = () => {
    if (currentCard < lectureData.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const totalCorrect = Object.entries(quizAnswers).reduce((score, [qIndexStr, userAnswer]) => {
    const qIndex = parseInt(qIndexStr);
    return score + (lectureData.mcqs[qIndex]?.answer === userAnswer ? 1 : 0);
  }, 0);

  const formatFlashcardVisual = (question: string, answer: string) => {
    return (
      <div 
        className="relative w-full aspect-video cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={handleCardClick}
      >
        <div 
          className="relative w-full h-full transition-transform duration-700 transform-gpu"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of card (Question) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black rounded-2xl shadow-2xl p-12 flex flex-col justify-center items-center gap-4 border-4 border-indigo-700 text-white"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className="text-3xl font-bold font-['Orbitron'] text-center">{question}</h2>
            <p className="text-sm text-white/70 font-['Poppins'] text-center">Click to reveal answer</p>
          </div>
          
          {/* Back of card (Answer) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black rounded-2xl shadow-2xl p-12 flex flex-col justify-center items-center gap-4 border-4 border-purple-700 text-white"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <h2 className="text-2xl font-bold font-['Orbitron'] text-center mb-4">Answer:</h2>
            <p className="text-lg text-white/90 font-['Poppins'] text-center">{answer}</p>
            <p className="text-sm text-white/70 font-['Poppins'] text-center">Click to see question</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-10">
      
      <h2 className="text-4xl text-center font-bold text-white font-['Orbitron']">
        Flashcard {currentCard + 1} of {lectureData.flashcards.length}
      </h2>

      <div className="flex justify-center items-center min-h-[480px]">
        {formatFlashcardVisual(
          lectureData.flashcards[currentCard]?.question,
          lectureData.flashcards[currentCard]?.answer
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <audio ref={audioRef} controls className="w-full max-w-md">
          <source src={lectureData.flashcard_audio[currentCard]} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <button
          onClick={handlePlayPause}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full text-white font-semibold hover:scale-105 transition-transform flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} {isPlaying ? "Pause" : "Play"} Audio
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentCard === 0}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          <ArrowLeft className="inline-block mr-1" /> Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentCard === lectureData.flashcards.length - 1}
          className="bg-gray-800 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Next <ArrowRight className="inline-block ml-1" />
        </button>
      </div>

      {/* QUIZ SECTION */}
      <div className="mt-12">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div
            onClick={() => setShowQuiz(!showQuiz)}
            className="p-6 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 flex items-center justify-center">
                  <FileQuestion className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Orbitron'] text-xl font-bold text-white">INTERACTIVE QUIZ</h3>
                  <p className="text-gray-300">Test your understanding • {lectureData.mcqs.length} questions</p>
                </div>
              </div>
              <div className={`transform transition-transform ${showQuiz ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {showQuiz && (
            <div className="p-6 space-y-6 animate-fadeIn">
              {lectureData.mcqs.map((question, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <h4 className="font-['Poppins'] text-lg font-medium text-white">
                    {qIndex + 1}. {question.question}
                  </h4>
                  <div className="grid gap-2">
                    {question.options.map((option, oIndex) => {
                      const isCorrect = oIndex === question.answer;
                      const isSelected = quizAnswers[qIndex] === oIndex;

                      let bgClass =
                        'bg-black/20 hover:bg-white/5 border border-white/10';
                      if (submitted) {
                        if (isCorrect && isSelected) {
                          bgClass = 'bg-green-600/30 border border-green-600';
                        } else if (isSelected && !isCorrect) {
                          bgClass = 'bg-red-600/30 border border-red-600';
                        } else if (isCorrect) {
                          bgClass = 'bg-green-600/20 border border-green-600/50';
                        } else {
                          bgClass = 'bg-black/10 border border-white/10';
                        }
                      } else if (isSelected) {
                        bgClass = 'bg-cyan-500/20 border border-cyan-500/50';
                      }

                      return (
                        <label
                          key={oIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${bgClass}`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            onChange={() => handleQuizAnswer(qIndex, oIndex)}
                            checked={isSelected}
                            disabled={submitted}
                            className="text-cyan-500 focus:ring-cyan-500"
                          />
                          <span className="text-gray-300">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {!submitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-['Orbitron'] font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
                >
                  SUBMIT QUIZ
                </button>
              ) : (
                <p className="text-center mt-6 text-xl font-semibold text-white">
                  ✅ You got {totalCorrect} out of {lectureData.mcqs.length} correct!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
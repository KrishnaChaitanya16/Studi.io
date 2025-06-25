import React, { useState } from 'react';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import LoadingAnimation from './components/LoadingAnimation';
import ResultsPage from './components/ResultsPage';
import Footer from './components/Footer';

type AppState = 'upload' | 'loading' | 'results';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [lectureData, setLectureData] = useState<any | null>(null);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const handleFormSubmit = async (formData: FormData) => {
    setCurrentState('loading');
    setLoadingStep(0); // Start with step 0 (Processing content)
    
    try {
      // Small delay to show initial step
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 0: Processing content (API call)
      const res = await fetch('https://studi-io.onrender.com/process', {
        method: 'POST',
        body: formData,
      });
      
      // Move to step 1: Synthesizing voice
      setLoadingStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await res.json();
      
      // Move to step 2: Creating presentation
      setLoadingStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Format the data
      const formattedFlashcards = data.flashcards.map((card: any) => ({
        question: card.front,
        answer: card.back
      }));
      
      const formattedQuiz = data.mcqs.map((mcq: any) => ({
        question: mcq.question || mcq.split('\n')[0],
        options: mcq.options || ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: mcq.answer || 0
      }));
      
      setLectureData({
        flashcards: formattedFlashcards,
        flashcard_audio: data.flashcard_audio,
        mcqs: formattedQuiz
      });
      
      // Complete all steps (step 3 means all done)
      setLoadingStep(3);
      
      // Wait a moment to show completion, then go to results
      setTimeout(() => {
        setCurrentState('results');
        setLoadingStep(0);
      }, 1200);
      
    } catch (error) {
      console.error('Error processing lecture:', error);
      alert('Something went wrong! Please try again.');
      setCurrentState('upload');
      setLoadingStep(0);
    }
  };

  const handleNewLecture = () => {
    setCurrentState('upload');
    setLectureData(null);
    setLoadingStep(0);
  };

  const handleStepComplete = (step: number) => {
    console.log(`Step ${step} completed`);
  };

  const handleAllComplete = () => {
    console.log('All steps completed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-cyan-500/5 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {currentState === 'upload' && <Header />}

        <main className="min-h-[60vh] flex items-center justify-center">
          {currentState === 'upload' && (
            <div className="w-full animate-fadeIn">
              <UploadForm onSubmit={handleFormSubmit} />
            </div>
          )}

          {currentState === 'loading' && (
            <div className="w-full animate-fadeIn">
              <LoadingAnimation 
                forceStep={loadingStep}
                onStepComplete={handleStepComplete}
                onAllComplete={handleAllComplete}
              />
            </div>
          )}

          {currentState === 'results' && lectureData && (
            <div className="w-full animate-fadeIn">
              <ResultsPage lectureData={lectureData} />
              <div className="text-center mt-12">
                <button
                  onClick={handleNewLecture}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl text-white hover:scale-105 transition-transform font-['Orbitron'] font-medium"
                >
                  Create New Lecture
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
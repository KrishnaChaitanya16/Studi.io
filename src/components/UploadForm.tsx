import React, { useState } from 'react';
import { Upload, FileText, Mic, Sparkles } from 'lucide-react';

interface UploadFormProps {
  onSubmit: (data: FormData) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [voiceTone, setVoiceTone] = useState('');

  const subjects = [
    'Science', 'Mathematics', 'History', 'Literature', 
    'Computer Science', 'Biology', 'Chemistry', 'Physics'
  ];

  const voiceTones = [
    'Calm Female', 'Energetic Male', 'Professional Female',
    'Enthusiastic Male', 'Gentle Female', 'Authoritative Male'
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && subject && voiceTone) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('subject', subject);
      formData.append('voiceTone', voiceTone);
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl group overflow-hidden">
        {/* Simple grazing line effect */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-pink-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute right-0 bottom-0 w-[2px] h-full bg-gradient-to-t from-transparent via-pink-400 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-gray-600 hover:border-cyan-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="flex flex-col items-center gap-4">
              {selectedFile ? (
                <>
                  <FileText className="w-12 h-12 text-cyan-400" />
                  <p className="text-cyan-400 font-medium">{selectedFile.name}</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  <div>
                    <p className="text-gray-300 font-medium mb-1">Drop your files here or click to browse</p>
                    <p className="text-gray-500 text-sm">Supports PDF, TXT, DOCX</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="block text-cyan-400 font-['Poppins'] font-medium">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj} className="bg-gray-900">
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Tone Selection */}
          <div className="space-y-2">
            <label className="block text-pink-400 font-['Poppins'] font-medium">
              Voice Tone
            </label>
            <select
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all backdrop-blur-sm"
              required
            >
              <option value="">Select Voice Tone</option>
              {voiceTones.map((tone) => (
                <option key={tone} value={tone} className="bg-gray-900">
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || !subject || !voiceTone}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white font-['Orbitron'] font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span>Generate Lecture</span>
              <Mic className="w-5 h-5" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
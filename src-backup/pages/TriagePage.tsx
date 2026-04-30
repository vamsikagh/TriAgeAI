import { useState } from 'react';
import { useStore } from '../store';
import { analyzePatient, isGeminiConfigured } from '../services/geminiService';
import { Mic, Camera, FileText, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import type { Patient } from '../types';

type TabType = 'text' | 'voice' | 'photo';

export default function TriagePage() {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const {
    currentInput,
    setCurrentInput,
    isAnalyzing,
    setAnalyzing,
    analysisError,
    setAnalysisError,
    addPatient,
    resetCurrentInput,
  } = useStore();

  const [result, setResult] = useState<Patient | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAnalysisError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setAnalysisError('Image must be less than 10 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setCurrentInput({
        imageBase64: base64,
        imageMimeType: file.type as any,
        imagePreviewUrl: reader.result as string,
      });
      setAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setAnalysisError('Voice input is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setAnalysisError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentInput({ description: currentInput.description + ' ' + transcript });
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setAnalysisError('Voice recognition failed. Please try again.');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleAnalyze = async () => {
    if (!currentInput.patientDetails.name || !currentInput.patientDetails.age || !currentInput.patientDetails.gender) {
      setAnalysisError('Please fill in all patient details');
      return;
    }

    if (!currentInput.description && !currentInput.imageBase64) {
      setAnalysisError('Please provide an injury description or upload a photo');
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const triageResult = await analyzePatient(currentInput);
      
      const patient: Patient = {
        id: `p-${Date.now()}`,
        name: currentInput.patientDetails.name,
        age: currentInput.patientDetails.age,
        gender: currentInput.patientDetails.gender,
        description: currentInput.description,
        location: 'Noida Sector 18, Delhi NCR',
        ...triageResult,
        imagePreviewUrl: currentInput.imagePreviewUrl,
        dispatchedTo: null,
        eta: null,
        status: 'triaged',
      };

      setResult(patient);
      addPatient(patient);
      setShowResult(true);
    } catch (error: any) {
      setAnalysisError(error.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleNewTriage = () => {
    resetCurrentInput();
    setResult(null);
    setShowResult(false);
    setAnalysisError(null);
  };

  const geminiConfigured = isGeminiConfigured();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Triage</h1>
        <p className="text-gray-400">Describe or photograph injuries — Gemini AI will classify severity</p>
      </div>

      {!geminiConfigured && (
        <div className="card bg-amber-950 border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-medium">Gemini API Key Not Configured</p>
              <p className="text-amber-300 text-sm mt-1">
                Add VITE_GEMINI_API_KEY to your .env file to enable AI analysis
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Tabs */}
      <div className="card">
        <div className="flex gap-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'text'
                ? 'text-white border-b-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            ✍️ Text
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'voice'
                ? 'text-white border-b-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
            🎙️ Voice
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'photo'
                ? 'text-white border-b-2 border-rose-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Camera className="w-4 h-4" />
            📸 Photo
          </button>
        </div>

        {/* Patient Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">NAME</label>
            <input
              type="text"
              value={currentInput.patientDetails.name}
              onChange={(e) =>
                setCurrentInput({
                  patientDetails: { ...currentInput.patientDetails, name: e.target.value },
                })
              }
              className="input-field"
              placeholder="Patient name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">AGE</label>
            <input
              type="number"
              value={currentInput.patientDetails.age}
              onChange={(e) =>
                setCurrentInput({
                  patientDetails: { ...currentInput.patientDetails, age: e.target.value },
                })
              }
              className="input-field"
              placeholder="Age"
              min="0"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">GENDER</label>
            <select
              value={currentInput.patientDetails.gender}
              onChange={(e) =>
                setCurrentInput({
                  patientDetails: { ...currentInput.patientDetails, gender: e.target.value as any },
                })
              }
              className="input-field"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'text' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">INJURY DESCRIPTION</label>
            <textarea
              value={currentInput.description}
              onChange={(e) => setCurrentInput({ description: e.target.value })}
              className="input-field min-h-32"
              placeholder="Describe the patient's injuries, symptoms, and condition..."
            />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">VOICE INPUT</label>
            <button
              onClick={handleVoiceInput}
              disabled={isRecording}
              className={`btn-primary w-full ${isRecording ? 'animate-pulse' : ''}`}
            >
              <Mic className="w-5 h-5 inline mr-2" />
              {isRecording ? 'Listening...' : 'Start Recording'}
            </button>
            {currentInput.description && (
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-1">Transcription:</p>
                <p className="text-white">{currentInput.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photo' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">UPLOAD PHOTO</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="input-field"
            />
            {currentInput.imagePreviewUrl && (
              <div className="mt-4">
                <img
                  src={currentInput.imagePreviewUrl}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg border border-slate-600"
                />
              </div>
            )}
          </div>
        )}

        {analysisError && (
          <div className="mt-4 bg-rose-950 border border-rose-800 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-rose-200 text-sm">{analysisError}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !geminiConfigured}
          className="btn-primary w-full mt-6"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
              Analyzing with Gemini AI...
            </>
          ) : (
            'Analyze with Gemini AI'
          )}
        </button>
      </div>

      {/* AI Assessment Result */}
      {showResult && result && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">AI Assessment</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SeverityBadge level={result.severityLevel} size="lg" />
              <div>
                <p className="text-sm text-gray-400">Confidence Score</p>
                <p className="text-2xl font-bold text-white">{result.confidenceScore}%</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Injury Summary</p>
              <p className="text-white">{result.injurySummary}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-2">Recommended Actions</p>
              <ul className="space-y-1">
                {result.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Surgery Required:</span>
                <span className={result.requiresSurgery ? 'text-rose-400 font-semibold' : 'text-slate-500'}>
                  {result.requiresSurgery ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Blood Required:</span>
                <span className={result.requiresBlood ? 'text-rose-400 font-semibold' : 'text-slate-500'}>
                  {result.requiresBlood ? 'YES' : 'NO'}
                </span>
              </div>
            </div>

            <button onClick={handleNewTriage} className="btn-secondary w-full mt-4">
              Start New Triage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

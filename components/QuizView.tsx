
import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, XCircle, Trophy, RotateCcw, Home, ArrowLeft, Zap, Target, Brain } from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  onRestart: () => void;
  onGoHome: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onRestart, onGoHome }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentIdx];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'hard': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy className="w-12 h-12 md:w-16 md:h-16 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">تحليل الأداء</h2>
          <p className="text-gray-500 mb-10 font-bold text-lg">لقد أتممت التحدي بنجاح!</p>
          
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
               <div className="text-4xl font-black text-indigo-600">{percentage}%</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">النسبة</div>
            </div>
            <div className="w-px h-12 bg-gray-100 self-center"></div>
            <div className="text-center">
               <div className="text-4xl font-black text-gray-900">{score} / {questions.length}</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">النقاط</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة التعلم
            </button>
            <button
              onClick={onGoHome}
              className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-gray-700 border-2 border-gray-100 rounded-[2rem] font-black text-lg hover:bg-gray-50 transition-all active:scale-95"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black">
            {currentIdx + 1}
          </div>
          <span className="text-gray-400 font-bold text-sm uppercase tracking-wider">من {questions.length} أسئلة</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(question.difficulty)}`}>
           مستوى: {question.difficulty}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 border border-gray-100 mb-8 relative">
        <div className="absolute top-0 right-10 -translate-y-1/2 bg-white p-3 rounded-2xl shadow-lg border border-gray-50">
           <Brain className="w-8 h-8 text-indigo-500" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-12 leading-relaxed text-center md:text-right">
          {question.question}
        </h2>

        <div className="space-y-4 mb-10">
          {question.options.map((option, i) => {
            let style = 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/20';
            if (isAnswered) {
              if (option === question.correctAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-900 scale-[1.02] z-10';
              else if (option === selectedAnswer) style = 'border-rose-500 bg-rose-50 text-rose-900 opacity-80';
              else style = 'border-gray-50 opacity-40';
            } else if (option === selectedAnswer) {
              style = 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100 text-indigo-900';
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full flex items-center justify-between p-5 md:p-7 rounded-[2rem] border-2 transition-all font-bold text-right text-base md:text-xl relative ${style}`}
              >
                <span className="flex-1 ml-4">{option}</span>
                {isAnswered && option === question.correctAnswer && <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />}
                {isAnswered && option === selectedAnswer && option !== question.correctAnswer && <XCircle className="w-6 h-6 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="bg-indigo-50/50 rounded-[2rem] p-6 md:p-8 border border-indigo-100/50 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-indigo-900 font-black mb-3">
              <Target className="w-5 h-5 text-indigo-500" />
              لماذا هذه هي الإجابة؟
            </div>
            <p className="text-indigo-800/80 leading-relaxed text-sm md:text-lg font-medium">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {!isAnswered ? (
          <button
            onClick={() => selectedAnswer && setIsAnswered(true) && selectedAnswer === question.correctAnswer && setScore(s => s + 1)}
            disabled={!selectedAnswer}
            className={`w-full max-w-xs py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl 
              ${!selectedAnswer ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-indigo-100'}`}
          >
            تأكيد الإجابة
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2"
          >
            {currentIdx === questions.length - 1 ? 'رؤية النتيجة النهائية' : 'السؤال القادم'}
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;

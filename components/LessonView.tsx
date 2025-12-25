
import React, { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { ChevronLeft, ChevronRight, BookOpen, ListChecks, Lightbulb, AlertTriangle, Info, Bookmark, Sparkles } from 'lucide-react';

interface LessonViewProps {
  lessons: Lesson[];
  onFinish: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lessons, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const lesson = lessons[currentStep];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'tip': return 'bg-amber-50 border-amber-100 text-amber-900';
      case 'warning': return 'bg-rose-50 border-rose-100 text-rose-900';
      default: return 'bg-blue-50 border-blue-100 text-blue-900';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      {/* Progress Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
        <div className="w-full md:w-auto text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-3">
            <Bookmark className="text-indigo-600 w-7 h-7" />
            {lesson.title}
          </h2>
          <div className="flex gap-2 justify-center md:justify-start">
            {lessons.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-12 bg-indigo-600' : 'w-3 bg-indigo-100'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-black text-indigo-600 uppercase">المرحلة {currentStep + 1}</span>
        </div>
      </div>

      {/* Insight Alerts (Top) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {lesson.insights.map((insight, idx) => (
          <div key={idx} className={`flex items-start gap-3 p-4 rounded-2xl border ${getInsightBg(insight.type)} animate-in slide-in-from-right-4 duration-500 delay-${idx * 100}`}>
            <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
              {getInsightIcon(insight.type)}
            </div>
            <p className="text-sm font-bold leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 md:p-10">
          {/* Summary Box */}
          <div className="mb-10 p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
               <BookOpen className="w-32 h-32" />
            </div>
            <h4 className="text-indigo-100 text-xs font-black mb-2 uppercase tracking-widest">خلاصة المحتوى</h4>
            <p className="text-lg md:text-xl font-bold leading-relaxed relative z-10">
              {lesson.summary}
            </p>
          </div>

          {/* Main Body */}
          <div className="prose prose-indigo max-w-none text-gray-700 leading-loose text-base md:text-xl mb-12 text-right">
            {lesson.content.split('\n').map((para, i) => para.trim() && (
              <p key={i} className="mb-6 first-letter:text-3xl first-letter:font-black first-letter:text-indigo-600">{para}</p>
            ))}
          </div>

          {/* Key Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="col-span-full mb-2">
               <h4 className="flex items-center gap-2 font-black text-gray-900 text-lg">
                 <ListChecks className="text-emerald-500" />
                 ركائز التعلم
               </h4>
            </div>
            {lesson.keyPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">{i+1}</div>
                <span className="text-sm md:text-base font-bold text-gray-700">{point}</span>
              </div>
            ))}
          </div>

          {/* Deep Dive Notes Section */}
          <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-slate-100">
            <h4 className="flex items-center gap-2 font-black mb-6 text-slate-300">
               <Info className="text-indigo-400" />
               ملاحظات معمقة للطالب المتميز
            </h4>
            <div className="space-y-4">
              {lesson.notes.map((note, idx) => (
                <div key={idx} className="flex gap-3 items-start border-r-2 border-indigo-500/30 pr-4">
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed italic">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 flex justify-center">
        <div className="w-full max-w-4xl flex justify-between gap-4">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black transition-all ${currentStep === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'}`}
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </button>

          <button
            onClick={() => currentStep < lessons.length - 1 ? setCurrentStep(prev => prev + 1) : onFinish()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {currentStep === lessons.length - 1 ? 'إنهاء وبدء التقييم' : 'الدرس التالي'}
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;

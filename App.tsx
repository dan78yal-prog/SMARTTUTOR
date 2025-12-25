
import React, { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import LessonView from './components/LessonView';
import QuizView from './components/QuizView';
import { AppState, StudyData } from './types';
import { processContent } from './services/geminiService';
// Added AlertTriangle to the imports from lucide-react
import { Sparkles, BrainCircuit, GraduationCap, ChevronLeft, Flag, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [studyData, setStudyData] = useState<StudyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContentExtracted = async (text: string) => {
    setState('processing');
    setError(null);
    try {
      const data = await processContent(text);
      setStudyData(data);
      setState('studying');
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.");
      setState('landing');
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setState('landing')}>
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-100">
            <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Smart<span className="text-indigo-600">Tutor</span></span>
        </div>
        
        {(state === 'studying' || state === 'testing') && (
          <button 
            onClick={() => confirm('هل أنت متأكد من رغبتك في الخروج؟ سيتم فقدان تقدمك الحالي.') && setState('landing')}
            className="text-xs md:text-sm font-bold text-gray-500 hover:text-rose-600 flex items-center gap-2 transition-colors bg-gray-50 hover:bg-rose-50 px-4 py-2 rounded-full border border-gray-100"
          >
            إنهاء الجلسة
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-[#fcfdff] text-right font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {renderHeader()}

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {state === 'landing' && (
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-20 animate-in fade-in duration-700">
            <div className="lg:w-1/2 text-center lg:text-right space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs md:text-sm font-bold border border-indigo-100 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>الجيل الثالث من التعلم المخصص</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] md:leading-tight">
                حول كتبك إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">رحلة استكشاف</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                ارفع أي ملف PDF، وسيقوم معلمك الذكي بصياغة دروس تفاعلية، ملاحظات معمقة، واختبارات تتحدى ذكاءك.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-6">
                <button 
                  onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3"
                >
                  ابدأ التعلم الآن
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex -space-x-3 space-x-reverse">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${i+20}`} className="w-10 h-10 rounded-full border-4 border-white shadow-sm" alt="user" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-gray-500 leading-none">انضم لـ ٥٠ ألف طالب ذكي</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full max-w-xl mx-auto" id="upload-section">
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-[4rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <PDFUploader 
                  onContentExtracted={handleContentExtracted}
                  isProcessing={state === 'processing'}
                />
              </div>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-indigo-400 blur-[100px] opacity-20 animate-pulse"></div>
              <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border border-indigo-50">
                <BrainCircuit className="w-16 h-16 md:w-24 md:h-24 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">جارٍ صياغة المنهج...</h2>
            <p className="text-lg md:text-2xl text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
              نحن نقرأ النص، نستخلص العبر، ونصمم لك اختباراً حقيقياً لقياس فهمك.
            </p>
          </div>
        )}

        {state === 'studying' && studyData && (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-12 px-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black mb-4 border border-emerald-100">
                <Flag className="w-4 h-4" />
                <span>الهدف: {studyData.learningPathGoal}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{studyData.topic}</h2>
              <p className="text-base md:text-xl text-gray-500 font-bold leading-relaxed">
                رحلتك تتكون من {studyData.lessons.length} مراحل تعليمية مكثفة.
              </p>
            </div>
            <LessonView 
              lessons={studyData.lessons} 
              onFinish={() => setState('testing')} 
            />
          </div>
        )}

        {state === 'testing' && studyData && (
          <div className="animate-in slide-in-from-left-8 duration-700">
             <div className="text-center mb-12 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">اختبار التميز 🎯</h2>
              <p className="text-lg md:text-2xl text-gray-500 font-bold">حان وقت إثبات المعرفة التي اكتسبتها</p>
            </div>
            <QuizView 
              questions={studyData.quiz} 
              onRestart={() => setState('studying')}
              onGoHome={() => setState('landing')}
            />
          </div>
        )}

        {error && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-[400px] bg-white border-2 border-rose-100 p-6 rounded-[2.5rem] shadow-2xl z-[100] animate-in slide-in-from-bottom-10">
            <div className="flex items-start gap-4">
               <div className="bg-rose-50 p-3 rounded-2xl">
                 <AlertTriangle className="w-6 h-6 text-rose-600" />
               </div>
               <div className="flex-1">
                  <h3 className="font-black text-xl text-gray-900 mb-2">توقف قليلاً!</h3>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="mt-6 w-full bg-gray-900 text-white py-3 rounded-2xl font-black text-sm transition-transform active:scale-95"
                  >
                    حسناً، فهمت
                  </button>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-gray-400 text-sm font-black text-center md:text-right">
            SmartTutor AI &copy; ٢٠٢٤ - ثورة في التعليم الإلكتروني.
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {['المجتمع', 'الخصوصية', 'المساعدة', 'الأثر التعليمي'].map(link => (
              <a key={link} href="#" className="text-sm font-black text-gray-400 hover:text-indigo-600 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

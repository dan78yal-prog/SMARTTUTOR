
import React, { useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle, ShieldCheck, Zap, Target } from 'lucide-react';

interface PDFUploaderProps {
  onContentExtracted: (text: string) => void;
  isProcessing: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onContentExtracted, isProcessing }) => {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractText = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // الحصول على مرجع المكتبة بشكل آمن من النافذة العالمية
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) {
        throw new Error("مكتبة PDF غير محملة بعد. يرجى تحديث الصفحة.");
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length < 50) {
        throw new Error("الملف لا يحتوي على نص كافٍ للتحليل. تأكد من أنه ملف نصي وليس مجرد صور.");
      }

      onContentExtracted(fullText);
    } catch (err: any) {
      console.error("PDF Extraction Error:", err);
      setError(err.message || "فشل قراءة الملف. حاول مرة أخرى.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setError(null);
      extractText(file);
    } else if (file) {
      setError("يرجى اختيار ملف بصيغة PDF فقط.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-2">
      <div 
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-[3px] border-dashed rounded-[2.5rem] p-8 md:p-14 text-center transition-all duration-300
          ${isProcessing 
            ? 'border-indigo-300 bg-indigo-50/50 cursor-not-allowed scale-[0.98]' 
            : 'border-indigo-200 hover:border-indigo-500 hover:bg-white bg-white shadow-xl shadow-indigo-100/20'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          className="hidden" 
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-6">
          <div className={`p-5 rounded-3xl transition-all duration-500 ${isProcessing ? 'bg-white shadow-lg' : 'bg-indigo-50 group-hover:scale-110 group-hover:rotate-6'}`}>
            {isProcessing ? (
              <Loader2 className="w-10 h-10 md:w-14 md:h-14 text-indigo-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 md:w-14 md:h-14 text-indigo-600" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-gray-800">
              {isProcessing ? 'نحن نحلل ملفك...' : 'ارفع ملفك الدراسي'}
            </h3>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              {isProcessing ? 'ثوانٍ وسنكون جاهزين لبدء الدرس' : 'اضغط هنا لاختيار ملف PDF (بحد أقصى 10MB)'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs md:text-sm font-bold leading-relaxed">{error}</span>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'دقة عالية', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'سرعة البرق', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'تركيز ذكي', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
        ].map((feat, i) => (
          <div key={i} className="flex flex-row sm:flex-col items-center gap-3 p-3 md:p-4 rounded-2xl bg-white shadow-sm border border-gray-100 transition-transform hover:translate-y-[-2px]">
            <div className={`p-2 rounded-xl ${feat.bg}`}>
              <feat.icon className={`w-5 h-5 md:w-6 md:h-6 ${feat.color}`} />
            </div>
            <span className="text-[11px] md:text-xs font-extrabold text-gray-700 tracking-wide uppercase">{feat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFUploader;

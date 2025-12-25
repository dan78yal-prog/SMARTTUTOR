
import { GoogleGenAI, Type } from "@google/genai";
import { StudyData } from "../types";

export const processContent = async (text: string): Promise<StudyData> => {
  // جلب المفتاح مباشرة من البيئة
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("مفتاح الـ API غير متوفر حالياً. يرجى التأكد من إضافة API_KEY في إعدادات البيئة بـ Netlify ثم إعادة بناء الموقع (Clear Cache and Deploy).");
  }

  // إنشاء العميل
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `
    أنت خبير تربوي ومصمم مناهج تعليمية ذكي. قم بتحليل النص المستخرج من ملف PDF التالي بدقة عالية وقم ببناء رحلة تعليمية متكاملة باللغة العربية.
    
    المطلوب:
    1. موضوع الرحلة وهدف تعليمي رئيسي.
    2. تقسيم المحتوى إلى 3-4 دروس احترافية (شرح مفصل وممتع).
    3. لكل درس: (العنوان، المحتوى الشرحي، ملخص، نقاط أساسية، ملاحظات معمقة، وتنبيهات ذكية).
    4. اختبار تقييمي (5 أسئلة متنوعة الصعوبة).
    
    النص المستخرج:
    ${text.substring(0, 15000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            learningPathGoal: { type: Type.STRING },
            lessons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  notes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  insights: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, enum: ['tip', 'warning', 'fact'] },
                        text: { type: Type.STRING }
                      },
                      required: ["type", "text"]
                    }
                  }
                },
                required: ["title", "content", "summary", "keyPoints", "notes", "insights"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation", "difficulty"]
              }
            }
          },
          required: ["topic", "learningPathGoal", "lessons", "quiz"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("لم يتمكن الذكاء الاصطناعي من تحليل النص. حاول مرة أخرى.");
    
    return JSON.parse(textOutput.trim()) as StudyData;
  } catch (error: any) {
    console.error("Gemini Process Error:", error);
    
    if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("401")) {
      throw new Error("مفتاح الـ API المستخدم غير صالح. يرجى مراجعة المفتاح في إعدادات Netlify.");
    }
    
    if (error.message?.includes("429")) {
      throw new Error("لقد تجاوزت حد الاستخدام المجاني للـ API. يرجى الانتظار قليلاً ثم المحاولة.");
    }

    throw new Error(error.message || "حدث خطأ غير متوقع أثناء معالجة الملف.");
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { StudyData } from "../types";

export const processContent = async (text: string): Promise<StudyData> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "") {
    throw new Error("مفتاح الـ API غير متوفر. إذا كنت تستخدم Netlify، يرجى التأكد من إضافة API_KEY في إعدادات البيئة (Environment Variables).");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const prompt = `
    أنت خبير تربوي ومصمم مناهج تعليمية ذكي. قم بتحليل النص المستخرج من ملف PDF التالي بدقة عالية وقم ببناء رحلة تعليمية متكاملة باللغة العربية.
    
    المطلوب:
    1. موضوع الرحلة وهدف تعليمي رئيسي.
    2. تقسيم المحتوى إلى 3-4 دروس احترافية.
    3. لكل درس: (العنوان، المحتوى الشرحي، ملخص، نقاط أساسية، ملاحظات معمقة "Deep Dive"، وتنبيهات ذكية).
    4. اختبار تقييمي (5 أسئلة متنوعة).
    
    النص:
    ${text.substring(0, 20000)}
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
    if (!textOutput) throw new Error("لم يتم استلام رد صالح من الذكاء الاصطناعي.");
    return JSON.parse(textOutput.trim()) as StudyData;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("401") || error.message?.includes("API key")) {
      throw new Error("خطأ في صلاحية الـ API. يرجى التأكد من صحة المفتاح المستخدم.");
    }
    throw new Error(error.message || "حدث خطأ أثناء معالجة البيانات.");
  }
};

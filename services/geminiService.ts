
import { GoogleGenAI, Type } from "@google/genai";
import { StudyData } from "../types";

export const processContent = async (text: string): Promise<StudyData> => {
  // إنشاء المثيل داخل الدالة لضمان استقرار التشغيل
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const prompt = `
    أنت خبير تربوي ومصمم مناهج تعليمية ذكي. قم بتحليل النص المستخرج من ملف PDF التالي بدقة عالية وقم ببناء رحلة تعليمية متكاملة.
    
    المطلوب:
    1. موضوع الرحلة وهدف تعليمي رئيسي.
    2. تقسيم المحتوى إلى 3-4 دروس احترافية.
    3. لكل درس: (العنوان، المحتوى الشرحي، ملخص، نقاط أساسية، ملاحظات معمقة "Deep Dive"، وتنبيهات ذكية "هل تعلم أو نصيحة").
    4. اختبار تقييمي يتحدى فهم الطالب (5 أسئلة متنوعة الصعوبة).
    
    اجعل الأسلوب مشوقاً، تعليمياً، وباللغة العربية الفصحى المعاصرة.
    
    النص المستخرج:
    ${text.substring(0, 18000)}
  `;

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

  try {
    const textOutput = response.text;
    if (!textOutput) throw new Error("لم يتم استلام رد من النموذج.");
    return JSON.parse(textOutput.trim()) as StudyData;
  } catch (error) {
    console.error("Error processing content:", error);
    throw new Error("حدث خطأ أثناء صياغة المنهج التعليمي. يرجى المحاولة مرة أخرى.");
  }
};

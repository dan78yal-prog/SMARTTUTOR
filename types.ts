
export interface Lesson {
  title: string;
  content: string;
  summary: string;
  keyPoints: string[];
  notes: string[]; // ملاحظات معمقة
  insights: {
    type: 'tip' | 'warning' | 'fact';
    text: string;
  }[]; // تنبيهات ذكية
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyData {
  lessons: Lesson[];
  quiz: Question[];
  topic: string;
  learningPathGoal: string; // الهدف العام للرحلة
}

export type AppState = 'landing' | 'uploading' | 'processing' | 'studying' | 'testing' | 'results';

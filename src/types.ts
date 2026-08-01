export interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  iconName?: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  shortCaption?: string;
  date?: string;
  location?: string;
  isVideo?: boolean;
  videoUrl?: string;
  fallbackVideoUrl?: string;
  fallbackUrl?: string;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  note?: string;
  audioUrl?: string;
  fallbackAudioUrl?: string;
}

export interface ReasonItem {
  id: number;
  text: string;
  category?: string;
}

export interface BookPage {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  date?: string;
}

export interface FlowerItem {
  id: string;
  name: string;
  color: string;
  message: string;
  symbolism: string;
}

export interface StarWish {
  id: string;
  x: number; // percentage
  y: number; // percentage
  size: number;
  wish: string;
}

export interface HiddenMessage {
  id: string;
  hint: string;
  message: string;
  x: number;
  y: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AppContentData {
  timeline: TimelineItem[];
  photos: PhotoItem[];
  playlist: PlaylistTrack[];
  reasons: ReasonItem[];
  bookPages: BookPage[];
  flowers: FlowerItem[];
  starWishes: StarWish[];
  hiddenMessages: HiddenMessage[];
  quizQuestions: QuizQuestion[];
  letterText: {
    greeting: string;
    body1: string;
    body2: string;
    body3: string;
    closing: string;
  };
}

export type FinalResponseType = "Maybe" | "No" | null;

export interface AppSavedProgress {
  currentPage: number;
  isUnlocked: boolean;
  quizScore: number;
  quizAnswered: Record<string, number>;
  openedFlowers: string[];
  foundHearts: string[];
  openedStars: string[];
  musicEnabled: boolean;
  darkMode: boolean;
  finalResponse: FinalResponseType;
  sessionId: string;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar: string | null;
  cardsViewed: number;
  readingsDone: number;
  level: number;
  experience: number;
}

export interface TarotCard {
  id: string;
  name: string;
  shortName: string;
  cardType: 'MAJOR_ARCANA' | 'MINOR_ARCANA';
  suit: 'CUPS' | 'SWORDS' | 'WANDS' | 'PENTACLES' | 'MAJOR';
  element: 'FIRE' | 'WATER' | 'AIR' | 'EARTH' | 'SPIRIT';
  imageUrl: string | null;
  number: number | null;
  position: number;
  keywords: string[];
  description: string;
  symbolism: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  story: string | null;
  lessons: string[] | null;
  questions: string[] | null;
  loveMeaning: string | null;
  careerMeaning: string | null;
  spiritualMeaning: string | null;
  symbols: Record<string, string> | null;
  examples: string[] | null;
}

export interface SelectedCard {
  card: TarotCard;
  position: number;
  positionName: string;
  isReversed: boolean;
}

export interface ReadingSession {
  id: string;
  question: string;
  category: string | null;
  selectedCards: SelectedCard[];
  currentStep: number;
  interpretations: string[];
  status: 'setup' | 'shuffling' | 'selecting' | 'revealing' | 'interpreting' | 'completed';
}

export type AppSection = 'auth' | 'dashboard' | 'library' | 'reading' | 'history' | 'admin' | 'card-detail';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Navigation
  activeSection: AppSection;
  
  // Reading
  currentReading: ReadingSession | null;
  
  // UI
  selectedCard: TarotCard | null;
  isCardModalOpen: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  setActiveSection: (section: AppSection) => void;
  setCurrentReading: (reading: ReadingSession | null) => void;
  updateReadingStatus: (status: ReadingSession['status']) => void;
  addInterpretation: (interpretation: string) => void;
  setSelectedCard: (card: TarotCard | null) => void;
  openCardModal: (card: TarotCard) => void;
  closeCardModal: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Navigation
      activeSection: 'auth',
      
      // Reading
      currentReading: null,
      
      // UI
      selectedCard: null,
      isCardModalOpen: false,
      isAuthModalOpen: false,
      authMode: 'login',
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        activeSection: user ? 'dashboard' : 'auth'
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        activeSection: 'auth',
        currentReading: null
      }),
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      setCurrentReading: (reading) => set({ currentReading: reading }),
      
      updateReadingStatus: (status) => set((state) => ({
        currentReading: state.currentReading 
          ? { ...state.currentReading, status }
          : null
      })),
      
      addInterpretation: (interpretation) => set((state) => ({
        currentReading: state.currentReading
          ? {
              ...state.currentReading,
              interpretations: [...state.currentReading.interpretations, interpretation],
              currentStep: state.currentReading.currentStep + 1
            }
          : null
      })),
      
      setSelectedCard: (card) => set({ selectedCard: card }),
      
      openCardModal: (card) => set({ 
        selectedCard: card, 
        isCardModalOpen: true 
      }),
      
      closeCardModal: () => set({ 
        isCardModalOpen: false,
        selectedCard: null
      }),
      
      openAuthModal: (mode) => set({ 
        isAuthModalOpen: true, 
        authMode: mode 
      }),
      
      closeAuthModal: () => set({ 
        isAuthModalOpen: false 
      }),
    }),
    {
      name: 'tarot-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

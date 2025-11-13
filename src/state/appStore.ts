import { create } from "zustand";

export interface ProcessedImage {
  tempId: string;
  previewBase64: string;
  sizeInfo: string;
  originalName: string;
}

export interface HistoryItem {
  id: string;
  provider: string;
  originalName: string;
  url: string;
  createdAt: number;
  thumbnailBase64: string;
}

interface AppState {
  processedImage: ProcessedImage | null;
  uploadedUrl: string | null;
  history: HistoryItem[];
  isProcessing: boolean;
  isUploading: boolean;
  
  setProcessedImage: (image: ProcessedImage | null) => void;
  setUploadedUrl: (url: string | null) => void;
  setHistory: (history: HistoryItem[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  resetUploadState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  processedImage: null,
  uploadedUrl: null,
  history: [],
  isProcessing: false,
  isUploading: false,
  
  setProcessedImage: (image) => set({ processedImage: image }),
  setUploadedUrl: (url) => set({ uploadedUrl: url }),
  setHistory: (history) => set({ history }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIsUploading: (isUploading) => set({ isUploading }),
  resetUploadState: () => set({ processedImage: null, uploadedUrl: null }),
}));


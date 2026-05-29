export interface HistoryItem {
  id: string;
  filename: string;
  sourceLang: string;
  targetLang: string;
  sourceCode: string;
  translatedCode: string;
  codebleu: number;
  confidence: number;
  date: string;
  explanation?: string;
  type?: string; 
}

export interface SnippetItem {
  id: string;
  title: string;
  language: string;
  tags: string[];
  code: string;
  lastUsed: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  type: string; 
}

export type ActiveTab = "workspace" | "history" | "snippets" | "api" | "help";

import React from "react";
import { Settings, Moon, Sun, User, Code, FileText, BarChart2 } from "lucide-react";

interface HeaderProps {
  onTabChange: (tab: any) => void;
  activeTab: string;
}

export default function Header({ onTabChange, activeTab }: HeaderProps) {
  const [isDark, setIsDark] = React.useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 bg-[#0b1326]/95 backdrop-blur-sm border-b border-[#2d3449]">
      <div className="flex items-center gap-8">
        <span 
          onClick={() => onTabChange("workspace")}
          className="font-sans text-2xl font-bold text-[#c0c1ff] tracking-tight cursor-pointer hover:opacity-95 select-none"
        >
          Los Bacas
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => onTabChange("workspace")}
            className={`transition-colors font-mono text-xs font-medium flex items-center gap-1.5 ${
              activeTab === "workspace" ? "text-[#c0c1ff]" : "text-[#c7c4d7] hover:text-white"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Translator
          </button>
          <a 
            href="#documentation"
            onClick={(e) => { e.preventDefault(); alert("Documentación en desarrollo: Próximamente se integrarán guías detalladas."); }}
            className="text-[#c7c4d7] hover:text-white transition-colors font-mono text-xs flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Documentation
          </a>
          <a 
            href="#benchmarks"
            onClick={(e) => { e.preventDefault(); alert("Estadísticas y Benchmarks: Modelo Transformer v4.2-Opt logra CodeBLEU ponderado de 0.94."); }}
            className="text-[#c7c4d7] hover:text-white transition-colors font-mono text-xs flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Benchmarks
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => alert("Configuración del motor de migración: Su clave API de Gemini está conectada server-side de manera segura.")}
          className="p-2 hover:bg-[#2d3449]/50 rounded-lg cursor-pointer transition-all duration-150 ease-in-out active:scale-95 text-[#c7c4d7] hover:text-white"
          title="Engine settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-[#2d3449]/50 rounded-lg cursor-pointer transition-all duration-150 ease-in-out active:scale-95 text-[#c7c4d7] hover:text-white"
          title="Toggle color theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[#c0c1ff]" />}
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-[#2d3449]">
          <div className="w-8 h-8 rounded-full bg-[#131b2e] flex items-center justify-center border border-[#c0c1ff]/30 text-[#c0c1ff]">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden lg:inline text-xs text-[#c7c4d7] font-mono">
            021200279e
          </span>
        </div>
      </div>
    </header>
  );
}

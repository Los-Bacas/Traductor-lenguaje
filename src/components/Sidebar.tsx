import { Code, History, Terminal, Cpu, HelpCircle, Sparkles, LogOut, LucideIcon } from "lucide-react";
import { ActiveTab } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewTranslation: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onNewTranslation }: SidebarProps) {
  const menuItems: { id: ActiveTab; label: string; icon: LucideIcon }[] = [
    { id: "workspace", label: "Workspace", icon: Code },
    { id: "history", label: "Historial", icon: History },
    { id: "snippets", label: "Snippets", icon: Terminal },
    { id: "api", label: "API Management", icon: Cpu },
    { id: "help", label: "Ayuda & Docs", icon: HelpCircle },
  ];

  return (
    <aside className="flex flex-col h-full py-6 px-4 gap-4 bg-[#131b2e] border-r border-[#2d3449] w-64 select-none shrink-0">
      {/* Branding Header Area */}
      <div className="flex items-center gap-3 px-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#c0c1ff] flex items-center justify-center text-[#1000a9] shadow-[0_0_15px_rgba(192,193,255,0.3)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-sans text-lg font-black text-white leading-none tracking-tight">Los Bacas</h2>
          <p className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider mt-0.5">AI Migration Engine</p>
        </div>
      </div>

      {/* Primary Action Button: New Translation */}
      <button
        onClick={onNewTranslation}
        className="mx-1 mb-4 bg-[#c0c1ff] text-[#1000a9] hover:bg-white hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] font-mono text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 duration-150 cursor-pointer text-center"
      >
        <span className="text-sm font-bold">+</span> Nueva Traducción
      </button>

      {/* Navigation Options list */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full rounded-xl flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#571bc1]/20 text-[#c0c1ff] font-bold border-r-4 border-[#c0c1ff]"
                  : "text-[#c7c4d7] hover:text-white hover:bg-[#2d3449]/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#c0c1ff]" : "text-[#c7c4d7]"}`} />
              <span className="font-sans text-xs font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Upgrade Plan Call to Action */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="bg-gradient-to-br from-[#571bc1]/30 to-[#0b1326] rounded-xl p-4 border border-[#c0c1ff]/10 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          <h4 className="text-xs font-bold text-white mb-1 tracking-tight">Migración Masiva</h4>
          <p className="text-[10px] text-[#c7c4d7] mb-3 leading-relaxed">Sube carpetas completas y desbloquea el límite diario.</p>
          <button 
            onClick={() => alert("Upgrade Plan: Próximamente se habilitarán planes suscripción Enterprise con pipelines CI/CD automatizados.")}
            className="w-full bg-[#c0c1ff] hover:bg-white text-[#1000a9] font-mono text-[10px] font-bold py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            Suscripción Pro
          </button>
        </div>

        {/* Brand System Status footer indicator */}
        <div className="pt-3 border-t border-[#2d3449] flex items-center justify-between px-2 text-[10px] text-[#c7c4d7]/70 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>Sistema: Activo</span>
          </div>
          <span>v4.2-Opt</span>
        </div>
      </div>
    </aside>
  );
}

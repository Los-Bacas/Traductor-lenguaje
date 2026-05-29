import React from "react";
import { Search, ArrowRight, ExternalLink, Play, Database, Code, FileText } from "lucide-react";
import { HistoryItem } from "../types";
import { API_BASE_URL } from "../config";

interface HistoryViewProps {
  onLoadToWorkspace: (item: HistoryItem) => void;
}

export default function HistoryView({ onLoadToWorkspace }: HistoryViewProps) {
  const [historyList, setHistoryList] = React.useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Fetch updated history from Express DB
  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error("Error loaded history:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadHistory();
  }, []);

  // Filter list records based on search query
  const filteredList = historyList.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.filename.toLowerCase().includes(query) ||
      item.sourceLang.toLowerCase().includes(query) ||
      item.targetLang.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query)
    );
  });

  // Decide icon to show based on history list type
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "database":
        return <Database className="w-4 h-4 text-[#7bd0ff]" />;
      case "functions":
        return <Code className="w-4 h-4 text-[#38BDF8]" />;
      case "data_object":
        return <FileText className="w-4 h-4 text-[#F472B6]" />;
      default:
        return <Code className="w-4 h-4 text-[#34D399]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar">
      
      {/* Top statistics overview row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171f33] border border-[#2d3449] p-5 rounded-2xl">
          <p className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider mb-2">Traducciones Totales</p>
          <p className="text-white text-3xl font-bold font-sans">1,288</p>
        </div>
        <div className="bg-[#171f33] border border-[#2d3449] p-5 rounded-2xl">
          <p className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider mb-2">Promedio CodeBLEU</p>
          <p className="text-[#10B981] text-3xl font-bold font-sans">89.4</p>
        </div>
        <div className="bg-[#171f33] border border-[#2d3449] p-5 rounded-2xl">
          <p className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider mb-2">Líneas Migradas</p>
          <p className="text-white text-3xl font-bold font-sans">42.1k</p>
        </div>
        <div className="bg-[#171f33] border border-[#2d3449] p-5 rounded-2xl">
          <p className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider mb-2">Confianza de IA</p>
          <p className="text-[#7bd0ff] text-3xl font-bold font-sans">94%</p>
        </div>
      </div>

      {/* History table toolbar controls */}
      <div className="bg-[#131b2e] border border-[#2d3449] rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#2d3449] flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white tracking-wide">Registro de Conversión</h3>
          
          <div className="flex items-center bg-[#171f33] border border-[#464554]/30 rounded-xl px-4 py-2 w-72 focus-within:border-[#c0c1ff]">
            <Search className="w-4 h-4 text-[#c7c4d7] mr-2" />
            <input
              type="text"
              placeholder="Buscar archivo, idioma..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs w-full text-white placeholder-[#c7c4d7]/40 outline-none"
            />
          </div>
        </div>

        {/* Translation Table Stream */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#c7c4d7] italic">
            Cargando historial de migración...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#c7c4d7] italic">
            No se encontraron registros de traducción para "{searchQuery}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#171f33] border-b border-[#2d3449] text-[10px] uppercase tracking-wider text-[#c7c4d7] font-mono">
                  <th className="px-6 py-4">Snippet / Archivo</th>
                  <th className="px-6 py-4">Conversión</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-center">CodeBLEU</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3449]/30 text-xs text-[#dae2fd]">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#1e293b]/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <p className="font-semibold text-white">{item.filename}</p>
                          <p className="font-mono text-[10px] text-[#c7c4d7] opacity-60">ID: #{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="bg-[#2d3449] px-2 py-0.5 rounded text-white">{item.sourceLang}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#c7c4d7]" />
                        <span className="bg-[#571bc1]/20 border border-[#c0c1ff]/20 px-2 py-0.5 rounded text-[#c0c1ff]">{item.targetLang}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#c7c4d7] font-mono text-[11px]">{item.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border ${
                        item.codebleu >= 0.85 
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" 
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}>
                        {(item.codebleu * 100).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onLoadToWorkspace(item)}
                        className="bg-[#571bc1]/30 hover:bg-[#571bc1] text-[#c0c1ff] hover:text-white font-mono text-[11px] font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <span>Abrir en Workspace</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Promotional / Automated status banner at bottom */}
      <div className="bg-[#1E293B] border border-[#2d3449] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="flex-1">
          <h3 className="font-sans text-lg font-bold text-white mb-2">Automatice el Pipeline de Migración</h3>
          <p className="text-xs text-[#c7c4d7] leading-relaxed max-w-xl">
            Toda traducción queda registrada de manera segura en sus servidores cloud. Mediante las llaves de acceso API, integre Los Bacas directamente en sus flujos integrados de integración y despliegue continuos (CI/CD) para resolver deudas técnicas legadas.
          </p>
        </div>
        <div className="relative w-full md:w-64 h-32 rounded-xl overflow-hidden border border-[#c0c1ff]/20 group shrink-0 shadow-lg">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNOOOH4rFYUOBT2f9_DWFBiUuA1c4cX_BD0XwvYNnXXyWuyw4W8m2Eim90QlE3y0ngAKjZZdRsyHkVybcWWalVkZqXzfmmKZ9ruN0LD7K0WWdUGQ7i4Mm6cFOJl3542zBkw0bza0T5RhWwQdcSKD4hcFmYRf0ilZPF2klgEUOBlIhW_Hcpg2iCdLBD_MyOKlicQ6MbzSKNUcGAh9Zlfs2qmqYwzV488B2NQamKTwHhvW_3lo8MyhnkPzjZ_lRiKIiNzDMeb8PshdM"
            alt="Data server blinking lights"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 font-mono text-[9px] bg-[#0b1326]/80 px-2 py-1 rounded border border-[#2d3449]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-white">API Estado: En línea</span>
          </div>
        </div>
      </div>
    </div>
  );
}

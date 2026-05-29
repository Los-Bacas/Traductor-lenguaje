import React from "react";
import { Search, Plus, Terminal, Check, Star, RefreshCw, FileText, LayoutGrid, List } from "lucide-react";
import { SnippetItem } from "../types";

interface SnippetsViewProps {
  onLoadTemplate: (code: string, language: string) => void;
}

export default function SnippetsView({ onLoadTemplate }: SnippetsViewProps) {
  const [snippets, setSnippets] = React.useState<SnippetItem[]>([]);
  const [filterLang, setFilterLang] = React.useState("All");
  const [search, setSearch] = React.useState("");
  
  // Modal states for creating new snippet
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newLang, setNewLang] = React.useState("TypeScript");
  const [newTags, setNewTags] = React.useState("");
  const [newCode, setNewCode] = React.useState("");

  // Favorites / stars simulation
  const [starredIds, setStarredIds] = React.useState<string[]>(["sn-2"]);

  const fetchSnippets = async () => {
    try {
      const res = await fetch("/api/snippets");
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error("Error loaded snippets:", err);
    }
  };

  React.useEffect(() => {
    fetchSnippets();
  }, []);

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    try {
      const tagsArray = newTags 
        ? newTags.split(",").map(t => t.trim()).filter(Boolean) 
        : [newLang];

      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          language: newLang,
          tags: [newLang, ...tagsArray],
          code: newCode
        }),
      });

      if (res.ok) {
        await fetchSnippets();
        setIsModalOpen(false);
        // Clear form values
        setNewTitle("");
        setNewTags("");
        setNewCode("");
      }
    } catch (err) {
      console.error("Error creating snippet:", err);
    }
  };

  const toggleStar = (id: string) => {
    if (starredIds.includes(id)) {
      setStarredIds(starredIds.filter(x => x !== id));
    } else {
      setStarredIds([...starredIds, id]);
    }
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || 
                          s.code.toLowerCase().includes(search.toLowerCase());
    
    if (filterLang === "All") return matchesSearch;
    return matchesSearch && s.language.toLowerCase() === filterLang.toLowerCase();
  });

  return (
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar relative">
      
      {/* Filters & top toolbar option row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131b2e] border border-[#2d3449] px-6 py-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-[#c7c4d7] font-mono text-[10px] uppercase tracking-wider">Filtrar por:</span>
          <div className="flex flex-wrap gap-1.5">
            {["All", "TypeScript", "Python", "Go", "Rust", "Schema"].map((lang) => (
              <button
                key={lang}
                onClick={() => setFilterLang(lang)}
                className={`px-3 py-1.5 rounded-full font-sans text-xs transition-colors cursor-pointer ${
                  filterLang === lang
                    ? "bg-[#c0c1ff] text-[#1000a9] font-bold"
                    : "bg-[#171f33] text-[#c7c4d7] hover:text-white border border-[#464554]/25"
                }`}
              >
                {lang === "All" ? "Todos" : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Search for snippet logic */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#171f33] border border-[#464554]/30 rounded-xl px-3 py-1.5 w-60">
            <Search className="w-4 h-4 text-[#c7c4d7] mr-1.5" />
            <input
              type="text"
              placeholder="Buscar fragmento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs w-full text-white placeholder-[#c7c4d7]/40 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSnippets.map((snippet) => {
          const isStarred = starredIds.includes(snippet.id);
          const firstFiveLines = snippet.code.split("\n").slice(0, 5).join("\n");
          
          return (
            <div 
              key={snippet.id} 
              className="group bg-[#131b2e] border border-[#2d3449] hover:border-[#c0c1ff]/60 rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm"
            >
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-sans text-xs font-bold leading-relaxed">{snippet.title}</h4>
                    <div className="flex gap-1 mt-1.5">
                      {snippet.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-[9px] px-1.5 py-0.5 bg-[#1E293B] border border-[#2d3449] text-[#c7c4d7] rounded-md font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleStar(snippet.id)}
                    className="p-1 text-[#c7c4d7] hover:text-yellow-400 transition-colors"
                  >
                    <Star className={`w-4 h-4 ${isStarred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                  </button>
                </div>

                {/* Simulated snippet syntax/preview block */}
                <div className="bg-[#1E293B] rounded-xl border border-[#2d3449] p-3 font-mono text-[11px] leading-relaxed relative min-h-24 select-none opacity-80 overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#1e293b] to-transparent pointer-events-none"></div>
                  <div className="flex gap-3 text-[#c7c4d7]/40 font-mono">
                    <div className="text-right select-none pr-1">
                      {Array.from({ length: Math.max(firstFiveLines.split("\n").length, 3) }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="flex-1 text-[#c7c4d7]/90 text-left whitespace-pre select-none font-mono">
                      {firstFiveLines}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Bottom Card utility interactions */}
              <div className="p-4 bg-[#171f33] border-t border-[#2d3449] flex justify-between items-center group-hover:bg-[#131b2e] transition-colors">
                <span className="text-[10px] text-[#c7c4d7]/70 font-mono">{snippet.lastUsed}</span>
                <button
                  onClick={() => onLoadTemplate(snippet.code, snippet.language)}
                  className="bg-[#c0c1ff] text-[#1000a9] hover:bg-white text-[10px] font-bold font-mono px-3.5 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Usar Plantilla</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Interactive "Crear snippet" dashed-outline placeholder card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-[#2d3449] rounded-2xl flex items-center justify-center min-h-[190px] hover:bg-[#131b2e] hover:border-[#c0c1ff]/60 transition-all cursor-pointer group"
        >
          <div className="text-center p-6">
            <div className="w-10 h-10 bg-[#171f33] border border-[#2d3449] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-[#c0c1ff]" />
            </div>
            <p className="text-xs font-semibold text-white tracking-wide">Crear Fragmento</p>
            <p className="text-[10px] text-[#c7c4d7]/70 font-mono mt-1">Guarde su propio boilerplate reusable</p>
          </div>
        </div>
      </div>

      {/* Promotional section & verified compliance indicator */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="md:col-span-2 bg-gradient-to-br from-[#571bc1]/20 to-[#131b2e] p-8 rounded-2xl border border-[#2d3449] relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-sm">
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] select-none pointer-events-none">
            <Terminal className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="font-sans text-lg font-bold text-white mb-2">Centralice colecciones con IA</h3>
            <p className="text-xs text-[#c7c4d7] leading-relaxed max-w-lg mb-5">
              Sincronice sus snippets comunes o conéctese directamente a sus Gists de Github. El motor de Los Bacas categorizará idiomáticamente y auto-completará descripciones mediante transformadores inteligentes en tiempo real.
            </p>
            <button 
              onClick={() => alert("Sincronización Gists: Característica premium estará disponible en la versión v5.0.")}
              className="bg-white hover:bg-slate-100 text-[#1000a9] text-xs font-bold font-mono px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              Comenzar Sincronización
            </button>
          </div>
        </div>

        <div className="bg-[#171f33] p-6 rounded-2xl border border-[#2d3449] flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-white text-xs font-bold leading-relaxed mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Verificación de Estilo
            </h4>
            <p className="text-[10px] text-[#c7c4d7]/70 leading-relaxed font-mono">
              El 85% de sus snippets cumplen con los máximos estándares internacionales de portabilidad e identación.
            </p>
          </div>
          <div className="mt-8">
            <div className="w-full bg-[#1e293b] rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-[#10B981] h-full rounded-full" style={{ width: "85%" }}></div>
            </div>
            <span className="text-[9px] text-[#c7c4d7]/70 uppercase tracking-widest font-mono">Standard Compliance</span>
          </div>
        </div>
      </section>

      {/* CREATE NEW SNIPPET MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#131b2e] border border-[#2d3449] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-[#2d3449] flex justify-between items-center bg-[#171f33]">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Terminal className="text-[#c0c1ff]" /> Guardar Nuevo Fragmento
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#c7c4d7] hover:text-white transition-colors cursor-pointer text-xs font-mono"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateSnippet} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wide text-[#c7c4d7] mb-1.5">Nombre del Snippet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Convertidor UTF8"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#2d3449] rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-[#c0c1ff] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wide text-[#c7c4d7] mb-1.5">Lenguaje Principal *</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#2d3449] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Schema">Database Schema</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wide text-[#c7c4d7] mb-1.5">Etiquetas adicionales</label>
                  <input
                    type="text"
                    placeholder="Ej: database, utils"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#2d3449] rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-[#c0c1ff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wide text-[#c7c4d7] mb-1.5">Código Fuente *</label>
                <textarea
                  required
                  rows={6}
                  placeholder={`// Ingresa tu código fuente estructurado aquí...\nexport function demo() {\n  return true;\n}`}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#2d3449] rounded-xl p-3 text-xs text-white font-mono focus:ring-1 focus:ring-[#c0c1ff] h-40 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-[#2d3449]/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#c7c4d7] hover:text-white text-xs font-mono cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c0c1ff] hover:bg-white text-[#1000a9] text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
                >
                  Guardar Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

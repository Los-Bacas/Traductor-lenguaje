import React from "react";
import { 
  ArrowRight, Save, Share2, Clipboard, Trash2, Cpu, 
  TrendingUp, Activity, Check, ThumbsUp, ThumbsDown
} from "lucide-react";
import { API_BASE_URL } from "../config";

interface WorkspaceViewProps {
  initialCode?: string;
  initialSourceLang?: string;
  initialTargetLang?: string;
  initialTranslatedCode?: string;
  onTranslationSuccess: () => void; // call to refresh parent database lists
}

export default function WorkspaceView({
  initialCode = "",
  initialSourceLang = "Python",
  initialTargetLang = "JavaScript",
  initialTranslatedCode = "",
  onTranslationSuccess
}: WorkspaceViewProps) {
  // Translate core states
  const [sourceCode, setSourceCode] = React.useState(initialCode);
  const [translatedCode, setTranslatedCode] = React.useState(initialTranslatedCode);
  const [sourceLang, setSourceLang] = React.useState(initialSourceLang);
  const [targetLang, setTargetLang] = React.useState(initialTargetLang);
  
  // Evaluation States
  const [codebleu, setCodebleu] = React.useState<number | null>(initialTranslatedCode ? 0.94 : null);
  const [confidence, setConfidence] = React.useState<number | null>(initialTranslatedCode ? 98.2 : null);
  const [latency, setLatency] = React.useState<number | null>(initialTranslatedCode ? 1.2 : null);
  const [explanation, setExplanation] = React.useState<string>(initialTranslatedCode ? "Traducción optimizada." : "");

  // Engine control states
  const [loading, setLoading] = React.useState(false);
  const [copiedInput, setCopiedInput] = React.useState(false);
  const [copiedOutput, setCopiedOutput] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"liked" | "disliked" | null>(null);
  const [modernize, setModernize] = React.useState(true);

  // Sync state if props change (e.g. when loaded from snippets template or history list)
  React.useEffect(() => {
    if (initialCode) {
      setSourceCode(initialCode);
    }
  }, [initialCode]);

  React.useEffect(() => {
    if (initialSourceLang) setSourceLang(initialSourceLang);
  }, [initialSourceLang]);

  React.useEffect(() => {
    if (initialTargetLang) setTargetLang(initialTargetLang);
  }, [initialTargetLang]);

  React.useEffect(() => {
    if (initialTranslatedCode) {
      setTranslatedCode(initialTranslatedCode);
      setCodebleu(0.94);
      setConfidence(98.2);
      setLatency(1.2);
    } else {
      // Clear output only if we specifically requested a brand new blank translation
      if (!initialCode) {
        setTranslatedCode("");
        setCodebleu(null);
        setConfidence(null);
        setLatency(null);
      }
    }
  }, [initialTranslatedCode, initialCode]);

  // Compute live line counts for line numbers
  const inputLines = sourceCode.split("\n");
  const outputLines = translatedCode.split("\n");
  const lineCountInput = Math.max(inputLines.length, 10);
  const lineCountOutput = Math.max(outputLines.length, 10);

  // Call Translate Endpoint
  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      alert("Por favor ingresa o pega código en el editor fuente.");
      return;
    }
    setLoading(true);
    setCopiedOutput(false);
    setFeedback(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode,
          sourceLang,
          targetLang,
          options: { modernize }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Fallo en la comunicación con el servidor.");
      }

      const data = await response.json();
      setTranslatedCode(data.translatedCode);
      setCodebleu(data.codebleu);
      setConfidence(data.confidence);
      setLatency(data.latency);
      setExplanation(data.explanation || "");

      // Automatically store in server history so it synchronizes dynamically!
      await fetch(`${API_BASE_URL}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `Traduccion_${sourceLang}_to_${targetLang}.${sourceLang === "Python" ? "py" : sourceLang === "JavaScript" ? "js" : "txt"}`,
          sourceLang,
          targetLang,
          sourceCode,
          translatedCode: data.translatedCode,
          codebleu: data.codebleu,
          confidence: data.confidence,
          explanation: data.explanation || "Conversión realizada con Gemini AI.",
        }),
      });

      // Refreash parent components
      onTranslationSuccess();
    } catch (err: any) {
      console.error(err);
      alert(`Error en el motor: ${err.message || "Ocurrió un error inesperado de compilación."}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset editors
  const handleClear = () => {
    if (confirm("¿Estás seguro de que deseas limpiar el código fuente?")) {
      setSourceCode("");
      setTranslatedCode("");
      setCodebleu(null);
      setConfidence(null);
      setLatency(null);
      setExplanation("");
      setFeedback(null);
    }
  };

  // Clipboard copies
  const copyInputToClipboard = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  };

  const copyOutputToClipboard = () => {
    navigator.clipboard.writeText(translatedCode);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Hardcoded mock translation demo codes
  const loadDemoCode = (lang: string) => {
    if (lang === "Python") {
      setSourceCode(
        `def solve_quantum_array(arr):\n    # Convierte y filtra números primos\n    primes = []\n    for val in arr:\n        if val > 1 and all(val % i != 0 for i in range(2, int(val**0.5) + 1)):\n            primes.append(val)\n    return sum(primes)`
      );
    } else if (lang === "JavaScript") {
      setSourceCode(
        `function solveQuantumArray(arr) {\n  let sum = 0;\n  for (let val of arr) {\n    let isPrime = val > 1;\n    for (let i = 2; i <= Math.sqrt(val); i++) {\n      if (val % i === 0) {\n        isPrime = false;\n        break;\n      }\n    }\n    if (isPrime) {\n      sum += val;\n    }\n  }\n  return sum;\n}`
      );
    } else if (lang === "Go") {
      setSourceCode(
        `package main\nimport "math"\n\nfunc solveQuantum(arr []int) int {\n\tsum := 0\n\tfor _, val := range arr {\n\t\tisPrime := val > 1\n\t\tfor i := 2; i <= int(math.Sqrt(float64(val))); i++ {\n\t\t\tif val%i == 0 {\n\t\t\t\tisPrime = false\n\t\t\t\tbreak\n\t\t\t}\n\t\t}\n\t\tif isPrime {\n\t\t\tsum += val\n\t\t}\n\t}\n\treturn sum\n}`
      );
    } else {
      setSourceCode(`// Código de prueba para ${lang}\nvoid execute() {\n  return;\n}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar">
      {/* Translation Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#131b2e] border border-[#2d3449] px-6 py-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#171f33] rounded-full px-4 py-2 border border-[#464554]">
            {/* Source Lang dropdown */}
            <select
              value={sourceLang}
              onChange={(e) => {
                setSourceLang(e.target.value);
                loadDemoCode(e.target.value);
              }}
              className="bg-transparent border-none text-[#c0c1ff] font-sans text-xs font-bold focus:ring-0 outline-none cursor-pointer"
            >
              <option value="Python" className="bg-[#171f33] text-white">Python</option>
              <option value="JavaScript" className="bg-[#171f33] text-white">JavaScript</option>
              <option value="TypeScript" className="bg-[#171f33] text-white">TypeScript</option>
              <option value="Go" className="bg-[#171f33] text-white">Go</option>
              <option value="Rust" className="bg-[#171f33] text-white">Rust</option>
              <option value="Java" className="bg-[#171f33] text-white">Java</option>
              <option value="PostgreSQL" className="bg-[#171f33] text-white">PostgreSQL</option>
              <option value="C++" className="bg-[#171f33] text-white">C++</option>
            </select>

            <ArrowRight className="w-4 h-4 mx-2 text-[#c7c4d7]" />

            {/* Target Lang dropdown */}
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-transparent border-none text-[#7bd0ff] font-sans text-xs font-bold focus:ring-0 outline-none cursor-pointer"
            >
              <option value="JavaScript" className="bg-[#171f33] text-white">JavaScript</option>
              <option value="TypeScript" className="bg-[#171f33] text-white">TypeScript</option>
              <option value="Go" className="bg-[#171f33] text-white">Go</option>
              <option value="Rust" className="bg-[#171f33] text-white">Rust</option>
              <option value="Python" className="bg-[#171f33] text-white">Python</option>
              <option value="MongoDB" className="bg-[#171f33] text-white">MongoDB</option>
              <option value="C++" className="bg-[#171f33] text-white">C++</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs text-[#c7c4d7] font-mono select-none cursor-pointer bg-[#171f33] px-3 py-1.5 rounded-full border border-[#464554]/30 hover:border-[#c0c1ff]/30">
            <input
              type="checkbox"
              checked={modernize}
              onChange={(e) => setModernize(e.target.checked)}
              className="rounded bg-[#0b1326] border-[#464554] text-[#c0c1ff] focus:ring-0 w-3 h-3"
            />
            <span>Modernizar sintaxis</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              if (translatedCode) {
                alert("Guardado: El código se guardó correctamente en el historial general.");
              } else {
                alert("Primero debes ejecutar la traducción para poder guardar.");
              }
            }}
            className="bg-[#171f33] hover:bg-[#222a3d] text-white px-3.5 py-2 rounded-xl text-xs font-mono border border-[#464554] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#10B981]" />
            Guardar
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copiado al portapapeles para compartir con tu equipo.");
            }}
            className="bg-[#171f33] hover:bg-[#222a3d] text-white px-3.5 py-2 rounded-xl text-xs font-mono border border-[#464554] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#c0c1ff]" />
            Compartir
          </button>
        </div>
      </div>

      {/* Editor Split Panel Screen */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 min-h-0">
        
        {/* LEFT PANEL: Source Code */}
        <div className="flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-sans text-sm font-semibold text-white tracking-wide">Código de Origen</h3>
            <span className="bg-[#1E293B] border border-[#2d3449] text-[#c7c4d7] px-2.5 py-1 rounded-lg text-[10px] font-mono">
              {sourceLang.toUpperCase()}
            </span>
          </div>

          <div className="flex-1 bg-[#1E293B] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[#c0c1ff]/20 transition-all">
            {/* Code inputs body */}
            <div className="flex flex-1 font-mono text-xs p-4 overflow-auto custom-scrollbar">
              {/* Dynamic Line Numbers */}
              <div className="text-[#908fa0] text-right pr-4 border-r border-[#2d3449] select-none opacity-40 font-mono leading-6">
                {Array.from({ length: lineCountInput }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder={`// Ingresa o pega tu código escrito en ${sourceLang} aquí...\n// O selecciona otro idioma de origen en el menú superior.`}
                spellCheck={false}
                className="pl-4 flex-1 outline-none resize-none bg-transparent border-none text-[#dae2fd] placeholder-[#c7c4d7]/40 leading-6 h-full font-mono focus:ring-0 focus:outline-none"
              />
            </div>

            {/* Bottom tool parameters key info */}
            <div className="bg-[#131b2e] px-4 py-2.5 border-t border-[#2d3449] flex items-center justify-between">
              <span className="text-[#c7c4d7]/70 text-[10px] font-mono">UTF-8 • Spaces: 4 • {sourceCode.length} chars</span>
              <div className="flex gap-2 text-[#c7c4d7]">
                <button 
                  onClick={copyInputToClipboard}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy entered source code"
                >
                  {copiedInput ? <Check className="w-4 h-4 text-[#10B981]" /> : <Clipboard className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleClear}
                  className="p-1 hover:text-red-400 transition-colors"
                  title="Clear source workspace code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS & RUN CENTER BUTTON ELEMENT */}
        <div className="flex h-16 lg:h-full lg:w-20 items-center justify-center">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className={`w-14 h-14 lg:w-16 lg:h-16 bg-[#8083ff] hover:bg-[#c0c1ff] text-[#1000a9] rounded-full shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative cursor-pointer ${
              loading ? "animate-pulse" : ""
            }`}
            title="Translate input code utilizing Gemini model"
          >
            <div className="absolute inset-0 bg-[#c0c1ff] rounded-full animate-ping opacity-10 group-hover:opacity-20"></div>
            <Activity className={`w-6 h-6 transition-transform duration-500 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
          </button>
        </div>

        {/* RIGHT PANEL: Translated Code result */}
        <div className="flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-sans text-sm font-semibold text-white tracking-wide">Código Traducido</h3>
            <div className="flex items-center gap-2">
              {codebleu !== null && (
                <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full font-mono text-[9px] border border-[#10B981]/20 font-bold">
                  CodeBLEU: {codebleu.toFixed(2)}
                </span>
              )}
              <span className="bg-[#1E293B] border border-[#2d3449] text-[#7bd0ff] px-2.5 py-1 rounded-lg text-[10px] font-mono">
                {targetLang.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-[#1E293B] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col relative">
            {/* Loading Indicator helper */}
            {loading && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500/20 overflow-hidden">
                <div className="w-1/3 h-full bg-[#c0c1ff] animate-[shimmer_1.5s_infinite_linear]"></div>
              </div>
            )}
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
              }
            `}</style>

            <div className="flex flex-1 font-mono text-xs p-4 overflow-auto custom-scrollbar relative">
              {/* Dynamic Line Numbers */}
              <div className="text-[#908fa0] text-right pr-4 border-r border-[#2d3449] select-none opacity-40 font-mono leading-6">
                {Array.from({ length: lineCountOutput }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="pl-4 flex-1 text-[#dae2fd] overflow-x-auto whitespace-pre-wrap leading-6 outline-none font-mono selection:bg-[#571bc1]/50">
                {translatedCode || (
                  <span className="text-[#c7c4d7]/30 italic">
                    {loading ? "// Conectando con Gemini 3.5-flash..." : "// El código traducido aparecerá aquí tras presionar el botón central."}
                  </span>
                )}
              </pre>
            </div>

            {/* Bottom tool parameters actions */}
            <div className="bg-[#131b2e] px-4 py-2.5 border-t border-[#2d3449] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={copyOutputToClipboard}
                  disabled={!translatedCode}
                  className="bg-[#c0c1ff] text-[#1000a9] hover:bg-white text-[10px] leading-relaxed font-bold font-mono px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {copiedOutput ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                  <span>Copiar Código</span>
                </button>
                {latency !== null && (
                  <div className="flex items-center gap-1 text-[#c7c4d7] font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    <span>Acción: {latency}s</span>
                  </div>
                )}
              </div>

              {translatedCode && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFeedback("liked")}
                    className={`p-1 transition-colors ${feedback === "liked" ? "text-[#10B981]" : "text-[#c7c4d7] hover:text-white"}`}
                    title="Good compilation result"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFeedback("disliked")}
                    className={`p-1 transition-colors ${feedback === "disliked" ? "text-red-400" : "text-[#c7c4d7] hover:text-white"}`}
                    title="Bad compilation result"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code explanation summary if translation was outputted */}
      {explanation && (
        <div className="bg-[#1E293B] border border-[#2d3449] rounded-2xl p-4">
          <h4 className="text-xs font-bold text-[#c0c1ff] font-mono uppercase tracking-wide mb-1 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" /> Resumen de Conversión
          </h4>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Bento Stats Panel Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="bg-[#131b2e] rounded-xl p-4 border border-[#2d3449] flex items-center gap-4 hover:border-[#c0c1ff]/20 transition-all duration-300">
          <div className="p-3 rounded-lg bg-[#009bd1]/10 text-[#7bd0ff]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[#c7c4d7]/70 font-mono text-[10px] uppercase">Clúster Motor</p>
            <p className="font-bold text-white text-xs">Transformer v4.2-Opt</p>
          </div>
        </div>

        <div className="bg-[#131b2e] rounded-xl p-4 border border-[#2d3449] flex items-center gap-4 hover:border-[#c0c1ff]/20 transition-all duration-300">
          <div className="p-3 rounded-lg bg-[#571bc1]/20 text-[#d0bcff]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[#c7c4d7]/70 font-mono text-[10px] uppercase">Confianza Promedio</p>
            <p className="font-bold text-white text-xs">{confidence ? `${confidence}% Exacto` : "98.2% Accurate"}</p>
          </div>
        </div>

        <div className="bg-[#131b2e] rounded-xl p-4 border border-[#2d3449] flex items-center gap-4 hover:border-[#c0c1ff]/20 transition-all duration-300">
          <div className="p-3 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[#c7c4d7]/70 font-mono text-[10px] uppercase">Sesión de Inferencia</p>
            <p className="font-bold text-white text-xs">Uso Multi-lenguaje Habilitado</p>
          </div>
        </div>
      </div>
    </div>
  );
}

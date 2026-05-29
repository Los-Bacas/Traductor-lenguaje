import React from "react";
import { Key, Copy, Trash2, Search, Bell, HelpCircle, Activity, Play, Check, ShieldCheck, Terminal } from "lucide-react";
import { ApiKeyItem } from "../types";

export default function ApiView() {
  const [keysList, setKeysList] = React.useState<ApiKeyItem[]>([]);
  const [activeDocsRoute, setActiveDocsRoute] = React.useState<"translate" | "models" | "usage">("translate");
  const [generating, setGenerating] = React.useState(false);
  const [copiedKeyId, setCopiedKeyId] = React.useState<string | null>(null);

  // Fetch API Keys list
  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/api-keys");
      if (res.ok) {
        const data = await res.json();
        setKeysList(data);
      }
    } catch (err) {
      console.error("Error loaded API Keys:", err);
    }
  };

  React.useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    setGenerating(true);
    const keyName = prompt("Ingresa el nombre de la nueva Llave API:", `Key_Production_Main_${keysList.length + 1}`);
    if (keyName === null) {
      setGenerating(false);
      return;
    }
    
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: keyName.trim() || `Key_Env_${keysList.length + 1}`,
          type: Math.random() > 0.4 ? "production" : "sandbox"
        }),
      });

      if (res.ok) {
        await fetchKeys();
      }
    } catch (err) {
      console.error("Error creating key:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta Llave API? Cualquier servicio externo que la utilice perderá acceso inmediatamente.")) {
      try {
        const res = await fetch(`/api/api-keys/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          await fetchKeys();
        }
      } catch (err) {
        console.error("Error deleting key:", err);
      }
    }
  };

  const copyKeyText = (item: ApiKeyItem) => {
    navigator.clipboard.writeText(`lb_${item.type === "production" ? "live" : "test"}_9j6f2wogx3p7fc6shf0hbr7wv`);
    setCopiedKeyId(item.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Render mock documentation terminal code snippet based on selected route
  const getDocCodeSnippet = () => {
    if (activeDocsRoute === "translate") {
      return `curl -X POST "https://api.losbacas.ai/v1/translate" \\
  -H "Authorization: Bearer $LB_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_lang": "cobol",
    "target_lang": "java",
    "code": "IDENTIFICATION DIVISION...",
    "options": {
      "modernize": true,
      "output_format": "spring-boot"
    }
  }'`;
    } else if (activeDocsRoute === "models") {
      return `curl -X GET "https://api.losbacas.ai/v1/models" \\
  -H "Authorization: Bearer $LB_API_KEY"`;
    } else {
      return `curl -X GET "https://api.losbacas.ai/v1/usage" \\
  -H "Authorization: Bearer $LB_API_KEY"`;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar">
      
      {/* Bento Grid Stats Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-[#171f33] p-6 rounded-2xl border border-[#2d3449] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">Uso de API Consola</h3>
              <span className="px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] text-[9px] font-bold rounded uppercase tracking-wider border border-[#10B981]/25">Live</span>
            </div>
            
            {/* Visual Bar Histogram */}
            <div className="h-24 flex items-end gap-1 px-1">
              <div className="flex-1 bg-[#c0c1ff]/10 rounded-t h-[30%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 4,120"></div>
              <div className="flex-1 bg-[#c0c1ff]/20 rounded-t h-[45%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 6,800"></div>
              <div className="flex-1 bg-[#c0c1ff]/10 rounded-t h-[25%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 3,400"></div>
              <div className="flex-1 bg-[#c0c1ff]/30 rounded-t h-[60%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 9,000"></div>
              <div className="flex-1 bg-[#c0c1ff]/20 rounded-t h-[40%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 5,600"></div>
              <div className="flex-1 bg-[#c0c1ff]/40 rounded-t h-[75%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 11,400"></div>
              <div className="flex-1 bg-[#c0c1ff]/30 rounded-t h-[50%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 7,500"></div>
              <div className="flex-1 bg-[#c0c1ff]/40 rounded-t h-[65%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 9,300"></div>
              <div className="flex-1 bg-[#c0c1ff]/60 rounded-t h-[95%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 14,200"></div>
              <div className="flex-1 bg-[#c0c1ff]/25 rounded-t h-[55%] hover:bg-[#c0c1ff] transition-all cursor-crosshair" title="Active calls: 8,100"></div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-end border-t border-[#2d3449]/40 pt-4">
            <span className="text-white text-2xl font-bold font-sans">
              124.5k <span className="text-[10px] font-mono font-medium text-[#c7c4d7]/70">Llamadas / 24h</span>
            </span>
            <span className="text-[#10B981] text-xs font-mono font-bold flex items-center gap-1">
              +12% este mes
            </span>
          </div>
        </div>

        <div className="bg-[#171f33] p-6 rounded-2xl border border-[#2d3449] flex flex-col items-center justify-center text-center shadow-sm">
          <Activity className="w-8 h-8 text-[#7bd0ff] mb-2" />
          <h4 className="text-[10px] text-[#c7c4d7] font-mono uppercase tracking-widest">Latencia Promedio</h4>
          <p className="text-white text-2xl font-bold font-sans mt-1">184ms</p>
          <div className="w-full bg-[#1e293b] h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#7bd0ff] h-full w-[70%]"></div>
          </div>
        </div>

        <div className="bg-[#171f33] p-6 rounded-2xl border border-[#2d3449] flex flex-col items-center justify-center text-center shadow-sm">
          <ShieldCheck className="w-8 h-8 text-[#10B981] mb-2" />
          <h4 className="text-[10px] text-[#c7c4d7] font-mono uppercase tracking-widest">Tasa de Error</h4>
          <p className="text-[#10B981] text-2xl font-bold font-sans mt-1">0.04%</p>
          <p className="text-[10px] text-[#c7c4d7]/80 mt-2 font-mono">Rangos Operacionales Normales</p>
        </div>
      </div>

      {/* API Keys Management Section */}
      <div className="bg-[#131b2e] border border-[#2d3449] rounded-2xl p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Mis Llaves de API</h3>
            <p className="text-xs text-[#c7c4d7] mt-0.5">Administre sus tokens secretos para acceder al conversor desde sistemas CI/CD externos.</p>
          </div>
          <button
            onClick={handleCreateKey}
            disabled={generating}
            className="bg-[#c0c1ff] hover:bg-white text-[#1000a9] font-mono text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Generar Nueva</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {keysList.map((key) => (
            <div 
              key={key.id}
              className="flex items-center justify-between p-4 bg-[#171f33] rounded-xl border border-[#2d3449] hover:border-[#c0c1ff]/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  key.type === "production" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#7bd0ff]/10 text-[#7bd0ff] border-[#7bd0ff]/20"
                }`}>
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white leading-relaxed">{key.name}</h4>
                  <code className="text-[10px] text-[#c7c4d7] font-mono">{key.keyMasked}</code>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => copyKeyText(key)}
                  className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#2d3449] border border-[#2d3449] rounded-lg text-[#c7c4d7] hover:text-white flex items-center gap-1.5 transition-colors font-mono text-[11px] cursor-pointer"
                >
                  {copiedKeyId === key.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteKey(key.id)}
                  className="p-2 bg-[#1E293B] hover:bg-red-400/10 border border-[#2d3449] hover:border-red-400/20 rounded-lg text-[#c7c4d7] hover:text-red-400 transition-colors cursor-pointer"
                  title="Revoke API key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapid Documentation / Dual Columns widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Left Side: Route definitions */}
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-white tracking-wide">Documentación Rápida</h3>
          
          <div 
            onClick={() => setActiveDocsRoute("translate")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeDocsRoute === "translate" 
                ? "bg-[#171f33] border-l-4 border-l-[#7bd0ff] border-[#2d3449]" 
                : "bg-[#131b2e] hover:bg-[#171f33]/50 border-[#2d3449]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-[#7bd0ff]/10 text-[#7bd0ff] font-bold rounded">POST</span>
              <span className="text-[#c7c4d7]/70">/v1/translate</span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-2 leading-relaxed">Traducir Código Remoto</h4>
            <p className="text-[11px] text-[#c7c4d7] leading-relaxed mt-0.5">Envia fragmentos de código fuente para traducir de manera síncrona a través del clúster IA.</p>
          </div>

          <div 
            onClick={() => setActiveDocsRoute("models")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeDocsRoute === "models" 
                ? "bg-[#171f33] border-l-4 border-l-[#10B981] border-[#2d3449]" 
                : "bg-[#131b2e] hover:bg-[#171f33]/50 border-[#2d3449]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-[#10B981]/10 text-[#10B981] font-bold rounded">GET</span>
              <span className="text-[#c7c4d7]/70">/v1/models</span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-2 leading-relaxed">Listar Motores Disponibles</h4>
            <p className="text-[11px] text-[#c7c4d7] leading-relaxed mt-0.5">Retorna una lista completa de los modelos base cargados y sus coeficientes de compilabilidad.</p>
          </div>

          <div 
            onClick={() => setActiveDocsRoute("usage")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeDocsRoute === "usage" 
                ? "bg-[#171f33] border-l-4 border-l-[#c0c1ff] border-[#2d3449]" 
                : "bg-[#131b2e] hover:bg-[#171f33]/50 border-[#2d3449]"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-[#c0c1ff]/10 text-[#c0c1ff] font-bold rounded">GET</span>
              <span className="text-[#c7c4d7]/70">/v1/usage</span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-2 leading-relaxed">Verificar Cuotas de Consumo</h4>
            <p className="text-[11px] text-[#c7c4d7] leading-relaxed mt-0.5">Muestra métricas de tokens restantes por minuto y cuota acumulada del mes en curso.</p>
          </div>
        </div>

        {/* Right Side: Mock Terminal CLI Output preview */}
        <div className="bg-[#1E293B] rounded-2xl border border-[#2d3449] overflow-hidden flex flex-col shadow-sm">
          <div className="flex items-center justify-between bg-[#171f33] px-4 py-2.5 border-b border-[#2d3449] font-mono text-[10px]">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
            </div>
            <span className="text-[#c7c4d7] font-mono">example_request.sh</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(getDocCodeSnippet());
                alert("Snippet de curl copiado al portapapeles.");
              }}
              className="text-[#c7c4d7] hover:text-white transition-colors p-1"
              title="Copy request script"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 font-mono text-[11px] leading-relaxed bg-[#1E293B] text-[#908fa0] overflow-x-auto selection:bg-[#571bc1]/50 flex-1">
            <pre className="text-left whitespace-pre font-mono text-white">
              {getDocCodeSnippet()}
            </pre>
          </div>

          <div className="p-4 bg-[#131b2e] border-t border-[#2d3449]/40 flex justify-between items-center text-[10px] font-mono text-[#c7c4d7]">
            <span>Tiempo de Respuesta: <strong className="text-[#7bd0ff]">~180ms</strong></span>
            <span>Tokens Estimados: <strong className="text-white">1,240</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

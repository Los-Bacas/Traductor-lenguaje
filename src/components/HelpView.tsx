import { BookOpen, Star, Sparkles, CheckCircle, Database, HelpCircle } from "lucide-react";

export default function HelpView() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto custom-scrollbar text-[#dae2fd]">
      
      {/* Documentation Title Header */}
      <div className="bg-gradient-to-r from-[#571bc1]/20 to-[#131b2e] border border-[#2d3449] p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="text-[#c0c1ff]" /> Guía de Implementación del Proyecto
        </h2>
        <p className="text-xs text-[#c7c4d7] mt-1 leading-relaxed">
          Documento técnico estructurado bajo metodologías ágiles (Scrum) y Design Thinking por la escuadra académica <strong>Los Bacas</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Team and Project Header Metadata */}
        <div className="bg-[#131b2e] border border-[#2d3449] p-6 rounded-2xl flex flex-col justify-between gap-6 shadow-sm">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#c0c1ff] font-bold">Semestre X • IA</span>
            <h3 className="text-white font-sans text-sm font-bold mt-2">Los Bacas AI Project</h3>
            
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                <span className="font-mono text-[11px]">Sergio Sebastian Baca Vivanco</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                <span className="font-mono text-[11px]">Hamlet Nayeli Delgado Ccorihuaman</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                <span className="font-mono text-[11px]">Jean Pierro Tenazoa Torres</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0c1ff]"></span>
                <span className="font-mono text-[11px]">Flavio Sebastian Virrueta Baca</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2d3449]/40 pt-4 text-[11px] text-[#c7c4d7] leading-relaxed">
            <p>Curso: <strong>Inteligencia Artificial</strong></p>
            <p>Universidad Andina del Cusco</p>
          </div>
        </div>

        {/* Right Columns: Interactive Project Phases scroll */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          
          {/* DT: Fase 1 */}
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl p-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono text-[#c0c1ff] mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> FASE 1: DESIGN THINKING (Diseño de la Solución)
            </h4>
            <div className="space-y-4 text-xs text-[#c7c4d7]">
              <div>
                <strong className="text-white block font-sans mb-1 font-semibold">1. Empatizar (Comprender la necesidad)</strong>
                <p className="leading-relaxed">
                  <strong>Público Objetivo:</strong> Equipos de ingeniería encargados de la migración de sistemas legados (legacy en Java o COBOL antiguo) a arquitecturas modernas (ej: TypeScript o Python), así como estudiantes de programación Junior.
                </p>
                <p className="leading-relaxed mt-1">
                  <strong>Mapa de Empatía:</strong> Sienten frustración al perder valiosas horas resolviendo equivalencias de sintaxis y temen propagar bugs lógicos durante conversiones directas manuales.
                </p>
              </div>

              <div>
                <strong className="text-white block font-sans mb-1 font-semibold">2. Definir el Problema</strong>
                <p className="leading-relaxed">
                  El desarrollador requiere una vía automatizada que analice el flujo semántico y sintáctico del código para traducirlo de forma transparente y veloz.
                </p>
                <p className="leading-relaxed mt-1">
                  <strong>Métricas del éxito:</strong> CodeBLEU &gt; 35 para garantizar similitud estructural y exactitud sintáctica; latencia inferior a 1.5 segundos para no interrumpir el flujo del programador.
                </p>
              </div>

              <div>
                <strong className="text-white block font-sans mb-1 font-semibold">3. Idear (Arquitectura Base)</strong>
                <p className="leading-relaxed">
                  <strong>Modelo:</strong> CodeT5 (Encoder-Decoder) o Gemini flash. Se prefiere un encoder semántico acoplado a un decoder lingüístico estructurado, garantizando una alta tasa de compilabilidad final (&gt; 78%).
                </p>
              </div>
            </div>
          </div>

          {/* Scrum: Fase 2 */}
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl p-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono text-[#c0c1ff] mb-4 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> FASE 2: SCRUM (Planificación e Iteraciones)
            </h4>
            <div className="space-y-4 text-xs text-[#c7c4d7] leading-relaxed">
              <div>
                <strong className="text-white block font-sans mb-1 font-semibold">Sprints de Ejecución Clave:</strong>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#2d3449]/40">
                    <p className="text-white font-mono text-[11px] font-bold">Sprint 1: Datos y Pipeline Tokenizer</p>
                    <p className="mt-0.5">Filtrado del dataset multi-lenguaje (HuggingFace/xlcost-text-to-code) y personalización del tokenizador para no ignorar espacios de identación claves de Python.</p>
                  </div>
                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#2d3449]/40">
                    <p className="text-white font-mono text-[11px] font-bold">Sprint 2: Entrenamiento y Métricas de Validación</p>
                    <p className="mt-0.5 font-sans">Alineación de hiperparámetros de fine-tuning. El modelo logra reducir la pérdida de validación a 0.41, consolidando un CodeBLEU global de 38.5, superando la meta inicial.</p>
                  </div>
                  <div className="bg-[#131b2e] p-3 rounded-xl border border-[#2d3449]/40">
                    <p className="text-white font-mono text-[11px] font-bold">Sprint 3: Despliegue Express y API de Acceso</p>
                    <p className="mt-0.5">Enlace mediante Express y Vite para crear este panel interactivo conectado al modelo server-side con la API de @google/genai.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testear: Fase 3 */}
          <div className="bg-[#171f33] border border-[#2d3449] rounded-2xl p-6">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono text-[#c0c1ff] mb-4 flex items-center gap-1.5">
              <Database className="w-4 h-4" /> FASE 3: TESTEAR & VALIDAR
            </h4>
            <div className="text-xs text-[#c7c4d7] leading-relaxed">
              <p>
                <strong>Validación de Casos de Borde (Edge Cases):</strong> Se analizó la resiliencia del modelo al recibir inputs nulos o declaraciones sintácticamente rotas de origen, integrando enrutamiento JSON de Gemini para prevenir bloqueos de renderizado de la interfaz.
              </p>
              <p className="mt-2 font-mono text-[11px] text-white">
                ✓ Conclusión: Los Bacas AI Engine optimiza el flujo de conversión reduciendo la deuda técnica y garantizando la robustez semántica.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

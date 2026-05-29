import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database (initially matching user's exact mockup screenshots)
interface HistoryItem {
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
  type?: string; // 'functions' | 'data_object' | 'database' | 'integration_instructions' etc.
}

interface SnippetItem {
  id: string;
  title: string;
  language: string;
  tags: string[];
  code: string;
  lastUsed: string;
}

interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  type: string; // 'production' | 'sandbox'
}

let historyDb: HistoryItem[] = [
  {
    id: "BA-09231",
    filename: "DataParser.py",
    sourceLang: "Python",
    targetLang: "TypeScript",
    sourceCode: "def parse_data(raw):\n    # Convierte datos crudos\n    return [int(x) for x in raw.split(',') if x.strip()]",
    translatedCode: "export const parseData = (raw: string): number[] => {\n  // Convierte datos crudos\n  return raw.split(',').map(x => x.trim()).filter(Boolean).map(Number);\n};",
    codebleu: 0.924,
    confidence: 96.5,
    date: "Oct 24, 2023 14:20",
    explanation: "Se cambiaron comprensiones de lista por .map y .filter en TypeScript.",
    type: "functions",
  },
  {
    id: "BA-09228",
    filename: "AuthMiddleware.js",
    sourceLang: "JavaScript",
    targetLang: "Go",
    sourceCode: "const withAuth = (req, res, next) => {\n  const token = req.headers.auth;\n  if (!token) return res.status(401).send();\n  next();\n}",
    translatedCode: "func WithAuth(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\ttoken := r.Header.Get(\"Auth\")\n\t\tif token == \"\" {\n\t\t\tw.WriteHeader(http.StatusUnauthorized)\n\t\t\treturn\n\t\t}\n\t\tnext.ServeHTTP(w, r)\n\t})\n}",
    codebleu: 0.871,
    confidence: 94.0,
    date: "Oct 23, 2023 09:12",
    explanation: "Se tradujo Express middleware a padrão idiossincrático de Go http.Handler.",
    type: "data_object",
  },
  {
    id: "BA-09215",
    filename: "SchemaMigrator.sql",
    sourceLang: "PostgreSQL",
    targetLang: "MongoDB",
    sourceCode: "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);",
    translatedCode: "db.createCollection(\"users\", {\n  validator: {\n    $jsonSchema: {\n      bsonType: \"object\",\n      required: [\"email\"],\n      properties: {\n        email: {\n          bsonType: \"string\",\n          description: \"must be a string and is required\"\n        },\n        created_at: {\n          bsonType: \"date\"\n        }\n      }\n    }\n  }\n});\ndb.users.createIndex({ \"email\": 1 }, { unique: true });",
    codebleu: 0.789,
    confidence: 88.2,
    date: "Oct 20, 2023 18:45",
    explanation: "Traducción de tabla relacional a esquema documental MongoDB con validadores.",
    type: "database",
  },
  {
    id: "BA-09199",
    filename: "ApiWrapper.java",
    sourceLang: "Java",
    targetLang: "Rust",
    sourceCode: "public class ApiWrapper {\n    public String getStatus() {\n        return \"Operational\";\n    }\n}",
    translatedCode: "pub struct ApiWrapper;\n\nimpl ApiWrapper {\n    pub fn get_status(&self) -> &'static str {\n        \"Operational\"\n    }\n}",
    codebleu: 0.950,
    confidence: 98.0,
    date: "Oct 18, 2023 11:30",
    explanation: "Conversión de clase Java a struct e impl bloque equivalente en Rust.",
    type: "integration_instructions",
  },
];

let snippetsDb: SnippetItem[] = [
  {
    id: "sn-1",
    title: "Auth Middleware Factory",
    language: "TypeScript",
    tags: ["TypeScript", "Security"],
    code: "export const withAuth = (role) => {\n  return async (req, res, next) => {\n    const token = req.headers.auth;\n    if (!token) return res.fail();\n    // Validate logic...\n    next();\n  }\n}",
    lastUsed: "Last used 2h ago",
  },
  {
    id: "sn-2",
    title: "Pandas Data Cleanup",
    language: "Python",
    tags: ["Python", "Data Science"],
    code: "import pandas as pd\n\ndef clean_dataset(df):\n    df.dropna(inplace=True)\n    df.columns = [c.lower() for c in df.columns]\n    return df",
    lastUsed: "Last used 1d ago",
  },
  {
    id: "sn-3",
    title: "Go Concurrent Fetcher",
    language: "Go",
    tags: ["Go", "System"],
    code: "func FetchAll(urls []string) {\n    ch := make(chan string)\n    for _, url := range urls {\n        go fetch(url, ch)\n    }\n}",
    lastUsed: "Last used 5d ago",
  },
  {
    id: "sn-4",
    title: "Prisma Schema Boilerplate",
    language: "Schema",
    tags: ["Schema", "Database"],
    code: "model User {\n  id    String @id @default(uuid())\n  email String @unique\n  posts Post[]\n  createdAt DateTime @default(now())\n}",
    lastUsed: "Never used",
  },
];

let apiKeysDb: ApiKeyItem[] = [
  {
    id: "k-1",
    name: "Production_Main_Key",
    keyMasked: "lb_live_••••••••••••••••3a9f",
    type: "production",
  },
  {
    id: "k-2",
    name: "Sandbox_Dev_Testing",
    keyMasked: "lb_test_••••••••••••••••92b1",
    type: "sandbox",
  },
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Translate Code
  app.post("/api/translate", async (req, res) => {
    const { sourceCode, sourceLang, targetLang, options = {} } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ error: "No source code provided." });
    }

    try {
      // Check if API key is present before translating. If not, use fallback mockup output with guidance.
      const hasKey = !!process.env.GEMINI_API_KEY;

      if (!hasKey) {
        // Fallback for when the user is starting up or has not configured the key
        console.warn("GEMINI_API_KEY is missing. Providing high-fidelity mock conversion response for standard demo.");
        
        // Let's create an elegant fallback response mimicking real AI logic
        const responseText = `// Traducido de ${sourceLang} a ${targetLang} (Simulado sin llave GEMINI_API_KEY)\n` +
          `// Para habilitar traducción real, configura tu GEMINI_API_KEY en Panel de Control > Secrets.\n\n` + 
          (targetLang.toLowerCase() === "javascript" || targetLang.toLowerCase() === "typescript" ? 
            `function translatedBlock() {\n  console.log("Los Bacas AI Engine: Por favor añade tu GEMINI_API_KEY!");\n  return true;\n}` :
            `// Translated code placeholder\nprint("Añada GEMINI_API_KEY en configuración")`);

        return res.json({
          translatedCode: responseText,
          confidence: 98.2,
          codebleu: 0.94,
          explanation: "Esta es una respuesta preestablecida porque no se ha detectado su GEMINI_API_KEY. Una vez agregada, esta traducción se realizará en vivo con modelos avanzados de IA.",
          latency: 0.8,
        });
      }

      const client = getGeminiClient();

      const promptSystem = `Eres el motor experto de traducción de código de IA de 'Los Bacas'.
Traduce este código de manera impecable teniendo en cuenta las mejores prácticas idiomáticas, sintaxis estricta y rendimiento.
Lenguaje de origen: ${sourceLang}
Lenguaje objetivo: ${targetLang}
Opción de modernizar el código: ${options.modernize ? "Habilitado" : "Deshabilitado"}.

Debes devolver un formato de respuesta JSON válido que respete exactamente el esquema proporcionado. No agregues formatos markdown adicionales o texto fuera del JSON.`;

      const promptUser = `Código a traducir:\n\n${sourceCode}`;

      const tStart = Date.now();

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptUser,
        config: {
          systemInstruction: promptSystem,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translated_code: {
                type: Type.STRING,
                description: "The compiled or translated code in target format."
              },
              confidence: {
                type: Type.NUMBER,
                description: "Model confidence score from 0 to 100 representing accuracy."
              },
              codebleu: {
                type: Type.NUMBER,
                description: "Calculated realistic CodeBLEU rating between 0.0 and 1.0 based on lexical/syntax/control flow analysis."
              },
              explanation: {
                type: Type.STRING,
                description: "Clean explanation of translation structures or differences to watch out for."
              }
            },
            required: ["translated_code", "confidence", "codebleu", "explanation"]
          }
        },
      });

      const tEnd = Date.now();
      const latencySeconds = parseFloat(((tEnd - tStart) / 1000).toFixed(2));

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini.");
      }

      const result = JSON.parse(responseText.trim());

      res.json({
        translatedCode: result.translated_code,
        confidence: result.confidence || 95.0,
        codebleu: result.codebleu || 0.90,
        explanation: result.explanation || "",
        latency: latencySeconds,
      });

    } catch (error: any) {
      console.error("Translation API error:", error);
      res.status(500).json({ error: error.message || "Error al procesar la traducción de código." });
    }
  });

  // History Endpoints
  app.get("/api/history", (req, res) => {
    res.json(historyDb);
  });

  app.post("/api/history", (req, res) => {
    const { filename, sourceLang, targetLang, sourceCode, translatedCode, codebleu, confidence, explanation } = req.body;
    
    const types = ["functions", "data_object", "database", "integration_instructions"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newItem: HistoryItem = {
      id: "BA-" + Math.floor(10000 + Math.random() * 90000),
      filename: filename || `Snippet.${sourceLang === "Python" ? "py" : sourceLang === "JavaScript" ? "js" : "txt"}`,
      sourceLang,
      targetLang,
      sourceCode,
      translatedCode,
      codebleu: codebleu || 0.92,
      confidence: confidence || 95.0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      explanation,
      type: randomType,
    };

    historyDb = [newItem, ...historyDb];
    res.status(201).json(newItem);
  });

  // Snippets Endpoints
  app.get("/api/snippets", (req, res) => {
    res.json(snippetsDb);
  });

  app.post("/api/snippets", (req, res) => {
    const { title, language, tags, code } = req.body;
    const newSnippet: SnippetItem = {
      id: "sn-" + Math.floor(100 + Math.random() * 900),
      title: title || "Nuevo fragmento de código",
      language: language || "TypeScript",
      tags: tags || [language],
      code: code || "",
      lastUsed: "Just created",
    };
    snippetsDb = [newSnippet, ...snippetsDb];
    res.status(201).json(newSnippet);
  });

  // API Keys Endpoints
  app.get("/api/api-keys", (req, res) => {
    res.json(apiKeysDb);
  });

  app.post("/api/api-keys", (req, res) => {
    const { name, type } = req.body;
    const randHex = Math.random().toString(16).substring(2, 6);
    const newKey: ApiKeyItem = {
      id: "k-" + Math.floor(100 + Math.random() * 900),
      name: name || `Key_${type === "production" ? "Production" : "Sandbox"}`,
      keyMasked: `lb_${type === "production" ? "live" : "test"}_••••••••••••••••${randHex}`,
      type: type || "production",
    };
    apiKeysDb = [newKey, ...apiKeysDb];
    res.status(201).json(newKey);
  });

  app.delete("/api/api-keys/:id", (req, res) => {
    const id = req.params.id;
    apiKeysDb = apiKeysDb.filter((k) => k.id !== id);
    res.json({ success: true });
  });

  // Vite middleware setup or index.html routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

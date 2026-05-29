import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WorkspaceView from "./components/WorkspaceView";
import HistoryView from "./components/HistoryView";
import SnippetsView from "./components/SnippetsView";
import ApiView from "./components/ApiView";
import HelpView from "./components/HelpView";
import { ActiveTab, HistoryItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("workspace");
  const [workspaceKey, setWorkspaceKey] = React.useState(0);

  // States to pass when transferring from history item or snippet template
  const [transferredCode, setTransferredCode] = React.useState("");
  const [transferredSourceLang, setTransferredSourceLang] = React.useState("Python");
  const [transferredTargetLang, setTransferredTargetLang] = React.useState("JavaScript");
  const [transferredTranslatedCode, setTransferredTranslatedCode] = React.useState("");

  // Forces a full unmount and remount with clean values
  const handleNewTranslation = () => {
    setTransferredCode("");
    setTransferredSourceLang("Python");
    setTransferredTargetLang("JavaScript");
    setTransferredTranslatedCode("");
    setWorkspaceKey((prev) => prev + 1);
    setActiveTab("workspace");
  };

  // Loads a historical item back into the active workspace editor
  const handleLoadHistoryToWorkspace = (item: HistoryItem) => {
    setTransferredCode(item.sourceCode);
    setTransferredSourceLang(item.sourceLang);
    setTransferredTargetLang(item.targetLang);
    setTransferredTranslatedCode(item.translatedCode);
    setWorkspaceKey((prev) => prev + 1); // remount workspace with populated states
    setActiveTab("workspace");
  };

  // Loads a boilerplate template code from Snippets into the workspace
  const handleLoadTemplateToWorkspace = (code: string, language: string) => {
    setTransferredCode(code);
    setTransferredSourceLang(language);
    
    // Auto-decide corresponding target language for neat developer experience
    let target = "JavaScript";
    if (language === "Python") target = "JavaScript";
    if (language === "TypeScript") target = "Go";
    if (language === "Go") target = "Rust";
    if (language === "Schema") {
      setTransferredSourceLang("PostgreSQL");
      target = "MongoDB";
    }
    setTransferredTargetLang(target);
    setTransferredTranslatedCode("");
    
    setWorkspaceKey((prev) => prev + 1); // remount workspace with template
    setActiveTab("workspace");
  };

  // Callback to trigger when translation saves new history items
  const handleTranslationSuccess = () => {
    console.log("Translation committed successfully, state indices synced.");
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans overflow-hidden h-screen flex flex-col selection:bg-[#571bc1]/50">
      
      {/* Universal top control layout block */}
      <Header onTabChange={setActiveTab} activeTab={activeTab} />

      <div className="flex flex-1 overflow-hidden">
        {/* Core Sidebar control deck */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onNewTranslation={handleNewTranslation} 
        />

        {/* Primary Screen Container Area */}
        <main className="flex-1 overflow-hidden bg-[#0a0e17] flex flex-col relative">
          
          {/* Subtle background tech matrix lines layout decoration */}
          <div className="absolute inset-0 bg-[#060e20] bg-clip-border opacity-5 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-transparent to-transparent"></div>

          {activeTab === "workspace" && (
            <div key={workspaceKey} className="flex-1 flex flex-col min-h-0">
              <WorkspaceView
                initialCode={transferredCode}
                initialSourceLang={transferredSourceLang}
                initialTargetLang={transferredTargetLang}
                initialTranslatedCode={transferredTranslatedCode}
                onTranslationSuccess={handleTranslationSuccess}
              />
            </div>
          )}

          {activeTab === "history" && (
            <HistoryView onLoadToWorkspace={handleLoadHistoryToWorkspace} />
          )}

          {activeTab === "snippets" && (
            <SnippetsView onLoadTemplate={handleLoadTemplateToWorkspace} />
          )}

          {activeTab === "api" && (
            <ApiView />
          )}

          {activeTab === "help" && (
            <HelpView />
          )}
        </main>
      </div>
    </div>
  );
}

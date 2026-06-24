import React, { useState, useEffect } from "react";
import { 
  Project, 
  Character, 
  Foreshadowing, 
  Episode, 
  Task, 
  AIRiskReport, 
  Notification 
} from "./types";
import { 
  initialProject, 
  initialCharacters, 
  initialEpisodes, 
  initialTasks, 
  initialForeshadowings 
} from "./data";
import { Dashboard } from "./components/Dashboard";
import { ProjectSettings } from "./components/ProjectSettings";
import { EpisodesList } from "./components/EpisodesList";
import { CharactersList } from "./components/CharactersList";
import { Foreshadowings } from "./components/Foreshadowings";
import { Schedules } from "./components/Schedules";
import { AIRiskReportView } from "./components/AIRiskReportView";
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  CheckSquare, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  Activity, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RefreshCw, 
  Bell, 
  Plus, 
  X,
  Compass
} from "lucide-react";

export default function App() {
  // 1. Core Persistent States
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [foreshadowings, setForeshadowings] = useState<Foreshadowing[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiReports, setAiReports] = useState<Record<string, AIRiskReport>>({});

  // 2. UI Control States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // 3. Load State from LocalStorage or Load Sample Initial Data
  useEffect(() => {
    const cachedProj = localStorage.getItem("toonflow_projects");
    const cachedSelProj = localStorage.getItem("toonflow_selected_proj_id");
    const cachedChars = localStorage.getItem("toonflow_characters");
    const cachedFores = localStorage.getItem("toonflow_foreshadowings");
    const cachedEps = localStorage.getItem("toonflow_episodes");
    const cachedTasks = localStorage.getItem("toonflow_tasks");
    const cachedNotifs = localStorage.getItem("toonflow_notifications");
    const cachedReports = localStorage.getItem("toonflow_ai_reports");
    const cachedDarkMode = localStorage.getItem("toonflow_darkmode");

    if (cachedProj) {
      setProjects(JSON.parse(cachedProj));
      setSelectedProjectId(cachedSelProj || "");
      setCharacters(cachedChars ? JSON.parse(cachedChars) : []);
      setForeshadowings(cachedFores ? JSON.parse(cachedFores) : []);
      setEpisodes(cachedEps ? JSON.parse(cachedEps) : []);
      setTasks(cachedTasks ? JSON.parse(cachedTasks) : []);
      setNotifications(cachedNotifs ? JSON.parse(cachedNotifs) : []);
      setAiReports(cachedReports ? JSON.parse(cachedReports) : {});
    } else {
      // Setup default mock project data
      setProjects([initialProject]);
      setSelectedProjectId(initialProject.id);
      setCharacters(initialCharacters);
      setForeshadowings(initialForeshadowings);
      setEpisodes(initialEpisodes);
      setTasks(initialTasks);
      setNotifications([
        {
          id: "notif_start",
          projectId: initialProject.id,
          projectName: initialProject.title,
          type: "deadline",
          message: `👋 ToonFlow에 오신 것을 환영합니다! 신규 프로젝트 '${initialProject.title}'가 성공적으로 준비되었습니다.`,
          createdAt: new Date().toISOString(),
          read: false
        }
      ]);
      setAiReports({});
    }

    if (cachedDarkMode) {
      setIsDarkMode(cachedDarkMode === "true");
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // 4. Save States on Change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("toonflow_projects", JSON.stringify(projects));
      localStorage.setItem("toonflow_selected_proj_id", selectedProjectId);
      localStorage.setItem("toonflow_characters", JSON.stringify(characters));
      localStorage.setItem("toonflow_foreshadowings", JSON.stringify(foreshadowings));
      localStorage.setItem("toonflow_episodes", JSON.stringify(episodes));
      localStorage.setItem("toonflow_tasks", JSON.stringify(tasks));
      localStorage.setItem("toonflow_notifications", JSON.stringify(notifications));
      localStorage.setItem("toonflow_ai_reports", JSON.stringify(aiReports));
    }
  }, [projects, selectedProjectId, characters, foreshadowings, episodes, tasks, notifications, aiReports]);

  useEffect(() => {
    localStorage.setItem("toonflow_darkmode", String(isDarkMode));
  }, [isDarkMode]);

  // Active Project Reference
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const activeReport = currentProject ? aiReports[currentProject.id] || null : null;

  // 5. Shared Handlers
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    addNotification(id, "스위칭", `📂 활성화된 작품이 변경되었습니다.`, "schedule_change");
  };

  const handleCreateProject = (newProj: Omit<Project, "id" | "createdAt">) => {
    const id = "proj_" + Date.now();
    const projectWithId: Project = {
      ...newProj,
      id,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, projectWithId]);
    setSelectedProjectId(id);
    addNotification(id, "생성", `🎨 새 웹툰 프로젝트 '${newProj.title}' 연재 기획안이 등록되었습니다!`, "schedule_change");
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Clear associations
    setCharacters(prev => prev.filter(c => c.projectId !== id));
    setForeshadowings(prev => prev.filter(f => f.projectId !== id));
    setEpisodes(prev => prev.filter(e => e.projectId !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setNotifications(prev => prev.filter(n => n.projectId !== id));
    
    // Choose another project
    const remaining = projects.filter(p => p.id !== id);
    if (remaining.length > 0) {
      setSelectedProjectId(remaining[0].id);
    } else {
      setSelectedProjectId("");
    }
  };

  const handleCreateCharacter = (char: Omit<Character, "id">) => {
    const newChar: Character = {
      ...char,
      id: "char_" + Date.now()
    };
    setCharacters(prev => [...prev, newChar]);
  };

  const handleUpdateCharacter = (updatedChar: Character) => {
    setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
  };

  const handleDeleteCharacter = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateForeshadowing = (fore: Omit<Foreshadowing, "id">) => {
    const newFore: Foreshadowing = {
      ...fore,
      id: "fore_" + Date.now()
    };
    setForeshadowings(prev => [...prev, newFore]);
  };

  const handleUpdateForeshadowing = (updatedFore: Foreshadowing) => {
    setForeshadowings(prev => prev.map(f => f.id === updatedFore.id ? updatedFore : f));
  };

  const handleDeleteForeshadowing = (id: string) => {
    setForeshadowings(prev => prev.filter(f => f.id !== id));
  };

  const handleCreateEpisode = (ep: Omit<Episode, "id" | "scenes">) => {
    const newEp: Episode = {
      ...ep,
      id: "ep_" + Date.now(),
      scenes: []
    };
    setEpisodes(prev => [...prev, newEp]);
    addNotification(ep.projectId, ep.title, `📖 제 ${ep.chapterNumber}화 기획안('${ep.title}')이 신규 등록되었습니다.`, "schedule_change");
  };

  const handleUpdateEpisode = (updatedEp: Episode) => {
    setEpisodes(prev => prev.map(e => e.id === updatedEp.id ? updatedEp : e));
  };

  const handleDeleteEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(e => e.id !== id));
  };

  const handleCreateTask = (task: Omit<Task, "id" | "status">) => {
    const newTask: Task = {
      ...task,
      id: "task_" + Date.now(),
      status: "pending"
    };
    setTasks(prev => [...prev, newTask]);
    
    if (task.priority === "high") {
      addNotification(task.projectId, "즉시 할 일", `⚠️ 긴급 수준이 높은 작업 카드 '${task.title}'가 스케줄에 투입되었습니다.`, "deadline");
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (pId: string, pName: string, message: string, type: Notification["type"]) => {
    const newNotif: Notification = {
      id: "notif_" + Date.now(),
      projectId: pId,
      projectName: pName,
      type,
      message,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 6. Server-Side AI Risk Analysis trigger
  const handleAnalyzeRisk = async () => {
    if (!currentProject) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: currentProject,
          episodes: episodes.filter(e => e.projectId === currentProject.id),
          characters: characters.filter(c => c.projectId === currentProject.id),
          tasks: tasks.filter(t => t.projectId === currentProject.id),
          foreshadowings: foreshadowings.filter(f => f.projectId === currentProject.id)
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 분석 통신 오류 발생");
      }

      const report: AIRiskReport = await response.json();
      
      // Update reports state
      setAiReports(prev => ({
        ...prev,
        [currentProject.id]: report
      }));

      // Trigger user alert notification log
      let notifType: Notification["type"] = "schedule_change";
      let text = `🤖 AI 리스크 분석 완료: 현 마감 안정 점수는 ${report.riskScore}점입니다.`;
      if (report.riskLevel === "high") {
        notifType = "risk_increase";
        text = `🚨 [AI 위험 감지] 마감 리스크 지수가 ${report.riskScore}점으로 높음 상태입니다. 권고사항을 확인하세요!`;
      } else if (report.riskLevel === "medium") {
        notifType = "deadline";
        text = `⚠️ [AI 분석] 마감 리스크 지수 ${report.riskScore}점(보통). 세부 진행도를 재점검하십시오.`;
      }

      addNotification(currentProject.id, currentProject.title, text, notifType);

    } catch (err) {
      console.error("AI Analysis failed:", err);
      alert("AI 서버 연결에 에러가 발생했습니다. 규칙 엔진 모드로 마감 상황을 임시 분석합니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 7. Backup mechanisms
  const handleExportData = () => {
    const allData = {
      projects,
      selectedProjectId,
      characters,
      foreshadowings,
      episodes,
      tasks,
      notifications,
      aiReports
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `toonflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.projects && parsed.selectedProjectId) {
            setProjects(parsed.projects);
            setSelectedProjectId(parsed.selectedProjectId);
            setCharacters(parsed.characters || []);
            setForeshadowings(parsed.foreshadowings || []);
            setEpisodes(parsed.episodes || []);
            setTasks(parsed.tasks || []);
            setNotifications(parsed.notifications || []);
            setAiReports(parsed.aiReports || {});
            alert("백업 파일 복구가 완료되었습니다!");
          } else {
            alert("잘못된 형식의 ToonFlow 백업 파일입니다.");
          }
        } catch (err) {
          alert("파일 읽기 도중 오류가 발생했습니다.");
        }
      };
    }
  };

  const handleResetToDefault = () => {
    if (confirm("정말로 모든 데이터를 초기 샘플 데이터('낭만 검객') 상태로 되돌리시겠습니까? 작성 중인 데이터는 지워집니다.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Handle task checklist check status
  const handleToggleTaskStatus = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      handleUpdateTask({
        ...target,
        status: target.status === "completed" ? "pending" : "completed"
      });
    }
  };

  // Sidebar list configurations
  const tabsList = [
    { id: "dashboard", label: "대시보드", icon: Compass },
    { id: "projects", label: "작품 설정", icon: Layers },
    { id: "episodes", label: "스토리/콘티", icon: BookOpen },
    { id: "characters", label: "캐릭터 도감", icon: Users },
    { id: "foreshadowing", label: "복선/떡밥", icon: Sparkles },
    { id: "schedule", label: "일정/To-Do", icon: CheckSquare },
    { id: "ai_analysis", label: "AI 리스크 진단", icon: Activity }
  ];

  return (
    <div className={isDarkMode ? "dark bg-[#090D16] text-slate-100 min-h-screen font-sans" : "bg-[#F4F7FA] text-[#2D3436] min-h-screen font-sans"}>
      
      {/* 1. Header component */}
      <header className={`border-b sticky top-0 z-50 transition-colors backdrop-blur-md ${
        isDarkMode ? "bg-[#0F172A]/80 border-slate-800/80" : "bg-white/90 border-[#E2E8F0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-indigo-600 dark:text-indigo-400">ToonFlow</span>
              <span className="text-[10px] font-bold block leading-none text-slate-400 dark:text-slate-500">마감 세이프 가드</span>
            </div>
          </div>

          {/* Center: Quick Active Project Switcher */}
          {projects.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase">작품:</span>
              <select
                value={selectedProjectId}
                onChange={e => handleSelectProject(e.target.value)}
                className={`p-1.5 rounded-lg border text-xs font-bold outline-hidden cursor-pointer ${
                  isDarkMode ? "bg-slate-900 border-indigo-950 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Backup / Export Buttons */}
            <div className="flex items-center gap-1.5 border-r border-slate-800/10 dark:border-slate-800 pr-2.5">
              <button
                onClick={handleExportData}
                title="데이터 로컬 백업 다운로드"
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              
              <label 
                title="백업 복구 업로드"
                className={`p-2 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                  isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportData} 
                  className="hidden" 
                />
              </label>

              <button
                onClick={handleResetToDefault}
                title="기본 샘플 데이터로 복구"
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isDarkMode ? "border-slate-800 hover:bg-slate-850 text-amber-500" : "border-slate-200 hover:bg-amber-50 text-amber-600"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isDarkMode 
                  ? "border-indigo-900/50 bg-indigo-950/20 text-indigo-400 hover:bg-indigo-900/20" 
                  : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Navigation Tab Menu */}
          <aside className="lg:w-60 shrink-0">
            {/* Desktop Navigation */}
            <div className={`hidden lg:block p-4 rounded-[24px] border ${
              isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-[#E2E8F0]"
            } space-y-1.5`}>
              <span className="text-[10px] font-bold text-slate-400 block px-3 mb-2 uppercase tracking-wider">창작 관리 메뉴</span>
              {tabsList.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : isDarkMode 
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Horizontal scrollable Navigation */}
            <div className="lg:hidden overflow-x-auto flex gap-1.5 pb-2 scrollbar-none">
              {tabsList.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : isDarkMode 
                      ? "bg-slate-900 text-slate-400" 
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Dynamic Component Stage */}
          <section className="flex-1 min-w-0">
            {activeTab === "dashboard" && currentProject && (
              <Dashboard 
                project={currentProject}
                episodes={episodes}
                characters={characters}
                foreshadowings={foreshadowings}
                tasks={tasks}
                report={activeReport}
                notifications={notifications}
                isDarkMode={isDarkMode}
                onNavigate={setActiveTab}
                onToggleTask={handleToggleTaskStatus}
                onAnalyze={handleAnalyzeRisk}
                isAnalyzing={isAnalyzing}
              />
            )}

            {activeTab === "projects" && (
              <ProjectSettings 
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={handleSelectProject}
                onCreateProject={handleCreateProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "episodes" && currentProject && (
              <EpisodesList 
                episodes={episodes}
                projectId={currentProject.id}
                onCreateEpisode={handleCreateEpisode}
                onUpdateEpisode={handleUpdateEpisode}
                onDeleteEpisode={handleDeleteEpisode}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "characters" && currentProject && (
              <CharactersList 
                characters={characters}
                projectId={currentProject.id}
                onCreateCharacter={handleCreateCharacter}
                onUpdateCharacter={handleUpdateCharacter}
                onDeleteCharacter={handleDeleteCharacter}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "foreshadowing" && currentProject && (
              <Foreshadowings 
                foreshadowings={foreshadowings}
                projectId={currentProject.id}
                onCreateForeshadowing={handleCreateForeshadowing}
                onUpdateForeshadowing={handleUpdateForeshadowing}
                onDeleteForeshadowing={handleDeleteForeshadowing}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "schedule" && currentProject && (
              <Schedules 
                tasks={tasks}
                projectId={currentProject.id}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                isDarkMode={isDarkMode}
              />
            )}

            {activeTab === "ai_analysis" && currentProject && (
              <AIRiskReportView 
                project={currentProject}
                episodes={episodes}
                characters={characters}
                foreshadowings={foreshadowings}
                tasks={tasks}
                report={activeReport}
                onAnalyze={handleAnalyzeRisk}
                isAnalyzing={isAnalyzing}
                isDarkMode={isDarkMode}
              />
            )}

            {!currentProject && (
              <div className="text-center py-16 border border-dashed border-slate-800/30 rounded-2xl">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">등록된 웹툰 프로젝트가 존재하지 않습니다. '작품 설정' 탭에서 새로운 작화안을 생성하십시오.</p>
              </div>
            )}
          </section>

        </div>
      </main>

    </div>
  );
}

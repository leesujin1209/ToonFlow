import React, { useState } from "react";
import { Project } from "../types";
import { Plus, Check, Trash2, Edit2, FileText, ChevronRight, Layers, Sparkles } from "lucide-react";

interface ProjectSettingsProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (project: Omit<Project, "id" | "createdAt">) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  isDarkMode: boolean;
}

export const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  isDarkMode
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New Project Fields
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("무협 / 판타지");
  const [newCycle, setNewCycle] = useState<'weekly' | 'biweekly' | 'monthly' | 'irregular'>("weekly");
  const [newStatus, setNewStatus] = useState<'ongoing' | 'completed' | 'paused' | 'planning'>("planning");
  const [newProgress, setNewProgress] = useState(0);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Selected project reference
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Act editing states
  const [intro, setIntro] = useState(currentProject?.actStructure?.introduction || "");
  const [confront, setConfront] = useState(currentProject?.actStructure?.confrontation || "");
  const [resolve, setResolve] = useState(currentProject?.actStructure?.resolution || "");

  // Update act local state when project changes
  React.useEffect(() => {
    if (currentProject) {
      setIntro(currentProject.actStructure?.introduction || "");
      setConfront(currentProject.actStructure?.confrontation || "");
      setResolve(currentProject.actStructure?.resolution || "");
    }
  }, [selectedProjectId, currentProject]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateProject({
      title: newTitle,
      genre: newGenre,
      serializationCycle: newCycle,
      status: newStatus,
      progress: Number(newProgress),
      startDate: newStartDate,
      endDate: newEndDate,
      actStructure: {
        introduction: "새 도입부 설정을 기록해 주세요.",
        confrontation: "새 전개 갈등 요소를 기록해 주세요.",
        resolution: "새 결말 대결 구도 및 마무리를 기록해 주세요."
      }
    });

    // Reset Form
    setNewTitle("");
    setIsCreating(false);
  };

  const handleSaveActs = () => {
    if (!currentProject) return;
    onUpdateProject({
      ...currentProject,
      actStructure: {
        introduction: intro,
        confrontation: confront,
        resolution: resolve
      }
    });
    alert("시나리오 3막 구조가 안전하게 저장되었습니다!");
  };

  const handleUpdateBasic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    onUpdateProject({
      ...currentProject,
      progress: Number(newProgress),
      endDate: newEndDate,
      status: newStatus,
      serializationCycle: newCycle,
      genre: newGenre
    });
    setIsEditing(false);
    alert("프로젝트 기본 정보가 성공적으로 변경되었습니다.");
  };

  const openEditModal = () => {
    if (!currentProject) return;
    setNewProgress(currentProject.progress);
    setNewEndDate(currentProject.endDate);
    setNewStatus(currentProject.status);
    setNewCycle(currentProject.serializationCycle);
    setNewGenre(currentProject.genre);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">프로젝트 관리 설정</h1>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            창작 중인 여러 웹툰 프로젝트를 통합 관리하고, 핵심 마감일과 대하 서사의 뼈대를 단단하게 보관합니다.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" /> 새 웹툰 등록하기
        </button>
      </div>

      {/* Create New Project Modal/Collapse */}
      {isCreating && (
        <form 
          onSubmit={handleCreate}
          className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-md space-y-4 animate-fadeIn`}
        >
          <h3 className="text-sm font-bold">새 웹툰 프로젝트 정보 입력</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">웹툰 타이틀</label>
              <input 
                type="text" 
                placeholder="예: 낭만 검객, 우주 파이터 등"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">장르 선택</label>
              <select 
                value={newGenre}
                onChange={e => setNewGenre(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="무협 / 판타지">무협 / 판타지</option>
                <option value="로맨스 / 로판">로맨스 / 로판</option>
                <option value="드라마 / 일상">드라마 / 일상</option>
                <option value="액션 / 학원물">액션 / 학원물</option>
                <option value="스릴러 / 호러">스릴러 / 호러</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">연재 주기</label>
              <select 
                value={newCycle}
                onChange={e => setNewCycle(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="weekly">주간 연재 (Weekly)</option>
                <option value="biweekly">격주 연재 (Bi-weekly)</option>
                <option value="monthly">월간 연재 (Monthly)</option>
                <option value="irregular">비정기/완결작</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">최종 마감 목표일</label>
              <input 
                type="date" 
                value={newEndDate}
                onChange={e => setNewEndDate(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className={`px-3 py-1.5 rounded-xl text-xs ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              프로젝트 생성
            </button>
          </div>
        </form>
      )}

      {/* Project Selector List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Projects */}
        <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-xs space-y-3`}>
          <h2 className="text-sm font-bold pb-2 border-b border-slate-800/10 dark:border-slate-800">보유 중인 작품 목록</h2>
          <div className="space-y-2">
            {projects.map(proj => {
              const isActive = proj.id === selectedProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive 
                      ? (isDarkMode ? "bg-indigo-950/30 border-indigo-500 text-white" : "bg-indigo-50 border-indigo-400 text-indigo-950") 
                      : (isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold">{proj.title}</h4>
                      <span className="text-[10px] opacity-70">{proj.genre} • {proj.serializationCycle === 'weekly' ? '주간' : '격주'}</span>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
                  </div>
                  
                  {/* Miniature progress bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[9px] mb-0.5 opacity-80">
                      <span>완성도</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-300 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Project Setting Details */}
        <div className="lg:col-span-2 space-y-6">
          {currentProject ? (
            <>
              {/* Basic Setting Update Card */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-xs space-y-4`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/10 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold">기본 연재 정보 수동 조정</h3>
                  </div>
                  <button
                    onClick={openEditModal}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateBasic} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] mb-1">작업 완성도 (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={newProgress}
                          onChange={e => setNewProgress(Number(e.target.value))}
                          className={`w-full p-2 rounded-lg border text-xs ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">최종 마감 예정일</label>
                        <input 
                          type="date" 
                          value={newEndDate}
                          onChange={e => setNewEndDate(e.target.value)}
                          className={`w-full p-2 rounded-lg border text-xs ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] mb-1">상태</label>
                        <select 
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value as any)}
                          className={`w-full p-2 rounded-lg border text-xs ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        >
                          <option value="planning">기획 단계</option>
                          <option value="ongoing">연재 중</option>
                          <option value="paused">휴재 중</option>
                          <option value="completed">완결</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg"
                      >
                        취소
                      </button>
                      <button 
                        type="submit" 
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                      >
                        저장하기
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">장르</span>
                      <span className="text-xs font-semibold">{currentProject.genre}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">연재 주기</span>
                      <span className="text-xs font-semibold">
                        {currentProject.serializationCycle === 'weekly' ? '매주 연재' : currentProject.serializationCycle === 'biweekly' ? '격주 연재' : '기타'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">마감 목표일</span>
                      <span className="text-xs font-semibold text-red-500">{currentProject.endDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">상태</span>
                      <span className="text-xs font-semibold text-indigo-500">
                        {currentProject.status === 'ongoing' ? '연재중' : currentProject.status === 'planning' ? '기획중' : '휴재/완결'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Dangerous section - Delete project (Only if more than 1 project) */}
                {projects.length > 1 && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`진짜로 '${currentProject.title}' 프로젝트를 통째로 삭제하시겠습니까? 데이터는 영구 손실됩니다.`)) {
                          onDeleteProject(currentProject.id);
                        }
                      }}
                      className="text-[10px] text-red-500 hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> 프로젝트 영구 삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 3-Act Structure Plan Editor */}
              <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-xs space-y-4`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/10 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-bold">기획 3막 구조 (3-Act Storyline Plan)</h3>
                  </div>
                  <span className="text-[10px] text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 대하 기획 뼈대
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">1막: 도입부 (Introduction) - 기연 및 세계관 착수</label>
                    </div>
                    <textarea
                      value={intro}
                      onChange={e => setIntro(e.target.value)}
                      rows={3}
                      placeholder="주인공의 결핍, 세계관의 첫 암시, 기연이나 최초 사건의 시작을 간략히 요약하세요."
                      className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden leading-relaxed ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">2막: 전개 및 위기 (Confrontation) - 갈등 심화 및 첩자 색출</label>
                    </div>
                    <textarea
                      value={confront}
                      onChange={e => setConfront(e.target.value)}
                      rows={3}
                      placeholder="동료 합류, 적대 세력과의 대립 격화, 의혹과 갈등이 최고조로 치닫는 핵심 중반 요약."
                      className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden leading-relaxed ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400">3막: 결말 (Resolution) - 최종 결전 및 복선 회수</label>
                    </div>
                    <textarea
                      value={resolve}
                      onChange={e => setResolve(e.target.value)}
                      rows={3}
                      placeholder="최종 대전의 승리, 음모의 종결, 주인공의 사명 완수 및 비장한 여운의 결말."
                      className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden leading-relaxed ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveActs}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> 3막 시나리오 안전 저장하기
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">선택한 웹툰 프로젝트가 존재하지 않습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

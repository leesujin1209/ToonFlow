import React, { useState } from "react";
import { Foreshadowing } from "../types";
import { Plus, Trash2, Check, Sparkles, AlertTriangle, HelpCircle, Search } from "lucide-react";

interface ForeshadowingsProps {
  foreshadowings: Foreshadowing[];
  projectId: string;
  onCreateForeshadowing: (f: Omit<Foreshadowing, "id">) => void;
  onUpdateForeshadowing: (f: Foreshadowing) => void;
  onDeleteForeshadowing: (id: string) => void;
  isDarkMode: boolean;
}

export const Foreshadowings: React.FC<ForeshadowingsProps> = ({
  foreshadowings,
  projectId,
  onCreateForeshadowing,
  onUpdateForeshadowing,
  onDeleteForeshadowing,
  isDarkMode
}) => {
  const projectForeshadowings = foreshadowings.filter(f => f.projectId === projectId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [isCreating, setIsCreating] = useState(false);

  // New foreshadowing fields
  const [description, setDescription] = useState("");
  const [episodeRegistered, setEpisodeRegistered] = useState("");

  // Resolving popover/state fields
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [episodeResolved, setEpisodeResolved] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !episodeRegistered.trim()) return;

    onCreateForeshadowing({
      projectId,
      description,
      episodeRegistered,
      status: "unresolved",
      episodeResolved: ""
    });

    setDescription("");
    setEpisodeRegistered("");
    setIsCreating(false);
  };

  const handleResolveSubmit = (f: Foreshadowing) => {
    if (!episodeResolved.trim()) return;

    onUpdateForeshadowing({
      ...f,
      status: "resolved",
      episodeResolved
    });

    setResolvingId(null);
    setEpisodeResolved("");
  };

  const handleReopen = (f: Foreshadowing) => {
    onUpdateForeshadowing({
      ...f,
      status: "unresolved",
      episodeResolved: ""
    });
  };

  const filteredForeshadowings = projectForeshadowings.filter(f => {
    const matchesSearch = f.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unresolvedCount = projectForeshadowings.filter(f => f.status === "unresolved").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">복선 & 떡밥 추적기 (Plot Devices)</h1>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            이야기 전반에 흩뿌려진 복선과 암시들을 완벽하게 기록해두고, 최종 완결 전 미회수되어 스토리 붕괴가 일어나지 않도록 추적합니다.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" /> 새 복선 등록하기
        </button>
      </div>

      {/* Narrative warning box for unrecovered plot holes */}
      {unresolvedCount >= 3 && (
        <div className={`p-4 rounded-xl border flex items-start gap-2.5 ${
          isDarkMode ? "bg-amber-950/20 border-amber-900/40 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <span className="font-bold block">🚨 미회수 떡밥 경고 알림</span>
            <span>현재 독자들에게 제시되고 풀리지 않은 복선이 <strong className="font-extrabold text-indigo-500 dark:text-indigo-400">{unresolvedCount}개</strong> 있습니다. 전개 2막~3막 초반 구조 내에서 등장인물 간의 고백이나 물건 조사를 통해 조속히 회수하는 장면을 기획하십시오.</span>
          </div>
        </div>
      )}

      {/* New Foreshadowing form */}
      {isCreating && (
        <form 
          onSubmit={handleCreate}
          className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-md space-y-4 animate-fadeIn`}
        >
          <h3 className="text-sm font-bold">새 떡밥 설정 추가</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">복선 내용 (구체적으로 기록)</label>
              <input 
                type="text" 
                placeholder="예: 백련하가 건넨 의문의 낙양 상패 뒤에 새겨진 문양"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">등록/살포 회차</label>
              <input 
                type="text" 
                placeholder="예: 2화, 혹은 3화 자객 씬"
                value={episodeRegistered}
                onChange={e => setEpisodeRegistered(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
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
              복선 투척
            </button>
          </div>
        </form>
      )}

      {/* Filter Options */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="복선 설명 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          />
        </div>
        
        <div className={`p-1 rounded-xl border flex gap-1 self-start ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          {[
            { id: "all", label: "전체 복선" },
            { id: "unresolved", label: "미회수 떡밥" },
            { id: "resolved", label: "회수한 복선" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Foreshadowing list */}
      {filteredForeshadowings.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800/30 dark:border-slate-800 rounded-2xl">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400">등록되었거나 조건에 부합하는 복선 카드가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredForeshadowings.map(fore => {
            const isUnresolved = fore.status === "unresolved";
            const isResolvingThis = resolvingId === fore.id;

            return (
              <div 
                key={fore.id}
                className={`p-4 rounded-xl border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDarkMode ? "bg-slate-900 border-slate-800 hover:bg-slate-800/35" : "bg-white border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isUnresolved 
                        ? "bg-red-500/10 text-red-500" 
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}>
                      {isUnresolved ? "미회수 (Unresolved)" : "회수 완료 (Resolved)"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      살포 회차: <strong className="text-slate-500 dark:text-slate-300">{fore.episodeRegistered}</strong>
                    </span>
                    {!isUnresolved && (
                      <span className="text-[10px] text-emerald-500 font-semibold">
                        • 회수 완료 회차: {fore.episodeResolved}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-semibold ${!isUnresolved ? "line-through text-slate-500" : ""}`}>
                    {fore.description}
                  </p>
                </div>

                {/* Control elements */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isResolvingThis ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn">
                      <input 
                        type="text" 
                        placeholder="예: 8화 결투씬"
                        value={episodeResolved}
                        onChange={e => setEpisodeResolved(e.target.value)}
                        className={`p-1.5 rounded-lg border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                          isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
                        }`}
                      />
                      <button
                        onClick={() => handleResolveSubmit(fore)}
                        className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setResolvingId(null)}
                        className="text-xs text-slate-400"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <>
                      {isUnresolved ? (
                        <button
                          onClick={() => setResolvingId(fore.id)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> 복선 회수하기
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopen(fore)}
                          className="px-3 py-1.5 border border-slate-300 dark:border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          다시 살포
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm("이 복선을 완전히 삭제하시겠습니까?")) {
                            onDeleteForeshadowing(fore.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isDarkMode ? "border-slate-800 hover:bg-slate-800 text-red-500" : "border-slate-200 hover:bg-slate-50 text-red-500"
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { Character } from "../types";
import { Plus, Trash2, Edit2, Search, Users, AlertTriangle, Check, Info, Sparkles } from "lucide-react";

interface CharactersListProps {
  characters: Character[];
  projectId: string;
  onCreateCharacter: (char: Omit<Character, "id">) => void;
  onUpdateCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  isDarkMode: boolean;
}

export const CharactersList: React.FC<CharactersListProps> = ({
  characters,
  projectId,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  isDarkMode
}) => {
  const projectCharacters = characters.filter(c => c.projectId === projectId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "main" | "supporting" | "extra">("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [role, setRole] = useState<'main' | 'supporting' | 'extra'>("main");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");
  const [relationships, setRelationships] = useState("");
  const [conflicts, setConflicts] = useState("");

  // Manual marked conflicts (state of IDs that have been manually marked as conflicting)
  const [manualConflicts, setManualConflicts] = useState<Record<string, boolean>>({});

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateCharacter({
      projectId,
      name,
      role,
      personality,
      appearance,
      relationships,
      conflicts
    });

    // Reset Form
    setName("");
    setPersonality("");
    setAppearance("");
    setRelationships("");
    setConflicts("");
    setIsCreating(false);
  };

  const handleStartEdit = (char: Character) => {
    setEditingId(char.id);
    setName(char.name);
    setRole(char.role);
    setPersonality(char.personality);
    setAppearance(char.appearance);
    setRelationships(char.relationships);
    setConflicts(char.conflicts);
  };

  const handleSaveEdit = (charId: string) => {
    onUpdateCharacter({
      id: charId,
      projectId,
      name,
      role,
      personality,
      appearance,
      relationships,
      conflicts
    });
    setEditingId(null);
  };

  const toggleManualConflict = (charId: string) => {
    setManualConflicts(prev => ({
      ...prev,
      [charId]: !prev[charId]
    }));
  };

  // Automated conflict/anomaly warning engine
  const detectConflict = (char: Character) => {
    const warningKeywords = ["비밀리", "배신", "독단", "부작용", "치명적", "모순", "충돌", "원수", "암살"];
    const textToScan = `${char.personality} ${char.appearance} ${char.relationships} ${char.conflicts}`.toLowerCase();
    
    const detectedKeywords = warningKeywords.filter(word => textToScan.includes(word));
    const isManual = !!manualConflicts[char.id];

    return {
      hasConflict: detectedKeywords.length > 0 || isManual,
      keywords: detectedKeywords,
      isManual
    };
  };

  // Filters
  const filteredCharacters = projectCharacters.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.personality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">등장인물 설정 도감</h1>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            주요 및 조연 캐릭터들의 프로필과 외형 묘사, 인물 관계도를 등록하고 설정의 흐름이 모순되지 않도록 자동 충돌 진단을 실행하세요.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" /> 새 인물 등록하기
        </button>
      </div>

      {/* New Character Create Card */}
      {isCreating && (
        <form 
          onSubmit={handleCreate}
          className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-md space-y-4 animate-fadeIn`}
        >
          <h3 className="text-sm font-bold">새로운 등장인물 상세 기입</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">이름 (배역명)</label>
              <input 
                type="text" 
                placeholder="예: 유백, 백련하 등"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">인물 분류 (배역 등급)</label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="main">주연 (Main Protagonist)</option>
                <option value="supporting">조연 (Supporting Character)</option>
                <option value="extra">엑스트라 (Extra/Villain)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">성격 (Mbti, 특징, 말투)</label>
              <textarea 
                placeholder="인물의 성격적 성정과 주로 쓰는 어조, 핵심 습관 등을 기록해 주세요."
                value={personality}
                onChange={e => setPersonality(e.target.value)}
                rows={2}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">외형 묘사 (의상, 흉터, 장비)</label>
              <textarea 
                placeholder="헤어스타일, 대표적인 의상 색감, 신체적 흉터나 소지 무기 등을 묘사해 주세요."
                value={appearance}
                onChange={e => setAppearance(e.target.value)}
                rows={2}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">인물 관계망 (누가 누구와 어떤 감정을 교류하는지)</label>
              <input 
                type="text" 
                placeholder="예: 백련하(동료/조력자) - 구박하지만 깊게 신뢰, 혈사독(표적) - 최종 대치 대상"
                value={relationships}
                onChange={e => setRelationships(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">설정 충돌 우려 요소 및 리스크 (주의 사항)</label>
              <input 
                type="text" 
                placeholder="예: 천마공을 발동할 때마다 기혈이 파괴되는 부작용이 있어 빈번한 무공 사용 시 설정 붕괴 위험"
                value={conflicts}
                onChange={e => setConflicts(e.target.value)}
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
              인물 정보 저장
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="이름 또는 키워드로 캐릭터 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          />
        </div>
        
        {/* Role classification filter tabs */}
        <div className={`p-1 rounded-xl border flex gap-1 self-start ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          {[
            { id: "all", label: "전체" },
            { id: "main", label: "주연" },
            { id: "supporting", label: "조연" },
            { id: "extra", label: "조단역" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                roleFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Characters list grid */}
      {filteredCharacters.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400">조건에 부합하는 등장인물이 도감에 등록되어 있지 않습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCharacters.map(char => {
            const isEditing = editingId === char.id;
            const conflictInfo = detectConflict(char);
            const roleBadge = char.role === 'main' ? 'bg-indigo-500 text-white' : char.role === 'supporting' ? 'bg-sky-500 text-white' : 'bg-slate-500 text-white';

            return (
              <div 
                key={char.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                } ${conflictInfo.hasConflict ? (isDarkMode ? "ring-1 ring-red-500/30" : "ring-1 ring-red-100") : ""}`}
              >
                {isEditing ? (
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/10 dark:border-slate-800">
                      <span className="text-xs font-bold text-indigo-500">캐릭터 프로필 수정</span>
                      <button 
                        onClick={() => handleSaveEdit(char.id)}
                        className="text-xs text-emerald-500 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> 완성
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block mb-0.5 text-slate-400">이름</label>
                          <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                          />
                        </div>
                        <div>
                          <label className="block mb-0.5 text-slate-400">분류</label>
                          <select 
                            value={role} 
                            onChange={e => setRole(e.target.value as any)}
                            className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                          >
                            <option value="main">주연</option>
                            <option value="supporting">조연</option>
                            <option value="extra">엑스트라</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-0.5 text-slate-400">성격</label>
                        <textarea 
                          value={personality} 
                          onChange={e => setPersonality(e.target.value)}
                          rows={2}
                          className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-0.5 text-slate-400">외형</label>
                        <textarea 
                          value={appearance} 
                          onChange={e => setAppearance(e.target.value)}
                          rows={2}
                          className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-0.5 text-slate-400">관계도</label>
                        <input 
                          type="text" 
                          value={relationships} 
                          onChange={e => setRelationships(e.target.value)}
                          className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-0.5 text-slate-400">설정 충돌 요소</label>
                        <input 
                          type="text" 
                          value={conflicts} 
                          onChange={e => setConflicts(e.target.value)}
                          className={`w-full p-1.5 border rounded-lg ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    {/* Character Card Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                          {char.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                            {char.name}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${roleBadge}`}>
                              {char.role === 'main' ? '주연' : char.role === 'supporting' ? '조연' : '엑스트라'}
                            </span>
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(char)}
                          className={`p-1 rounded-md border transition-colors ${
                            isDarkMode ? "border-slate-800 hover:bg-slate-800 text-slate-400" : "border-slate-200 hover:bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`'${char.name}' 등장인물을 도감에서 영구 삭제하시겠습니까?`)) {
                              onDeleteCharacter(char.id);
                            }
                          }}
                          className={`p-1 rounded-md border transition-colors ${
                            isDarkMode ? "border-slate-800 hover:bg-slate-800 text-red-500" : "border-slate-200 hover:bg-slate-50 text-red-500"
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Character Profile Fields */}
                    <div className="space-y-2.5 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-semibold">인물 성격 & 심리</span>
                        <p className={`p-2 rounded-lg leading-relaxed ${isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                          {char.personality || "미기재"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-semibold">대표 외형 & 특징</span>
                        <p className={`p-2 rounded-lg leading-relaxed ${isDarkMode ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                          {char.appearance || "미기재"}
                        </p>
                      </div>
                      {char.relationships && (
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">핵심 인물 관계도</span>
                          <p className="text-[11px] font-medium text-indigo-500 dark:text-indigo-400 mt-0.5">
                            🔗 {char.relationships}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Conflict analysis system block */}
                {!isEditing && (
                  <div className="pt-4 mt-4 border-t border-slate-800/10 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {conflictInfo.hasConflict ? (
                      <div className="flex items-start gap-1.5 text-red-500 text-[10px] font-bold animate-pulse">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span>⚠️ AI 설정 경고 / 모순 요인 감지</span>
                          {conflictInfo.keywords.length > 0 && (
                            <span className="block font-medium text-slate-500 dark:text-slate-400 text-[9px] mt-0.5">
                              원인 단어: [{conflictInfo.keywords.join(", ")}]
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold">
                        <Check className="w-4 h-4" />
                        <span>설정 정합성 검토 완료 (양호)</span>
                      </div>
                    )}

                    <button
                      onClick={() => toggleManualConflict(char.id)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border cursor-pointer transition-colors ${
                        conflictInfo.isManual
                          ? "bg-red-500/10 border-red-500/30 text-red-500"
                          : "border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {conflictInfo.isManual ? "⚠️ 수동 마킹 취소" : "📍 설정 충돌 수동마킹"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

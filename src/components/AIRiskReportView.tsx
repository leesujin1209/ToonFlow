import React from "react";
import { Project, Episode, Character, Foreshadowing, Task, AIRiskReport } from "../types";
import { Sparkles, AlertTriangle, CheckCircle, RefreshCw, Activity, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { motion } from "motion/react";

interface AIRiskReportViewProps {
  project: Project;
  episodes: Episode[];
  characters: Character[];
  foreshadowings: Foreshadowing[];
  tasks: Task[];
  report: AIRiskReport | null;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isDarkMode: boolean;
}

export const AIRiskReportView: React.FC<AIRiskReportViewProps> = ({
  project,
  episodes,
  characters,
  foreshadowings,
  tasks,
  report,
  onAnalyze,
  isAnalyzing,
  isDarkMode
}) => {
  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const highPriorityPending = tasks.filter(t => t.status === "pending" && t.priority === "high").length;

  const totalEpisodes = episodes.length;
  const completedEpisodes = episodes.filter(e => e.status === "completed").length;

  const unresolvedForeshadowings = foreshadowings.filter(f => f.status === "unresolved").length;

  const deadline = new Date(project.endDate);
  const today = new Date();
  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  // Risk Gauge styling logic
  const getRiskStyle = (level: string) => {
    switch (level) {
      case "high":
        return {
          text: "text-red-500",
          border: "border-red-500/20",
          bg: "bg-red-500/10",
          gauge: "stroke-red-500",
          badge: "bg-red-500 text-white",
          cardBg: isDarkMode ? "bg-red-950/20" : "bg-red-50"
        };
      case "medium":
        return {
          text: "text-amber-500",
          border: "border-amber-500/20",
          bg: "bg-amber-500/10",
          gauge: "stroke-amber-500",
          badge: "bg-amber-500 text-white",
          cardBg: isDarkMode ? "bg-amber-950/20" : "bg-amber-50"
        };
      default:
        return {
          text: "text-emerald-500",
          border: "border-emerald-500/20",
          bg: "bg-emerald-500/10",
          gauge: "stroke-emerald-500",
          badge: "bg-emerald-500 text-white",
          cardBg: isDarkMode ? "bg-emerald-950/20" : "bg-emerald-50"
        };
    }
  };

  const risk = getRiskStyle(report?.riskLevel || "low");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">AI 마감 지연 리스크 정밀 진단</h1>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            현재까지 등록된 할 일 완료 비중, 마감 디데이, 시나리오 스토리보드 구성 밀도 정보를 인공지능이 복합 연산하여 연재 리스크를 선제 분석합니다.
          </p>
        </div>
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer self-start ${
            isAnalyzing
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
          {isAnalyzing ? "AI 리스크 연산 중..." : "AI 진단 새로고침"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Widget: Circular Gauge & Raw Metrics Summary */}
        <div className={`p-6 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-6`}>
          <div className="text-center space-y-2">
            <h3 className="text-sm font-bold">마감 지연 지수</h3>
            <p className="text-[11px] text-slate-400">지수가 높을수록 세이브 원고 고갈 및 휴재 위험이 증가합니다.</p>
          </div>

          {/* Large Gauge */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="74"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="74"
                className={risk.gauge}
                strokeWidth="15"
                fill="transparent"
                strokeDasharray="465"
                initial={{ strokeDashoffset: 465 }}
                animate={{ strokeDashoffset: 465 - (465 * (report?.riskScore || 0)) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center space-y-1">
              <span className="text-5xl font-extrabold tracking-tight">
                {report ? report.riskScore : "0"}
              </span>
              <span className="text-xs text-slate-400 block font-bold">Risk Score</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${risk.badge}`}>
                {report ? report.riskLevel : "NONE"}
              </span>
            </div>
          </div>

          {/* Project telemetry summaries */}
          <div className="space-y-3 pt-4 border-t border-slate-800/10 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400">분석 적용 지표 (Raw Metrics)</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <span className="text-slate-400 block text-[10px]">목표 D-Day</span>
                <span className="font-bold text-red-500">D-{daysRemaining}일</span>
              </div>
              <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <span className="text-slate-400 block text-[10px]">미완료 작업</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{pendingTasks}개</span>
              </div>
              <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <span className="text-slate-400 block text-[10px]">우선 마감 건</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{highPriorityPending}개</span>
              </div>
              <div className={`p-2.5 rounded-xl ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                <span className="text-slate-400 block text-[10px]">미해결 복선</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{unresolvedForeshadowings}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Console: Detailed Report Summary + Causes + AI Corrective actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnostic summary banner */}
          <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-4`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
              <h3 className="text-sm font-extrabold">인공지능 마감 안전 진단 보고서</h3>
            </div>

            <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              {report 
                ? report.summary 
                : "진단 정보가 없습니다. 상단 'AI 진단 새로고침' 버튼을 눌러 연재 진행도 데이터를 마감 엔진에 입력하십시오."}
            </p>

            {report && (
              <span className="text-[10px] text-slate-500 block">
                최종 연산 시점: {new Date(report.analyzedAt).toLocaleString("ko-KR")}
              </span>
            )}
          </div>

          {/* Key delay danger triggers */}
          <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-4`}>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <h3 className="text-sm font-bold">마감 일정을 위협하는 주요 요인</h3>
            </div>

            {report ? (
              <div className="space-y-2">
                {report.causes.map((cause, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl text-xs border ${isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-100 text-slate-700"} flex items-center gap-2`}
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    <span>{cause}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">데이터 미확보</p>
            )}
          </div>

          {/* AI Concrete Action Suggestions list */}
          <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-4`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <h3 className="text-sm font-bold">마감 사수를 위한 AI 권고사항 (Corrective Solutions)</h3>
            </div>

            {report ? (
              <div className="space-y-3">
                {report.suggestions.map((sug, idx) => (
                  <div 
                    key={idx}
                    className={`p-3.5 rounded-xl border ${risk.cardBg} ${risk.border} text-xs leading-relaxed flex items-start gap-3`}
                  >
                    <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${isDarkMode ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-100">{sug}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">데이터 분석 후 대안이 이곳에 제시됩니다.</p>
            )}
          </div>

        </div>

      </div>

      {/* Comfort footer block */}
      <div className="text-center py-6">
        <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          마감 스트레스는 모든 만화가들의 숙명입니다. ToonFlow가 마감 리스크를 분석하여 든든한 등대가 되겠습니다.<br />
          언제나 힘내십시오, 당신의 멋진 원화와 스토리를 사랑하는 독자들이 기다립니다!
        </p>
      </div>
    </div>
  );
};

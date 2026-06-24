import React from "react";
import { 
  Project, 
  Character, 
  Foreshadowing, 
  Episode, 
  Task, 
  AIRiskReport, 
  Notification 
} from "../types";
import { 
  Sparkles, 
  Clock, 
  CheckSquare, 
  AlertTriangle, 
  BookOpen, 
  Users, 
  Bell, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  project: Project;
  episodes: Episode[];
  characters: Character[];
  foreshadowings: Foreshadowing[];
  tasks: Task[];
  report: AIRiskReport | null;
  notifications: Notification[];
  isDarkMode: boolean;
  onNavigate: (tab: string) => void;
  onToggleTask: (taskId: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  project,
  episodes,
  characters,
  foreshadowings,
  tasks,
  report,
  notifications,
  isDarkMode,
  onNavigate,
  onToggleTask,
  onAnalyze,
  isAnalyzing
}) => {
  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  
  const totalEpisodes = episodes.length;
  const completedEpisodes = episodes.filter(e => e.status === "completed").length;
  const ongoingEpisodes = episodes.filter(e => e.status !== "completed" && e.status !== "planning").length;

  const totalForeshadowings = foreshadowings.length;
  const unresolvedForeshadowings = foreshadowings.filter(f => f.status === "unresolved").length;

  // D-Day calculation
  const deadline = new Date(project.endDate);
  const today = new Date();
  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  // Today's high-priority / pending task list
  const pendingHighTasks = tasks.filter(t => t.status === "pending").slice(0, 4);

  // Risk Color Scheme helper
  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return {
          bg: isDarkMode ? "bg-red-950/40" : "bg-red-50",
          text: "text-red-500",
          border: "border-red-500/30",
          badgeBg: "bg-red-500",
          gauge: "stroke-red-500"
        };
      case "medium":
        return {
          bg: isDarkMode ? "bg-amber-950/40" : "bg-amber-50",
          text: "text-amber-500",
          border: "border-amber-500/30",
          badgeBg: "bg-amber-500",
          gauge: "stroke-amber-500"
        };
      default:
        return {
          bg: isDarkMode ? "bg-emerald-950/40" : "bg-emerald-50",
          text: "text-emerald-500",
          border: "border-emerald-500/30",
          badgeBg: "bg-emerald-500",
          gauge: "stroke-emerald-500"
        };
    }
  };

  const riskStyle = getRiskColor(report?.riskLevel || "low");

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`p-6 rounded-[24px] border transition-all ${
        isDarkMode 
          ? "bg-slate-900 border-slate-800/80 shadow-xs" 
          : "bg-white border-[#E2E8F0] shadow-xs"
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md ${
                isDarkMode ? "bg-indigo-950 text-indigo-300" : "bg-[#EEF2FF] text-[#3F51B5]"
              }`}>
                {project.genre}
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md ${
                isDarkMode ? "bg-slate-850 text-slate-300" : "bg-slate-100 text-[#64748B]"
              }`}>
                {project.serializationCycle === 'weekly' ? '주간 연재' : project.serializationCycle === 'biweekly' ? '격주 연재' : project.serializationCycle === 'monthly' ? '월간 연재' : '비정기 연재'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              {project.title}
            </h1>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-[#64748B]"}`}>
              현재 연재 마감까지 <span className="font-bold text-[#3F51B5] dark:text-indigo-400">D-{daysRemaining}일</span> 남았습니다. 차질 없는 완결을 위해 복선과 원고율을 점검하세요!
            </p>
          </div>
          <button
            onClick={() => onNavigate("projects")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isDarkMode 
                ? "bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-200" 
                : "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] font-bold"
            }`}
          >
            작품 변경 / 수정
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "원고 진행률",
            value: `${project.progress}%`,
            desc: "수동 기록 기준",
            icon: Activity,
            color: "text-[#3F51B5] dark:text-indigo-400",
            bg: "bg-[#EEF2FF] dark:bg-indigo-950/40"
          },
          {
            title: "등록 회차",
            value: `${totalEpisodes}회`,
            desc: `완료 ${completedEpisodes}회 / 작업 ${ongoingEpisodes}회`,
            icon: BookOpen,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          },
          {
            title: "미해결 복선",
            value: `${unresolvedForeshadowings}개`,
            desc: `총 복선 ${totalForeshadowings}개`,
            icon: Sparkles,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
          },
          {
            title: "마감 D-Day",
            value: `D-${daysRemaining}`,
            desc: `목표: ${project.endDate}`,
            icon: Calendar,
            color: "text-red-500",
            bg: "bg-red-500/10"
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`p-5 rounded-[24px] border transition-all ${
              isDarkMode 
                ? "bg-slate-900 border-slate-800" 
                : "bg-white border-[#E2E8F0] shadow-xs"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase tracking-tight ${isDarkMode ? "text-slate-400" : "text-[#94A3B8]"}`}>
                {stat.title}
              </span>
              <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-black tracking-tight mb-1 text-slate-850 dark:text-white">
              {stat.value}
            </div>
            <div className={`text-[10px] font-medium leading-none ${isDarkMode ? "text-slate-500" : "text-[#64748B]"}`}>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Risk Status Card */}
        <div className={`lg:col-span-2 p-6 rounded-[24px] transition-all flex flex-col justify-between ${
          isDarkMode 
            ? "bg-slate-900 border border-slate-800 text-slate-100" 
            : "bg-[#3F51B5] text-white shadow-xl shadow-indigo-100/40"
        } space-y-5`}>
          
          <div className={`flex justify-between items-center pb-3 border-b ${
            isDarkMode ? "border-slate-800" : "border-indigo-400/40"
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isDarkMode ? "text-indigo-400" : "text-white"} animate-pulse`} />
              <h2 className="text-sm font-extrabold uppercase tracking-widest">AI 마감 리스크 예측 정보</h2>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase ${
              report?.riskLevel === 'high' 
                ? "bg-red-500 text-white" 
                : report?.riskLevel === 'medium' 
                ? "bg-amber-400 text-slate-950" 
                : "bg-emerald-400 text-slate-950"
            }`}>
              {report ? `${report.riskLevel.toUpperCase()} RISK` : "대기 중"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Visual Circular Risk Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className={isDarkMode ? "stroke-slate-800" : "stroke-indigo-800"}
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="50"
                  className={isDarkMode ? riskStyle.gauge : "stroke-amber-400"}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="314.16"
                  initial={{ strokeDashoffset: 314.16 }}
                  animate={{ strokeDashoffset: 314.16 - (314.16 * (report?.riskScore || 0)) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black tracking-tight">
                  {report ? report.riskScore : "0"}%
                </span>
                <span className={`text-[9px] block font-bold ${isDarkMode ? "text-slate-400" : "text-indigo-100"}`}>
                  위험 지수
                </span>
              </div>
            </div>

            {/* Risk Explanation summary */}
            <div className="flex-1 space-y-2.5">
              <h3 className="text-sm font-bold tracking-tight">
                {report 
                  ? `위험 분석 결과: ${report.riskLevel === 'high' ? '🚨 휴재 권고 단계 (위험)' : report.riskLevel === 'medium' ? '⚠️ 주의가 필요한 마감 흐름' : '✅ 완벽한 주간 연재 흐름 (안전)'}` 
                  : "마감 지연 지수가 아직 분석되지 않았습니다."}
              </h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-indigo-50/90"}`}>
                {report 
                  ? report.summary 
                  : "현재 등록된 원고 진도와 복선 살포 데이터, 그리고 마감까지 남은 일정을 기준으로 ToonFlow AI가 세이브 고갈 위험도를 계산하여 드립니다."}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isAnalyzing
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-white hover:bg-indigo-50 text-[#3F51B5] shadow-xs"
                  }`}
                >
                  <Activity className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  {isAnalyzing ? "분석 연산 중..." : "실시간 리스크 예측 분석"}
                </button>
                <button
                  onClick={() => onNavigate("ai_analysis")}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer ${
                    isDarkMode 
                      ? "border-slate-800 text-slate-300 hover:bg-slate-800" 
                      : "border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  상세 가이드
                </button>
              </div>
            </div>
          </div>

          {/* Quick recommendations list if available */}
          {report && report.suggestions.length > 0 && (
            <div className={`p-3.5 rounded-xl border ${
              isDarkMode 
                ? "bg-slate-950/60 border-slate-850 text-slate-300" 
                : "bg-indigo-700/40 border-indigo-500/30 text-white"
            }`}>
              <span className={`text-xs font-extrabold block mb-1 ${
                isDarkMode ? "text-indigo-400" : "text-amber-300"
              }`}>
                💡 핵심 해결 권고사항:
              </span>
              <ul className="text-xs space-y-1 opacity-90 list-disc list-inside">
                {report.suggestions.slice(0, 2).map((s, idx) => (
                  <li key={idx} className="line-clamp-1">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Notification Log & Today's To-Dos */}
        <div className="space-y-6">
          {/* Today's Tasks Checklist */}
          <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"}`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#3F51B5] dark:text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">우선 마감 To-Do</h2>
              </div>
              <button 
                onClick={() => onNavigate("schedule")}
                className="text-xs text-[#3F51B5] dark:text-indigo-400 hover:underline font-bold flex items-center"
              >
                자세히 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingHighTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">마감 예정된 일이 없습니다. 완벽합니다! 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingHighTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors ${
                      isDarkMode ? "bg-slate-950 border-slate-800/80 hover:bg-slate-850/50" : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.status === "completed"}
                      onChange={() => onToggleTask(task.id)}
                      className="mt-0.5 h-4 w-4 rounded-sm text-[#3F51B5] focus:ring-[#3F51B5] border-slate-300 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold leading-tight ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                          task.priority === 'high' ? 'bg-red-500/10 text-red-500' : task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {task.priority === 'high' ? '긴급' : task.priority === 'medium' ? '보통' : '여유'}
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-0.5 font-medium">
                          <Clock className="w-2.5 h-2.5" /> 마감일: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Notifications Log */}
          <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"}`}>
            <div className="flex items-center gap-1.5 mb-4">
              <Bell className="w-4 h-4 text-[#3F51B5] dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">안전 알림 로그</h2>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-slate-400">수집된 로그 메시지가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notifications.slice(0, 5).map(notif => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                      notif.type === 'risk_increase' 
                        ? (isDarkMode ? 'bg-red-950/20 border-red-900/30 text-red-300' : 'bg-red-50 border-red-100 text-red-800') 
                        : notif.type === 'deadline' 
                        ? (isDarkMode ? 'bg-amber-950/20 border-amber-900/30 text-amber-300' : 'bg-amber-50 border-amber-100 text-amber-800') 
                        : (isDarkMode ? 'bg-slate-950 border-slate-850 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600')
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <div>
                      <p className="font-semibold">{notif.message}</p>
                      <span className="text-[9px] text-slate-400 block mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

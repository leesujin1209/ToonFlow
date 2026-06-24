import React, { useState } from "react";
import { Task } from "../types";
import { Plus, Trash2, Calendar, CheckCircle, Clock, Search, ListTodo, Filter, RefreshCw } from "lucide-react";

interface SchedulesProps {
  tasks: Task[];
  projectId: string;
  onCreateTask: (task: Omit<Task, "id" | "status">) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  isDarkMode: boolean;
}

export const Schedules: React.FC<SchedulesProps> = ({
  tasks,
  projectId,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  isDarkMode
}) => {
  const projectTasks = tasks.filter(t => t.projectId === projectId);

  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");

  // New task fields
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>("medium");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateTask({
      projectId,
      title,
      dueDate,
      priority
    });

    setTitle("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setPriority("medium");
    setIsCreating(false);
  };

  const toggleTaskStatus = (task: Task) => {
    onUpdateTask({
      ...task,
      status: task.status === "completed" ? "pending" : "completed"
    });
  };

  // Filter & Sort Logic
  const filteredTasks = projectTasks
    .filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
    });

  const pendingTasks = filteredTasks.filter(t => t.status === "pending");
  const completedTasks = filteredTasks.filter(t => t.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">연재 일정 & 할 일(To-Do) 관리</h1>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            회차별 데생, 채색, 펜선 및 식자 작업 등 세분화된 할 일을 마감 기한과 연동하여 스케줄링하고 차질을 방지합니다.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" /> 새 작업 카드 추가
        </button>
      </div>

      {/* New Task creation form collapse */}
      {isCreating && (
        <form 
          onSubmit={handleCreate}
          className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} shadow-md space-y-4 animate-fadeIn`}
        >
          <h3 className="text-sm font-bold">새 작업 일정 카드 생성</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">할 일 제목 (예: 2화 펜선 데생 작업)</label>
              <input 
                type="text" 
                placeholder="어떤 마감 작업을 완료해야 하나요?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">완료 시한 (마감일)</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">긴급성 (우선순위)</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className={`w-full p-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
                  isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <option value="high">🚨 즉시 실행 (High)</option>
                <option value="medium">⚡ 보통 기한 (Medium)</option>
                <option value="low">⚙️ 여유 완만 (Low)</option>
              </select>
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
              스케줄 추가
            </button>
          </div>
        </form>
      )}

      {/* Kanban Filters toolbar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="할 일 이름으로 기어 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              className={`p-1.5 rounded-lg border text-xs outline-hidden ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <option value="all">전체 중요도</option>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className={`p-1.5 rounded-lg border text-xs outline-hidden ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <option value="dueDate">기한 마감순</option>
              <option value="priority">중요 긴급순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board columns: Left Pending, Right Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column 1: PENDING TASKS */}
        <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-4`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/10 dark:border-slate-800 justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">진행 예정 / 작업 중</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full">
              {pendingTasks.length}개 대기
            </span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400">계획된 작업이 모두 끝났습니다! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingTasks.map(task => (
                <div 
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isDarkMode ? "bg-slate-950 border-slate-800/60 hover:bg-slate-800/20" : "bg-slate-50 border-slate-200 hover:bg-slate-100/40"
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleTaskStatus(task)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-sm cursor-pointer"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-normal truncate">{task.title}</p>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase ${
                        task.priority === 'high' ? 'bg-red-500/15 text-red-500' : task.priority === 'medium' ? 'bg-amber-500/15 text-amber-500' : 'bg-slate-500/15 text-slate-500'
                      }`}>
                        {task.priority === 'high' ? '높음' : task.priority === 'medium' ? '보통' : '낮음'}
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> 기한: {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded-lg border border-slate-800/10 dark:border-slate-800 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: COMPLETED TASKS */}
        <div className={`p-5 rounded-[24px] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-[#E2E8F0] shadow-xs"} space-y-4`}>
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/10 dark:border-slate-800 justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">원고 완료 목록</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full">
              {completedTasks.length}개 해결
            </span>
          </div>

          {completedTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-slate-400">아직 원고 완료 목록이 비어 있습니다.</p>
            </div>
          ) : (
            <div className="space-y-2.5 opacity-85">
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    isDarkMode ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleTaskStatus(task)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-sm cursor-pointer"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-normal text-slate-500 line-through truncate">{task.title}</p>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span className="text-[9px] font-bold bg-slate-500/10 text-slate-400 px-1.5 py-0.5 rounded-sm">완료됨</span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3" /> 마감일: {task.dueDate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 rounded-lg border border-slate-800/10 dark:border-slate-800 text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

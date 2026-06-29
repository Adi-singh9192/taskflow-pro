import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { Board, Task } from '../types';
import toast from 'react-hot-toast';
import { Plus, MoreHorizontal, Calendar, Clock, Sparkles, X, Trash2, ChevronLeft, Award, ShieldCheck, Flame } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { CompletionSubmissionModal } from '../components/rewards/CompletionSubmissionModal';
import { VerificationResultModal } from '../components/rewards/VerificationResultModal';

const COLUMNS = ["To Do", "In Progress", "Review", "Done"] as const;
type Column = typeof COLUMNS[number];

export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Reward Engine Modals State
  const [taskToVerify, setTaskToVerify] = useState<Task | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Column>("To Do");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [dueDate, setDueDate] = useState('');
  const [estimatedEffort, setEstimatedEffort] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    fetchBoardAndTasks();
  }, [id]);

  const fetchBoardAndTasks = async () => {
    try {
      const [boardRes, tasksRes] = await Promise.all([
        api.get(`/boards/${id}`),
        api.get(`/tasks/board/${id}`)
      ]);
      setBoard(boardRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error('Failed to load board data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, column: Column) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === column) return;

    // Optimistic update
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: column } : t));
    
    try {
      await api.put(`/tasks/${taskId}`, { ...task, status: column });
    } catch (err) {
      toast.error('Failed to move task');
      fetchBoardAndTasks(); // Revert on failure
    }
  };

  const openTaskModal = (task?: Task, col?: Column) => {
    if (task) {
      setSelectedTask(task);
      setIsCreating(false);
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status as Column);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setEstimatedEffort(task.estimatedEffort || '');
    } else {
      setSelectedTask(null);
      setIsCreating(true);
      setTitle('');
      setDescription('');
      setStatus(col || "To Do");
      setPriority("Medium");
      setDueDate('');
      setEstimatedEffort('');
    }
    setIsModalOpen(true);
  };

  const saveTask = async () => {
    if (!title.trim()) return toast.error('Title is required');
    try {
      const payload = { title, description, status, priority, dueDate, estimatedEffort };
      if (isCreating) {
        await api.post(`/tasks/board/${id}`, payload);
        toast.success('Task created');
      } else if (selectedTask) {
        await api.put(`/tasks/${selectedTask._id}`, payload);
        toast.success('Task updated');
      }
      setIsModalOpen(false);
      fetchBoardAndTasks();
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      setIsModalOpen(false);
      fetchBoardAndTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const suggestEstimate = async () => {
    if (!title.trim()) return toast.error('Please enter a title first');
    setIsAILoading(true);
    try {
      const { data } = await api.post('/ai/suggest-estimate', { title, description });
      if (data.estimatedEffort) setEstimatedEffort(data.estimatedEffort);
      if (data.dueDate) setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
      toast.success(data.reasoning || 'AI Suggestion applied');
    } catch (err) {
      toast.error('AI suggestion failed');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleOpenSubmitProof = (task: Task, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTaskToVerify(task);
    setIsSubmitModalOpen(true);
  };

  const handleVerificationSuccess = (result: any) => {
    setIsSubmitModalOpen(false);
    setVerificationResult(result);
    setIsResultModalOpen(true);
    fetchBoardAndTasks();
    if (isModalOpen) setIsModalOpen(false);
  };

  const priorityColors = {
    Low: 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)]',
    Medium: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20',
    High: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border-[var(--color-secondary)]/20',
  };

  if (isLoading) return <div className="p-12 text-center text-[var(--color-text-muted)]">Loading board...</div>;

  return (
    <div className="h-full flex flex-col absolute inset-0 bg-[var(--color-background)]">
      <div className="px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row sm:items-end justify-between shrink-0 gap-4">
        <div>
          <button 
            onClick={() => navigate('/boards')}
            className="md:hidden flex items-center gap-1 text-[var(--color-text-muted)] mb-3 text-sm hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Boards
          </button>
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-[var(--color-text-muted)] mb-1 md:mb-2 uppercase tracking-widest font-semibold">
            <span className="hidden sm:inline">Projects</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-[var(--color-primary)]">{board?.title || 'Loading'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter font-heading">{board?.title}</h1>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-500 border-2 border-[var(--color-background)]"></div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-purple-500 border-2 border-[var(--color-background)]"></div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500 border-2 border-[var(--color-background)]"></div>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--color-border)] border-2 border-[var(--color-background)] flex items-center justify-center text-[10px] text-[var(--color-text-muted)]">+4</div>
          </div>
          <Button onClick={() => openTaskModal()} size="sm" className="md:h-10 md:px-4 shadow-[0_0_15px_rgba(232,255,0,0.3)] hover:shadow-[0_0_20px_rgba(232,255,0,0.5)] transition-all shrink-0">
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 px-4 md:px-8 pb-24 md:pb-8 overflow-x-auto overflow-y-hidden">
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 h-full min-w-max md:min-w-0">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter(t => t.status === col || (col === 'Done' && t.status === 'Verified Completed'));
            let dotColor = 'bg-[var(--color-text-muted)]';
            if (col === 'In Progress') dotColor = 'bg-blue-500';
            if (col === 'Review') dotColor = 'bg-yellow-500';
            if (col === 'Done') dotColor = 'bg-[var(--color-success)]';

            return (
              <div 
                key={col} 
                className="flex flex-col gap-3 md:gap-4 w-[280px] md:w-auto shrink-0 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
              >
                <div className="flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", dotColor)}></div>
                    <span className="text-xs font-bold uppercase tracking-wider">{col}</span>
                    <span className="text-[10px] bg-[var(--color-card)] px-1.5 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-muted)]">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button onClick={() => openTaskModal(undefined, col)} className="text-[var(--color-text-muted)] hover:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 h-full overflow-hidden overflow-y-auto pr-1 md:pr-2 pb-4">
                  {columnTasks.map(task => (
                    <div 
                      key={task._id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => openTaskModal(task)}
                      className={cn(
                        "p-3 md:p-4 bg-[var(--color-card)] border rounded-xl hover:border-[var(--color-primary)] transition-all cursor-grab active:cursor-grabbing shadow-lg shrink-0",
                        col === 'In Progress' ? "bg-gradient-to-b from-[var(--color-hover)] to-[var(--color-card)] border-[var(--color-primary)]/30 shadow-2xl" : "border-[var(--color-border)]",
                        col === 'Done' ? "opacity-60 border-dashed border-[var(--color-border)]" : ""
                      )}
                    >
                      <div className={cn("flex justify-between items-start mb-2 md:mb-3", col === 'Done' && 'opacity-40')}>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase",
                          task.priority === 'High' ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]" : 
                          task.priority === 'Medium' ? "bg-[var(--color-info)]/10 text-[var(--color-info)]" : 
                          "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                        )}>
                          {task.priority === 'High' ? 'Critical' : task.priority === 'Medium' ? 'Feature' : 'Task'}
                        </span>
                        {task.estimatedEffort && (
                          <span className="text-[9px] md:text-[10px] font-mono text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded truncate max-w-[80px]">
                            AI: {task.estimatedEffort}
                          </span>
                        )}
                      </div>
                      
                      <h3 className={cn("text-sm font-semibold mb-1 md:mb-2 line-clamp-2", col === 'Done' && "text-[var(--color-text-muted)] line-through")}>
                        {task.title}
                      </h3>
                      
                      {task.description && col !== 'Done' && (
                        <p className="text-[11px] md:text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3 md:mb-4">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-col gap-2 mt-2 md:mt-3">
                        {task.status === 'Verified Completed' ? (
                          <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-[var(--color-primary)] font-mono font-bold bg-[rgba(232,255,0,0.1)] border border-[rgba(232,255,0,0.2)] px-2 py-0.5 rounded">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              VERIFIED (+{task.verificationResult?.reward?.xp || 0} XP)
                            </div>
                            {task.verificationResult?.reward?.badge && (
                              <div className="text-[8px] text-[var(--color-secondary)] font-bold uppercase tracking-widest pl-1">
                                🏆 Badge: {task.verificationResult.reward.badge}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            {col === 'Done' ? (
                              <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] text-[var(--color-success)] font-mono">
                                <Clock className="w-3 h-3" />
                                COMPLETED
                              </div>
                            ) : (
                              <>
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-400 shrink-0"></div>
                                {task.dueDate && (
                                  <div className="text-[9px] md:text-[10px] text-[var(--color-text-muted)] font-mono truncate">
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </div>
                                )}
                              </>
                            )}

                            {(col === 'Review' || col === 'Done' || col === 'In Progress') && (
                              <button
                                onClick={(e) => handleOpenSubmitProof(task, e)}
                                className="flex items-center gap-1 text-[9px] md:text-[10px] text-black font-extrabold bg-[var(--color-primary)] px-2 py-1 rounded-md hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-[0_0_8px_rgba(232,255,0,0.25)]"
                              >
                                <Award className="w-3 h-3" />
                                Submit (AI)
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Quick Stats Bar (Floating Footer style) */}
      <div className="hidden md:flex h-12 border-t border-[var(--color-border)] bg-[var(--color-card)]/30 backdrop-blur-md items-center justify-between px-8 text-[10px] text-[var(--color-text-muted)] font-mono tracking-tight uppercase shrink-0 z-20">
        <div className="flex gap-6">
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"></span> AI EFFORT: {tasks.filter(t => t.estimatedEffort).length} ESTIMATED</div>
          <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[var(--color-secondary)] rounded-full"></span> TOTAL TASKS: {tasks.length}</div>
        </div>
        <div className="flex gap-4">
          <span className="text-[var(--color-primary)]">● SYSTEM ONLINE</span>
          <span>LATENCY: 24MS</span>
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              <Card className="flex flex-col bg-[var(--color-background)] overflow-hidden h-full max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] shrink-0">
                  <h2 className="font-heading font-bold text-lg">{isCreating ? 'New Task' : 'Edit Task'}</h2>
                  <div className="flex gap-2">
                    {!isCreating && (
                      <button onClick={() => selectedTask && deleteTask(selectedTask._id)} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors rounded-lg hover:bg-[var(--color-hover)]">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:text-white transition-colors rounded-lg hover:bg-[var(--color-hover)]">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex-1 space-y-4">
                      <Input
                        label="Task Title"
                        placeholder="E.g., Design landing page"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Description</label>
                        <textarea
                          className="w-full h-24 md:h-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] resize-none"
                          placeholder="Add more details..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-64 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Status</label>
                        <select
                          className="w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                          value={status}
                          onChange={(e) => setStatus(e.target.value as Column)}
                        >
                          {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Priority</label>
                        <select
                          className="w-full h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      <Input
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />

                      <Input
                        label="Estimated Effort"
                        placeholder="e.g. 2 hours, 1d"
                        value={estimatedEffort}
                        onChange={(e) => setEstimatedEffort(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
                  <Button 
                    variant="secondary" 
                    onClick={suggestEstimate}
                    disabled={isAILoading || !title.trim()}
                    className="w-full sm:w-auto gap-2 border-[var(--color-secondary)]/30 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAILoading ? 'Thinking...' : 'AI Suggestion'}
                  </Button>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1 sm:flex-none" onClick={saveTask}>Save Task</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reward Engine Verification Modals */}
      {isSubmitModalOpen && taskToVerify && (
        <CompletionSubmissionModal
          task={taskToVerify}
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSuccess={handleVerificationSuccess}
        />
      )}

      {isResultModalOpen && verificationResult && (
        <VerificationResultModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          result={verificationResult}
        />
      )}
    </div>
  );
}

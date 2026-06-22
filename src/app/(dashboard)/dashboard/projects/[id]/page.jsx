"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { useProject, useProjectMutations } from "@/lib/hooks/useProjects";
import { useTasksByProject, useTaskMutations } from "@/lib/hooks/useTasks";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import Drawer from "@/components/ui/Drawer";
import ProjectForm from "@/components/projects/ProjectForm";
import TaskForm from "@/components/tasks/TaskForm";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  formatDate,
  getPriority,
  priorityStyles,
} from "@/lib/utils/formatters";
import { useState } from "react";

export default function ProjectDetailPage() {
  const { id } = useParams();

  if (!id || Array.isArray(id)) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-stone-500">
          Invalid project runtime context.
        </p>
      </div>
    );
  }

  return <ProjectDetailContainer id={id} />;
}

// Component: ProjectDetailContainer
function ProjectDetailContainer({ id }) {
  const router = useRouter();

  const { project, loading, refetch } = useProject(id);
  const {
    tasks,
    loading: tasksLoading,
    refetch: refetchTasks,
  } = useTasksByProject(id);
  const { update: updateProject, mutating: projectMutating } =
    useProjectMutations();
  const {
    create: createTask,
    update: updateTask,
    remove: removeTask,
    mutating: taskMutating,
  } = useTaskMutations();

  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [confirmTaskId, setConfirmTaskId] = useState(null);

  async function handleProjectSubmit(formData) {
    await updateProject(id, formData);
    await refetch();
    setProjectDrawerOpen(false);
  }

  async function handleTaskSubmit(formData) {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await createTask({ ...formData, project_id: id });
    }
    await refetchTasks();
    setTaskDrawerOpen(false);
    setEditingTask(null);
  }

  async function handleDeleteTask() {
    await removeTask(confirmTaskId);
    await refetchTasks();
    setConfirmTaskId(null);
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setTaskDrawerOpen(true);
  }

  function handleAddTask() {
    setEditingTask(null);
    setTaskDrawerOpen(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <p className="text-sm text-stone-500">Syncing project schema...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 max-w-sm mx-auto text-center">
        <p className="text-sm text-stone-500 bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-xl">
          Project records could not be resolved.
        </p>
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-4 h-9 rounded-xl border border-amber-500/10 transition-all active:scale-95"
        >
          <ArrowLeft size={14} />
          Return to Projects
        </button>
      </div>
    );
  }

  const priority = getPriority(project.due_date);
  const totalTasks = tasks?.length ?? 0;
  const doneTasks = tasks?.filter((t) => t.status === "done").length ?? 0;
  const inProgressTasks =
    tasks?.filter((t) => t.status === "in_progress").length ?? 0;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Project Header */}
      <div className="flex items-start justify-between flex-wrap gap-6 pb-6 border-b border-stone-900/60">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-200 transition-colors group w-fit"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Back to projects</span>
          </button>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-stone-100 tracking-tight">
                {project.name}
              </h1>
              <Badge
                label={project.status.replace("_", " ")}
                variant={project.status}
              />
              {priority !== "none" && (
                <span
                  className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md font-bold border ${priorityStyles[priority]}`}
                >
                  {priority}
                </span>
              )}
            </div>

            {project.clients?.name && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                <User size={13} className="text-stone-600" />
                <span className="text-stone-400 hover:text-amber-500 cursor-pointer transition-colors">
                  {project.clients.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setProjectDrawerOpen(true)}
          className="px-4 h-9 bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-500 hover:border-amber-500/30 text-xs font-semibold rounded-xl transition-all active:scale-95"
        >
          Edit Project Details
        </button>
      </div>

      {/* Project Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={totalTasks} variant="stone" />
        <StatCard
          label="In Progress"
          value={inProgressTasks}
          variant="active"
        />
        <StatCard
          label="Completed Tasks"
          value={doneTasks}
          variant="completed"
        />
        <StatCard
          label="Total Completion"
          value={`${progress}%`}
          variant="progress"
        />
      </div>

      {/* Project Information Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-stone-900/30 border border-stone-900/80 rounded-2xl p-5 flex flex-col gap-5 backdrop-blur-sm">
            <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">
              Project Ledger
            </h2>

            <div className="flex flex-col gap-4">
              {project.start_date && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-950/60 border border-stone-900 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Initiated
                    </p>
                    <p className="text-sm text-stone-300 font-medium mt-0.5">
                      {formatDate(project.start_date)}
                    </p>
                  </div>
                </div>
              )}

              {project.due_date && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-950/60 border border-stone-900 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Deadline Target
                    </p>
                    <p className="text-sm text-stone-300 font-medium mt-0.5">
                      {formatDate(project.due_date)}
                    </p>
                  </div>
                </div>
              )}

              {project.clients?.name && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-950/60 border border-stone-900 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                      Account Client
                    </p>
                    <p className="text-sm text-stone-300 font-medium mt-0.5">
                      {project.clients.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Overview */}
            {totalTasks > 0 && (
              <div className="pt-4 border-t border-stone-900/60">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-stone-500">
                    Velocity Metric
                  </p>
                  <p className="text-xs font-bold text-stone-400">
                    {progress}% Ratio
                  </p>
                </div>
                <div className="h-1.5 bg-stone-950 rounded-full overflow-hidden p-[1px] border border-stone-900">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Scope Details */}
            {project.details && (
              <div className="pt-4 border-t border-stone-900/60 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-stone-600" />
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                    Scope Details
                  </p>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed font-medium bg-stone-950/40 p-3 rounded-xl border border-stone-900/40 break-words">
                  {project.details}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4 self-stretch">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-stone-400 tracking-wider uppercase">
                Task Execution Backlog
              </h2>
              <span className="text-[10px] font-bold text-stone-500 bg-stone-900/60 px-2 py-0.5 rounded-md border border-stone-800/40">
                {totalTasks}
              </span>
            </div>

            <button
              onClick={handleAddTask}
              className="flex items-center gap-1.5 px-3 h-8 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/5"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Append Task</span>
            </button>
          </div>

          {tasksLoading ? (
            <div className="text-xs text-stone-500 italic py-6">
              Re-indexing backlog maps...
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No active issues mapped"
              description="Break this deployment layout down into actionable execution blocks."
            />
          ) : (
            <div className="flex flex-col bg-stone-900/10 border border-stone-900/80 rounded-2xl overflow-hidden backdrop-blur-sm">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-stone-900/40 transition-all group gap-4
                    ${index !== tasks.length - 1 ? "border-b border-stone-900/50" : ""}`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-200 tracking-tight break-words pr-2">
                      {task.title}
                    </p>
                    {task.due_date && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <span className="w-1 h-1 rounded-full bg-stone-700" />
                        <span>Due {formatDate(task.due_date)}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <Badge
                      label={task.status.replace("_", " ")}
                      variant={task.status}
                    />

                    <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity duration-150 border-l border-stone-900 pl-3">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1.5 text-stone-500 hover:text-amber-500 rounded-md hover:bg-stone-900 transition-colors"
                        title="Edit task parameters"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmTaskId(task.id)}
                        className="p-1.5 text-stone-500 hover:text-red-400 rounded-md hover:bg-stone-900 transition-colors"
                        title="Purge task statement"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- DRAWERS & CONTEXT ACTION FLOWS --- */}
      <Drawer
        open={projectDrawerOpen}
        onClose={() => setProjectDrawerOpen(false)}
        title="Edit project"
      >
        <ProjectForm
          initial={project}
          onSubmit={handleProjectSubmit}
          onCancel={() => setProjectDrawerOpen(false)}
          loading={projectMutating}
        />
      </Drawer>

      <Drawer
        open={taskDrawerOpen}
        onClose={() => {
          setTaskDrawerOpen(false);
          setEditingTask(null);
        }}
        title={editingTask ? "Edit task" : "Add task"}
      >
        <TaskForm
          initial={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setTaskDrawerOpen(false);
            setEditingTask(null);
          }}
          loading={taskMutating}
        />
      </Drawer>

      <ConfirmDialog
        open={!!confirmTaskId}
        title="Delete task?"
        description="This action cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmTaskId(null)}
        loading={taskMutating}
      />
    </div>
  );
}

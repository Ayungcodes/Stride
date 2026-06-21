"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTasks,
  getTaskById,
  getTasksByProject,
  getStandaloneTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/queries/tasks";

// ─── USE TASKS ────────────────────────────────────────────────
// Fetches all tasks for the logged-in freelancer.
// Use this on the /tasks page.
//
// Usage:
//   const { tasks, loading, error, refetch } = useTasks()

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ─── USE TASKS BY PROJECT ─────────────────────────────────────
// Fetches all tasks linked to a specific project.
// Use this on the /projects/[id] detail page.
//
// Usage:
//   const { tasks, loading, error, refetch } = useTasksByProject(projectId)

export function useTasksByProject(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getTasksByProject(projectId);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ─── USE STANDALONE TASKS ─────────────────────────────────────
// Fetches only tasks that are not linked to any project.
// Useful for a personal to-dos section on the dashboard overview.
//
// Usage:
//   const { tasks, loading, error } = useStandaloneTasks()

export function useStandaloneTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStandaloneTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// ─── USE TASK MUTATIONS ───────────────────────────────────────
// Returns create, update, and delete functions.
// Pass project_id when creating a task under a project,
// leave it out for a standalone task.
//
// Usage:
//   const { create, update, remove, mutating, error } = useTaskMutations()
//   await create({ title, description, status, due_date, project_id })

export function useTaskMutations() {
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (taskData) => {
    try {
      setMutating(true);
      setError(null);
      const newTask = await createTask(taskData);
      return newTask;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setMutating(false);
    }
  }, []);

  const update = useCallback(async (id, updates) => {
    try {
      setMutating(true);
      setError(null);
      const updated = await updateTask(id, updates);
      return updated;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setMutating(false);
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      setMutating(true);
      setError(null);
      await deleteTask(id);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  return { create, update, remove, mutating, error };
}

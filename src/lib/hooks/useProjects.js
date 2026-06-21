"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProjects,
  getProjectById,
  getProjectsByClient,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/queries/projects";
import { getPriority } from "@/lib/utils/formatters";

// ─── USE PROJECTS ─────────────────────────────────────────────
// Fetches all projects, with priority computed from due_date.
// Use this on the /projects page.
//
// Usage:
//   const { projects, loading, error, refetch } = useProjects()

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects();

      // Compute priority on the frontend from due_date
      const withPriority = data.map((project) => ({
        ...project,
        priority: getPriority(project.due_date),
      }));

      setProjects(withPriority);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

// ─── USE PROJECT ──────────────────────────────────────────────
// Fetches a single project by ID, with its client and tasks.
// Use this on the /projects/[id] detail page.
//
// Usage:
//   const { project, loading, error, refetch } = useProject(id)

export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectById(id);
      setProject({
        ...data,
        priority: getPriority(data.due_date),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
}

// ─── USE PROJECTS BY CLIENT ───────────────────────────────────
// Fetches all projects linked to a specific client.
// Use this on the /clients/[id] detail page.
//
// Usage:
//   const { projects, loading, error } = useProjectsByClient(clientId)

export function useProjectsByClient(clientId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getProjectsByClient(clientId);
      const withPriority = data.map((p) => ({
        ...p,
        priority: getPriority(p.due_date),
      }));
      setProjects(withPriority);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

// ─── USE PROJECT MUTATIONS ────────────────────────────────────
// Returns create, update, and delete functions.
// Use these inside forms and action buttons.
//
// Usage:
//   const { create, update, remove, mutating, error } = useProjectMutations()

export function useProjectMutations() {
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (projectData) => {
    try {
      setMutating(true);
      setError(null);
      const newProject = await createProject(projectData);
      return newProject;
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
      const updated = await updateProject(id, updates);
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
      await deleteProject(id);
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

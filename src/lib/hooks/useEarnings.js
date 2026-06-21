"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getEarningsByYear,
  getEarningsByMonth,
  getEarningYears,
  createEarning,
  updateEarning,
  deleteEarning,
} from "@/lib/queries/earnings";

// ─── USE EARNINGS BY YEAR ─────────────────────────────────────
// Fetches monthly totals for a given year — powers the graph.
// Defaults to the current year.
//
// Usage:
//   const { earnings, loading, error } = useEarningsByYear(2025)

export function useEarningsByYear(year = new Date().getFullYear()) {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEarningsByYear(year);
      setEarnings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { earnings, loading, error, refetch: fetchEarnings };
}

// ─── USE EARNINGS BY MONTH ────────────────────────────────────
// Fetches individual earning entries for a specific month.
// Used when a user clicks a month to see the full breakdown.
//
// Usage:
//   const { earnings, total, loading, error } = useEarningsByMonth(2025, 6)

export function useEarningsByMonth(year, month) {
  const [earnings, setEarnings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async () => {
    if (!year || !month) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getEarningsByMonth(year, month);
      setEarnings(data);

      // Compute the month total on the frontend
      const monthTotal = data.reduce((sum, e) => sum + Number(e.amount), 0);
      setTotal(monthTotal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { earnings, total, loading, error, refetch: fetchEarnings };
}

// ─── USE EARNING YEARS ────────────────────────────────────────
// Fetches the list of years that have earnings entries.
// Used to populate the year selector on the analytics page.
//
// Usage:
//   const { years, loading } = useEarningYears()

export function useEarningYears() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchYears() {
      try {
        setLoading(true);
        const data = await getEarningYears();
        setYears(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchYears();
  }, []);

  return { years, loading, error };
}

// ─── USE EARNING MUTATIONS ────────────────────────────────────
// Returns create, update, and delete functions.
// After creating or deleting, call refetch() from useEarningsByYear
// to update the graph.
//
// Usage:
//   const { create, update, remove, mutating, error } = useEarningMutations()
//   await create({ amount, description, date, project_id })

export function useEarningMutations() {
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (earningData) => {
    try {
      setMutating(true);
      setError(null);
      const newEarning = await createEarning(earningData);
      return newEarning;
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
      const updated = await updateEarning(id, updates);
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
      await deleteEarning(id);
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

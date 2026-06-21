"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getClients,
  getClientById,
  createClient_,
  updateClient,
  deleteClient,
} from "@/lib/queries/clients";

// ─── USE CLIENTS ──────────────────────────────────────────────
// Fetches all clients for the logged-in freelancer.
// Use this on the /clients page.
//
// Usage:
//   const { clients, loading, error, refetch } = useClients()

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}

// ─── USE CLIENT ───────────────────────────────────────────────
// Fetches a single client by ID, including their linked projects.
// Use this on the /clients/[id] detail page.
//
// Usage:
//   const { client, loading, error, refetch } = useClient(id)

export function useClient(id) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClient = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getClientById(id);
      setClient(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return { client, loading, error, refetch: fetchClient };
}

// ─── USE CLIENT MUTATIONS ─────────────────────────────────────
// Returns create, update, and delete functions with their own
// loading and error states. Use these for forms and action buttons.
//
// Usage:
//   const { createClient, updating, error } = useClientMutations()
//   await createClient({ name, email, phone, address, notes })

export function useClientMutations() {
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (clientData) => {
    try {
      setMutating(true);
      setError(null);
      const newClient = await createClient_(clientData);
      return newClient;
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
      const updated = await updateClient(id, updates);
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
      await deleteClient(id);
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

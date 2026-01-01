import { useEffect, useMemo, useReducer } from "react";
import { nanoid } from "nanoid";
import { loadState, saveState } from "@/lib/storage";
import type { CallFilters, CallLog, CallStatus } from "@/lib/types";

interface State {
  calls: CallLog[];
  filters: CallFilters;
}

type Action =
  | { type: "add-call"; payload: Omit<CallLog, "id" | "createdAt"> }
  | { type: "update-status"; payload: { id: string; status: CallStatus } }
  | { type: "update-notes"; payload: { id: string; notes: string; followUpAction?: string } }
  | { type: "reschedule"; payload: { id: string; scheduledAt?: string } }
  | { type: "set-filters"; payload: Partial<CallFilters> }
  | { type: "seed"; payload: State };

const STORAGE_VERSION = 1;

const defaultState: State = {
  calls: [],
  filters: {
    search: "",
    status: "all",
    direction: "all",
    tag: "all",
    priority: "all"
  }
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "seed":
      return action.payload;
    case "add-call": {
      const call: CallLog = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      return { ...state, calls: [call, ...state.calls] };
    }
    case "update-status":
      return {
        ...state,
        calls: state.calls.map((call) =>
          call.id === action.payload.id ? { ...call, status: action.payload.status } : call
        )
      };
    case "update-notes":
      return {
        ...state,
        calls: state.calls.map((call) =>
          call.id === action.payload.id
            ? {
                ...call,
                notes: action.payload.notes,
                followUpAction: action.payload.followUpAction ?? call.followUpAction
              }
            : call
        )
      };
    case "reschedule":
      return {
        ...state,
        calls: state.calls.map((call) =>
          call.id === action.payload.id
            ? { ...call, scheduledAt: action.payload.scheduledAt ?? undefined }
            : call
        )
      };
    case "set-filters":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    default:
      return state;
  }
}

function seedState(state: State): State {
  if (state.calls.length > 0) return state;
  return {
    ...state,
    calls: [
      {
        id: nanoid(),
        contactName: "Priya Sharma",
        phoneNumber: "+91 98765 43210",
        direction: "incoming",
        status: "in-progress",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        durationMinutes: 12,
        tags: ["sales", "demo"],
        notes: "Discussed product demo. Needs follow-up deck.",
        followUpAction: "Send product deck and pricing breakdown",
        priority: "high"
      },
      {
        id: nanoid(),
        contactName: "Rahul Gupta",
        phoneNumber: "+91 91234 56789",
        direction: "outgoing",
        status: "scheduled",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        durationMinutes: undefined,
        tags: ["support"],
        notes: "Follow-up on support ticket #4829",
        followUpAction: "Prepare resolution summary",
        priority: "medium"
      },
      {
        id: nanoid(),
        contactName: "Neha Verma",
        phoneNumber: "+91 90123 45678",
        direction: "incoming",
        status: "completed",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        durationMinutes: 22,
        tags: ["vip"],
        notes: "Closed annual renewal. Happy with new features.",
        followUpAction: "Schedule QBR in 3 months",
        priority: "low"
      }
    ]
  };
}

export function useCallStore() {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    const persisted = loadState<State>(defaultState, STORAGE_VERSION);
    dispatch({ type: "seed", payload: seedState(persisted) });
  }, []);

  useEffect(() => {
    saveState(state, STORAGE_VERSION);
  }, [state]);

  const filteredCalls = useMemo(() => {
    const { search, status, direction, tag, priority } = state.filters;
    return state.calls.filter((call) => {
      if (status !== "all" && call.status !== status) return false;
      if (direction !== "all" && call.direction !== direction) return false;
      if (tag !== "all" && !call.tags.includes(tag)) return false;
      if (priority !== "all" && call.priority !== priority) return false;
      const normalized = `${call.contactName} ${call.phoneNumber} ${call.notes} ${call.tags.join(" ")}`.toLowerCase();
      return normalized.includes(search.toLowerCase());
    });
  }, [state.calls, state.filters]);

  const activeTags = useMemo(() => {
    const set = new Set<string>();
    state.calls.forEach((call) => call.tags.forEach((tag) => set.add(tag)));
    return Array.from(set.values()).sort();
  }, [state.calls]);

  return {
    state,
    filteredCalls,
    activeTags,
    addCall: (payload: Omit<CallLog, "id" | "createdAt">) =>
      dispatch({ type: "add-call", payload }),
    updateStatus: (id: string, status: CallStatus) =>
      dispatch({ type: "update-status", payload: { id, status } }),
    updateNotes: (id: string, notes: string, followUpAction?: string) =>
      dispatch({ type: "update-notes", payload: { id, notes, followUpAction } }),
    reschedule: (id: string, scheduledAt?: string) =>
      dispatch({ type: "reschedule", payload: { id, scheduledAt } }),
    setFilters: (filters: Partial<CallFilters>) => dispatch({ type: "set-filters", payload: filters })
  };
}

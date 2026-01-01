import type { CallFilters, CallLog } from "@/lib/types";

interface FilterToolbarProps {
  filters: CallFilters;
  tags: string[];
  onChange: (filters: Partial<CallFilters>) => void;
}

const statusOptions: { value: CallFilters["status"]; label: string }[] = [
  { value: "all", label: "सभी" },
  { value: "new", label: "नई" },
  { value: "in-progress", label: "चल रही" },
  { value: "scheduled", label: "शेड्यूल्ड" },
  { value: "completed", label: "पूरी" }
];

const directionOptions: { value: CallFilters["direction"]; label: string }[] = [
  { value: "all", label: "सभी" },
  { value: "incoming", label: "इनकमिंग" },
  { value: "outgoing", label: "आउटगोइंग" },
  { value: "missed", label: "मिस्ड" }
];

const priorityOptions: { value: CallLog["priority"] | "all"; label: string }[] = [
  { value: "all", label: "सभी" },
  { value: "high", label: "हाई" },
  { value: "medium", label: "मीडियम" },
  { value: "low", label: "लो" }
];

export function FilterToolbar({ filters, tags, onChange }: FilterToolbarProps) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white/80 p-4 shadow shadow-brand-900/5 ring-1 ring-slate-100 md:grid-cols-2 lg:grid-cols-5">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-500">
        सर्च
        <input
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="नाम, नंबर या नोट्स"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-500">
        स्टेटस
        <select
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value as CallFilters["status"] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-500">
        दिशा
        <select
          value={filters.direction}
          onChange={(event) =>
            onChange({ direction: event.target.value as CallFilters["direction"] })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {directionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-500">
        टैग
        <select
          value={filters.tag}
          onChange={(event) => onChange({ tag: event.target.value as CallFilters["tag"] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="all">सभी</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-500">
        प्राथमिकता
        <select
          value={filters.priority}
          onChange={(event) => onChange({ priority: event.target.value as CallFilters["priority"] })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

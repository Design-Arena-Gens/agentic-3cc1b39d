import { format, formatDistanceToNow } from "date-fns";
import { enIN } from "date-fns/locale";
import { clsx } from "clsx";
import { Badge } from "./ui/Badge";
import type { CallLog, CallStatus } from "@/lib/types";

interface CallCardProps {
  call: CallLog;
  onStatusChange: (status: CallStatus) => void;
  onUpdateNotes: (notes: string, followUpAction?: string) => void;
  onReschedule: (scheduledAt?: string) => void;
}

const statusLabels: Record<CallStatus, string> = {
  "new": "नई",
  "in-progress": "चल रही",
  "completed": "पूरी",
  "scheduled": "शेड्यूल्ड"
};

const directionLabels: Record<CallLog["direction"], string> = {
  incoming: "इनकमिंग",
  outgoing: "आउटगोइंग",
  missed: "मिस्ड"
};

const priorityColors: Record<CallLog["priority"], string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700"
};

export function CallCard({ call, onStatusChange, onUpdateNotes, onReschedule }: CallCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white/95 p-5 shadow-md shadow-brand-900/5 ring-1 ring-slate-100 backdrop-blur">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{call.contactName}</h3>
          <p className="text-sm text-slate-500">{call.phoneNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="gray">{directionLabels[call.direction]}</Badge>
          <Badge color="brand">{statusLabels[call.status]}</Badge>
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              priorityColors[call.priority]
            )}
          >
            {call.priority.toUpperCase()}
          </span>
        </div>
      </header>

      <dl className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">कॉल समय</dt>
          <dd>
            {format(new Date(call.createdAt), "dd MMM yyyy, hh:mm a", { locale: enIN })} (
            {formatDistanceToNow(new Date(call.createdAt), { addSuffix: true })})
          </dd>
        </div>
        {call.durationMinutes && (
          <div>
            <dt className="font-medium text-slate-500">अवधि</dt>
            <dd>{call.durationMinutes} मिनट</dd>
          </div>
        )}
        {call.scheduledAt && (
          <div>
            <dt className="font-medium text-slate-500">अगला फ़ॉलो-अप</dt>
            <dd>
              {format(new Date(call.scheduledAt), "dd MMM yyyy, hh:mm a", { locale: enIN })} (
              {formatDistanceToNow(new Date(call.scheduledAt), { addSuffix: true })})
            </dd>
          </div>
        )}
        {call.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <dt className="font-medium text-slate-500">टैग्स</dt>
            <dd className="flex flex-wrap gap-2">
              {call.tags.map((tag) => (
                <Badge key={tag} color="gray">
                  #{tag}
                </Badge>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {call.notes && (
        <section className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            नोट्स
          </h4>
          <p className="whitespace-pre-wrap leading-relaxed">{call.notes}</p>
        </section>
      )}

      {call.followUpAction && (
        <section className="rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            फ़ॉलो-अप एक्शन
          </h4>
          <p className="leading-relaxed">{call.followUpAction}</p>
        </section>
      )}

      <footer className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["new", "in-progress", "scheduled", "completed"] as CallStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                call.status === status
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600"
              )}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => {
              const input = window.prompt("नोट्स अपडेट करें", call.notes);
              if (input !== null) {
                const followUp = window.prompt(
                  "फ़ॉलो-अप एक्शन अपडेट करें",
                  call.followUpAction ?? ""
                );
                onUpdateNotes(input, followUp ?? undefined);
              }
            }}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
          >
            नोट्स एडिट करें
          </button>
          <button
            onClick={() => {
              const input = window.prompt(
                "अगला फ़ॉलो-अप समय (YYYY-MM-DD HH:MM)",
                call.scheduledAt
                  ? format(new Date(call.scheduledAt), "yyyy-MM-dd HH:mm")
                  : ""
              );
              if (input !== null) {
                if (!input.trim()) {
                  onReschedule(undefined);
                  return;
                }
                const candidate = new Date(input.replace(" ", "T"));
                if (Number.isNaN(candidate.getTime())) {
                  window.alert("समय सही नहीं है। कृपया YYYY-MM-DD HH:MM फॉर्मेट में डालें।");
                  return;
                }
                onReschedule(candidate.toISOString());
              }
            }}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition hover:border-brand-300 hover:text-brand-600"
          >
            फ़ॉलो-अप सेट करें
          </button>
        </div>
      </footer>
    </article>
  );
}

import { differenceInHours, isAfter } from "date-fns";
import { Badge } from "./ui/Badge";
import type { CallLog } from "@/lib/types";

interface StatsOverviewProps {
  calls: CallLog[];
}

const statusLabelMap: Record<CallLog["status"], string> = {
  "new": "नई",
  "in-progress": "चल रही",
  "completed": "पूरी",
  "scheduled": "शेड्यूल्ड"
};

export function StatsOverview({ calls }: StatsOverviewProps) {
  const totals = calls.length;
  const byStatus: Record<CallLog["status"], number> = {
    new: 0,
    "in-progress": 0,
    completed: 0,
    scheduled: 0
  };
  const overdue = calls.filter(
    (call) => call.scheduledAt && isAfter(new Date(), new Date(call.scheduledAt))
  ).length;
  const upcoming = calls.filter(
    (call) => call.scheduledAt && !isAfter(new Date(), new Date(call.scheduledAt))
  ).length;
  let totalDuration = 0;

  calls.forEach((call) => {
    byStatus[call.status] += 1;
    if (call.durationMinutes) {
      totalDuration += call.durationMinutes;
    }
  });

  const averageDuration = totals && totalDuration ? Math.round(totalDuration / totals) : 0;
  const fastFollowUps = calls.filter((call) => {
    if (!call.scheduledAt) return false;
    return differenceInHours(new Date(call.scheduledAt), new Date(call.createdAt)) <= 24;
  }).length;

  return (
    <section className="grid gap-4 rounded-3xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-slate-100 backdrop-blur md:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-sm font-medium text-slate-500">कुल कॉल</p>
        <p className="text-3xl font-semibold text-slate-900">{totals}</p>
        <p className="text-xs text-slate-400">आज तक रिकॉर्ड की गई कॉल्स</p>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">स्टेटस ब्रेकडाउन</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(byStatus) as CallLog["status"][]).map((status) => (
            <Badge key={status} color="gray">
              {statusLabelMap[status]} · {byStatus[status]}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">फ़ॉलो-अप हाइलाइट</p>
        <p className="text-2xl font-semibold text-slate-900">{upcoming}</p>
        <p className="text-xs text-slate-400">
          {overdue} देरी से · {fastFollowUps} तेज़ (24h के अंदर)
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-500">औसत कॉल अवधि</p>
        <p className="text-2xl font-semibold text-slate-900">
          {averageDuration ? `${averageDuration} मिनट` : "N/A"}
        </p>
        <p className="text-xs text-slate-400">नोटेड कॉल्स के आधार पर</p>
      </div>
    </section>
  );
}

"use client";

import { Suspense } from "react";
import { CallForm } from "@/components/CallForm";
import { CallCard } from "@/components/CallCard";
import { FilterToolbar } from "@/components/FilterToolbar";
import { StatsOverview } from "@/components/StatsOverview";
import { useCallStore } from "@/hooks/useCallStore";

function CallManager() {
  const { state, filteredCalls, activeTags, addCall, updateStatus, reschedule, updateNotes, setFilters } =
    useCallStore();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-5 py-10">
      <section className="space-y-3 text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          कॉल मैनेजमेंट सहायक
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          CallFlow: आपकी सारी कॉल्स एक डैशबोर्ड में
        </h1>
        <p className="text-base text-slate-600">
          कॉल रिकॉर्ड करें, फ़ॉलो-अप शेड्यूल करें, प्राथमिकता सेट करें और अपने दिन का पूरा नियंत्रण पाएं।
        </p>
      </section>

      <StatsOverview calls={state.calls} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <CallForm onCreate={addCall} />
        <div className="space-y-4">
          <FilterToolbar filters={state.filters} tags={activeTags} onChange={setFilters} />

          <div className="space-y-4">
            {filteredCalls.length === 0 ? (
              <div className="rounded-3xl bg-white/80 p-10 text-center text-slate-500 shadow-inner ring-1 ring-slate-100">
                <p className="text-lg font-semibold text-slate-600">कोई कॉल नहीं मिली</p>
                <p className="text-sm mt-2">
                  नई कॉल जोड़ें या फिल्टर्स बदलें ताकि मौजूदा कॉल्स देखें।
                </p>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <CallCard
                  key={call.id}
                  call={call}
                  onStatusChange={(status) => updateStatus(call.id, status)}
                  onUpdateNotes={(notes, followUpAction) =>
                    updateNotes(call.id, notes, followUpAction)
                  }
                  onReschedule={(scheduledAt) => reschedule(call.id, scheduledAt)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">लोड हो रहा है...</div>}>
      <CallManager />
    </Suspense>
  );
}

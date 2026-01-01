import { useState } from "react";
import { format } from "date-fns";
import type { CallLog } from "@/lib/types";

type FormState = {
  contactName: string;
  phoneNumber: string;
  direction: CallLog["direction"];
  status: CallLog["status"];
  scheduledAt: string;
  durationMinutes: string;
  tags: string;
  notes: string;
  followUpAction: string;
  priority: CallLog["priority"];
};

const initialForm: FormState = {
  contactName: "",
  phoneNumber: "",
  direction: "incoming",
  status: "new",
  scheduledAt: "",
  durationMinutes: "",
  tags: "",
  notes: "",
  followUpAction: "",
  priority: "medium"
};

interface CallFormProps {
  onCreate: (payload: Omit<CallLog, "id" | "createdAt">) => void;
}

export function CallForm({ onCreate }: CallFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCreate({
      contactName: form.contactName || "Unknown caller",
      phoneNumber: form.phoneNumber,
      direction: form.direction,
      status: form.status,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : undefined,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: form.notes,
      followUpAction: form.followUpAction || undefined,
      priority: form.priority
    });
    setForm(initialForm);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white/90 p-6 shadow-xl shadow-brand-900/5 ring-1 ring-slate-100 backdrop-blur"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">नई कॉल जोड़ें</h2>
        <span className="text-xs text-slate-500">
          {format(new Date(), "dd MMM yyyy, hh:mm a")}
        </span>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          संपर्क नाम
          <input
            value={form.contactName}
            onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))}
            placeholder="उदाहरण: राहुल गुप्ता"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          फोन नंबर
          <input
            value={form.phoneNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
            placeholder="+91 90000 00000"
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          कॉल दिशा
          <select
            value={form.direction}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, direction: event.target.value as FormState["direction"] }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="incoming">इनकमिंग</option>
            <option value="outgoing">आउटगोइंग</option>
            <option value="missed">मिस्ड</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          स्टेटस
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as FormState["status"] }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="new">नई</option>
            <option value="in-progress">चल रही</option>
            <option value="completed">पूरी</option>
            <option value="scheduled">शेड्यूल्ड</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          फ़ॉलो-अप तिथि
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, scheduledAt: event.target.value }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          अवधि (मिनट)
          <input
            type="number"
            min={0}
            value={form.durationMinutes}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, durationMinutes: event.target.value }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          टैग्स (कॉमा से अलग)
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="support, vip"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
          प्राथमिकता
          <select
            value={form.priority}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, priority: event.target.value as FormState["priority"] }))
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="high">हाई</option>
            <option value="medium">मीडियम</option>
            <option value="low">लो</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        नोट्स
        <textarea
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          rows={3}
          placeholder="कॉल से संबंधित महत्वपूर्ण बातें लिखें..."
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
        फ़ॉलो-अप एक्शन
        <textarea
          value={form.followUpAction}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, followUpAction: event.target.value }))
          }
          rows={2}
          placeholder="क्या करना है? जैसे: कल सुबह कॉल बैक करें"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:ring-offset-1"
      >
        कॉल सेव करें
      </button>
    </form>
  );
}

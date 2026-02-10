"use client";

import { useState, useEffect, useCallback } from "react";

interface Poll {
  id: string;
  question: string;
  isActive: boolean;
  options: { id: string; text: string }[];
  _count?: { votes: number };
}

interface Period {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

interface Recipient {
  id: string;
  name: string;
  website: string | null;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("polls");

  // Data
  const [polls, setPolls] = useState<Poll[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  // Poll form
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [newPollActive, setNewPollActive] = useState(false);

  // Period form
  const [periodLabel, setPeriodLabel] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  // Revenue form
  const [revPeriodId, setRevPeriodId] = useState("");
  const [revAmount, setRevAmount] = useState("");
  const [revNotes, setRevNotes] = useState("");

  // Cost form
  const [costPeriodId, setCostPeriodId] = useState("");
  const [costDesc, setCostDesc] = useState("");
  const [costAmount, setCostAmount] = useState("");

  // Recipient form
  const [recipName, setRecipName] = useState("");
  const [recipWebsite, setRecipWebsite] = useState("");

  // Allocation form
  const [allocRecipientId, setAllocRecipientId] = useState("");
  const [allocPeriodId, setAllocPeriodId] = useState("");
  const [allocGross, setAllocGross] = useState("");
  const [allocCosts, setAllocCosts] = useState("");
  const [allocNet, setAllocNet] = useState("");
  const [allocProof, setAllocProof] = useState("");
  const [allocNotes, setAllocNotes] = useState("");

  const [msg, setMsg] = useState("");

  const loadData = useCallback(async () => {
    const [p, per, rec] = await Promise.all([
      fetch("/api/admin/polls").then((r) => r.json()),
      fetch("/api/admin/periods").then((r) => r.json()),
      fetch("/api/admin/recipients").then((r) => r.json()),
    ]);
    setPolls(Array.isArray(p) ? p : []);
    setPeriods(Array.isArray(per) ? per : []);
    setRecipients(Array.isArray(rec) ? rec : []);
  }, []);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const createPoll = async () => {
    const opts = newOptions.filter((o) => o.trim());
    if (!newQuestion || opts.length < 2) return flash("Need question + 2 options");
    await fetch("/api/admin/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, options: opts, isActive: newPollActive }),
    });
    setNewQuestion(""); setNewOptions(["", ""]); setNewPollActive(false);
    flash("Poll created"); loadData();
  };

  const setActive = async (id: string) => {
    await fetch(`/api/admin/polls/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    flash("Active poll updated"); loadData();
  };

  const createPeriod = async () => {
    if (!periodLabel || !periodStart || !periodEnd) return flash("All fields required");
    await fetch("/api/admin/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: periodLabel, startDate: periodStart, endDate: periodEnd }),
    });
    setPeriodLabel(""); setPeriodStart(""); setPeriodEnd("");
    flash("Period created"); loadData();
  };

  const createRevenue = async () => {
    if (!revPeriodId || !revAmount) return flash("Period and amount required");
    await fetch("/api/admin/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportingPeriodId: revPeriodId, amount: revAmount, notes: revNotes }),
    });
    setRevAmount(""); setRevNotes("");
    flash("Revenue recorded");
  };

  const createCost = async () => {
    if (!costPeriodId || !costDesc || !costAmount) return flash("All fields required");
    await fetch("/api/admin/costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportingPeriodId: costPeriodId, description: costDesc, amount: costAmount }),
    });
    setCostDesc(""); setCostAmount("");
    flash("Cost recorded");
  };

  const createRecipient = async () => {
    if (!recipName) return flash("Name required");
    await fetch("/api/admin/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: recipName, website: recipWebsite }),
    });
    setRecipName(""); setRecipWebsite("");
    flash("Recipient created"); loadData();
  };

  const createAllocation = async () => {
    if (!allocRecipientId || !allocPeriodId || !allocGross || !allocCosts || !allocNet) return flash("Fill required fields");
    await fetch("/api/admin/allocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: allocRecipientId,
        reportingPeriodId: allocPeriodId,
        grossRevenue: allocGross,
        operatingCosts: allocCosts,
        netAmount: allocNet,
        proofUrl: allocProof,
        notes: allocNotes,
      }),
    });
    setAllocGross(""); setAllocCosts(""); setAllocNet(""); setAllocProof(""); setAllocNotes("");
    flash("Allocation created");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Admin Login</h1>
          {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={login} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = ["polls", "periods", "revenue", "costs", "recipients", "allocations"];
  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";
  const btnCls = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium";
  const selectCls = inputCls;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <a href="/" className="text-blue-600 hover:underline text-sm">← Back to site</a>
        </div>

        {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{msg}</div>}

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === t ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "polls" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Create Poll</h2>
              <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Question" className={inputCls} />
              {newOptions.map((o, i) => (
                <div key={i} className="flex gap-2">
                  <input value={o} onChange={(e) => { const opts = [...newOptions]; opts[i] = e.target.value; setNewOptions(opts); }}
                    placeholder={`Option ${i + 1}`} className={inputCls} />
                  {i >= 2 && <button onClick={() => setNewOptions(newOptions.filter((_, j) => j !== i))} className="text-red-500 text-sm">✕</button>}
                </div>
              ))}
              <button onClick={() => setNewOptions([...newOptions, ""])} className="text-blue-600 text-sm hover:underline">+ Add option</button>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={newPollActive} onChange={(e) => setNewPollActive(e.target.checked)} /> Set as active
              </label>
              <button onClick={createPoll} className={btnCls}>Create Poll</button>

              <h2 className="text-lg font-semibold mt-8">Existing Polls</h2>
              <div className="space-y-3">
                {polls.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium">{p.question}</span>
                        {p.isActive && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>}
                        <div className="text-xs text-gray-500 mt-1">{p.options.map((o) => o.text).join(" • ")} — {p._count?.votes || 0} votes</div>
                      </div>
                      {!p.isActive && <button onClick={() => setActive(p.id)} className="text-blue-600 text-xs hover:underline">Set Active</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "periods" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Create Reporting Period</h2>
              <input value={periodLabel} onChange={(e) => setPeriodLabel(e.target.value)} placeholder="Label (e.g. January 2025)" className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className={inputCls} />
                <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className={inputCls} />
              </div>
              <button onClick={createPeriod} className={btnCls}>Create Period</button>

              <h2 className="text-lg font-semibold mt-6">Existing Periods</h2>
              {periods.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-3 text-sm">
                  <span className="font-medium">{p.label}</span>
                  <span className="text-gray-500 ml-2">{new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "revenue" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Record AdSense Revenue</h2>
              <select value={revPeriodId} onChange={(e) => setRevPeriodId(e.target.value)} className={selectCls}>
                <option value="">Select period...</option>
                {periods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <input type="number" step="0.01" value={revAmount} onChange={(e) => setRevAmount(e.target.value)} placeholder="Amount ($)" className={inputCls} />
              <input value={revNotes} onChange={(e) => setRevNotes(e.target.value)} placeholder="Notes (optional)" className={inputCls} />
              <button onClick={createRevenue} className={btnCls}>Record Revenue</button>
            </div>
          )}

          {activeTab === "costs" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Record Operating Cost</h2>
              <select value={costPeriodId} onChange={(e) => setCostPeriodId(e.target.value)} className={selectCls}>
                <option value="">Select period...</option>
                {periods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <input value={costDesc} onChange={(e) => setCostDesc(e.target.value)} placeholder="Description" className={inputCls} />
              <input type="number" step="0.01" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder="Amount ($)" className={inputCls} />
              <button onClick={createCost} className={btnCls}>Record Cost</button>
            </div>
          )}

          {activeTab === "recipients" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Add Recipient Organization</h2>
              <input value={recipName} onChange={(e) => setRecipName(e.target.value)} placeholder="Organization name" className={inputCls} />
              <input value={recipWebsite} onChange={(e) => setRecipWebsite(e.target.value)} placeholder="Website URL (optional)" className={inputCls} />
              <button onClick={createRecipient} className={btnCls}>Add Recipient</button>

              <h2 className="text-lg font-semibold mt-6">Recipients</h2>
              {recipients.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-3 text-sm">
                  <span className="font-medium">{r.name}</span>
                  {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline text-xs">{r.website}</a>}
                </div>
              ))}
            </div>
          )}

          {activeTab === "allocations" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Create Allocation</h2>
              <select value={allocRecipientId} onChange={(e) => setAllocRecipientId(e.target.value)} className={selectCls}>
                <option value="">Select recipient...</option>
                {recipients.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <select value={allocPeriodId} onChange={(e) => setAllocPeriodId(e.target.value)} className={selectCls}>
                <option value="">Select period...</option>
                {periods.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" step="0.01" value={allocGross} onChange={(e) => setAllocGross(e.target.value)} placeholder="Gross ($)" className={inputCls} />
                <input type="number" step="0.01" value={allocCosts} onChange={(e) => setAllocCosts(e.target.value)} placeholder="Costs ($)" className={inputCls} />
                <input type="number" step="0.01" value={allocNet} onChange={(e) => setAllocNet(e.target.value)} placeholder="Net ($)" className={inputCls} />
              </div>
              <input value={allocProof} onChange={(e) => setAllocProof(e.target.value)} placeholder="Proof URL (optional)" className={inputCls} />
              <input value={allocNotes} onChange={(e) => setAllocNotes(e.target.value)} placeholder="Notes (optional)" className={inputCls} />
              <button onClick={createAllocation} className={btnCls}>Create Allocation</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

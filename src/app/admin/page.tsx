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

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  const createPoll = async () => {
    const opts = newOptions.filter((o) => o.trim());
    if (!newQuestion || opts.length < 2) return flash("Need question + 2 options");
    await fetch("/api/admin/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, options: opts, isActive: newPollActive }),
    });
    setNewQuestion("");
    setNewOptions(["", ""]);
    setNewPollActive(false);
    flash("Poll created");
    loadData();
  };

  const setActive = async (id: string) => {
    await fetch(`/api/admin/polls/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    flash("Active poll updated");
    loadData();
  };

  const createPeriod = async () => {
    if (!periodLabel || !periodStart || !periodEnd) return flash("All fields required");
    await fetch("/api/admin/periods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: periodLabel, startDate: periodStart, endDate: periodEnd }),
    });
    setPeriodLabel("");
    setPeriodStart("");
    setPeriodEnd("");
    flash("Period created");
    loadData();
  };

  const createRevenue = async () => {
    if (!revPeriodId || !revAmount) return flash("Period and amount required");
    await fetch("/api/admin/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportingPeriodId: revPeriodId, amount: revAmount, notes: revNotes }),
    });
    setRevAmount("");
    setRevNotes("");
    flash("Revenue recorded");
  };

  const createCost = async () => {
    if (!costPeriodId || !costDesc || !costAmount) return flash("All fields required");
    await fetch("/api/admin/costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportingPeriodId: costPeriodId,
        description: costDesc,
        amount: costAmount,
      }),
    });
    setCostDesc("");
    setCostAmount("");
    flash("Cost recorded");
  };

  const createRecipient = async () => {
    if (!recipName) return flash("Name required");
    await fetch("/api/admin/recipients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: recipName, website: recipWebsite }),
    });
    setRecipName("");
    setRecipWebsite("");
    flash("Recipient created");
    loadData();
  };

  const createAllocation = async () => {
    if (!allocRecipientId || !allocPeriodId || !allocGross || !allocCosts || !allocNet)
      return flash("Fill required fields");
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
    setAllocGross("");
    setAllocCosts("");
    setAllocNet("");
    setAllocProof("");
    setAllocNotes("");
    flash("Allocation created");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-500 mt-1">Enter password to continue</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {loginError}
            </div>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter password"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = ["polls", "periods", "revenue", "costs", "recipients", "allocations"];
  
  const inputCls = "w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const btnCls = "bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md";
  const selectCls = inputCls;
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Admin Panel</h1>
            <p className="text-sm text-slate-500">Manage polls, allocations, and transparency data</p>
          </div>
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to site
          </a>
        </div>

        {/* Flash message */}
        {msg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium shadow-sm animate-fade-in">
            ✓ {msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === t
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {activeTab === "polls" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Create Poll</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Question</label>
                    <input
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="What's your favorite color?"
                      className={inputCls}
                    />
                  </div>

                  {newOptions.map((o, i) => (
                    <div key={i}>
                      <label className={labelCls}>Option {i + 1}</label>
                      <div className="flex gap-2">
                        <input
                          value={o}
                          onChange={(e) => {
                            const opts = [...newOptions];
                            opts[i] = e.target.value;
                            setNewOptions(opts);
                          }}
                          placeholder={`Option ${i + 1}`}
                          className={inputCls}
                        />
                        {i >= 2 && (
                          <button
                            onClick={() => setNewOptions(newOptions.filter((_, j) => j !== i))}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setNewOptions([...newOptions, ""])}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    + Add option
                  </button>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={newPollActive}
                      onChange={(e) => setNewPollActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    Set as active poll
                  </label>

                  <button onClick={createPoll} className={btnCls}>
                    Create Poll
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Existing Polls</h2>
                <div className="space-y-3">
                  {polls.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">{p.question}</span>
                            {p.isActive && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            {p.options.map((o) => o.text).join(" • ")} — {p._count?.votes || 0} votes
                          </div>
                        </div>
                        {!p.isActive && (
                          <button
                            onClick={() => setActive(p.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline shrink-0"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "periods" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Create Reporting Period</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Label</label>
                    <input
                      value={periodLabel}
                      onChange={(e) => setPeriodLabel(e.target.value)}
                      placeholder="January 2025"
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Start Date</label>
                      <input
                        type="date"
                        value={periodStart}
                        onChange={(e) => setPeriodStart(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>End Date</label>
                      <input
                        type="date"
                        value={periodEnd}
                        onChange={(e) => setPeriodEnd(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <button onClick={createPeriod} className={btnCls}>
                    Create Period
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Existing Periods</h2>
                <div className="space-y-2">
                  {periods.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-lg p-3 text-sm">
                      <span className="font-medium text-slate-900">{p.label}</span>
                      <span className="text-slate-500 ml-2">
                        {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "revenue" && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Record AdSense Revenue</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Period</label>
                  <select value={revPeriodId} onChange={(e) => setRevPeriodId(e.target.value)} className={selectCls}>
                    <option value="">Select period...</option>
                    {periods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={revAmount}
                    onChange={(e) => setRevAmount(e.target.value)}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Notes (optional)</label>
                  <input
                    value={revNotes}
                    onChange={(e) => setRevNotes(e.target.value)}
                    placeholder="Additional details..."
                    className={inputCls}
                  />
                </div>
                <button onClick={createRevenue} className={btnCls}>
                  Record Revenue
                </button>
              </div>
            </div>
          )}

          {activeTab === "costs" && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Record Operating Cost</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Period</label>
                  <select value={costPeriodId} onChange={(e) => setCostPeriodId(e.target.value)} className={selectCls}>
                    <option value="">Select period...</option>
                    {periods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input
                    value={costDesc}
                    onChange={(e) => setCostDesc(e.target.value)}
                    placeholder="Hosting, domain, etc."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costAmount}
                    onChange={(e) => setCostAmount(e.target.value)}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
                <button onClick={createCost} className={btnCls}>
                  Record Cost
                </button>
              </div>
            </div>
          )}

          {activeTab === "recipients" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Recipient Organization</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Organization Name</label>
                    <input
                      value={recipName}
                      onChange={(e) => setRecipName(e.target.value)}
                      placeholder="Red Cross"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Website URL (optional)</label>
                    <input
                      value={recipWebsite}
                      onChange={(e) => setRecipWebsite(e.target.value)}
                      placeholder="https://redcross.org"
                      className={inputCls}
                    />
                  </div>
                  <button onClick={createRecipient} className={btnCls}>
                    Add Recipient
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recipients</h2>
                <div className="space-y-2">
                  {recipients.map((r) => (
                    <div key={r.id} className="border border-slate-200 rounded-lg p-3 text-sm">
                      <span className="font-medium text-slate-900">{r.name}</span>
                      {r.website && (
                        <a
                          href={r.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:underline text-xs"
                        >
                          {r.website}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "allocations" && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Create Allocation</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Recipient</label>
                  <select
                    value={allocRecipientId}
                    onChange={(e) => setAllocRecipientId(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select recipient...</option>
                    {recipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Period</label>
                  <select
                    value={allocPeriodId}
                    onChange={(e) => setAllocPeriodId(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Select period...</option>
                    {periods.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Gross ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={allocGross}
                      onChange={(e) => setAllocGross(e.target.value)}
                      placeholder="0.00"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Costs ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={allocCosts}
                      onChange={(e) => setAllocCosts(e.target.value)}
                      placeholder="0.00"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Net ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={allocNet}
                      onChange={(e) => setAllocNet(e.target.value)}
                      placeholder="0.00"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Proof URL (optional)</label>
                  <input
                    value={allocProof}
                    onChange={(e) => setAllocProof(e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Notes (optional)</label>
                  <input
                    value={allocNotes}
                    onChange={(e) => setAllocNotes(e.target.value)}
                    placeholder="Additional details..."
                    className={inputCls}
                  />
                </div>
                <button onClick={createAllocation} className={btnCls}>
                  Create Allocation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

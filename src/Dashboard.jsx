import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import "./dashboard.css";

const API_BASE = "https://fitgenie-uy93.onrender.com";

const API = {

  me: `${API_BASE}/api/users/me`,
  latest: `${API_BASE}/api/fit-plan/latest`,
  history: `${API_BASE}/api/fit-plan/history`,
  create: `${API_BASE}/api/fit-plan/create`,
};

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const getToken = () => localStorage.getItem("token");

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

function titleCase(s = "") {
  const t = s.toString().trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
}

function safeDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleString();
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [user, setUser] = useState(null);
  const [latestPlan, setLatestPlan] = useState(null);
  const [history, setHistory] = useState([]);


  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const token = getToken();

  const headers = useMemo(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const userName = useMemo(() => {
    return user?.name || user?.fullName || user?.email?.split("@")?.[0] || "User";
  }, [user]);

  const profile = useMemo(() => {
    return {
      age: user?.age ?? "",
      gender: user?.gender ?? "",
      height: user?.height ?? "",
      weight: user?.weight ?? "",
      goal: user?.goal ?? "",
      timePerDay: user?.timePerDay ?? "",
      dietPreferance: user?.dietPreferance ?? "", 
    };
  }, [user]);

  const profileComplete =
    profile.age &&
    profile.gender &&
    profile.height &&
    profile.weight &&
    profile.goal &&
    profile.timePerDay &&
    profile.dietPreferance;

  const weeklyMeta = useMemo(() => {
    if (!latestPlan) return null;

    const plan = latestPlan.plan || latestPlan.latestPlan || latestPlan;

   
    const wp = plan.weeklyPlan || plan.plan?.weeklyPlan || null;


    if (wp && !Array.isArray(wp)) {
      const hasAnyDay = DAY_ORDER.some((d) => wp[d]);
      if (!hasAnyDay) return null;

      return {
        weeks: [
          {
            week: 1,
            workout: DAY_ORDER.map((k) => wp[k]).filter(Boolean),
            nutrition: plan.nutrition || null,
          },
        ],
        createdAt: plan.createdAt,
        planName: plan.planName || plan.name || plan.summary?.goal || plan.goal || "Fitness Plan",
        summary: plan.summary || null,
        tips: plan.tips || [],
      };
    }

    if (Array.isArray(wp) && wp.length > 0) {
      return {
        weeks: wp,
        createdAt: plan.createdAt,
        planName: plan.planName || plan.name || plan.summary?.goal || plan.goal || "Fitness Plan",
        summary: plan.summary || null,
        tips: plan.tips || [],
      };
    }

    return null;
  }, [latestPlan]);


  const selectedWeek = useMemo(() => {
    if (!weeklyMeta?.weeks?.length) return null;
    const idx = Math.min(Math.max(selectedWeekIndex, 0), weeklyMeta.weeks.length - 1);
    const weekObj = weeklyMeta.weeks[idx];

    const daysByKey = {};
    for (const d of weekObj?.workout || []) {
      const key = (d?.day || "").toString().trim().toLowerCase();
      if (key) daysByKey[key] = d;
    }

    const hasAnyDay = DAY_ORDER.some((k) => daysByKey[k]);
    if (!hasAnyDay) return null;

    return {
      weekNumber: weekObj?.week ?? idx + 1,
      daysByKey,
      nutrition: weekObj?.nutrition || null,
    };
  }, [weeklyMeta, selectedWeekIndex]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("No token found. Please login again.");

      const meRes = await fetchJson(API.me, { headers });
      setUser(meRes.user || meRes);

      try {
        const latestRes = await fetchJson(API.latest, { headers });
      
        setLatestPlan(latestRes.plan || latestRes.latestPlan || latestRes);
      } catch {
        setLatestPlan(null);
      }


      try {
        const histRes = await fetchJson(API.history, { headers });
        const list = histRes.plans || histRes.history || (Array.isArray(histRes) ? histRes : []);
        setHistory(Array.isArray(list) ? list : []);
      } catch {
        setHistory([]);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  
  }, []);

  const generatePlan = async () => {
    setGenerating(true);
    try {
      if (!token) throw new Error("No token found. Please login again.");
      if (!profileComplete) throw new Error("Update your profile first.");

      await fetchJson(API.create, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), 
      });

      toast.success("Plan generated!");
      setSelectedWeekIndex(0);
      await loadDashboard();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="dash">
  
      <header className="dash-topbar">
        <button
          className="dash-menuBtn"
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Open menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="dash-topTitle">
          Fit<span>Genie</span>
        </div>

        <button className="dash-topAction" onClick={signOut} title="Sign out">
          Sign out
        </button>
      </header>

      {sidebarOpen && <div className="dash-backdrop" onClick={() => setSidebarOpen(false)} />}

  
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-logo">
          Fit<span>Genie</span>
        </div>

        <nav className="dash-nav">
          <button className="dash-navItem active" onClick={() => setSidebarOpen(false)}>
            🏠 Dashboard
          </button>

          <button
            className="dash-navItem"
            onClick={() => {
              setSidebarOpen(false);
              generatePlan();
            }}
            disabled={generating || loading || !profileComplete}
            title={!profileComplete ? "Update profile first" : "Generate plan"}
          >
            ✨ {generating ? "Generating..." : "Generate Plan"}
          </button>

          <button className="dash-navItem dash-signout" onClick={signOut}>
            🚪 Sign Out
          </button>
        </nav>

        <div className="dash-sidebarHint">
          <div className="hint-title">Tip</div>
          <div className="hint-text">
            Complete your profile, then generate a plan. Your weekly plan will display by days (Mon–Sun).
          </div>
        </div>
      </aside>

      <main className="dash-main">
   
        <section className="card dash-welcome">
          <div className="welcome-left">
            <div className="welcome-title">
              Welcome, <span className="welcome-name">{loading ? "..." : userName}</span> 👋
            </div>

            <div className="welcome-sub">
              {profileComplete ? (
                <>
                  <span className="dot" /> Profile complete • Ready to generate
                </>
              ) : (
                <>
                  <span className="dot warn" /> Profile not complete • Update profile first
                </>
              )}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={generatePlan}
            disabled={!profileComplete || generating || loading}
          >
            {generating ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              "Generate  Plan"
            )}
          </button>
        </section>

        <section className="dash-grid">
      
          <div className="card">
            <div className="card-title">👤 Profile Summary</div>

            {loading ? (
              <div className="empty">Loading profile...</div>
            ) : (
              <div className="rows">
                <Row label="Gender" value={profile.gender || "--"} />
                <Divider />
                <Row label="Age" value={profile.age ? `${profile.age} yrs` : "--"} />
                <Divider />
                <Row label="Height" value={profile.height ? `${profile.height} cm` : "--"} />
                <Divider />
                <Row label="Weight" value={profile.weight ? `${profile.weight} kg` : "--"} />
                <Divider />
                <Row label="Goal" value={profile.goal || "--"} />
                <Divider />
                <Row label="Diet" value={profile.dietPreferance || "--"} />
                <Divider />
                <Row label="Time/Day" value={profile.timePerDay ? `${profile.timePerDay}` : "--"} />
              </div>
            )}
          </div>

          {/* Latest Plan */}
          <div className="card plan-card">
            <div className="plan-head">
              <div className="badge">
                <span className="badge-dot" />
                Latest Plan
              </div>

              {weeklyMeta?.weeks?.length > 1 && (
                <select
                  className="week-select"
                  value={selectedWeekIndex}
                  onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
                >
                  {weeklyMeta.weeks.map((w, idx) => (
                    <option key={idx} value={idx}>
                      Week {w.week ?? idx + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {!weeklyMeta ? (
              <div className="empty">
                <div className="empty-icon">✨</div>
                <div>No plan yet. Generate one.</div>
              </div>
            ) : (
              <>
                <div className="plan-title">{weeklyMeta.planName}</div>

                <div className="plan-meta">
                  {weeklyMeta.createdAt ? safeDate(weeklyMeta.createdAt) : ""}
                  {selectedWeek?.weekNumber ? (
                    <span className="meta-pill">Week {selectedWeek.weekNumber}</span>
                  ) : null}
                </div>

                {/* Summary */}
                {weeklyMeta.summary && (
                  <div className="summary-grid">
                    <div className="summary-item">
                      <div className="s-label">Goal</div>
                      <div className="s-value">{weeklyMeta.summary.goal || "--"}</div>
                    </div>
                    <div className="summary-item">
                      <div className="s-label">Time/Day</div>
                      <div className="s-value">{weeklyMeta.summary.timePerDay || "--"}</div>
                    </div>
                    <div className="summary-item">
                      <div className="s-label">Diet</div>
                      <div className="s-value">
                        {weeklyMeta.summary.dietPreference || weeklyMeta.summary.dietPreferance || "--"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Week Grid */}
                {selectedWeek ? (
                  <div className="week-grid">
                    {DAY_ORDER.map((dayKey) => {
                      const dayData = selectedWeek.daysByKey[dayKey];
                      if (!dayData) return null;

                      const dayTitle = titleCase(dayKey);
                      const exArr = Array.isArray(dayData.exercises) ? dayData.exercises : [];

                      return (
                        <div className="day-card" key={dayKey}>
                          <div className="day-top">
                            <div className="day-title">{dayTitle}</div>
                            {dayData.focus && <div className="day-focus">{dayData.focus}</div>}
                          </div>

                          {exArr.length > 0 ? (
                            <div className="day-list">
                              {exArr.map((ex, idx) => (
                                <div className="day-item" key={idx}>
                                  <span className="day-ex">{ex?.name || "Exercise"}</span>
                                  <span className="day-sets">
                                    {ex?.sets ? `${ex.sets} sets` : ""}
                                    {ex?.reps ? ` • ${ex.reps} reps` : ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="day-note">Rest / Recovery day</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty small">
                    Plan saved, but dashboard couldn’t map the weekly workout structure.
                  </div>
                )}

                {/* Nutrition */}
                {selectedWeek?.nutrition && (
                  <div className="subcard">
                    <div className="subcard-title">🥗 Nutrition</div>

                    <div className="nutrition-top">
                      <div className="nut-pill">
                        <span>Calories</span>
                        <b>{selectedWeek.nutrition.dailyCalories ?? "--"}</b>
                      </div>
                      <div className="nut-pill">
                        <span>Protein</span>
                        <b>{selectedWeek.nutrition.macros?.protein ?? "--"}</b>
                      </div>
                      <div className="nut-pill">
                        <span>Carbs</span>
                        <b>{selectedWeek.nutrition.macros?.carbs ?? "--"}</b>
                      </div>
                      <div className="nut-pill">
                        <span>Fat</span>
                        <b>{selectedWeek.nutrition.macros?.fat ?? "--"}</b>
                      </div>
                    </div>

                    {Array.isArray(selectedWeek.nutrition.meals) && selectedWeek.nutrition.meals.length > 0 && (
                      <div className="meals">
                        {selectedWeek.nutrition.meals.map((m, idx) => (
                          <div className="meal" key={idx}>
                            <div className="meal-title">{m.meal || "Meal"}</div>
                            <ul className="meal-list">
                              {(m.items || []).map((it, i) => (
                                <li key={i}>{it}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tips */}
                {Array.isArray(weeklyMeta.tips) && weeklyMeta.tips.length > 0 && (
                  <div className="subcard">
                    <div className="subcard-title">💡 Tips</div>
                    <ul className="tips">
                      {weeklyMeta.tips.slice(0, 6).map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            <button
              className="btn-soft"
              onClick={generatePlan}
              disabled={!profileComplete || generating || loading}
            >
              {generating ? "Generating..." : "Generate New Plan"}
            </button>
          </div>

          {/* History */}
          <div className="card col-full">
            <div className="card-title">🕓 Plan History</div>

            {loading ? (
              <div className="empty">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <div>No history yet.</div>
              </div>
            ) : (
              <div className="history">
                {history.slice(0, 10).map((item, i) => (
                  <div className="h-item" key={item._id || i}>
                    <div className="h-icon">🏋️</div>
                    <div className="h-info">
                      <div className="h-name">
                        {item.planName || item.name || item.summary?.goal || item.goal || "Fitness Plan"}
                      </div>
                      <div className="h-meta">{item.createdAt ? safeDate(item.createdAt) : "—"}</div>
                    </div>
                    <div className="h-arrow">›</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="row">
      <label>{label}</label>
      <span className="value">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="divider" />;
}
import { useState, useMemo } from "react";

const FLAME = "🔥";
const BOLT = "⚡";

const DEFAULTS = {
  cylinderPrice: 1300,
  cylinderDays: 20,
  wattage: 2200,
  hoursPerDay: 2,
  ratePerUnit: 7,
};

const SliderRow = ({ label, value, min, max, step, onChange, unit, color }) => (
  <div style={{ marginBottom: "1.4rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
      <span style={{ fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#9ca3af" }}>{label}</span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", color, fontWeight: 600 }}>
        {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}{unit}
      </span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: color, cursor: "pointer", height: "4px" }}
    />
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
      <span style={{ fontSize: "0.68rem", color: "#4b5563" }}>{min}{unit}</span>
      <span style={{ fontSize: "0.68rem", color: "#4b5563" }}>{max}{unit}</span>
    </div>
  </div>
);

function App() {
  const [cylinderPrice, setCylinderPrice] = useState(DEFAULTS.cylinderPrice);
  const [cylinderDays, setCylinderDays] = useState(DEFAULTS.cylinderDays);
  const [wattage, setWattage] = useState(DEFAULTS.wattage);
  const [hoursPerDay, setHoursPerDay] = useState(DEFAULTS.hoursPerDay);
  const [ratePerUnit, setRatePerUnit] = useState(DEFAULTS.ratePerUnit);

  const isChanged = cylinderPrice !== DEFAULTS.cylinderPrice || cylinderDays !== DEFAULTS.cylinderDays ||
    wattage !== DEFAULTS.wattage || hoursPerDay !== DEFAULTS.hoursPerDay || ratePerUnit !== DEFAULTS.ratePerUnit;

  const handleReset = () => {
    setCylinderPrice(DEFAULTS.cylinderPrice);
    setCylinderDays(DEFAULTS.cylinderDays);
    setWattage(DEFAULTS.wattage);
    setHoursPerDay(DEFAULTS.hoursPerDay);
    setRatePerUnit(DEFAULTS.ratePerUnit);
  };

  const results = useMemo(() => {
    const lpgPerDay = cylinderPrice / cylinderDays;
    const lpgPerMonth = lpgPerDay * 30;

    const unitsPerDay = (wattage / 1000) * hoursPerDay;
    const inductionPerDay = unitsPerDay * ratePerUnit;
    const inductionPerMonth = inductionPerDay * 30;

    const unitsPerMonth = unitsPerDay * 30;
    const saving = lpgPerMonth - inductionPerMonth;
    const cheaperOption = saving > 0 ? "induction" : saving < 0 ? "lpg" : "equal";

    return { lpgPerDay, lpgPerMonth, inductionPerDay, inductionPerMonth, unitsPerDay, unitsPerMonth, saving, cheaperOption };
  }, [cylinderPrice, cylinderDays, wattage, hoursPerDay, ratePerUnit]);

  const pct = Math.min(100, Math.abs(results.saving) / Math.max(results.lpgPerMonth, results.inductionPerMonth) * 100);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: "#e5e7eb", padding: "2rem 1rem",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      backgroundImage: "radial-gradient(ellipse at 20% 10%, rgba(251,146,60,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 60%)"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.5rem" }}>India Kitchen Cost Planner</div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#fb923c" }}>LPG</span> vs <span style={{ color: "#60a5fa" }}>Induction</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.4rem" }}>Adjust values to match your usage and see which saves more</p>
          {isChanged && (
            <button onClick={handleReset} style={{
              marginTop: "0.7rem", padding: "0.4rem 1rem", fontSize: "0.75rem",
              letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
              color: "#e5e7eb", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.5rem",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            >
              ↺ Reset to defaults
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>

          {/* LPG Card */}
          <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "1rem", padding: "1.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
              <span style={{ fontSize: "1.2rem" }}>{FLAME}</span>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#fb923c", fontWeight: 600 }}>LPG Gas</span>
            </div>
            <SliderRow label="Cylinder Price" value={cylinderPrice} min={800} max={2000} step={50} onChange={setCylinderPrice} unit="₹" color="#fb923c" />
            <SliderRow label="Cylinder Lasts" value={cylinderDays} min={10} max={40} step={1} onChange={setCylinderDays} unit="days" color="#fb923c" />
            <div style={{ borderTop: "1px solid rgba(251,146,60,0.15)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Per day</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "#fb923c" }}>₹{results.lpgPerDay.toFixed(0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Per month</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: "#fb923c" }}>₹{results.lpgPerMonth.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Induction Card */}
          <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "1rem", padding: "1.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
              <span style={{ fontSize: "1.2rem" }}>{BOLT}</span>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#60a5fa", fontWeight: 600 }}>Induction</span>
            </div>
            <SliderRow label="Wattage" value={wattage} min={1000} max={3000} step={100} onChange={setWattage} unit="W" color="#60a5fa" />
            <SliderRow label="Daily Usage" value={hoursPerDay} min={0.5} max={5} step={0.5} onChange={setHoursPerDay} unit="hrs" color="#60a5fa" />
            <SliderRow label="Electricity Rate" value={ratePerUnit} min={3} max={20} step={0.5} onChange={setRatePerUnit} unit="₹/unit" color="#60a5fa" />
            <div style={{ borderTop: "1px solid rgba(96,165,250,0.15)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Units/month</span>
                <span style={{ fontFamily: "'DM Mono', monospace", color: "#60a5fa" }}>{results.unitsPerMonth.toFixed(1)} kWh</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Per month</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 600, color: "#60a5fa" }}>₹{results.inductionPerMonth.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div style={{
          background: results.cheaperOption === "induction"
            ? "rgba(96,165,250,0.08)" : results.cheaperOption === "lpg"
            ? "rgba(251,146,60,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${results.cheaperOption === "induction" ? "rgba(96,165,250,0.3)" : results.cheaperOption === "lpg" ? "rgba(251,146,60,0.3)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "1rem", padding: "1.4rem 1.6rem", marginBottom: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.35rem" }}>Monthly Saving</div>
              <div style={{ fontSize: "2rem", fontFamily: "'DM Mono', monospace", fontWeight: 600,
                color: results.cheaperOption === "induction" ? "#60a5fa" : results.cheaperOption === "lpg" ? "#fb923c" : "#9ca3af" }}>
                ₹{Math.abs(results.saving).toFixed(0)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.35rem" }}>Verdict</div>
              <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                {results.cheaperOption === "equal" ? "Both cost the same" :
                  `${results.cheaperOption === "induction" ? `${BOLT} Induction` : `${FLAME} LPG`} is cheaper`}
              </div>
              {results.cheaperOption !== "equal" && (
                <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>saves {pct.toFixed(0)}% per month</div>
              )}
            </div>
          </div>

          {/* Bar comparison */}
          <div style={{ marginTop: "1.2rem" }}>
            <div style={{ display: "flex", gap: "4px", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                flex: results.lpgPerMonth, background: "#fb923c",
                transition: "flex 0.4s ease", borderRadius: "4px 0 0 4px"
              }} />
              <div style={{
                flex: results.inductionPerMonth, background: "#60a5fa",
                transition: "flex 0.4s ease", borderRadius: "0 4px 4px 0"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
              <span style={{ fontSize: "0.7rem", color: "#fb923c" }}>{FLAME} LPG ₹{results.lpgPerMonth.toFixed(0)}</span>
              <span style={{ fontSize: "0.7rem", color: "#60a5fa" }}>Induction ₹{results.inductionPerMonth.toFixed(0)} {BOLT}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "0.75rem", padding: "1rem 1.2rem", fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.7 }}>
          <strong style={{ color: "#9ca3af" }}>💡 Note:</strong> Induction is ~84% energy efficient vs LPG's ~40%. So even at similar rupee cost, induction delivers more usable heat.
          At <strong style={{ color: "#e5e7eb" }}>2200W for 1.5 hrs/day @ ₹10/unit</strong> → <strong style={{ color: "#60a5fa" }}>₹{results.inductionPerMonth.toFixed(0)}/month</strong> vs LPG's <strong style={{ color: "#fb923c" }}>₹{results.lpgPerMonth.toFixed(0)}/month</strong>.
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "#6b7280" }}>
          Made with <span style={{ color: "#ef4444" }}>❤️</span> by <span style={{ color: "#e5e7eb", fontWeight: 600 }}>Siraj</span>
        </div>

      </div>
    </div>
  );
}
export default App;
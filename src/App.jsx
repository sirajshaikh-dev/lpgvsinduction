import { useState, useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";

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

        {/* Product Sell Section */}
        <div style={{
          marginTop: "2rem",
          background: "rgba(74,222,128,0.04)",
          border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: "1rem",
          overflow: "hidden",
        }}>
          {/* Badge strip */}
          <div style={{
            background: "rgba(74,222,128,0.12)",
            borderBottom: "1px solid rgba(74,222,128,0.15)",
            padding: "0.5rem 1.4rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80", fontWeight: 700 }}>
              ✦ Exclusive Deal — Direct from Seller
            </span>
          </div>

          <div style={{ padding: "1.4rem" }}>
            {/* Product Title */}
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.3rem" }}>
                Featured Product
              </div>
              <h2 style={{
                margin: 0, fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                fontWeight: 600, letterSpacing: "-0.01em", color: "#e5e7eb", lineHeight: 1.35,
              }}>
                RR Signature 2200W Infrared Cooktop
                <span style={{ fontWeight: 400, color: "#6b7280", fontSize: "0.85em" }}> — Touch Panel</span>
              </h2>
            </div>

            {/* Price Comparison */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "0.75rem",
              padding: "1rem 1.2rem",
              marginBottom: "1.2rem",
            }}>
              <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6b7280", marginBottom: "0.8rem" }}>
                Price Comparison
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                {/* Flipkart price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <a
                      href="https://www.flipkart.com/rr-signature-2200-w-infrared-cooktop-touch-panel/p/itm1ab6b8d449f31"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Verify price on Flipkart"
                      style={{
                        fontSize: "0.6rem", padding: "0.1rem 0.4rem",
                        background: "rgba(255,167,38,0.15)", border: "1px solid rgba(255,167,38,0.25)",
                        borderRadius: "0.25rem", color: "#ffa726", letterSpacing: "0.08em", textTransform: "uppercase",
                        textDecoration: "none", cursor: "pointer", transition: "all 0.15s ease",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(255,167,38,0.3)";
                        e.currentTarget.style.borderColor = "rgba(255,167,38,0.6)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255,167,38,0.15)";
                        e.currentTarget.style.borderColor = "rgba(255,167,38,0.25)";
                      }}
                    >Flipkart ↗</a>
                    MRP
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "1rem", color: "#4b5563",
                    textDecoration: "line-through", textDecorationColor: "#ef4444",
                  }}>₹4,000</span>
                </div>
                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />
                {/* Our price */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{
                      fontSize: "0.6rem", padding: "0.1rem 0.4rem",
                      background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)",
                      borderRadius: "0.25rem", color: "#4ade80", letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>Our Price</span>
                    You Pay
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.4rem", fontWeight: 700, color: "#4ade80" }}>₹2,800</span>
                </div>
                {/* Savings row */}
                <div style={{
                  background: "rgba(74,222,128,0.07)", borderRadius: "0.5rem",
                  padding: "0.45rem 0.8rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 600 }}>You Save</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", color: "#4ade80", fontWeight: 600 }}>
                    ₹1,200 &nbsp;<span style={{ fontSize: "0.75rem", opacity: 0.8 }}>(30% off)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.2rem",
            }}>
              <div style={{
                background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)",
                borderRadius: "0.75rem", padding: "0.8rem 1rem",
              }}>
                <div style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>🚚</div>
                <div style={{ fontSize: "0.72rem", color: "#4ade80", fontWeight: 700, letterSpacing: "0.05em" }}>FREE Delivery</div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.1rem" }}>Within Surat</div>
              </div>
              <div style={{
                background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)",
                borderRadius: "0.75rem", padding: "0.8rem 1rem",
              }}>
                <div style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>🇮🇳</div>
                <div style={{ fontSize: "0.72rem", color: "#60a5fa", fontWeight: 700, letterSpacing: "0.05em" }}>₹100 Delivery</div>
                <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.1rem" }}>Pan India</div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/919898194074?text=${encodeURIComponent("Hi, I want to order the RR Signature 2200W Induction Cooktop")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                width: "100%", padding: "0.85rem 1.5rem",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                border: "none", borderRadius: "0.75rem",
                color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                textDecoration: "none", letterSpacing: "0.02em",
                boxShadow: "0 0 24px rgba(34,197,94,0.25)",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 36px rgba(34,197,94,0.45)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 24px rgba(34,197,94,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* WhatsApp SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Store Section */}
        <div style={{
          marginTop: "1rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "1rem 1.4rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem",
          }}>
            <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280" }}>
              How to Order
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              <span style={{ fontSize: "0.7rem", color: "#4ade80" }}>WhatsApp</span>
              <span style={{ fontSize: "0.7rem", color: "#4b5563", margin: "0 0.2rem" }}>or</span>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
              <span style={{ fontSize: "0.7rem", color: "#60a5fa" }}>Visit Store</span>
            </div>
          </div>

          <div style={{ padding: "1.2rem 1.4rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Store Info */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{
                width: "36px", height: "36px", flexShrink: 0, borderRadius: "0.5rem",
                background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
              }}>🏪</div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#e5e7eb", letterSpacing: "-0.01em" }}>
                  MS Electrical
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.15rem" }}>
                  Visit us in-store to see the product before buying
                </div>
              </div>
            </div>

            {/* Map iframe */}
            <div style={{
              borderRadius: "0.75rem", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              position: "relative", height: "200px",
            }}>
              <iframe
                title="MS Electrical Store Location"
                src="https://maps.google.com/maps?q=MS+Electrical+Surat&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) brightness(0.85)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Directions Button */}
            <a
              href="https://share.google/jBIWkKOmJXZ3pCPdB"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.55rem",
                width: "100%", padding: "0.75rem 1.2rem",
                background: "rgba(96,165,250,0.1)",
                border: "1px solid rgba(96,165,250,0.3)",
                borderRadius: "0.75rem",
                color: "#60a5fa", fontSize: "0.88rem", fontWeight: 600,
                textDecoration: "none", letterSpacing: "0.02em",
                transition: "all 0.2s ease", cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(96,165,250,0.18)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(96,165,250,0.1)";
                e.currentTarget.style.borderColor = "rgba(96,165,250,0.3)";
              }}
            >
              {/* Map pin SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Get Directions to MS Electrical
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "#6b7280" }}>
          Made with <span style={{ color: "#ef4444" }}>❤️</span> by <span style={{ color: "#e5e7eb", fontWeight: 600 }}>Siraj</span>
        </div>

      </div>
      <Analytics />
    </div>
  );
}
export default App;
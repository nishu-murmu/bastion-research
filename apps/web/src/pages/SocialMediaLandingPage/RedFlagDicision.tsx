import { useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FlagStatus = "flagged" | "clear" | null;
type FilterType = "all" | "critical" | "high" | "triggered";
type Theme = "dark" | "light";

interface FlagCard {
  id: number;
  num: string;
  name: string;
  desc: string;
  check: string;
}

interface Combo {
  id: number;
  tier: "critical" | "high";
  flags: number[];
  name: string;
  desc: string;
  flagsLabel: string;
  alert: string;
  turnaround?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FLAGS: FlagCard[] = [
  {
    id: 1,
    num: "RED FLAG 01",
    name: "Low ROCE — Wealth Destroyer",
    desc: "5-Year Average ROCE below 10–12% means the company earns less than its cost of borrowing. Every rupee deployed destroys capital. Exception: an active, credible turnaround with clear evidence of improvement.",
    check: "Screener.in → Average ROCE 5Yrs → single digits = run",
  },
  {
    id: 2,
    num: "RED FLAG 02",
    name: "Negative Free Cash Flow (FCF)",
    desc: "A business chronically unable to generate free cash, surviving only on loans or share dilution, is bleeding out. Paper profits mean nothing if cash never materialises.",
    check: "Screener.in → Free Cash Flow → chronically negative = danger",
  },
  {
    id: 3,
    num: "RED FLAG 03",
    name: "Debt-to-Equity Over 1.0 & Rising",
    desc: "Debt is fire. Borrowing just to keep operations running signals deep structural problems. A D/E that rises every year with no improvement in ROCE is a slow countdown to distress.",
    check: "Screener.in → Debt to Equity → over 1.0 and rising YoY = avoid",
  },
  {
    id: 4,
    num: "RED FLAG 04",
    name: "Poor Cash Conversion (CFO to EBITDA)",
    desc: "Profits that don't convert into cash are phantom profits. Cash is stuck in inventory or unpaid invoices. A great P&L with poor conversion is a ticking clock.",
    check: "CFO ÷ EBITDA over 6 years → below 50% = serious concern",
  },
  {
    id: 5,
    num: "RED FLAG 05",
    name: 'Volatile Operating Margins (Fake "Specialty")',
    desc: "Real specialty businesses have pricing power — margins stay stable above 20%. If margins swing between 5–12% based on raw material prices, it's a commodity business in a specialty costume.",
    check: "Screener.in → 10-Year OPM Trend → volatile = commodity",
  },
  {
    id: 6,
    num: "RED FLAG 06",
    name: "Perpetual CWIP — The Stuck Factory",
    desc: "CWIP should convert to productive assets within 2–3 years. Staying massive for 4–6 years with no completions means cash is buried in the ground earning zero return.",
    check: "Balance sheet → CWIP large 4+ years, no Gross Block growth",
  },
  {
    id: 7,
    num: "RED FLAG 07",
    name: "Goodwill ≈ Net Worth (Air Money)",
    desc: "Goodwill means we overpaid for an acquisition. Zero physical value. When goodwill approaches 100% of Net Worth, a single write-off can wipe billions in equity overnight.",
    check: "Balance sheet → Goodwill ÷ Net Worth → near 100% = timebomb",
  },
  {
    id: 8,
    num: "RED FLAG 08",
    name: "Messy Related Party Transactions (RPTs)",
    desc: "The easiest way promoters silently siphon wealth. Listed company buys from promoter's private entities at inflated prices — profits exit the company and enter their personal pocket.",
    check: "Annual report → RPTs → unexplained, large, or rising = walk away",
  },
  {
    id: 9,
    num: "RED FLAG 09",
    name: "Unhealthy Fund Flow (Tijori)",
    desc: "Cash should enter from operations and exit to assets or dividends. If operations bleed money and all inflows come from raising debt or diluting shares, the core business model is broken.",
    check: "Tijori Finance → Fund Flow → operations negative, debt/equity rising",
  },
  {
    id: 10,
    num: "RED FLAG 10",
    name: "Promoter Pledging Over 15–20%",
    desc: "Using own shares as loan collateral. A market crash triggers margin calls — the bank dumps millions of shares on the open market, creating a death spiral (see: Gensol Engineering).",
    check: "BSE/NSE disclosures → Promoter Pledging → above 15–20%",
  },
];

const SEGMENTS = [
  {
    icon: "💰",
    iconBg: "rgba(192,0,0,0.12)",
    title: "Capital & Cash",
    desc: "Is the business creating or destroying wealth?",
    flagIds: [1, 2, 3],
  },
  {
    icon: "🎭",
    iconBg: "rgba(196,182,150,0.1)",
    title: "Fake Profits & Margins",
    desc: "Are reported profits real, or accounting smoke and mirrors?",
    flagIds: [4, 5],
  },
  {
    icon: "⚖️",
    iconBg: "rgba(74,111,212,0.12)",
    title: "Hidden Balance Sheet Traps",
    desc: "What's lurking that could detonate quietly?",
    flagIds: [6, 7],
  },
  {
    icon: "🕵️",
    iconBg: "rgba(192,0,0,0.12)",
    title: "Shady Promoters & Governance",
    desc: "Can you trust the people running this company with your money?",
    flagIds: [8, 9, 10],
  },
];

const COMBOS: Combo[] = [
  {
    id: 1, tier: "critical", flags: [2, 4],
    name: "The Fake Growth Trap",
    desc: "Negative FCF + Poor Cash Conversion. Revenue grows on paper, but cash never arrives and EBITDA-to-CFO conversion stays below 50%. Both metrics independently confirm the same truth: this business cannot turn profits into real money.",
    flagsLabel: "Triggers: Flag 02 + Flag 04",
    alert: "⚠ ACTIVE — LIKELY FAKE REVENUE",
  },
  {
    id: 2, tier: "critical", flags: [1, 3, 6],
    name: "The Sunk Cost Spiral",
    desc: "Low ROCE + High Debt + Stuck CWIP. Borrowing heavily to build assets that are perpetually delayed and earn nothing. Capital is disappearing into the ground with no return in sight.",
    flagsLabel: "Triggers: Flag 01 + Flag 03 + Flag 06",
    alert: "⚠ ACTIVE — CAPITAL DESTRUCTION IN PROGRESS",
  },
  {
    id: 3, tier: "critical", flags: [8, 10],
    name: "The Fraud Precursor",
    desc: "Messy RPTs + High Promoter Pledging. Promoter is siphoning via related parties while personally leveraged against the same stock. Total capital wipeout typically follows. Do not wait for confirmation.",
    flagsLabel: "Triggers: Flag 08 + Flag 10",
    alert: "⚠ ACTIVE — EXIT IMMEDIATELY",
  },
  {
    id: 4, tier: "critical", flags: [2, 9],
    name: "The Structural Cash Hemorrhage",
    desc: "Negative FCF + Unhealthy Fund Flow. Operations bleed money AND the only lifeline is constant debt or equity dilution. No viable path to self-sufficiency exists. The business model is fundamentally broken.",
    flagsLabel: "Triggers: Flag 02 + Flag 09",
    alert: "⚠ ACTIVE — BUSINESS MODEL IS BROKEN",
  },
  {
    id: 5, tier: "critical", flags: [1, 2, 4],
    name: "The Triple Cash Failure",
    desc: "Low ROCE + Negative FCF + Poor Cash Conversion. All three cash-quality metrics failing simultaneously. The company is neither efficient, nor converting, nor generating real money. Deeply structurally broken.",
    flagsLabel: "Triggers: Flag 01 + Flag 02 + Flag 04",
    alert: "⚠ ACTIVE — FUNDAMENTAL CASH DESTRUCTION",
  },
  {
    id: 6, tier: "high", flags: [1, 2],
    name: "The Wealth Destroyer",
    desc: "Low ROCE + Negative FCF. Earning below cost of capital and generating no real cash. The business actively destroys shareholder value with every passing year it continues in this state.",
    flagsLabel: "Triggers: Flag 01 + Flag 02",
    turnaround: "⚡ Turnaround Exception: Only acceptable if ROCE is visibly improving quarter-on-quarter and the FCF trajectory is clearly reversing with a credible, time-bound plan. Evidence required — not just management commentary.",
    alert: "⚠ ACTIVE — HIGH RISK",
  },
  {
    id: 7, tier: "high", flags: [1, 3],
    name: "The Debt Trap",
    desc: "Low ROCE + High & Rising Debt. Earning below cost of capital while piling on more debt. Interest burden compounds faster than earnings can grow to meet it. A slow but inevitable death spiral.",
    flagsLabel: "Triggers: Flag 01 + Flag 03",
    turnaround: "⚡ Turnaround Exception: Acceptable only if debt is financing a high-return expansion with a clear payoff date, AND ROCE is actively improving. Management commentary alone is not sufficient.",
    alert: "⚠ ACTIVE — HIGH RISK",
  },
  {
    id: 8, tier: "high", flags: [2, 3],
    name: "Survival Mode",
    desc: "Negative FCF + High Debt. Cannot fund itself from operations; surviving purely on borrowed money. Any credit tightening, rate rise, or bank nervousness can trigger an immediate liquidity crisis.",
    flagsLabel: "Triggers: Flag 02 + Flag 03",
    turnaround: "⚡ Turnaround Exception: A company in a heavy investment phase can temporarily show negative FCF and rising debt before new capacity starts generating cash. Only acceptable if there is a clear, time-bound capex cycle nearing completion with improving operational metrics.",
    alert: "⚠ ACTIVE — LIQUIDITY RISK",
  },
  {
    id: 9, tier: "high", flags: [3, 6],
    name: "Debt-Funded Nowhere",
    desc: "High Debt + Stuck CWIP. Borrowing heavily to build a project that never completes. Debt accumulates and interest compounds; the asset produces nothing. Eventually the interest cost overwhelms the balance sheet.",
    flagsLabel: "Triggers: Flag 03 + Flag 06",
    turnaround: "⚡ Turnaround Exception: If CWIP delay is due to verified external factors (regulatory approvals, land disputes) and the project is genuinely near completion with a specific go-live date — not just management promises — this can be a monitored position.",
    alert: "⚠ ACTIVE — HIGH RISK",
  },
  {
    id: 10, tier: "high", flags: [3, 10],
    name: "The Margin Call Bomb",
    desc: "High Debt + High Promoter Pledging. The company is leveraged AND the promoter is personally leveraged against the same stock. A market correction can trigger simultaneous company-level and promoter-level default.",
    flagsLabel: "Triggers: Flag 03 + Flag 10",
    alert: "⚠ ACTIVE — DOUBLE LEVERAGE RISK",
  },
  {
    id: 11, tier: "high", flags: [8, 9],
    name: "The Promoter Drain",
    desc: "Messy RPTs + Unhealthy Fund Flow. Cash entering the business immediately leaks out to promoter-linked entities. The Tijori fund flow map will show money exiting through operating or financing channels to related parties.",
    flagsLabel: "Triggers: Flag 08 + Flag 09",
    alert: "⚠ ACTIVE — PROMOTER SIPHONING RISK",
  },
  {
    id: 12, tier: "high", flags: [3, 5],
    name: "The Cyclical Debt Disaster",
    desc: "Volatile Margins (commodity business) + High Debt. No pricing power combined with high leverage is catastrophic in a downturn. Margins compress exactly when debt repayment stress is at its highest.",
    flagsLabel: "Triggers: Flag 03 + Flag 05",
    turnaround: "⚡ Turnaround Exception: A commodity business at the bottom of a proven industry cycle with manageable debt and a history of surviving previous downturns may recover when the cycle turns. Requires clear evidence you are near cycle bottom — not just hope.",
    alert: "⚠ ACTIVE — CYCLICAL COLLAPSE RISK",
  },
  {
    id: 13, tier: "high", flags: [3, 7],
    name: "The Debt-Funded Acquisition Gamble",
    desc: "Goodwill ≈ Net Worth + High Debt. Overpaid for an acquisition and funded it with debt. If the acquired business underperforms, a goodwill write-off wipes equity while the debt remains. Double pain, no escape.",
    flagsLabel: "Triggers: Flag 03 + Flag 07",
    alert: "⚠ ACTIVE — ACQUISITION BLOW-UP RISK",
  },
  {
    id: 14, tier: "high", flags: [2, 6],
    name: "The Capital Graveyard",
    desc: "Negative FCF + Stuck CWIP. Money is sinking into an incomplete project that generates nothing, while the existing business also fails to generate free cash. Capital is trapped on both fronts with no near-term exit.",
    flagsLabel: "Triggers: Flag 02 + Flag 06",
    turnaround: "⚡ Turnaround Exception: If the stuck CWIP is verifiably close to completion (specific commissioning date, construction nearly done) and existing operations show improving FCF trajectory, the thesis can hold. Both conditions must be true — not just one.",
    alert: "⚠ ACTIVE — CAPITAL FULLY TRAPPED",
  },
  {
    id: 15, tier: "high", flags: [4, 7],
    name: "The Hollow Acquisition",
    desc: "Poor Cash Conversion + Goodwill ≈ Net Worth. The company overpaid for an acquisition AND cannot convert its own profits into cash. Both the legacy business and the acquired business are underperforming — equity is doubly at risk.",
    flagsLabel: "Triggers: Flag 04 + Flag 07",
    alert: "⚠ ACTIVE — EARNINGS QUALITY EXTREMELY LOW",
  },
  {
    id: 16, tier: "high", flags: [1, 5],
    name: "The Commodity Trap",
    desc: "Low ROCE + Volatile Margins. No pricing power and no capital efficiency. Management claims specialty status; the numbers prove otherwise. You are paying a premium multiple for a commodity producer.",
    flagsLabel: "Triggers: Flag 01 + Flag 05",
    turnaround: "⚡ Turnaround Exception: A commodity business at the bottom of its cycle can show temporarily low ROCE and volatile margins before recovering. Acceptable only if there is a clear industry cycle thesis, the balance sheet is clean enough to survive the downturn, and management is not dressing it up as specialty.",
    alert: "⚠ ACTIVE — OVERVALUED COMMODITY BUSINESS",
  },
  {
    id: 17, tier: "high", flags: [1],
    name: "The Dead Capital Business",
    desc: "Low ROCE — standalone. A business with persistently low ROCE and no credible path to improving it is a value trap regardless of how cheap the valuation looks. Capital deployed here earns less than it cost to raise. Time destroys value in these companies even if nothing else goes wrong.",
    flagsLabel: "Triggers: Flag 01 (standalone)",
    turnaround: "⚡ Turnaround Exception: The only acceptable scenario is an active, time-bound turnaround where ROCE is already showing measurable quarterly improvement — not a promise of future improvement. If management has been saying ROCE will improve for 3+ years with no data to back it, there is no turnaround. Walk away.",
    alert: "⚠ ACTIVE — AVOID UNLESS TURNAROUND IS PROVEN",
  },
  {
    id: 18, tier: "high", flags: [5, 7],
    name: "The Overvalued Acquirer",
    desc: "Volatile Margins (commodity) + Goodwill ≈ Net Worth. A business with no pricing power that also overpaid for an acquisition. When the cycle turns down, both margins compress AND goodwill faces write-off risk simultaneously.",
    flagsLabel: "Triggers: Flag 05 + Flag 07",
    alert: "⚠ ACTIVE — HIGH RISK",
  },
  {
    id: 19, tier: "high", flags: [1, 6],
    name: "The Expanding Underperformer",
    desc: "Low ROCE + Stuck CWIP. The business earns below cost of capital on existing assets and is simultaneously sinking more capital into a delayed expansion. Adding capacity to an already poor-return business compounds the value destruction.",
    flagsLabel: "Triggers: Flag 01 + Flag 06",
    turnaround: "⚡ Turnaround Exception: If the new capacity (CWIP) is structurally different from existing operations — higher-margin product, new geography, contracted offtake — and ROCE is expected to improve materially once commissioned. Requires specific evidence, not hope.",
    alert: "⚠ ACTIVE — HIGH RISK",
  },
  {
    id: 20, tier: "high", flags: [4, 9],
    name: "The Governance Cash Leak",
    desc: "Poor Cash Conversion + Messy RPTs. Cash conversion is poor AND related party transactions are messy. This combination raises a specific question: is the cash conversion poor because of genuine operational issues, or because profits are being quietly redirected to promoter-linked entities before they reach the books?",
    flagsLabel: "Triggers: Flag 04 + Flag 08",
    alert: "⚠ ACTIVE — GOVERNANCE CASH DIVERSION RISK",
  },
];

// ─── Token Maps ────────────────────────────────────────────────────────────────

const darkTokens = {
  bg: "#0e1016", bg2: "#141820", surface: "#181e2a", surface2: "#1e2535",
  surface3: "#242d40", border: "#2c3650", borderSoft: "#232d42",
  red: "#C00000", redBright: "#e03030", redMuted: "rgba(192,0,0,0.12)", redBorder: "rgba(192,0,0,0.35)",
  blue: "#1C2852", blueBright: "#4a6fd4", blueMuted: "rgba(74,111,212,0.12)", blueBorder: "rgba(74,111,212,0.4)",
  gold: "#C4B696", goldBright: "#d9cdb0", goldMuted: "rgba(196,182,150,0.1)", goldBorder: "rgba(196,182,150,0.3)",
  green: "#1a9e78", greenBright: "#22c997", greenMuted: "rgba(26,158,120,0.12)", greenBorder: "rgba(34,201,151,0.35)",
  text: "#dde3f0", textDim: "#6e7d99", textMuted: "#3d4a62",
};

const lightTokens = {
  bg: "#f0f2f7", bg2: "#e8eaf2", surface: "#ffffff", surface2: "#f5f6fa",
  surface3: "#eceef5", border: "#d4d8e8", borderSoft: "#dfe2ee",
  red: "#C00000", redBright: "#C00000", redMuted: "rgba(192,0,0,0.07)", redBorder: "rgba(192,0,0,0.3)",
  blue: "#1C2852", blueBright: "#1C2852", blueMuted: "rgba(28,40,82,0.07)", blueBorder: "rgba(28,40,82,0.3)",
  gold: "#8a7650", goldBright: "#7a6640", goldMuted: "rgba(138,118,80,0.08)", goldBorder: "rgba(138,118,80,0.3)",
  green: "#1a7a5e", greenBright: "#1a7a5e", greenMuted: "rgba(26,122,94,0.08)", greenBorder: "rgba(26,122,94,0.3)",
  text: "#1C2852", textDim: "#5a6882", textMuted: "#a0aac0",
};

type Tokens = typeof darkTokens;

// ─── ToggleButton ─────────────────────────────────────────────────────────────

interface ToggleButtonProps {
  label: string;
  active: boolean;
  activeStyle: React.CSSProperties;
  t: Tokens;
  onClick: () => void;
}

function ToggleButton({ label, active, activeStyle, t, onClick }: ToggleButtonProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 78,
        padding: "8px 0",
        borderRadius: 6,
        border: `1px solid ${hovered && !active ? t.textDim : t.border}`,
        background: hovered && !active ? t.surface3 : t.surface2,
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.2s",
        color: hovered && !active ? t.text : t.textDim,
        textAlign: "center",
        fontWeight: 500,
        ...(active ? activeStyle : {}),
      }}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RedFlagChecklist() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [flags, setFlags] = useState<Record<number, FlagStatus>>({});
  const [filter, setFilter] = useState<FilterType>("all");

  const t: Tokens = theme === "dark" ? darkTokens : lightTokens;

  const setFlag = useCallback((id: number, status: FlagStatus) => {
    setFlags((prev) => ({ ...prev, [id]: status }));
  }, []);

  const isFlagged = (id: number) => flags[id] === "flagged";
  const flagged = Object.values(flags).filter((v) => v === "flagged").length;
  const answered = Object.keys(flags).length;

  const evaluateCombos = () => {
    const triggered = { critical: [] as string[], high: [] as string[] };
    COMBOS.forEach((combo) => {
      if (combo.flags.every((f) => isFlagged(f))) {
        triggered[combo.tier].push(combo.name);
      }
    });
    return triggered;
  };

  const triggered = evaluateCombos();
  const hasCritical = triggered.critical.length > 0;
  const hasHigh = triggered.high.length > 0;
  const allActiveNames = [...triggered.critical, ...triggered.high];

  const scoreColor = flagged === 0 ? t.blueBright : hasCritical ? t.red : t.gold;
  const progressColor = flagged === 0 ? t.blueBright : hasCritical ? t.red : t.gold;

  const verdictInlineText =
    answered === 0 ? "Not started" :
      hasCritical ? "☠ Critical Combo Active" :
        hasHigh ? "✗ High Risk Combo Active" :
          flagged > 0 ? "⚠ Flags Raised — No Combo Yet" :
            "✓ No Flags So Far";

  const verdictInlineColor =
    answered === 0 ? t.textDim :
      hasCritical ? t.red :
        hasHigh || flagged > 0 ? t.gold :
          t.greenBright;

  const verdictSubText =
    answered === 0 ? "Mark flags below to begin" :
      hasCritical ? `${triggered.critical.length} critical combination(s) triggered` :
        hasHigh ? `${triggered.high.length} high-risk combination(s) triggered` :
          flagged > 0 ? `${flagged} flag(s) raised — review remaining items` :
            `${answered} of 10 reviewed`;

  const bannerVariant =
    answered === 0 ? "default" :
      hasCritical ? "danger" :
        hasHigh ? "high" :
          flagged > 0 ? "caution" : "safe";

  const bannerMain =
    bannerVariant === "default" ? "Awaiting Input" :
      bannerVariant === "danger" ? "☠ DO NOT INVEST — EXIT NOW" :
        bannerVariant === "high" ? "✗ HIGH RISK — AVOID" :
          bannerVariant === "caution" ? "⚠ PROCEED WITH CAUTION" :
            "✓ PASSES FORENSIC CHECK";

  const bannerDetail =
    bannerVariant === "default" ? "Mark each flag above as CLEAR or FLAGGED to receive your verdict. The verdict is driven entirely by meaningful flag combinations — not a raw count." :
      bannerVariant === "danger" ? "One or more Critical combinations are active. These patterns indicate a high probability of capital destruction, accounting fraud, or governance collapse. No valuation is cheap enough to justify this." :
        bannerVariant === "high" ? "One or more High Risk combinations are active. Serious structural problems are present. Unless you have a well-researched, time-bound turnaround thesis with specific numeric evidence — do not commit capital." :
          bannerVariant === "caution" ? "Flags have been raised but no dangerous combination has triggered yet. Complete the remaining flags — a combination may still emerge. Investigate each flagged item in depth before investing." :
            "No red flags detected and no toxic combinations are active. This stock passes the forensic quality screen. You may proceed to valuation analysis.";

  const bannerBorderTop =
    bannerVariant === "default" ? `1px solid ${t.border}` :
      bannerVariant === "safe" ? `3px solid ${t.greenBright}` :
        bannerVariant === "caution" ? `3px solid ${t.gold}` :
          bannerVariant === "high" ? `3px solid ${t.red}` :
            `4px solid ${t.red}`;

  const bannerBg =
    bannerVariant === "default" ? t.surface2 :
      bannerVariant === "safe" ? t.greenMuted :
        bannerVariant === "caution" ? t.goldMuted :
          t.redMuted;

  const bannerBorderColor =
    bannerVariant === "default" ? t.border :
      bannerVariant === "safe" ? t.greenBorder :
        bannerVariant === "caution" ? t.goldBorder :
          t.redBorder;

  const bannerTitleColor =
    bannerVariant === "default" ? t.textDim :
      bannerVariant === "safe" ? t.greenBright :
        bannerVariant === "caution" ? t.gold :
          t.red;

  const isComboTriggered = (combo: Combo) => combo.flags.every((f) => isFlagged(f));

  const visibleCombos = COMBOS.filter((combo) => {
    if (filter === "all") return true;
    if (filter === "critical") return combo.tier === "critical";
    if (filter === "high") return combo.tier === "high";
    if (filter === "triggered") return isComboTriggered(combo);
    return true;
  });

  const resetAll = () => { setFlags({}); setFilter("all"); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .combo-blink { animation: blink 1.8s infinite; }
        @media (max-width: 580px) {
          .flag-card-grid { grid-template-columns: 1fr !important; }
          .toggle-group { flex-direction: row !important; }
          .toggle-btn { flex: 1; }
          .score-bar { flex-direction: column; align-items: flex-start !important; }
          .verdict-box { text-align: left !important; }
          .progress-track { width: 100% !important; }
        }
      `}</style>

      <div style={{ background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden", transition: "background 0.3s, color 0.3s" }}>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ position: "fixed", top: 18, right: 20, zIndex: 200, display: "flex", alignItems: "center", gap: 9, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 99, padding: "7px 14px 7px 10px", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDim, transition: "all 0.2s", boxShadow: "0 2px 16px rgba(0,0,0,0.18)", userSelect: "none" }}
        >
          <div style={{ width: 34, height: 20, background: theme === "light" ? t.blue : t.border, borderRadius: 99, position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
            <div style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: theme === "light" ? "#fff" : t.textDim, top: 3, left: 3, transform: theme === "light" ? "translateX(14px)" : "none", transition: "transform 0.3s, background 0.3s" }} />
          </div>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Wrapper */}
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "52px 24px 88px" }}>

          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: 48, paddingTop: 8 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.3em", color: t.gold, textTransform: "uppercase", marginBottom: 16, opacity: 0.9 }}>
              Bastion CORE · Forensic Stock Checklist
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 7vw, 72px)", letterSpacing: "0.02em", lineHeight: 0.95, color: t.text }}>
              Did Your Stock Pass<br />The <span style={{ color: t.red }}>Red Flag</span> Test?
            </h1>
            <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${t.red}, transparent)`, margin: "20px auto 16px", borderRadius: 2 }} />
            <p style={{ color: t.textDim, fontSize: 14, fontWeight: 300, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Mark each flag CLEAR ✓ or FLAGGED ✗. The verdict updates live and is driven <em>only</em> by meaningful flag combinations — never by a raw count.
            </p>
          </header>

          {/* Score Bar */}
          <div className="score-bar" style={{ background: t.surface, border: `1px solid ${t.border}`, borderTop: `3px solid ${t.blue}`, borderRadius: 12, padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 40, flexWrap: "wrap", transition: "background 0.3s, border-color 0.3s" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: t.textDim, textTransform: "uppercase", marginBottom: 4 }}>Flags Triggered</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1, color: scoreColor, transition: "color 0.4s" }}>{flagged} / 10</div>
              <div className="progress-track" style={{ width: 160, height: 4, background: t.surface3, borderRadius: 99, overflow: "hidden", marginTop: 10 }}>
                <div style={{ height: "100%", borderRadius: 99, background: progressColor, width: `${(flagged / 10) * 100}%`, transition: "width 0.5s ease, background 0.4s" }} />
              </div>
            </div>
            <div className="verdict-box" style={{ flex: 1, textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: verdictInlineColor, transition: "color 0.3s" }}>{verdictInlineText}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 5, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>{verdictSubText}</div>
            </div>
            <button
              onClick={resetAll}
              onMouseEnter={(e) => { (e.currentTarget).style.borderColor = t.blueBright; (e.currentTarget).style.color = t.text; }}
              onMouseLeave={(e) => { (e.currentTarget).style.borderColor = t.border; (e.currentTarget).style.color = t.textDim; }}
              style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textDim, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "9px 18px", borderRadius: 6, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
            >↺ Reset</button>
          </div>

          {/* Segments */}
          {SEGMENTS.map((seg) => (
            <div key={seg.title} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${t.borderSoft}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0, background: seg.iconBg }}>{seg.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, letterSpacing: "0.06em", color: t.text }}>{seg.title}</div>
                  <div style={{ fontSize: 12, color: t.textDim, marginTop: 2, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>{seg.desc}</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {seg.flagIds.map((fid) => {
                  const flag = FLAGS.find((f) => f.id === fid)!;
                  const status = flags[fid] ?? null;
                  const isFl = status === "flagged";
                  const isCl = status === "clear";
                  return (
                    <div key={fid} className="flag-card-grid" style={{ background: isFl ? t.redMuted : isCl ? t.greenMuted : t.surface, border: `1px solid ${isFl ? t.redBorder : isCl ? t.greenBorder : t.borderSoft}`, borderRadius: 10, padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", transition: "border-color 0.25s, background 0.25s", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: isFl ? t.red : isCl ? t.greenBright : t.border, transition: "background 0.3s" }} />
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: isFl ? t.redBright : isCl ? t.greenBright : t.textMuted, letterSpacing: "0.12em", marginBottom: 5, textTransform: "uppercase", opacity: isFl || isCl ? 0.8 : 1 }}>{flag.num}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 6, letterSpacing: "0.01em" }}>{flag.name}</div>
                        <div style={{ fontSize: 12, color: t.textDim, lineHeight: 1.6 }}>{flag.desc}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.gold, background: t.goldMuted, border: `1px solid ${t.goldBorder}`, borderRadius: 4, padding: "4px 9px", marginTop: 9, display: "inline-block", letterSpacing: "0.04em" }}>{flag.check}</div>
                      </div>
                      <div className="toggle-group" style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                        <ToggleButton label="✗ FLAG" active={isFl} activeStyle={{ background: t.red, borderColor: t.red, color: "#fff", fontWeight: 600, boxShadow: "0 2px 12px rgba(192,0,0,0.4)" }} t={t} onClick={() => setFlag(fid, "flagged")} />
                        <ToggleButton label="✓ CLEAR" active={isCl} activeStyle={{ background: t.green, borderColor: t.greenBright, color: "#fff", fontWeight: 600, boxShadow: "0 2px 12px rgba(26,158,120,0.35)" }} t={t} onClick={() => setFlag(fid, "clear")} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.border}, transparent)`, margin: "44px 0" }} />

          {/* Combos Section */}
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderTop: `3px solid ${t.red}`, borderRadius: 12, padding: 28, transition: "background 0.3s, border-color 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 22 }}>☠️</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.05em", color: t.red }}>20 Toxic Combinations</div>
            </div>
            <div style={{ fontSize: 12, color: t.textDim, marginBottom: 22, lineHeight: 1.6, maxWidth: 620 }}>
              Auto-highlights when relevant flags are marked above. Your verdict is driven <strong>only</strong> by these meaningful patterns — never by a raw count of flags.
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
              {[{ color: t.red, label: "Critical — Do Not Invest / Exit Now" }, { color: t.gold, label: "High Risk — Avoid (unless strong turnaround case)" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: t.textDim, textTransform: "uppercase" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, flexShrink: 0, background: color }} />
                  {label}
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {([{ key: "all", label: "All 20" }, { key: "critical", label: "Critical Only" }, { key: "high", label: "High Risk Only" }, { key: "triggered", label: "Triggered ✗" }] as { key: FilterType; label: string }[]).map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${filter === key ? t.blueBright : t.border}`, background: filter === key ? t.blueMuted : "transparent", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: filter === key ? t.blueBright : t.textDim, cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
              ))}
            </div>

            {/* Combo Grid */}
            <div style={{ display: "grid", gap: 10 }}>
              {visibleCombos.map((combo) => {
                const active = isComboTriggered(combo);
                const isCrit = combo.tier === "critical";
                return (
                  <div key={combo.id} style={{ background: active ? (isCrit ? t.redMuted : t.goldMuted) : t.surface2, border: `1px solid ${active ? (isCrit ? t.redBorder : t.goldBorder) : t.borderSoft}`, borderRadius: 8, padding: "14px 18px", display: "grid", gridTemplateColumns: "32px 1fr", gap: 14, alignItems: "flex-start", transition: "border-color 0.3s, background 0.3s", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: active ? (isCrit ? t.red : t.gold) : (isCrit ? "rgba(192,0,0,0.3)" : "rgba(196,182,150,0.3)"), transition: "background 0.3s" }} />
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: active ? (isCrit ? t.red : t.gold) : t.textMuted, lineHeight: 1, transition: "color 0.3s" }}>{combo.id}</div>
                    <div>
                      <span style={{ display: "inline-block", fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, marginBottom: 5, background: isCrit ? t.redMuted : t.goldMuted, color: isCrit ? t.redBright : t.gold, border: `1px solid ${isCrit ? t.redBorder : t.goldBorder}` }}>{isCrit ? "Critical" : "High Risk"}</span>
                      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 4 }}>{combo.name}</div>
                      <div style={{ fontSize: 11.5, color: t.textDim, lineHeight: 1.55 }}>{combo.desc}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.textMuted, marginTop: 6, letterSpacing: "0.05em" }}>{combo.flagsLabel}</div>
                      {combo.turnaround && (
                        <div style={{ fontSize: 11, color: t.gold, background: t.goldMuted, border: `1px solid ${t.goldBorder}`, borderLeft: `3px solid ${t.gold}`, borderRadius: 4, padding: "6px 10px", marginTop: 9, lineHeight: 1.55 }}>{combo.turnaround}</div>
                      )}
                      {active && (
                        <div className="combo-blink" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: isCrit ? t.redBright : t.gold }}>{combo.alert}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verdict Banner */}
          <div style={{ marginTop: 32, borderRadius: 12, padding: "30px 36px", textAlign: "center", transition: "all 0.45s", background: bannerBg, border: `1px solid ${bannerBorderColor}`, borderTop: bannerBorderTop }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: "0.05em", marginBottom: 10, color: bannerTitleColor, transition: "color 0.4s" }}>{bannerMain}</div>
            <div style={{ fontSize: 13.5, color: t.textDim, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{bannerDetail}</div>
            {allActiveNames.length > 0 && (
              <div style={{ marginTop: 16, fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.textDim, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
                {allActiveNames.map((name) => (
                  <span key={name} style={{ display: "inline-block", background: t.redMuted, border: `1px solid ${t.redBorder}`, borderRadius: 4, padding: "3px 10px", color: t.redBright }}>{name}</span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 56, textAlign: "center", fontSize: 10, color: t.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            BASTION CORE · FOR EDUCATIONAL PURPOSES ONLY · NOT INVESTMENT ADVICE
          </div>

        </div>
      </div>
    </>
  );
}
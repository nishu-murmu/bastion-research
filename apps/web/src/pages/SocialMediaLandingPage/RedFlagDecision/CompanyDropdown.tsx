
import React from "react";

function CompanyDropdown({
  companies,
  value,
  onChange,
  t,
  loading,
}: {
  companies: RedFlagCompany[];
  value: string;
  onChange: (companyId: string) => void;
  t: Tokens;
  loading: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside to close dropdown
  React.useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const selected = companies.find(c => c.id === value);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 280,
        position: "relative",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: t.textDim,
        }}
      >
        Company
      </div>
      <button
        type="button"
        disabled={loading || companies.length === 0}
        onClick={() => {
          if (!loading && companies.length > 0) setOpen(v => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          padding: "10px 12px",
          color: t.text,
          fontSize: 13,
          outline: "none",
          cursor: loading ? "wait" : "pointer",
          gap: 10,
          transition: "all 0.2s",
        }}
      >
        {selected && selected.logo_url ? (
          <img
            src={selected.logo_url}
            alt=""
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              objectFit: "contain",
              border: `1px solid ${t.border}`,
              background: t.surface3,
              marginRight: 7,
              flexShrink: 0,
            }}
          />
        ) : (
          <span
            style={{
              width: 24,
              height: 24,
              display: "inline-block",
              borderRadius: 6,
              background: t.surface3,
              marginRight: 7,
              verticalAlign: "middle",
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ flex: 1 }}>
          {selected ? selected.name : loading ? "Loading..." : "Select a company"}
        </span>
        <svg width={20} height={20} viewBox="0 0 20 20" style={{
          marginLeft: 14,
          fill: "none",
          stroke: t.textDim,
          strokeWidth: 1.6,
          opacity: 0.7,
        }}>
          <polyline points="5,8 10,13 15,8" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: t.surface,
            border: `1px solid ${t.borderSoft || t.border}`,
            borderRadius: 10,
            maxHeight: 285,
            overflowY: "auto",
            boxShadow: "0 7px 32px rgba(0,0,0,0.08)",
            zIndex: 1002,
            minWidth: 240,
            fontSize: 13,
          }}
        >
          {companies.length === 0 ? (
            <div
              style={{
                padding: "12px 14px",
                color: t.textDim,
                opacity: 0.85,
                fontStyle: "italic",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {loading ? "Loading..." : "No companies"}
            </div>
          ) : (
            companies.map((c) => (
              <div
                key={c.id}
                role="option"
                aria-selected={c.id === value}
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                }}
                tabIndex={0}
                onKeyPress={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    onChange(c.id);
                    setOpen(false);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  cursor: "pointer",
                  background: c.id === value ? t.blueMuted : undefined,
                  color: t.text,
                  fontWeight: c.id === value ? 600 : 400,
                  borderBottom:
                    "1px solid " +
                    (t.borderSoft ? t.borderSoft : "#eee"),
                  transition: "background 0.12s",
                }}
              >
                {c.logo_url ? (
                  <img
                    src={c.logo_url}
                    alt=""
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 5,
                      objectFit: "contain",
                      border: `1px solid ${t.border}`,
                      background: t.surface3,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      display: "inline-block",
                      borderRadius: 5,
                      background: t.surface3,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span>{c.name}</span>
                {c.id === value && (
                  <span style={{ marginLeft: "auto", color: t.blueBright }}>
                    ✓
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyDropdown;
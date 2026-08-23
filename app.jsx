import React, { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// Data — swap this for a real API/DB call later (see notes at bottom of chat)
// ---------------------------------------------------------------------------
const BIKES = [
  { name: "Splendor Plus", brand: "Hero", cc: 100, type: "Commuter", power: "8.0 bhp", weight: "112 kg", price: "$900" },
  { name: "Activa 6G", brand: "Honda", cc: 110, type: "Scooter", power: "7.7 bhp", weight: "107 kg", price: "$1,050" },
  { name: "Pulsar 125", brand: "Bajaj", cc: 124, type: "Commuter", power: "11.8 bhp", weight: "140 kg", price: "$1,150" },
  { name: "Gixxer 155", brand: "Suzuki", cc: 155, type: "Naked", power: "13.6 bhp", weight: "135 kg", price: "$1,700" },
  { name: "Pulsar NS200", brand: "Bajaj", cc: 199, type: "Naked", power: "24.5 bhp", weight: "156 kg", price: "$2,000" },
  { name: "KTM Duke 250", brand: "KTM", cc: 249, type: "Naked", power: "29.4 bhp", weight: "159 kg", price: "$3,400" },
  { name: "RC 390", brand: "KTM", cc: 373, type: "Sport", power: "43.5 bhp", weight: "172 kg", price: "$5,800" },
  { name: "MT-03", brand: "Yamaha", cc: 321, type: "Naked", power: "42 bhp", weight: "168 kg", price: "$5,300" },
  { name: "CB300R", brand: "Honda", cc: 286, type: "Naked", power: "30.9 bhp", weight: "144 kg", price: "$4,900" },
  { name: "Himalayan 450", brand: "Royal Enfield", cc: 452, type: "Adventure", power: "40 bhp", weight: "196 kg", price: "$5,700" },
  { name: "Classic 350", brand: "Royal Enfield", cc: 349, type: "Cruiser", power: "20.2 bhp", weight: "195 kg", price: "$4,200" },
  { name: "SV650", brand: "Suzuki", cc: 645, type: "Sport", power: "75 bhp", weight: "197 kg", price: "$7,600" },
  { name: "MT-07", brand: "Yamaha", cc: 689, type: "Naked", power: "72.4 bhp", weight: "184 kg", price: "$8,000" },
  { name: "Trident 660", brand: "Triumph", cc: 660, type: "Naked", power: "80 bhp", weight: "189 kg", price: "$8,600" },
  { name: "CB650R", brand: "Honda", cc: 649, type: "Naked", power: "94 bhp", weight: "202 kg", price: "$9,200" },
  { name: "Street Triple 765", brand: "Triumph", cc: 765, type: "Naked", power: "128 bhp", weight: "188 kg", price: "$11,300" },
  { name: "MT-09", brand: "Yamaha", cc: 890, type: "Naked", power: "117.4 bhp", weight: "193 kg", price: "$10,500" },
  { name: "Z900", brand: "Kawasaki", cc: 948, type: "Naked", power: "125 bhp", weight: "212 kg", price: "$10,000" },
  { name: "CBR1000RR-R", brand: "Honda", cc: 999, type: "Sport", power: "217.6 bhp", weight: "201 kg", price: "$28,500" },
  { name: "Panigale V4", brand: "Ducati", cc: 1103, type: "Sport", power: "214 bhp", weight: "198 kg", price: "$29,000" },
  { name: "R1250GS", brand: "BMW", cc: 1254, type: "Adventure", power: "136 bhp", weight: "249 kg", price: "$19,000" },
  { name: "Road King", brand: "Harley-Davidson", cc: 1868, type: "Cruiser", power: "93 bhp", weight: "364 kg", price: "$21,000" },
  { name: "Hayabusa", brand: "Suzuki", cc: 1340, type: "Sport", power: "190 bhp", weight: "264 kg", price: "$18,800" },
  { name: "Gold Wing", brand: "Honda", cc: 1833, type: "Touring", power: "125 bhp", weight: "379 kg", price: "$27,500" },
];

// Displacement bands, styled like tachometer redline zones — low cc reads
// "cool/green", high cc reads "hot/red", the way an engine actually behaves.
const BANDS = [
  { id: "all", label: "All", min: 0, max: Infinity, color: "#8B8F98" },
  { id: "b1", label: "≤125cc", min: 0, max: 125, color: "#4ADE80" },
  { id: "b2", label: "126–250cc", min: 126, max: 250, color: "#A3E635" },
  { id: "b3", label: "251–400cc", min: 251, max: 400, color: "#FACC15" },
  { id: "b4", label: "401–650cc", min: 401, max: 650, color: "#FB923C" },
  { id: "b5", label: "651–1000cc", min: 651, max: 1000, color: "#F97316" },
  { id: "b6", label: "1000cc+", min: 1001, max: Infinity, color: "#EF4444" },
];

function bandFor(cc) {
  return BANDS.find((b) => b.id !== "all" && cc >= b.min && cc <= b.max) || BANDS[0];
}

export default function DisplacementApp() {
  const [activeBand, setActiveBand] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("cc-asc");

  const filtered = useMemo(() => {
    const band = BANDS.find((b) => b.id === activeBand);
    let list = BIKES.filter((b) => b.cc >= band.min && b.cc <= band.max);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.brand.toLowerCase().includes(q) ||
          b.type.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "cc-asc") return a.cc - b.cc;
      if (sortBy === "cc-desc") return b.cc - a.cc;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [activeBand, query, sortBy]);

  const counts = useMemo(() => {
    const c = {};
    BANDS.forEach((b) => {
      c[b.id] = BIKES.filter((bike) => bike.cc >= b.min && bike.cc <= b.max).length;
    });
    return c;
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#14161A",
        color: "#EDEDE8",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #FFB100; color: #14161A; }
        .band-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .band-btn:hover { transform: translateY(-2px); }
        .band-btn:focus-visible, .card:focus-visible, input:focus-visible, select:focus-visible {
          outline: 2px solid #FFB100; outline-offset: 2px;
        }
        .card { transition: transform 0.15s ease, border-color 0.15s ease; }
        .card:hover { transform: translateY(-3px); border-color: #FFB100 !important; }
        @media (prefers-reduced-motion: reduce) {
          .band-btn, .card { transition: none !important; }
          .band-btn:hover, .card:hover { transform: none !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "48px 32px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0.5px",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Displacement
          </h1>
          <span style={{ color: "#8B8F98", fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>
            /ˈdɪs.pleɪs.mənt/ — cubic centimeters swept per engine cycle
          </span>
        </div>
        <p style={{ color: "#8B8F98", marginTop: 8, fontSize: 15, maxWidth: 560 }}>
          {BIKES.length} bikes, sorted the way an engine actually reads: by what's under the tank.
        </p>
      </div>

      {/* Redline strip — the signature element: a flattened tachometer */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 8px" }}>
        <div
          role="group"
          aria-label="Filter by displacement band"
          style={{
            display: "flex",
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #2A2E35",
          }}
        >
          {BANDS.filter((b) => b.id !== "all").map((b) => (
            <button
              key={b.id}
              className="band-btn"
              onClick={() => setActiveBand(activeBand === b.id ? "all" : b.id)}
              style={{
                flex: 1,
                minWidth: 90,
                border: "none",
                cursor: "pointer",
                padding: "14px 8px 10px",
                background: activeBand === b.id ? "#1E2126" : "#181A1F",
                borderTop: `3px solid ${b.color}`,
                color: activeBand === b.id ? "#EDEDE8" : "#8B8F98",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12.5,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 500 }}>{b.label}</div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{counts[b.id]} bikes</div>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 32px",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, brand, or type…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: "1 1 260px",
            background: "#1E2126",
            border: "1px solid #2A2E35",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#EDEDE8",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: "#1E2126",
            border: "1px solid #2A2E35",
            borderRadius: 8,
            padding: "10px 14px",
            color: "#EDEDE8",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          <option value="cc-asc">CC — low to high</option>
          <option value="cc-desc">CC — high to low</option>
          <option value="name">Name — A to Z</option>
        </select>
        {activeBand !== "all" && (
          <button
            onClick={() => setActiveBand("all")}
            style={{
              background: "transparent",
              border: "1px solid #2A2E35",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#8B8F98",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            ✕ clear band filter
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 64px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#8B8F98",
              border: "1px dashed #2A2E35",
              borderRadius: 12,
            }}
          >
            Nothing in this range matches "{query}". Try a different search or clear the band filter.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {filtered.map((bike, i) => {
              const band = bandFor(bike.cc);
              return (
                <div
                  key={i}
                  className="card"
                  tabIndex={0}
                  style={{
                    background: "#1E2126",
                    border: "1px solid #2A2E35",
                    borderRadius: 10,
                    padding: "16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#8B8F98", fontFamily: "'JetBrains Mono', monospace" }}>
                        {bike.brand}
                      </div>
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 19, fontWeight: 600, marginTop: 2 }}>
                        {bike.name}
                      </div>
                    </div>
                    <div
                      style={{
                        background: band.color,
                        color: "#14161A",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: 6,
                        padding: "3px 7px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bike.cc}cc
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px solid #2A2E35",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      rowGap: 6,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12.5,
                    }}
                  >
                    <span style={{ color: "#8B8F98" }}>Type</span>
                    <span style={{ textAlign: "right" }}>{bike.type}</span>
                    <span style={{ color: "#8B8F98" }}>Power</span>
                    <span style={{ textAlign: "right" }}>{bike.power}</span>
                    <span style={{ color: "#8B8F98" }}>Weight</span>
                    <span style={{ textAlign: "right" }}>{bike.weight}</span>
                    <span style={{ color: "#8B8F98" }}>Price</span>
                    <span style={{ textAlign: "right", color: "#FFB100" }}>{bike.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

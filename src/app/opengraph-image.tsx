import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "La Darka — Burgers & Street Food à Lyon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 20% 10%, #ff4d2e22 0%, transparent 50%), radial-gradient(circle at 90% 90%, #f5c51822 0%, transparent 50%), #0a0908",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#ff4d2e",
              boxShadow: "0 0 24px #ff4d2e",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#8b827a",
            }}
          >
            La Darka · Lyon
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -4,
            }}
          >
            Smash. Crispy.
          </div>
          <div
            style={{
              fontSize: 140,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -4,
              color: "#ff4d2e",
            }}
          >
            Sauce.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#8b827a",
            fontSize: 26,
          }}
        >
          <div>Burgers · Ailes BBQ · Sandwichs maison</div>
          <div style={{ color: "#fafaf9" }}>★ 4.8 · 1200+ avis</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

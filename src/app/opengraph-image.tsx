import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/** Branded social card — wired automatically at /opengraph-image */
export const alt = "MarkaUI — Premium React Component Library";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAROON = "#7d1f2e";
const MAROON_DARK = "#5b1522";
const GOLD = "#d9a94a";
const CREAM = "#f7efe2";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${MAROON_DARK} 0%, ${MAROON} 55%, #8d2a3c 100%)`,
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* gold frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `2px solid rgba(217, 169, 74, 0.45)`,
            borderRadius: 24,
            display: "flex",
          }}
        />
        {/* gem emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${GOLD}, #b8862f)`,
            marginBottom: 36,
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: CREAM,
              borderRadius: 10,
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: CREAM,
            letterSpacing: -2,
            marginBottom: 18,
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: GOLD,
            fontWeight: 500,
            marginBottom: 44,
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["339+ Components", "12 Luxury Themes", "Light & Dark", "TypeScript"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 26px",
                borderRadius: 999,
                border: "1.5px solid rgba(217, 169, 74, 0.55)",
                background: "rgba(217, 169, 74, 0.12)",
                color: CREAM,
                fontSize: 24,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}

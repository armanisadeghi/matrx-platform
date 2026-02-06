import { ImageResponse } from "next/og";

/**
 * Default Open Graph Image
 *
 * Auto-generated OG image for pages that do not provide their own.
 * Uses the Next.js ImageResponse API (built on Satori/Resvg).
 *
 * File convention: app/opengraph-image.tsx is picked up automatically
 * by Next.js and served as /opengraph-image.
 */

export const runtime = "edge";
export const alt = "Matrx — AI-powered enterprise platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0F1F33 0%, #1E3A5F 50%, #2D5A8A 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(255, 255, 255, 0.15)",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            M
          </div>
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          Matrx
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#D4E4F7",
            letterSpacing: "-0.01em",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          AI-powered enterprise platform for custom integrations and workflows
        </div>

        {/* Decorative border line */}
        <div
          style={{
            display: "flex",
            width: 120,
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
            marginTop: 40,
          }}
        />

        {/* URL */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "rgba(212, 228, 247, 0.6)",
            marginTop: 24,
            letterSpacing: "0.05em",
          }}
        >
          matrx.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

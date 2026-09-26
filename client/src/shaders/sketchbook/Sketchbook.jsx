import React, { useMemo, useState } from "react";
import { createSketchbookDocument } from "./sketchbookDocument.js";
import "./sketchbook-3d.css";
import { BookOpen, Sparkles, RotateCcw, Award } from "lucide-react";

export function Sketchbook({
  ebook = null,
  assetBaseUrl = "/sketchbook/",
  className = "",
  initialMode = "read"
}) {
  const [isOpen, setIsOpen] = useState(initialMode === "read");
  const [ready, setReady] = useState(false);

  const eb = ebook || {
    id: "codex",
    title: "Foundations of Web Systems & Architecture",
    roman: "Vol. I",
    discipline: "Software Engineering & Web Architecture",
    author: "Dr. Evelyn Vance & Learnova Labs",
    readTime: "24 min read",
    coverColor: "#182a43",
    badge: "Core Theory"
  };

  const documentSource = useMemo(
    () => createSketchbookDocument(assetBaseUrl, eb),
    [assetBaseUrl, eb]
  );

  return (
    <div className={`sketchbook-wrapper w-full ${className}`}>
      
      {/* 3D INTERACTIVE SKETCHBOOK READER MODE */}
      {isOpen ? (
        <div className="sketchbook-open-container relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-[#f8f5ee] animate-fadeIn">
          
          {/* Top Floating Control Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/90 backdrop-blur-md border-b border-slate-200/70 z-20 relative">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {eb.roman || 'Vol. I'}
              </span>
              <span className="text-xs font-bold text-slate-800 font-sans truncate max-w-[260px] sm:max-w-[420px]">
                {eb.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Sparkles className="w-3 h-3 text-emerald-600" /> 3D Physical Sketchbook
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80"
                title="View 3D Closed Hardcover Volume"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>3D Volume Cover</span>
              </button>
            </div>
          </div>

          {/* 3D Sketchbook IFrame Canvas */}
          <div className="w-full min-h-[620px] h-[670px] relative">
            <iframe
              className={`w-full h-full border-0 transition-opacity duration-500 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
              title="Interactive LMS eBook 3D Sketchbook Reader"
              srcDoc={documentSource}
              sandbox="allow-scripts"
              loading="eager"
              onLoad={() => setReady(true)}
            />

            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f8f5ee] text-slate-500 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Rendering 3D Physical eBook Spreads...</span>
                </div>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* 3D HARDCOVER VOLUME COVER MODE */
        <div className="sketchbook-3d-stage">
          
          <div className="sketchbook-3d-glow" />

          {/* 3D Interactive Volume Object */}
          <div 
            className="sketchbook-3d-volume"
            style={{
              '--cover-color': eb.coverColor || '#1e293b',
              '--ry': '-10deg',
              '--rx': '5deg'
            }}
            onClick={() => {
              setReady(false);
              setIsOpen(true);
            }}
          >
            {/* Multi-layer Drop Shadow */}
            <div className="sketchbook-3d-shadow" />

            {/* Back Cover Depth Layer */}
            <div className="sketchbook-3d-back" />

            {/* Visible Paper Edges Block */}
            <div className="sketchbook-3d-pages" />

            {/* 3D Gold Foil Spine Edge */}
            <div className="sketchbook-3d-spine">
              <span className="sketchbook-3d-spine-text">{eb.roman || 'VOL. I'} · LEARNOVA</span>
            </div>

            {/* Front Cover Layer */}
            <div className="sketchbook-3d-front">
              <div className="sketchbook-3d-header">
                <span className="sketchbook-3d-roman">{eb.roman || 'VOL. I'}</span>
                <span className="sketchbook-3d-badge">{eb.badge || 'CORE THEORY'}</span>
              </div>

              <div className="sketchbook-3d-body">
                <h3 className="sketchbook-3d-title">{eb.title}</h3>
                <p className="sketchbook-3d-author">By {eb.author}</p>
                <p className="sketchbook-3d-discipline">{eb.discipline}</p>
              </div>

              <div className="sketchbook-3d-footer">
                <span>Learnova Monograph</span>
                <span className="flex items-center gap-1 font-mono">
                  <Award className="w-3 h-3 text-amber-300" /> Verified 2026
                </span>
              </div>

              {/* Action Prompt Overlay on Hover */}
              <div className="sketchbook-3d-open-prompt">
                <button className="sketchbook-3d-open-btn">
                  <BookOpen className="w-4 h-4" />
                  <span>Open 3D Sketchbook Reader</span>
                </button>
                <span className="text-[11px] text-slate-300 font-medium">Click to flip 3D spreads &amp; inspect content</span>
              </div>
            </div>
          </div>

          {/* Stage Prompt Banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/90 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-700 z-10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive 3D Hardcover Volume · Click volume to open reader</span>
          </div>

        </div>
      )}

    </div>
  );
}

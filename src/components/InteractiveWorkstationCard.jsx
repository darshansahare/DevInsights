import React, { useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const InteractiveWorkstationCard = () => {
  const cardRef = useRef(null);

  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
  });

  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalized coordinates from center (-1 to +1)
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // When the cursor hovers in a direction, that side tilts inwards (goes inside)
    // Top of card: normY < 0 -> rotateX negative pushes top into screen
    // Bottom of card: normY > 0 -> rotateX positive pushes bottom into screen
    // Right of card: normX > 0 -> rotateY negative pushes right into screen
    // Left of card: normX < 0 -> rotateY positive pushes left into screen
    const maxTilt = 15;
    const rotateX = normY * maxTilt;
    const rotateY = -normX * maxTilt;

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(0.985, 0.985, 0.985)`,
      transition: 'transform 0.08s ease-out',
    });

    const glareX = ((x / rect.width) * 100).toFixed(1);
    const glareY = ((y / rect.height) * 100).toFixed(1);

    setGlareStyle({
      opacity: 0.9,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.11) 0%, transparent 65%)`,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)',
    });
    setGlareStyle({
      opacity: 0,
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 65%)',
    });
  };

  return (
    <div className="workstation-card-wrapper">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={transformStyle}
        className="workstation-card"
      >
        {/* Dynamic glare lighting overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: '1rem',
            transition: 'opacity 0.25s ease',
            zIndex: 10,
            ...glareStyle,
          }}
        />

        {/* Window Header */}
        <div className="workstation-header">
          <div className="workstation-dots">
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
            <span className="workstation-path">github.com/react/react</span>
          </div>
          <span className="status-ready-pill">
            READY
          </span>
        </div>

        {/* Simulated Metrics preview */}
        <div className="simulated-stats-grid">
          <div className="simulated-stat-box">
            <div className="simulated-stat-label">
              <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span>Stars</span>
            </div>
            <span className="simulated-stat-number">228k</span>
          </div>

          <div className="simulated-stat-box">
            <div className="simulated-stat-label">
              <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#f43f5e' }} />
              <span>Forks</span>
            </div>
            <span className="simulated-stat-number">45.2k</span>
          </div>

          <div className="simulated-stat-box">
            <div className="simulated-stat-label">
              <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
              <span>Issues</span>
            </div>
            <span className="simulated-stat-number">1.2k</span>
          </div>
        </div>

        {/* Simulated Language & Velocity Box */}
        <div className="simulated-lang-box">
          <div className="simulated-lang-top">
            <span style={{ fontWeight: 500, color: '#cbd5e1' }}>Language Composition</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#34d399' }}>JavaScript (82%)</span>
          </div>
          <div className="simulated-lang-track">
            <div style={{ backgroundColor: '#f1e05a', height: '100%', width: '82%' }} />
            <div style={{ backgroundColor: '#3178c6', height: '100%', width: '12%' }} />
            <div style={{ backgroundColor: '#e34c26', height: '100%', width: '6%' }} />
          </div>
          <div className="simulated-legend">
            <span className="simulated-legend-item"><span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#f1e05a' }} /> JS 82%</span>
            <span className="simulated-legend-item"><span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#3178c6' }} /> TS 12%</span>
            <span className="simulated-legend-item"><span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: '#e34c26' }} /> HTML 6%</span>
          </div>
        </div>

        {/* Editorial callout badge */}
        <div className="simulated-callout">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 style={{ height: '16px', width: '16px', color: '#34d399' }} />
            <span>Download full audit report as clean PDF</span>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#64748b' }}>v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWorkstationCard;

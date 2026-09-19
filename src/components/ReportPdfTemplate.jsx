import React from 'react';
import './ReportPdfTemplate.css';
import logoImg from './image.png';

const LANGUAGE_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Markdown: '#083fa1',
};

const getLanguageColor = (lang) => {
  if (LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash % 360)}, 60%, 45%)`;
};

const ReportPdfTemplate = ({ data, templateRef }) => {
  if (!data) return null;

  const { repository, contributors = [], languages = {}, commitActivity = [] } = data;
  const totalLangBytes = Object.values(languages).reduce((sum, b) => sum + b, 0);
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalLangBytes > 0 ? Number(((bytes / totalLangBytes) * 100).toFixed(1)) : 0,
      color: getLanguageColor(name),
    }));

  const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
  const totalCommits12W = commitActivity.reduce((sum, c) => sum + c.count, 0);

  const codeSizeText = totalLangBytes > 1024 * 1024
    ? `${(totalLangBytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(totalLangBytes / 1024)} KB`;

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const getTierLabel = (index) => {
    if (index === 0) return 'Primary Maintainer';
    if (index <= 2) return 'Core Maintainer';
    return 'Active Contributor';
  };

  return (
    <div className="pdf-hidden-wrapper">
      <div ref={templateRef} className="pdf-sheet-a4">

        {/* Header Section (Directly from Mockup) */}
        <div className="pdf-header-container">
          <div className="pdf-header-top">
            <div className="pdf-brand-lockup">
              <div className="pdf-brand-badge">
                <img src={logoImg} alt="DevInsights" />
              </div>
              <div className="pdf-brand-text">
                <h1 className="pdf-brand-title">DEV.INSIGHTS</h1>
                <span className="pdf-brand-subtitle">REPOSITORY INTELLIGENCE</span>
              </div>
            </div>

            <div className="pdf-header-right">
              <span className="pdf-date-pill">[{formattedDate}]</span>
            </div>
          </div>

          <div className="pdf-repo-line">
            Repository: <strong>{repository.owner}/{repository.name}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="pdf-content-body">

          {/* 1. Core KPIs Grid */}
          <div className="pdf-kpi-grid">
            <div className="pdf-kpi-card">
              <span className="pdf-kpi-label">Stars</span>
              <span className="pdf-kpi-value">{(repository.stars || 0).toLocaleString()}</span>
              <div className="pdf-kpi-sub">Total Stargazers</div>
            </div>
            <div className="pdf-kpi-card">
              <span className="pdf-kpi-label">Forks</span>
              <span className="pdf-kpi-value">{(repository.forks || 0).toLocaleString()}</span>
              <div className="pdf-kpi-sub">Ecosystem Forks</div>
            </div>
            <div className="pdf-kpi-card">
              <span className="pdf-kpi-label">Open Issues</span>
              <span className="pdf-kpi-value">{(repository.issues || 0).toLocaleString()}</span>
              <div className="pdf-kpi-sub">Issues &amp; Pull Requests</div>
            </div>
            <div className="pdf-kpi-card">
              <span className="pdf-kpi-label">Tracked Code</span>
              <span className="pdf-kpi-value">{codeSizeText}</span>
              <div className="pdf-kpi-sub">Total Source Size</div>
            </div>
          </div>

          {/* 2. Repository Overview & Meta */}
          <div className="pdf-overview-card">
            {repository.description && (
              <p className="pdf-overview-desc">
                {repository.description}
              </p>
            )}

            <div className="pdf-overview-grid">
              <div>
                <span className="pdf-field-label">Primary Language</span>
                <span className="pdf-field-val">{repository.language || 'Multiple'}</span>
              </div>
              <div>
                <span className="pdf-field-label">License</span>
                <span className="pdf-field-val">{repository.license || 'None Specified'}</span>
              </div>
              <div>
                <span className="pdf-field-label">Default Branch</span>
                <span className="pdf-field-val">{repository.defaultBranch || 'main'}</span>
              </div>
              <div>
                <span className="pdf-field-label">12-Week Velocity</span>
                <span className="pdf-field-val">{totalCommits12W.toLocaleString()} commits</span>
              </div>
            </div>
          </div>

          {/* 3. Language Composition Breakdown */}
          {sortedLanguages.length > 0 && (
            <div>
              <div className="pdf-section-header">
                <h3 className="pdf-section-title">Language Architecture</h3>
                <span className="pdf-section-subtitle">
                  {sortedLanguages.length} {sortedLanguages.length === 1 ? 'Language' : 'Languages'} Analyzed
                </span>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="pdf-lang-bar">
                {sortedLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                      height: '100%',
                    }}
                  />
                ))}
              </div>

              {/* Language Chips */}
              <div className="pdf-lang-chips">
                {sortedLanguages.slice(0, 6).map((lang) => (
                  <div key={lang.name} className="pdf-lang-chip">
                    <span className="pdf-lang-dot" style={{ backgroundColor: lang.color }} />
                    <span className="pdf-lang-name">{lang.name}</span>
                    <span className="pdf-lang-pct">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Top Contributors & Core Authors  */}
          <div className="pdf-contributors-box">
            <div className="pdf-section-header">
              <h3 className="pdf-section-title">Top Contributors &amp; Authors</h3>
              <span className="pdf-section-subtitle">
                Ranked by Commit Contributions ({totalContributions.toLocaleString()} total commits)
              </span>
            </div>

            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Rank</th>
                  <th>Contributor</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>Contributions</th>
                  <th style={{ width: '180px', textAlign: 'right' }}>Share &amp; Impact</th>
                </tr>
              </thead>
              <tbody>
                {contributors.slice(0, 7).map((c, index) => {
                  const share = totalContributions > 0
                    ? ((c.contributions / totalContributions) * 100).toFixed(1)
                    : 0;

                  return (
                    <tr key={c.name}>
                      <td>
                        <span className="pdf-rank-pill">#{index + 1}</span>
                      </td>
                      <td>
                        <span className="pdf-author-name">{c.name}</span>
                        <span className="pdf-author-tier">{getTierLabel(index)}</span>
                      </td>
                      <td className="pdf-commits-cell">
                        {c.contributions.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="pdf-share-cell">{share}%</span>
                        <span className="pdf-progress-track">
                          <span
                            className="pdf-progress-bar"
                            style={{ width: `${Math.max(3, share)}%` }}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="pdf-footer-center">
          <span className="pdf-footer-brand">DEV.INSIGHTS</span>
          <span className="pdf-footer-page">1</span>
        </div>

      </div>
    </div>
  );
};

export default ReportPdfTemplate;

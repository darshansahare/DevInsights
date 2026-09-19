import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Code2,
  Layers,
  GitCommit,
  HardDrive,
  AlertCircle,
  Scale,
  GitBranch,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import './CodeMetrics.css';

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
  Dockerfile: '#384d54',
  JSON: '#292929',
};

const getLanguageColor = (lang) => {
  if (LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 55%, 45%)`;
};

const getMetricIcon = (iconName) => {
  switch (iconName) {
    case 'code':
      return <Code2 className="metric-icon-svg metric-icon-emerald" />;
    case 'layers':
      return <Layers className="metric-icon-svg metric-icon-slate" />;
    case 'git-commit':
      return <GitCommit className="metric-icon-svg metric-icon-emerald" />;
    case 'hard-drive':
      return <HardDrive className="metric-icon-svg metric-icon-amber" />;
    case 'alert-circle':
      return <AlertCircle className="metric-icon-svg metric-icon-rose" />;
    case 'scale':
      return <Scale className="metric-icon-svg metric-icon-slate" />;
    case 'git-branch':
      return <GitBranch className="metric-icon-svg metric-icon-slate" />;
    case 'calendar':
      return <Calendar className="metric-icon-svg metric-icon-slate" />;
    default:
      return <Code2 className="metric-icon-svg metric-icon-emerald" />;
  }
};

const CodeMetrics = ({ metrics = [], languages = {} }) => {
  const languageItems = React.useMemo(() => {
    if (!languages) return [];
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    if (total === 0) return [];

    return Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Number(((bytes / total) * 100).toFixed(1)),
        color: getLanguageColor(name),
      }));
  }, [languages]);

  return (
    <div className="code-metrics-card">
      <div className="code-metrics-header">
        <div>
          <h3 className="code-metrics-title">
            Code Architecture &amp; Metrics
          </h3>
          <p className="code-metrics-subtitle">
            Real metrics computed from GitHub repository tree
          </p>
        </div>
      </div>

      {/* Language Distribution Bar */}
      {languageItems.length > 0 && (
        <div className="lang-composition-box">
          <div className="lang-comp-top">
            <span className="lang-comp-heading">Language Composition</span>
            <span className="lang-comp-count">
              {languageItems.length} {languageItems.length === 1 ? 'language' : 'languages'} detected
            </span>
          </div>

          <div className="lang-bar-track">
            {languageItems.map((item) => (
              <div
                key={item.name}
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                className="lang-bar-segment"
                title={`${item.name}: ${item.percentage}%`}
              />
            ))}
          </div>

          <div className="lang-legend-row">
            {languageItems.slice(0, 6).map((item) => (
              <div key={item.name} className="lang-legend-item">
                <span
                  className="lang-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="lang-name">{item.name}</span>
                <span className="lang-percent">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.name} className="metric-card">
            <div className="metric-card-top">
              <div className="metric-icon-label">
                <div className="metric-icon-box">
                  {getMetricIcon(metric.icon)}
                </div>
                <span className="metric-name">{metric.name}</span>
              </div>

              {metric.change !== undefined && metric.change !== 0 && (
                <span
                  className={`metric-change-pill ${metric.change > 0 ? 'metric-change-up' : 'metric-change-down'
                    }`}
                >
                  {metric.change > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(metric.change)}%
                </span>
              )}
            </div>

            <div className="metric-value-box">
              <div className="metric-value-row">
                <span>{metric.value}</span>
                {metric.unit && (
                  <span className="metric-unit">
                    {metric.unit}
                  </span>
                )}
              </div>

              {metric.progress !== undefined && (
                <div className="pt-0.5">
                  <Progress
                    value={metric.progress}
                    className="h-1.5 bg-[#0b0d12]"
                  />
                </div>
              )}

              {metric.description && (
                <p className="metric-desc">
                  {metric.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeMetrics;

import React, { useState } from 'react';
import { ArrowRight, X, Github } from 'lucide-react';
import './RepoInput.css';

const POPULAR_REPOS = [
  { name: 'react/react', label: 'react/react' },
  { name: 'shadcn-ui/ui', label: 'shadcn-ui/ui' },
  { name: 'vercel/next.js', label: 'vercel/next.js' },
  { name: 'torvalds/linux', label: 'torvalds/linux' },
];

const RepoInput = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const normalizeUrl = (input) => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (/^[\w.-]+\/[\w.-]+$/i.test(trimmed)) {
      return `https://github.com/${trimmed}`;
    }
    return trimmed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = normalizeUrl(repoUrl);
    if (normalized) {
      onSubmit(normalized);
    }
  };

  const handleChipClick = (repoSlug) => {
    const fullUrl = `https://github.com/${repoSlug}`;
    setRepoUrl(fullUrl);
    onSubmit(fullUrl);
  };

  return (
    <div className="repo-input-container">
      {/* Pill Search Form */}
      <form onSubmit={handleSubmit} className="repo-search-form">
        <div className="repo-search-pill">

          <div className="repo-input-icon">
            <Github className="h-4 w-4 text-slate-400" />
          </div>

          <input
            type="text"
            placeholder="github.com/owner/repository"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            disabled={isLoading}
            className="repo-text-input"
          />

          {repoUrl && !isLoading && (
            <button
              type="button"
              onClick={() => setRepoUrl('')}
              className="repo-clear-btn"
              title="Clear input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Solid Circle Arrow Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !repoUrl.trim()}
            className="repo-submit-btn"
            title="Analyze repository"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {/* Quick Try Presets */}
      <div className="preset-chips-wrapper">
        <span className="preset-chips-label">Quick try:</span>
        {POPULAR_REPOS.map((repo) => (
          <button
            key={repo.name}
            type="button"
            disabled={isLoading}
            onClick={() => handleChipClick(repo.name)}
            className="preset-chip-btn"
          >
            {repo.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RepoInput;

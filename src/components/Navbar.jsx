import React, { useState, useEffect } from 'react';
import { Key, Github, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import logoImg from './image.png';
import './Navbar.css';

const Navbar = () => {
  const [hasToken, setHasToken] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenDialog, setShowTokenDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('github-token');
    setHasToken(!!saved);
    if (saved) setGithubToken(saved);
  }, []);

  const saveToken = () => {
    if (githubToken.trim()) {
      localStorage.setItem('github-token', githubToken.trim());
      setHasToken(true);
      toast.success('GitHub token saved', {
        description: 'Rate limit expanded to 5,000 req/hr.'
      });
    } else {
      localStorage.removeItem('github-token');
      setHasToken(false);
      toast.info('GitHub token cleared', {
        description: 'Now using standard rate limit (60 req/hr).'
      });
    }
    setShowTokenDialog(false);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-inner">

        {/* Brand: DevInsights */}
        <div className="navbar-brand-wrapper">
          <div className="navbar-brand-logo">
            <img src={logoImg} alt="DevInsights Logo" />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">DEV.INSIGHTS</span>
            <span className="navbar-brand-pill">
              REPOSITORY INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Token Modal Dialog */}
          <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
            <DialogTrigger asChild>
              <button
                type="button"
                className={`navbar-token-btn ${hasToken ? 'token-active' : ''}`}
              >
                {hasToken ? (
                  <>
                    <span className="token-status-dot" />
                    <span>Token Active (5k/hr)</span>
                  </>
                ) : (
                  <>
                    <Key style={{ height: '14px', width: '14px', color: '#10b981' }} />
                    <span>API Token</span>
                  </>
                )}
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key style={{ height: '16px', width: '16px', color: '#10b981' }} />
                    GitHub API Rate Limit Token
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Anonymous GitHub API queries are capped at 60/hour. Adding a personal token increases your quota to <strong>5,000 requests/hour</strong>.
                </DialogDescription>
              </DialogHeader>

              <div className="dialog-form-body">
                <div className="dialog-input-group">
                  <label className="dialog-label">Personal Access Token (classic or fine-grained)</label>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="dialog-input"
                  />
                </div>

                <div className="dialog-info-box">
                  <div className="dialog-info-badge">
                    <CheckCircle2 style={{ height: '14px', width: '14px' }} />
                    <span>Stored 100% locally in your browser</span>
                  </div>
                  <p className="dialog-info-text">Your token is stored only in localStorage and is never shared with any external servers.</p>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noreferrer"
                    className="dialog-link"
                  >
                    Generate a token on GitHub &rarr;
                  </a>
                </div>
              </div>

              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setShowTokenDialog(false)}
                  className="dialog-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveToken}
                  className="dialog-save-btn"
                >
                  {githubToken ? 'Save Token' : 'Clear Token'}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="navbar-github-link"
          >
            <Github style={{ height: '14px', width: '14px' }} />
            <span className="navbar-github-label">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

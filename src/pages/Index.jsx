import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import RepoInput from '@/components/RepoInput';
import Dashboard from '@/components/Dashboard';
import ConnectingDotsBackground from '@/components/ConnectingDotsBackground';
import InteractiveWorkstationCard from '@/components/InteractiveWorkstationCard';
import { fetchRepositoryData } from '@/services/githubService';
import { toast } from 'sonner';
import './Index.css';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoData, setRepoData] = useState(null);

  const handleAnalyzeRepo = async (rawInput) => {
    let repoUrl = rawInput.trim();

    if (/^[\w.-]+\/[\w.-]+$/i.test(repoUrl)) {
      repoUrl = `https://github.com/${repoUrl}`;
    }

    try {
      setIsLoading(true);

      if (!repoUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i)) {
        throw new Error('Please enter a valid repository (e.g. facebook/react or https://github.com/facebook/react)');
      }

      const token = localStorage.getItem('github-token') || undefined;
      const data = await fetchRepositoryData(repoUrl, token);
      setRepoData(data);

      toast.success('Repository analyzed successfully', {
        description: `Loaded data for ${data.repository.owner}/${data.repository.name}`,
      });
    } catch (error) {
      let message = 'Failed to analyze repository';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error('Analysis failed', {
        description: message,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Interactive Connecting Dots Ambient Background */}
      <ConnectingDotsBackground />

      {/* Top Navigation Bar */}
      <Navbar />

      <main className="page-main">
        {repoData ? (
          <div>
            {/* Top search bar when in dashboard view */}
            <div className="back-button-bar">
              <button
                type="button"
                onClick={() => setRepoData(null)}
                className="back-to-search-btn"
              >
                &larr; Analyze another repository
              </button>
              <div>
                <RepoInput onSubmit={handleAnalyzeRepo} isLoading={isLoading} />
              </div>
            </div>

            <Dashboard data={repoData} onReset={() => setRepoData(null)} />
          </div>
        ) : (
          /* Split Hero Section  */
          <div className="hero-grid">

            {/* Left Column: Editorial Headline & Search */}
            <div className="hero-left-col">
              <h1 className="hero-headline">
                Every Repo Tells a Story.
              </h1>

              <p className="hero-subtext">
                Uncover yours through commit activity, contributor patterns, technologies,
                and the signals shaping your project.
              </p>

              <div>
                <RepoInput onSubmit={handleAnalyzeRepo} isLoading={isLoading} />
              </div>

              {/* Three minimalist proof points */}
              <div className="proof-points-grid">
                <div>
                  <span className="proof-point-title">100% Real</span>
                  <span>Live GitHub API data</span>
                </div>
                <div>
                  <span className="proof-point-title">PDF Export</span>
                  <span>Full audit reports</span>
                </div>
                <div>
                  <span className="proof-point-title">Zero Bloat</span>
                  <span>Clean developer metrics</span>
                </div>
              </div>
            </div>

            {/* Interactive 3D Workstation Preview Card */}
            <InteractiveWorkstationCard />

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>DEV.INSIGHTS</span>
            <span> v2.0 / GitHub Analyzer</span>
          </div>
          <div>
            Built beyond the hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
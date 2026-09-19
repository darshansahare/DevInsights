import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InsightCard from './InsightCard';
import { Trophy, ExternalLink } from 'lucide-react';
import './ContributorStats.css';

const ContributorStats = ({ contributors = [] }) => {
  const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
  
  // Sort contributors descending
  const sortedContributors = [...contributors].sort((a, b) => b.contributions - a.contributions);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return <span className="rank-badge rank-badge-gold">1</span>;
      case 1:
        return <span className="rank-badge rank-badge-silver">2</span>;
      case 2:
        return <span className="rank-badge rank-badge-bronze">3</span>;
      default:
        return <span className="rank-badge rank-badge-default">{index + 1}</span>;
    }
  };

  return (
    <InsightCard 
      title="Top Contributors" 
      description={`${contributors.length} core authors ranked by total commit contributions`}
      className="h-full"
      action={
        <div className="leaderboard-badge">
          <Trophy className="h-3 w-3" />
          <span>Leaderboard</span>
        </div>
      }
    >
      <div className="contributor-list">
        {sortedContributors.length === 0 ? (
          <div className="contributor-empty">
            No contributor data returned by API.
          </div>
        ) : (
          sortedContributors.slice(0, 8).map((contributor, index) => {
            const contributionPercentage = totalContributions > 0 
              ? Math.round((contributor.contributions / totalContributions) * 100) 
              : 0;
            
            return (
              <div key={contributor.name} className="contributor-row group">
                <div className="contributor-top">
                  <div className="contributor-info">
                    {getRankBadge(index)}
                    
                    <Avatar className="contributor-avatar">
                      <AvatarImage src={contributor.avatarUrl} alt={contributor.name} />
                      <AvatarFallback className="contributor-avatar-fallback">
                        {contributor.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <a 
                        href={contributor.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="contributor-name-link"
                      >
                        <span className="truncate">{contributor.name}</span>
                        <ExternalLink className="contributor-ext-icon" />
                      </a>
                    </div>
                  </div>

                  <div className="contributor-stats-right">
                    <span className="contributor-commits-count">
                      {contributor.contributions.toLocaleString()}
                    </span>
                    <span className="contributor-percentage">
                      {contributionPercentage}% share
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="contributor-progress-track">
                  <div 
                    className="contributor-progress-fill" 
                    style={{ width: `${Math.max(2, contributionPercentage)}%` }} 
                  />
                </div>
              </div>
            );
          })
        )}

        {sortedContributors.length > 8 && (
          <p className="contributor-more-text">
            + {sortedContributors.length - 8} additional contributors
          </p>
        )}
      </div>
    </InsightCard>
  );
};

export default ContributorStats;

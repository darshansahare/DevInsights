// Extract owner and repo name from GitHub URL
const extractRepoInfo = (repoUrl) => {
  const parts = repoUrl.trim().replace(/\/+$/, '').split('/');
  const repo = parts[parts.length - 1];
  const owner = parts[parts.length - 2];
  
  return { owner, repo };
};

// Format relative time helper
const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 0) return 'Just now';
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
};

// Calculate 100% real code metrics based on languages, commit activity, and repo data
const calculateCodeMetrics = (languages, commitActivity, repository) => {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  // Sort languages descending
  const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const primaryLanguage = sortedLanguages[0]?.[0] || repository.language || 'None';
  const primaryBytes = sortedLanguages[0]?.[1] || 0;
  const primaryLanguagePercentage = totalBytes > 0 
    ? Math.round((primaryBytes / totalBytes) * 100) 
    : (primaryLanguage !== 'None' ? 100 : 0);
  
  // Recent commit frequency (last 4 weeks vs prior 4 weeks)
  const recentCommits = commitActivity.slice(-4).reduce((sum, week) => sum + (week.total || 0), 0);
  const olderCommits = commitActivity.slice(-8, -4).reduce((sum, week) => sum + (week.total || 0), 0);
  const commitChange = olderCommits > 0 
    ? Math.round(((recentCommits - olderCommits) / olderCommits) * 100) 
    : undefined;
  
  const languageCount = Object.keys(languages).length;
  const topLanguages = sortedLanguages.slice(0, 3).map(([lang]) => lang).join(', ') || primaryLanguage;

  // Format code size
  let codeSizeFormatted;
  if (totalBytes > 1024 * 1024) {
    codeSizeFormatted = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  } else if (totalBytes > 0) {
    codeSizeFormatted = `${Math.round(totalBytes / 1024)} KB`;
  } else if (repository.size) {
    codeSizeFormatted = repository.size > 1024 
      ? `${(repository.size / 1024).toFixed(1)} MB` 
      : `${repository.size} KB`;
  } else {
    codeSizeFormatted = '0 KB';
  }

  // Format license
  const licenseName = repository.license?.spdx_id 
    ? (repository.license.spdx_id === 'NOASSERTION' ? (repository.license.name || 'Custom') : repository.license.spdx_id)
    : (repository.license?.name || 'No License');

  // Format last push
  const lastPushDate = repository.pushed_at || repository.updated_at;
  const lastActiveText = formatRelativeTime(lastPushDate);

  const metrics = [
    { 
      name: 'Primary Language Share', 
      value: `${primaryLanguagePercentage}%`, 
      progress: primaryLanguagePercentage,
      description: `${primaryLanguage} comprises ${primaryLanguagePercentage}% of tracked code`,
      icon: 'code'
    },
    { 
      name: 'Languages Detected', 
      value: languageCount > 0 ? languageCount : 1, 
      unit: (languageCount > 1 || languageCount === 0) ? ' languages' : ' language',
      description: topLanguages ? `Top: ${topLanguages}` : 'Single language repository',
      icon: 'layers'
    },
    { 
      name: 'Recent Commit Velocity', 
      value: recentCommits, 
      unit: ' commits / 30d', 
      change: commitChange !== undefined && commitChange !== 0 ? commitChange : undefined,
      description: 'Commits pushed in the last 4 weeks',
      icon: 'git-commit'
    },
    { 
      name: 'Source Code Size', 
      value: codeSizeFormatted, 
      description: totalBytes > 0 ? `${totalBytes.toLocaleString()} bytes in language files` : 'Reported repository size',
      icon: 'hard-drive'
    },
    { 
      name: 'Open Issues & PRs', 
      value: (repository.open_issues_count || 0).toLocaleString(), 
      description: 'Active issue tracker tickets and pull requests',
      icon: 'alert-circle'
    },
    { 
      name: 'License', 
      value: licenseName, 
      description: repository.license ? 'Official repository license detected' : 'No explicit license detected',
      icon: 'scale'
    },
    { 
      name: 'Default Branch', 
      value: repository.default_branch || 'main', 
      description: repository.archived ? 'Repository is archived (read-only)' : 'Primary active development branch',
      icon: 'git-branch'
    },
    { 
      name: 'Last Code Push', 
      value: lastActiveText, 
      description: lastPushDate ? new Date(lastPushDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
      icon: 'calendar'
    },
  ];

  return metrics;
};

// Format commit activity data for the chart
const formatCommitActivity = (commitActivity) => {
  if (!Array.isArray(commitActivity) || commitActivity.length === 0) {
    return [];
  }
  return commitActivity.map((week) => {
    const date = new Date(week.week * 1000);
    const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return {
      date: monthYear,
      count: week.total || 0
    };
  }).slice(-12); // Last 12 weeks
};

// Create headers with authorization if token is provided
const createHeaders = (token) => {
  if (token) {
    return {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
  }
  return {
    'Accept': 'application/vnd.github.v3+json'
  };
};

// Create fallback commit activity if API is computing or unavailable
const createFallbackCommitActivity = () => {
  return Array(12).fill(0).map((_, i) => ({
    week: Math.floor(Date.now() / 1000) - (11 - i) * 7 * 24 * 3600,
    total: 0,
    days: [0, 0, 0, 0, 0, 0, 0]
  }));
};

// Fetch all required data from GitHub API
export const fetchRepositoryData = async (repoUrl, token) => {
  const { owner, repo } = extractRepoInfo(repoUrl);
  const headers = createHeaders(token);
  
  // Fetch repository details
  const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoResponse.ok) {
    if (repoResponse.status === 403) {
      throw new Error(`GitHub API rate limit exceeded. ${token ? 'Your token may have insufficient permissions.' : 'Try adding a GitHub personal access token.'}`);
    } else if (repoResponse.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    } else {
      throw new Error(`Repository not found or API error (${repoResponse.status})`);
    }
  }
  const repository = await repoResponse.json();
  
  // Fetch contributors
  let contributorsData = [];
  try {
    const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, { headers });
    if (contributorsResponse.ok) {
      const data = await contributorsResponse.json();
      if (Array.isArray(data)) {
        contributorsData = data.filter((c) => !c.login?.includes('[bot]'));
      }
    } else {
      console.warn(`Contributors API returned status ${contributorsResponse.status}`);
    }
  } catch (err) {
    console.warn('Failed to fetch contributors:', err);
  }

  // Fetch commit activity
  let commitActivityData = createFallbackCommitActivity();
  try {
    const commitActivityResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`, { headers });
    if (commitActivityResponse.ok) {
      const data = await commitActivityResponse.json();
      if (Array.isArray(data) && data.length > 0) {
        commitActivityData = data;
      }
    } else {
      console.warn(`Commit activity API returned status ${commitActivityResponse.status}`);
    }
  } catch (err) {
    console.warn('Failed to fetch commit activity:', err);
  }

  // Fetch languages
  let languagesData = {};
  try {
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (languagesResponse.ok) {
      languagesData = await languagesResponse.json();
    } else {
      console.warn(`Languages API returned status ${languagesResponse.status}`);
    }
  } catch (err) {
    console.warn('Failed to fetch languages:', err);
  }

  return formatRepositoryData(repository, contributorsData, commitActivityData, languagesData);
};

// Format repository data
const formatRepositoryData = (
  repository,
  contributorsData,
  commitActivityData,
  languagesData
) => {
  const formattedRepository = {
    name: repository.name,
    owner: repository.owner?.login || '',
    description: repository.description || 'No description provided',
    stars: repository.stargazers_count || 0,
    forks: repository.forks_count || 0,
    issues: repository.open_issues_count || 0,
    language: repository.language || 'Not specified',
    url: repository.html_url || '',
    createdAt: repository.created_at || '',
    updatedAt: repository.updated_at || '',
    pushedAt: repository.pushed_at,
    license: repository.license?.spdx_id || repository.license?.name,
    defaultBranch: repository.default_branch,
    size: repository.size,
  };
  
  const formattedContributors = contributorsData.map(contributor => ({
    name: contributor.login,
    avatarUrl: contributor.avatar_url,
    contributions: contributor.contributions,
    url: contributor.html_url,
  }));
  
  const codeMetrics = calculateCodeMetrics(languagesData, commitActivityData, repository);
  const commitActivity = formatCommitActivity(commitActivityData);
  
  return {
    repository: formattedRepository,
    codeMetrics,
    commitActivity,
    contributors: formattedContributors,
    languages: languagesData,
  };
};

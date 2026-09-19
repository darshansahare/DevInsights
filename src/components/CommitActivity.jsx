import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import './CommitActivity.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="commit-tooltip">
        <span className="commit-tooltip-label">{label}</span>
        <span className="commit-tooltip-value">
          {payload[0].value.toLocaleString()} commits
        </span>
      </div>
    );
  }

  return null;
};

const CommitActivity = ({ data = [] }) => {
  const totalCommits = data.reduce((sum, item) => sum + item.count, 0);
  const avgCommitsPerMonth = data.length > 0 ? Math.round(totalCommits / data.length) : 0;

  return (
    <div className="commit-activity-card">
      {/* Header with clean Filter Pill */}
      <div className="commit-activity-header">
        <div>
          <h3 className="commit-activity-title">
            Commit Activity Velocity
          </h3>
          <p className="commit-activity-subtitle">
            {totalCommits.toLocaleString()} commits across the last 12 weeks (~{avgCommitsPerMonth}/wk average)
          </p>
        </div>

        <span className="commit-filter-pill">
          12 Weeks
        </span>
      </div>

      {/* Smooth Curved Line/Area Chart */}
      <div className="commit-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emeraldCurveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="#1b202c" 
              vertical={false} 
            />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#717e92' }} 
              axisLine={{ stroke: '#1b202c' }} 
              tickLine={false} 
              dy={6} 
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#717e92' }} 
              axisLine={false} 
              tickLine={false} 
              dx={-6} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2e3748', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#10b981" 
              strokeWidth={2} 
              fill="url(#emeraldCurveGradient)" 
              dot={false} 
              activeDot={{ r: 5, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }} 
              animationDuration={1000} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitActivity;

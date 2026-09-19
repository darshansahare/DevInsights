import React from 'react';
import { cn } from "@/lib/utils";
import './InsightCard.css';

const InsightCard = ({ title, description, className, action, children }) => {
  return (
    <div className={cn("insight-card", className)}>
      <div className="insight-card-header">
        <div>
          <h3 className="insight-card-title">{title}</h3>
          {description && (
            <p className="insight-card-description">{description}</p>
          )}
        </div>
        {action && (
          <div className="insight-card-action">{action}</div>
        )}
      </div>
      <div className="insight-card-content">
        {children}
      </div>
    </div>
  );
};

export default InsightCard;

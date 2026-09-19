import React from "react";
import "./alert.css";

const Alert = React.forwardRef(({ className = "", variant = "default", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={`alert alert-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertIcon = ({ children, className = "" }) => {
  return (
    <div className={`alert-icon ${className}`.trim()}>
      {children}
    </div>
  );
};
AlertIcon.displayName = "AlertIcon";

const AlertTitle = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={`alert-title ${className}`.trim()}
      {...props}
    >
      {children}
    </h5>
  );
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`alert-description ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertIcon, AlertTitle, AlertDescription };

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="not-found-container">
      <div className="not-found-box">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-desc">The repository or page you are looking for does not exist.</p>
        <a href="/" className="not-found-link">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

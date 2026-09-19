import React from "react";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import "./sonner.css";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster"
      closeButton={false}
      position="bottom-right"
      expand
      gap={10}
      icons={{
        success: <CheckCircle2 size={16} strokeWidth={2} />,
        error: <AlertCircle size={16} strokeWidth={2} />,
        warning: <AlertTriangle size={16} strokeWidth={2} />,
        info: <Info size={16} strokeWidth={2} />,
        loading: <Loader2 size={16} strokeWidth={2} className="sonner-spin" />,
      }}
      toastOptions={{
        className: 'devinsights-toast',
      }}
      {...props}
    />
  );
};

export { Toaster };

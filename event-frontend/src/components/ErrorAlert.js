// src/components/ErrorAlert.js
import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div className="flex-grow-1">
          {message || 'An error occurred. Please try again.'}
        </div>
        {onRetry && (
          <button 
            className="btn btn-sm btn-outline-danger ms-3" 
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
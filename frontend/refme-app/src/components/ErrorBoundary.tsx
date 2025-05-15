import React, { Component, ErrorInfo, ReactNode } from 'react';
import '../styles/global.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="home-container">
          <div className="cyber-dots"></div>
          <div className="homepage-content">
            <div className="glass-panel" style={{ maxWidth: '600px', textAlign: 'center' }}>
              <h1 className="welcome-text">Oops!</h1>
              <p className="tagline">Something went wrong</p>
              <div style={{ marginTop: '20px' }}>
                <p>We're sorry, but an error occurred while rendering this component.</p>
                {this.state.error && (
                  <p className="error-message">
                    {this.state.error.toString()}
                  </p>
                )}
                <button
                  className="btn"
                  onClick={() => window.location.href = '/'}
                  style={{ marginTop: '20px' }}
                >
                  Go Back Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
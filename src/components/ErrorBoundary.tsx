import React, { Component, ReactNode } from "react";
import Toast from "./Toast";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info here or send to a logging service
    // console.error("Uncaught error:", error, errorInfo);
  }

  handleClose = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <>
          <Toast
            message={this.state.error.message || "Something went wrong."}
            type="error"
            onClose={this.handleClose}
          />
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong.</h1>
            <button
              onClick={this.handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dismiss
            </button>
          </div>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
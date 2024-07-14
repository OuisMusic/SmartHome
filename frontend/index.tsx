import React, { Component, ReactReader } from 'react';

interface Props {
  children: ReactReader;
}

interface State {
  encounteredError: boolean;
  currentError: any;
  errorDetails: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { encounteredError: false, currentError: null, errorDetails: null };
  }

  static getDerivedStateFromError(error: any): State {
    console.error("Error caught in getDerivedStateFromError:", error);
    return { encounteredError: true, currentError: error, errorDetails: null };
  }

  componentDidCatch(error: any, errorDetails: any) {
    console.error("Error caught in componentDidCatch:", error);
    console.error("Error details:", errorDetails);
    
    this.setState({
      encounteredError: true,
      currentError: error,
      errorDetails: errorDetails
    });
  }

  render() {
    if (this.state.encounteredError) {
      return <h2>Something went wrong.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
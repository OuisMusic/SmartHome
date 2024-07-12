import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    return { encounteredError: true, currentError: error, errorDetails: null };
  }

  componentDidCatch(error: any, errorDetails: any) {
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
```

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App apiBaseUrl={apiBaseUrl} />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
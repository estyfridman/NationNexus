import { Component, ErrorInfo, ReactNode } from 'react';
import NotFound from './components/notFound/NotFound';
import logger from "../src/utils/logger";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };  }

    static getDerivedStateFromError(error: Error): State {
      return { 
        hasError: true,
        error 
      };
    }
  

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`Uncaught error: ${error.message} - ${errorInfo.componentStack}`);
    this.setState({
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "An unexpected error occurred";
      const errorTitle = this.state.error?.name || "Error";
      const errorDetails = this.state.errorInfo?.componentStack || "";

      return (
        <NotFound
          title={`${errorTitle}: Something went wrong`}
          message={`${errorMessage} - ${errorDetails}`}
        />
      );
    }
    return this.props.children;
  }
}

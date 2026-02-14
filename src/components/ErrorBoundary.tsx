"use client";

import { Component, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              Please try refreshing the page. If the problem persists, contact
              support.
            </AlertDescription>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}

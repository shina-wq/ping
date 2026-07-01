import { Component, type ErrorInfo, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

import { ErrorPage } from "@/components/error-page";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Uncaught error:", error, info);
    }
    // TODO: Wire up an error-reporting service here later if add one.
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          icon={<TriangleAlert className="size-6" />}
          title="Something went wrong"
          description="The app ran into an unexpected error. Reloading usually fixes it."
          primaryAction={{ label: "Reload app", onClick: () => window.location.reload() }}
        />
      );
    }

    return this.props.children;
  }
}
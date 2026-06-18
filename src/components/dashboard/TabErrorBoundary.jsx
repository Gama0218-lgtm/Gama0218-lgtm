import { Component } from "react";

export default class TabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Tab render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-red text-4xl">⚠</div>
          <div className="text-sm font-black font-mono text-red">TAB RENDER ERROR</div>
          <div className="text-xs text-muted-foreground font-sans max-w-md text-center">
            {this.state.error?.message || "An unexpected error occurred in this tab."}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-secondary border border-border rounded-lg text-xs font-mono text-foreground hover:border-muted-foreground transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                        Something went wrong
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-surface-400">
                        An unexpected error occurred. This has been logged for investigation.
                    </p>
                    {this.state.error && (
                        <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-surface-900 px-4 py-2 text-left text-xs text-red-300">
                            {this.state.error.message}
                        </pre>
                    )}
                    <button
                        onClick={this.handleReset}
                        className="mt-6 flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/30"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

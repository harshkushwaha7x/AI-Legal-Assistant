'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ConnectionStatus {
    online: boolean;
    type?: string;
    downlink?: number;
}

export default function NetworkStatus() {
    const [status, setStatus] = useState<ConnectionStatus>({ online: true });
    const [showBanner, setShowBanner] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);

    useEffect(() => {
        const updateStatus = () => {
            const connection = (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection;
            setStatus({
                online: navigator.onLine,
                type: connection?.effectiveType,
                downlink: connection?.downlink,
            });
        };

        const handleOffline = () => {
            setStatus((prev) => ({ ...prev, online: false }));
            setShowBanner(true);
        };

        const handleOnline = () => {
            setStatus((prev) => ({ ...prev, online: true }));
            setReconnecting(true);
            setTimeout(() => {
                setReconnecting(false);
                setShowBanner(false);
            }, 2000);
        };

        updateStatus();
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showBanner && status.online) return null;

    return (
        <div
            className={`fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-xl border px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                status.online
                    ? reconnecting
                        ? 'border-green-500/20 bg-green-950/80'
                        : 'border-green-500/20 bg-green-950/80'
                    : 'border-red-500/20 bg-red-950/80'
            }`}
        >
            <div className="flex items-center gap-3">
                {status.online ? (
                    reconnecting ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-green-400" />
                    ) : (
                        <Wifi className="h-4 w-4 text-green-400" />
                    )
                ) : (
                    <WifiOff className="h-4 w-4 text-red-400" />
                )}

                <div>
                    <p className={`text-xs font-medium ${
                        status.online ? 'text-green-300' : 'text-red-300'
                    }`}>
                        {status.online
                            ? reconnecting
                                ? 'Reconnecting...'
                                : 'Back online'
                            : 'You are offline'
                        }
                    </p>
                    {!status.online && (
                        <p className="text-[10px] text-red-400/70">
                            Changes will be saved when connection is restored.
                        </p>
                    )}
                </div>

                {!status.online && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400/50" />
                )}
            </div>
        </div>
    );
}

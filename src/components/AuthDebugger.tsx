import { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export function AuthDebugger() {
  const { currentUser, isLoading } = useAuthContext();
  const [renderCount, setRenderCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: Render #${renderCount + 1} - Loading: ${isLoading}, User: ${currentUser?.role || 'none'}, Auth: ${!!currentUser}`;
    setLogs(prev => [...prev.slice(-9), logEntry]);
  }, [currentUser, isLoading, renderCount]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <div className="font-bold mb-2">Auth Debug (Renders: {renderCount})</div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i} className="font-mono">{log}</div>
        ))}
      </div>
    </div>
  );
}
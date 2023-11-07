import { useEffect, useState } from 'react';

// This hook will initialize a new EventSource when the component mounts and will close it when the component unmounts.
export function useEventSource(url: string) {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    setEventSource(es);

    return () => {
      es.close();
    };
  }, [url]);

  return eventSource;
}
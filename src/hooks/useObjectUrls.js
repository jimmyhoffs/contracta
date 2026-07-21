import { useEffect, useState } from 'react';

export function useObjectUrls(items) {
  const [urls, setUrls] = useState({});

  useEffect(() => {
    const next = {};
    for (const item of items) {
      next[item.id] = URL.createObjectURL(item.blob);
    }
    setUrls(next);
    return () => {
      Object.values(next).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join(',')]);

  return urls;
}

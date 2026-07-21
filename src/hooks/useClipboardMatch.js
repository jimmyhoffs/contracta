import { useEffect, useState } from 'react';

export function useClipboardMatch(matcher) {
  const [value, setValue] = useState(null);
  const [checked, setChecked] = useState(false);

  const check = async () => {
    try {
      if (!navigator.clipboard?.readText) throw new Error('unsupported');
      const text = (await navigator.clipboard.readText()).trim();
      setValue(matcher(text) || null);
    } catch {
      setValue(null);
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { value, checked, recheck: check };
}

export const matchPhone = (text) => {
  const m = text.match(/(\+?\d[\d\-\s().]{7,}\d)/);
  return m ? m[0].trim() : null;
};

export const matchEmail = (text) => {
  const m = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  return m ? m[0].trim() : null;
};

export const matchAddress = (text) => {
  if (/^\d+\s+\w+/.test(text) && text.length < 120) return text;
  return null;
};

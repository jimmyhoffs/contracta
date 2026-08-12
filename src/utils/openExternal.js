export async function openExternal(url) {
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  if (isTauri) {
    const { openUrl } = await import('@tauri-apps/plugin-opener');
    await openUrl(url);
    return;
  }
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener');
  }
}

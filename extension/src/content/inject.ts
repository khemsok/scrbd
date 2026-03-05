// This script runs in the page's main world to access ytcfg
(() => {
  const apiKey = (window as any).ytcfg?.data_?.INNERTUBE_API_KEY ?? null;
  window.postMessage({ type: "SCRBD_API_KEY", apiKey }, window.location.origin);
})();

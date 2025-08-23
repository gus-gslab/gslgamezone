declare global {
  interface Window {
    dataLayer: any[];
    gtag: (..._args: any[]) => void;
  }
}

export {};

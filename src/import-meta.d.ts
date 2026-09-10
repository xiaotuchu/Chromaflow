interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

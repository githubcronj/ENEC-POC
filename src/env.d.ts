/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIFY_BASE_URL: string;
  readonly VITE_DIFY_API_KEY: string;
  readonly VITE_DIFY_USER_PREFIX: string;
  readonly MODE: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
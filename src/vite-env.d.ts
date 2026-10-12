/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMERO?: string;
  readonly VITE_WHATSAPP_TEXTO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

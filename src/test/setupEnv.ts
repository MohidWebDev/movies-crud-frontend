import { TextDecoder, TextEncoder } from "node:util";

// react-router v7 needs these, and jsdom doesn't provide them
Object.assign(globalThis, { TextEncoder, TextDecoder });

// Babel rewrites import.meta.env.VITE_API_BASE_URL to process.env.VITE_API_BASE_URL
process.env.VITE_API_BASE_URL = "http://localhost:3000";

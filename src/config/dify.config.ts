/**
 * Dify API Configuration
 * 
 * IMPORTANT: Replace these values with your actual Dify API credentials
 */

export const DIFY_CONFIG = {
  BASE_URL: import.meta.env.VITE_DIFY_BASE_URL || 'https://api.dify.ai/v1',
  API_KEY: import.meta.env.VITE_DIFY_API_KEY || '',
  USER_PREFIX: import.meta.env.VITE_DIFY_USER_PREFIX || 'user-',
};

if (import.meta.env.DEV && !DIFY_CONFIG.API_KEY) {
  console.warn('⚠️ Missing Dify API Key. Please set VITE_DIFY_API_KEY in your .env file.');
}
export const env = {
  API_BASE_URL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_BASE_VERSION}`,
  APP_TITLE: import.meta.env.VITE_APP_TITLE as string,
  APP_ENV: import.meta.env.VITE_APP_ENV as string,
};

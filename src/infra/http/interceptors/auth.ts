// Injects Bearer token from Zustand auth store into every request
export const authRequestInterceptor = async (
  config: RequestInit & { url: string },
): Promise<RequestInit & { url: string }> => {
  // Import lazily to avoid circular dependency
  const { useAuthStore } = await import('@/app/stores/auth.store');
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
};

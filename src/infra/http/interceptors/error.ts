// Normalizes error responses into a consistent shape
export const errorResponseInterceptor = async (
  response: Response,
  _config: RequestInit & { url: string },
): Promise<Response> => {
  if (!response.ok) {
    // Let the client.ts handler deal with non-ok responses
    return response;
  }
  return response;
};

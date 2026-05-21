type RequestInterceptor = (config: RequestInit & { url: string }) => Promise<RequestInit & { url: string }>;
type ResponseInterceptor = (response: Response, config: RequestInit & { url: string }) => Promise<Response>;

interface HttpClientOptions {
  baseURL: string;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpClient {
  private baseURL: string;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor({ baseURL, requestInterceptors = [], responseInterceptors = [] }: HttpClientOptions) {
    this.baseURL = baseURL;
    this.requestInterceptors = requestInterceptors;
    this.responseInterceptors = responseInterceptors;
  }

  private async request<T>(method: RequestMethod, path: string, body?: unknown): Promise<T> {
    let config: RequestInit & { url: string } = {
      url: `${this.baseURL}${path}`,
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const { url, ...init } = config;
    let response = await fetch(url, init);

    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response, config);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw error;
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>('PUT', path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}

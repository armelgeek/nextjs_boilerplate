type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
};

async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to make API request"
    );
  }
}

export const api = {
  get: <T>(endpoint: string) =>
    apiCall<T>(endpoint, { method: "GET" }),

  post: <T>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, body?: unknown) =>
    apiCall<T>(endpoint, {
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

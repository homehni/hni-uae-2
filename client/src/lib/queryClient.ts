import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // First element is the URL path
    const [baseUrl, ...params] = queryKey;
    let fetchUrl = baseUrl as string;

    // Process additional parameters
    if (params.length > 0) {
      // Check if first param is an object (query parameters) or string/number (path segment)
      const firstParam = params[0];
      
      if (typeof firstParam === 'object' && firstParam !== null && !Array.isArray(firstParam)) {
        // Handle query parameters
        const queryParams = new URLSearchParams();
        const filters = firstParam as Record<string, any>;
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach((v) => queryParams.append(key, String(v)));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });

        const queryString = queryParams.toString();
        if (queryString) {
          fetchUrl = `${fetchUrl}?${queryString}`;
        }
      } else if (typeof firstParam === 'string' || typeof firstParam === 'number') {
        // Handle path segment (like ID)
        fetchUrl = `${fetchUrl}/${firstParam}`;
      }
    }

    const res = await fetch(fetchUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

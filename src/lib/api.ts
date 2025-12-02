import { supabase } from "./supabase";

type ApiFetchOptions = Omit<RequestInit, "body"> & { body?: any };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiFetch<T = any>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const url = `${BASE_URL}${path}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const res = await fetch(url, {
      ...options,
      headers,
      // Important for CORS
      mode: 'cors',
      credentials: 'include',
    });

    if (!res.ok) {
      let errorMessage = `API Error: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await res.text();
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    
    return {} as T;
  } catch (error: any) {
    // Network errors (CORS, offline, etc.)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.error('Network error - possible CORS issue or server unreachable');
      console.error('API Base URL:', BASE_URL);
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
}

// Helper for public endpoints (no auth required)
export async function publicFetch<T = any>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    mode: 'cors',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errorText}`);
  }

  return res.json();
}

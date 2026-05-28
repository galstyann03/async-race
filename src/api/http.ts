import { API_BASE_URL } from '../shared/constants';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | undefined>;
  body?: unknown;
};

export async function http<T>(
  path: string,
  options: Options = {},
): Promise<{ data: T; totalCount: number }> {
  const { method = 'GET', query, body } = options;

  const url = new URL(path.replace(/^\//, ''), `${API_BASE_URL}/`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new HttpError(response.status, `${method} ${path} → ${response.status}`);
  }

  const text = await response.text();
  const data = (text ? JSON.parse(text) : null) as T;
  const totalCount = Number(response.headers.get('X-Total-Count') ?? 0);

  return { data, totalCount };
}

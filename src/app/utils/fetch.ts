import type z from "zod";

export async function safeFetch<T>(schema: z.Schema<T>, input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw newHTTPError("Request failed", response, init?.method);
  }

  const json = await response.json().catch(() => {
    throw newHTTPError("Invalid JSON", response, init?.method);
  });

  const result = schema.safeParse(json);

  if (!result.success) {
    throw newHTTPError("Invalid response schema", response, init?.method);
  }

  return result.data;
}

function newHTTPError(reason: string, response: Response, method?: string) {
  const text = response.text().catch(() => null);
  const message = `HTTPError: ${reason} ${method ?? ""} ${response.url} ${text}`;

  console.error(`[HTTPError] ${message} ${response.url} ${response.status}`);

  return new HTTPError(response.status, message);
}

export class HTTPError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.status = status;
  }
}

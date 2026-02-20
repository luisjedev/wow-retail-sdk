export class WowApiError extends Error {
  constructor(message: string, public meta: { status: number; path: string }) {
    super(message);
  }

  get status() {
    return this.meta.status;
  }
}

export class WowNotFoundError extends WowApiError {}
export class WowAuthError extends WowApiError {}
export class WowRateLimitError extends WowApiError {}
export class WowValidationError extends Error {}

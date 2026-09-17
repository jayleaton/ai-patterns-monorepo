import 'server-only'

/** Expected business failures that the route boundary may expose to callers. */
export class ServiceError extends Error {
  constructor(
    readonly status: 403 | 404 | 409,
    message: string
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}

export function isApplicationError(errorPayload) {
    return errorPayload && errorPayload.error && errorPayload.error.name !== undefined && errorPayload.error.message !== undefined
  }
  
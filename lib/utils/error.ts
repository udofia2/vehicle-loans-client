/**
 * Utility functions for handling API errors and extracting user-friendly messages
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: string[]; // Array of validation errors
    };
    status?: number;
  };
  message?: string;
}

/**
 * Extract a user-friendly error message from an API error response
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "An error occurred"
): string {
  let errorMessage = fallback;

  // Type guard to check if error has the expected structure
  const apiError = error as ApiError;

  // First, check if there are specific validation errors
  if (
    apiError?.response?.data?.errors &&
    Array.isArray(apiError.response.data.errors)
  ) {
    // Join all validation errors with bullet points for better readability
    errorMessage = apiError.response.data.errors
      .map((err) => `• ${err}`)
      .join("\n");
  }
  // Then try to get general error message from response
  else if (apiError?.response?.data?.message) {
    errorMessage = apiError.response.data.message;
  } else if (apiError?.response?.data?.error) {
    errorMessage = apiError.response.data.error;
  } else if (apiError?.message) {
    errorMessage = apiError.message;
  }

  // Clean up common API error prefixes to make them more user-friendly
  errorMessage = errorMessage
    .replace("VIN Validation Error: ", "")
    .replace("BadRequestException: ", "")
    .replace("ConflictException: ", "")
    .replace("NotFoundException: ", "");

  return errorMessage;
}

/**
 * Check if an error is related to VIN validation
 */
export function isVinError(error: ApiError): boolean {
  const message = extractErrorMessage(error);
  return (
    message.toLowerCase().includes("vin") ||
    message.toLowerCase().includes("check digit")
  );
}

/**
 * Check if an error is a validation error (400 status)
 */
export function isValidationError(error: ApiError): boolean {
  return error.response?.status === 400;
}

/**
 * Check if an error is a conflict error (409 status)
 */
export function isConflictError(error: ApiError): boolean {
  return error.response?.status === 409;
}

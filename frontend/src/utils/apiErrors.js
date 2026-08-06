export function getFriendlyApiError(error) {
  const status = error?.response?.status;
  const response = error?.response?.data;

  if (typeof response === "string") {
    return response;
  }

  if (response?.detail) {
    return response.detail;
  }

  if (response && typeof response === "object") {
    const firstValue = Object.values(response).flat?.()[0] ?? Object.values(response)[0];

    if (typeof firstValue === "string") {
      return firstValue;
    }

    if (Array.isArray(firstValue) && firstValue[0]) {
      return firstValue[0];
    }
  }

  switch (status) {
    case 401:
      return "Your session expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested review could not be found.";
    case 500:
      return "The server encountered an error. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

import { BackendAnalyzeResponse } from "../types";

let activeAbortController: AbortController | null = null;

export async function analyzeKeyword(keyword: string): Promise<BackendAnalyzeResponse> {
  // Cancel the previous active request if it exists
  if (activeAbortController) {
    activeAbortController.abort();
  }

  const controller = new AbortController();
  activeAbortController = controller;
  const signal = controller.signal;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = `${apiBaseUrl}/api/v1/analyze`;
  const timeoutMs = 15000;

  const makeRequest = async (isRetry = false): Promise<BackendAnalyzeResponse> => {
    // Set up timeout timer
    const timeoutId = setTimeout(() => {
      // Abort only this specific controller request
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }),
        signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Retry once for HTTP 500/502/503
        if (!isRetry && [500, 502, 503].includes(response.status)) {
          console.warn(`Transient error ${response.status} encountered. Retrying once...`);
          // Brief pause before retry
          await new Promise((r) => setTimeout(r, 500));
          return makeRequest(true);
        }

        let errorMessage = "Analysis failed.";
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          errorMessage = `HTTP error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data: BackendAnalyzeResponse = await response.json();
      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        // If aborted, check if it was due to a timeout or another request starting
        if (activeAbortController === controller) {
          throw new Error("Analysis timed out.");
        }
        throw error;
      }

      // Retry once for transient network failures
      if (!isRetry) {
        console.warn("Network error encountered. Retrying once...", error);
        await new Promise((r) => setTimeout(r, 500));
        return makeRequest(true);
      }

      throw new Error("Unable to connect to backend.");
    }
  };

  try {
    return await makeRequest();
  } finally {
    if (activeAbortController === controller) {
      activeAbortController = null;
    }
  }
}

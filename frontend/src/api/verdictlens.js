
const BASE_URL = "https://verdictlens.onrender.com";

// ── helper function ──────────────────────────────────────
// all API calls go through this
// handles errors in one place instead of everywhere
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ── API functions ────────────────────────────────────────

// gets all judges with anomaly scores
// used by: Explorer page, Judges page
export async function getAllJudges() {
  return await apiCall("/judges/");
}

// gets one specific judge profile
// used by: Judge profile page
export async function getJudgeProfile(judgeName) {
  const encoded = encodeURIComponent(judgeName);
  return await apiCall(`/judges/${encoded}`);
}

// analyzes a judgment text
// used by: Case Analysis page
export async function analyzeJudgment(text) {
  return await apiCall("/analyze/", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// finds similar cases
// used by: Similarity Search page
export async function searchSimilarCases(query, topK = 5) {
  return await apiCall("/search/", {
    method: "POST",
    body: JSON.stringify({ query, top_k: topK }),
  });
}

// health check
export async function checkHealth() {
  return await apiCall("/health");
}
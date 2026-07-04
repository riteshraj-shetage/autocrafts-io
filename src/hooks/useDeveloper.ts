import { useState, useEffect } from "react";
import staticTelemetry from "../data/sourced.json";

export function useDeveloper(username: string | null) {
  const [data, setData] = useState<any>(staticTelemetry);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setData(staticTelemetry);
      return;
    }

    const workerUrl = "https://api.riteshraj.tech/";

    async function fetchLiveProfile() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${workerUrl}?username=${username}`);
        
        if (!response.ok) {
          throw new Error(`Could not find developer: ${username}`);
        }

        const liveTelemetry = await response.json();
        if (liveTelemetry.errors) {
          throw new Error(liveTelemetry.errors[0].message);
        }

        setData(liveTelemetry.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch developer telemetry");
      } finally {
        setLoading(false);
      }
    }

    fetchLiveProfile();
  }, [username]);

  return { rawTelemetry: data, loading, error };
}
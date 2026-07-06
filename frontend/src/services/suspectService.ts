import type { SuspectCapture } from '@/types';
import { mockSuspectCaptures } from '@/mocks/suspects';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export async function fetchSuspectCaptures(): Promise<SuspectCapture[]> {
  if (USE_MOCK) {
    await delay(400);
    return mockSuspectCaptures;
  }

  // Placeholder for future Django endpoint: GET /api/suspects/
  await delay(400);
  return mockSuspectCaptures;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

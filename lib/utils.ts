import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'
import { ParsedMetadataEntry } from 'lib/types';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

// Assuming you've set REACT_APP_BACKEND_URL in your environment variables
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export async function fetcher<JSON = any>(
  endpoint: string,
  init?: RequestInit
): Promise<JSON> {
  // Prepend the backend URL to the endpoint
  const res = await fetch(`${backendUrl}${endpoint}`, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function parseMetadata(formattedMetadata: string): ParsedMetadataEntry[] {
  // Split the metadata entries by the newline character
  const formattedEntries = formattedMetadata.split('\n');
  const parsedEntries: (ParsedMetadataEntry | null)[] = formattedEntries.map((entry, index) => {
    // Try to match both video and paper details
    const videoDetails = entry.match(/\[Title\]: (.*?), \[Channel name\]: (.*?), \[Video Link\]: (.*?), \[Published date\]: ([\d-]+)/);
    const paperDetails = entry.match(/\[Title\]: (.*?), \[Authors\]: (.*?), \[Link\]: (.*?), \[Release date\]: ([\d-]+)/);
    
    // Determine if it's a video or paper detail and extract accordingly
    let details = videoDetails || paperDetails;
    let extraInfoType = videoDetails ? 'Channel name' : 'Authors';

    // If details are found, construct the ParsedMetadataEntry object
    return details ? {
      index: index + 1,
      title: details[1],
      extraInfoType: extraInfoType,
      link: details[3],
      extraInfo: details[2],
      // Correct the index for the published date based on whether it's video or paper
      publishedDate: new Date(details[4]),
      publishedDateString: details[4] // This should be the same index as the publishedDate
    } : null;
  });

  // Remove null values and ensure the array is of ParsedMetadataEntry[]
  const filteredEntries = parsedEntries.filter(Boolean) as ParsedMetadataEntry[];

  // Sort the entries based on the published date
  return filteredEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

// Helper function to parse cookies
export function parseCookies(request: Request): Map<string, string> {
  const cookies = new Map<string, string>();
  const cookieString = request.headers.get('Cookie');
  if (cookieString) {
    cookieString.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=');
      cookies.set(name.trim(), rest.join('=').trim());
    });
  }
  return cookies;
}

import { IncomingMessage } from 'http';

export function parseServerSideCookies(req: IncomingMessage): Map<string, string> {
  const cookies = new Map<string, string>();
  const cookieHeader = req.headers.cookie || '';

  cookieHeader.split('; ').forEach(cookie => {
    const [key, value] = cookie.split('=');
    cookies.set(key, value);
  });

  return cookies;
}
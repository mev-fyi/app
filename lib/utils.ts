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

    if (videoDetails) {
      return {
        index: index + 1,
        type: 'youtubeVideo',
        title: videoDetails[1],
        extraInfo: videoDetails[2],
        link: videoDetails[3],
        publishedDate: new Date(videoDetails[4]),
        publishedDateString: videoDetails[4]
      };
    } else if (paperDetails) {
      const authors = paperDetails[2].split(', ').map(author => {
        const urlMatch = author.match(/https?:\/\/(.+)/);
        if (urlMatch) {
          const lastSegment = urlMatch[1].split('/').filter(Boolean).pop(); // Extract the last segment of the URL
          return `<a href="${author}" target="_blank" style="text-decoration: underline;">${lastSegment}</a>`;
        }
        return author;
      }).join(', ');

      return {
        index: index + 1,
        type: 'researchPaper',
        title: paperDetails[1],
        extraInfo: authors,
        link: paperDetails[3],
        publishedDate: new Date(paperDetails[4]),
        publishedDateString: paperDetails[4]
      };
    }

    return null;
  });

  // Remove null values and ensure the array is of ParsedMetadataEntry[]
  const filteredEntries = parsedEntries.filter(Boolean) as ParsedMetadataEntry[];

  // Sort the entries based on the published date
  return filteredEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}
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
  const formattedEntries = formattedMetadata.split('\n');

  const parsedEntries: (ParsedMetadataEntry | null)[] = formattedEntries.map((entry, index) => {
    const videoDetails = entry.match(/\[Title\]: (.*?), \[Channel name\]: (.*?), \[Video Link\]: (.*?), \[Published date\]: ([\d-]+)/);
    const paperDetails = entry.match(/\[Title\]: (.*?), \[Authors\]: (.*?), \[Link\]: (.*?), \[Release date\]: ([\d-]+)/);

    // Ensure that videoDetails and paperDetails are mutually exclusive
    if (videoDetails && !paperDetails) {
      return createVideoEntry(videoDetails, index);
    } else if (paperDetails && !videoDetails) {
      return createPaperEntry(paperDetails, index);
    }

    return null;
  });

  return parsedEntries.filter(Boolean) as ParsedMetadataEntry[];
}

function createVideoEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'youtubeVideo',
    title: details[1],
    extraInfo: details[2], // Channel name as extraInfo
    link: details[3],
    publishedDate: new Date(details[4]),
    publishedDateString: details[4]
  };
}

function createPaperEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  let authors = processAuthors(details[2]);

  return {
    index: index + 1,
    type: 'researchPaper',
    title: details[1],
    extraInfo: authors, // Authors as extraInfo
    link: details[3],
    publishedDate: new Date(details[4]),
    publishedDateString: details[4]
  };
}

function processAuthors(authors: string): string {
  const authorsArray = authors.split(', ');

  if (authorsArray.every(author => author.match(/^https?:\/\//))) {
    // If all authors are URLs, convert them to clickable names
    return authorsArray.map(author => {
      const lastSegment = author.split('/').filter(Boolean).pop(); // Extract the last segment of the URL
      return `<a href="${author}" target="_blank" style="text-decoration: underline;">${lastSegment}</a>`;
    }).join(', ');
  } else {
    // Apply 'et al.' if the combined length of authors is too long
    let combinedAuthors = authorsArray.join(', ');
    if (combinedAuthors.length > 44) {
      const firstAuthorLastName = authorsArray[0].split(' ').pop();
      combinedAuthors = `${firstAuthorLastName} et al.`;
    }
    return combinedAuthors;
  }
}
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

    if (videoDetails) {
      return createVideoEntry(videoDetails, index);
    } else if (paperDetails) {
      return createPaperEntry(paperDetails, index);
    }

    return null;
  });

  return parsedEntries.filter(Boolean) as ParsedMetadataEntry[]
}

function createVideoEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'youtubeVideo',
    title: details[1],
    extraInfo: details[2],
    link: details[3],
    publishedDate: new Date(details[4]),
    publishedDateString: details[4]
  };
}

function createPaperEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  let authors = processAuthors(details[2]);

  if (authors.length > 44) {
    const firstAuthorLastName = authors.split(', ')[0].split(' ').pop();
    authors = `${firstAuthorLastName} et al.`;
  }

  return {
    index: index + 1,
    type: 'researchPaper',
    title: details[1],
    extraInfo: authors,
    link: details[3],
    publishedDate: new Date(details[4]),
    publishedDateString: details[4]
  };
}

function processAuthors(authors: string): string {
  return authors.split(', ').map(author => {
    const urlMatch = author.match(/https?:\/\/(.+)/);
    if (urlMatch) {
      const lastSegment = urlMatch[1].split('/').filter(Boolean).pop(); // Extract the last segment of the URL
      return `<a href="${author}" target="_blank" style="text-decoration: underline;">${lastSegment}</a>`;
    }
    return author;
  }).join(', ');
}
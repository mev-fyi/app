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

  const parsedEntries = formattedEntries.map((entry, index): ParsedMetadataEntry => {
    // Extract all possible details with optional capturing groups
    const details = entry.match(/\[Title\]: (.*?)(, \[Authors\]: (.*?))?(, \[Link\]: (.*?))?(, \[Published date\]: ([\d-]+))?/);

    // Default to empty string if a group is not captured
    const title = details && details[1] ? sanitizeField(details[1]) : '';
    const authors = details && details[3] ? processAuthors(sanitizeField(details[3])) : '';
    const link = details && details[5] ? sanitizeField(details[5]) : '';
    const publishedDateString = details && details[7] ? sanitizeField(details[7]) : '';

    // Convert published date to a Date object, default to new Date('') for empty string
    const publishedDate = publishedDateString ? new Date(publishedDateString) : new Date('');

    return {
      index: index + 1,
      type: 'researchPaper', // Assume 'researchPaper' type for simplicity, adjust as needed
      title: title,
      extraInfo: authors,
      link: link,
      publishedDate: publishedDate,
      publishedDateString: publishedDateString
    };
  });

  // Filter out entries that have no title, assuming title is a minimum requirement
  return parsedEntries.filter(entry => entry.title !== '') as ParsedMetadataEntry[];
}

function createVideoEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'youtubeVideo',
    title: sanitizeField(details[1]),
    extraInfo: sanitizeField(details[2]),
    link: sanitizeField(details[3]),
    publishedDate: new Date(sanitizeField(details[4])),
    publishedDateString: sanitizeField(details[4])
  };
}

function createPaperEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'researchPaper',
    title: sanitizeField(details[1]),
    extraInfo: processAuthors(sanitizeField(details[2])),
    link: sanitizeField(details[3]),
    publishedDate: new Date(sanitizeField(details[4])),
    publishedDateString: sanitizeField(details[4])
  };
}

function processAuthors(authors: string): string {
  if (!isValidField(authors)) {
    return 'unspecified';
  }

  const authorsArray = authors.split(', ');

  if (authorsArray.every(author => isValidField(author) && author.match(/^https?:\/\//))) {
    return authorsArray.map(author => {
      const lastSegment = author.split('/').filter(Boolean).pop();
      return `<a href="${author}" target="_blank" style="text-decoration: underline;">${lastSegment}</a>`;
    }).join(', ');
  } else {
    let combinedAuthors = authorsArray.join(', ');
    if (combinedAuthors.length > 44) {
      const firstAuthorLastName = authorsArray[0].split(' ').pop();
      combinedAuthors = `${firstAuthorLastName} et al.`;
    }
    return combinedAuthors;
  }
}

function sanitizeField(field: string): string {
  return isValidField(field) ? field : 'unspecified';
}

function isValidField(field: string): boolean {
  if (!field) return false; // checks if field is undefined or null
  if (field.trim() === '') return false; // checks if field is empty or whitespace
  if (field.toLowerCase() === 'nan') return false; // checks if field is 'nan'

  return true; // return true if all checks pass
}
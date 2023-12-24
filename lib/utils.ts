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

  const parsedEntries = formattedEntries.map((entry, index) => {
    const details = entry.match(/\[Title\]: (.*?), \[Authors\]: (.*?), \[Link\]: (.*?), \[Release date\]: ([\d-]+)/);

    if (details) {
      return createPaperEntry(details, index);
    }

    // If details are not fully available, parse what is there
    const partialDetails = entry.match(/\[Title\]: (.*?)(, \[Authors\]: (.*?))?(, \[Link\]: (.*?))?(, \[Release date\]: ([\d-]+))?/);
    if (partialDetails) {
      return createPartialPaperEntry(partialDetails, index);
    }

    return null;
  });

  return parsedEntries.filter(entry => entry !== null) as ParsedMetadataEntry[];
}

function createPaperEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'researchPaper',
    title: sanitizeField(details[1]),
    extraInfo: processAuthors(sanitizeField(details[2])),
    link: sanitizeField(details[3]),
    publishedDate: sanitizeField(details[4]) !== 'unspecified' ? new Date(sanitizeField(details[4])) : new Date(''),
    publishedDateString: sanitizeField(details[4])
  };
}

function createPartialPaperEntry(details: RegExpMatchArray, index: number): ParsedMetadataEntry {
  return {
    index: index + 1,
    type: 'researchPaper',
    title: sanitizeField(details[1]),
    extraInfo: details[3] ? processAuthors(sanitizeField(details[3])) : '',
    link: details[5] ? sanitizeField(details[5]) : '',
    publishedDate: details[7] ? new Date(sanitizeField(details[7])) : new Date(''),
    publishedDateString: details[7] ? sanitizeField(details[7]) : ''
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
  return isValidField(field) ? field : '';
}

function isValidField(field: string): boolean {
  if (!field) return false;
  if (field.trim() === '') return false;
  if (field.toLowerCase() === 'nan') return false;
  return true;
}
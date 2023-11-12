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

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

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
  const formattedEntries = formattedMetadata.split(', [Title]: ');
  const parsedEntries: ParsedMetadataEntry[] = formattedEntries.map((entry, index): ParsedMetadataEntry | null => {
    const videoDetails = entry.match(/\[Title\]: (.*?), \[Channel name\]: (.*?), \[Video Link\]: (.*?), \[Published date\]: ([\d-]+)/);
    const paperDetails = entry.match(/\[Title\]: (.*?), \[Authors\]: (.*?), \[Link\]: (.*?), \[Release date\]: ([\d-]+)/);

    let details = videoDetails || paperDetails;
    let extraInfoType = videoDetails ? 'Channel name' : 'Authors';

    return details ? {
      index: index + 1,
      title: details[1],
      extraInfoType: extraInfoType,
      link: details[3],
      extraInfo: details[2],
      publishedDate: new Date(details[videoDetails ? 4 : 5]),
      publishedDateString: details[videoDetails ? 4 : 5] // Store the original string
    } : null;
  }).filter(Boolean) as ParsedMetadataEntry[];
  
  console.log('parsedEntries:', parsedEntries);
  console.log('parsedEntries:', JSON.stringify(parsedEntries, null, 2));

  return parsedEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}
import { ParsedMetadataEntry } from '../types/ParsedMetadataEntry';
// Define the input type for the formattedMetadata parameter
type FormattedMetadata = string;

// The parseAndFormatMetadata function with type annotations
function parseAndFormatMetadata(formattedMetadata: FormattedMetadata): string {
  const formattedEntries = formattedMetadata.split(', [Title]: ');
  const parsedEntries: ParsedMetadataEntry[] = formattedEntries.map((entry, index): ParsedMetadataEntry | null => {
    // Extract details using regex that works for both videos and research papers
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
      publishedDate: new Date(details[videoDetails ? 4 : 5])
    } : null;
  }).filter(Boolean) as ParsedMetadataEntry[];

  // Sort by published date
  const formattedList = parsedEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
    .map((entry): string => `
      ${entry.index}. <a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.title}</a> 
      (${entry.extraInfoType}: ${entry.extraInfo}) - ${entry.publishedDate.toISOString().split('T')[0]}
    `).join('<br>');

  return formattedList;
}

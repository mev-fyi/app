import React from 'react';
import { parseMetadata } from '../utils/parseMetadata';
import { ParsedMetadataEntry } from '../types/ParsedMetadataEntry';

const MetadataList: React.FC<{ formattedMetadata: string }> = ({ formattedMetadata }) => {
  const parsedEntries = parseMetadata(formattedMetadata);

  // Sort by published date
  parsedEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  return (
    <ol className="metadata-list">
      {parsedEntries.map((entry, index) => (
        <li key={index}>
          <a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.title}</a>
          <span> ({entry.extraInfoType}: {entry.extraInfo})</span>
          <span> - {entry.publishedDate.toISOString().split('T')[0]}</span>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;

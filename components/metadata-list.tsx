import React from 'react';
import { ParsedMetadataEntry } from 'lib/types';

interface MetadataListProps {
  entries: ParsedMetadataEntry[];
}

const MetadataList: React.FC<MetadataListProps> = ({ entries }) => {
  return (
    <ol className="metadata-list">
      {entries.map((entry, index) => (
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
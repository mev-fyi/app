import React from 'react';
import { ParsedMetadataEntry } from 'lib/types';
import styles from './MetadataList.module.css'; // Import the CSS module

interface MetadataListProps {
  entries: ParsedMetadataEntry[];
}

const MetadataList: React.FC<MetadataListProps> = ({ entries }) => {
  return (
    <ol className={styles.metadataList}>
      {entries.map((entry, index) => (
        <li key={index} className={styles.metadataListItem}>
          <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.metadataListLink}>
            {entry.title}
          </a>
          <span className={styles.metadataListSpan}>
            {entry.extraInfoType}: {entry.extraInfo} &middot; {entry.publishedDateString}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;
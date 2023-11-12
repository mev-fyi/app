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
          <div className={styles.metadataListDetails}>
            <span className={styles.metadataListExtraInfo}>{entry.extraInfo}</span>
            <span className={styles.metadataListDot}>&middot;</span>
            <span>{entry.publishedDateString}</span>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;
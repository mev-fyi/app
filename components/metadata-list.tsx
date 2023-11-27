import React from 'react';
import { ParsedMetadataEntry } from '@/lib/types'; // Adjust the import path as necessary
import styles from './MetadataList.module.css'; // Import the CSS module
import {IconResearchPaper, IconYouTube} from '@/components/ui/icons'; // Adjust path as necessary

interface MetadataListProps {
  entries: ParsedMetadataEntry[];
}

const MetadataList: React.FC<MetadataListProps> = ({ entries }) => {
  // Function to determine if an entry is a YouTube video
  const isYoutubeVideo = (entry: ParsedMetadataEntry) => entry.type === 'youtubeVideo';

  return (
    <ol className={styles.metadataList}>
      {entries.map((entry, index) => (
        <li key={index} className={styles.metadataListItem}>
          <div className={styles.metadataListItemIcon}>
            {isYoutubeVideo(entry) ? <IconYouTube /> : <IconResearchPaper />}
          </div>
          <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.metadataListLink}>
            {entry.title}
          </a>
          <span className={styles.metadataListSpan}>
            {entry.extraInfo} &middot; {entry.publishedDateString}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;
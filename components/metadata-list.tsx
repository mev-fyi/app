import React from 'react';
import { ParsedMetadataEntry } from '@/lib/types';
import styles from './MetadataList.module.css';

const MetadataList: React.FC<{ entries: ParsedMetadataEntry[] }> = ({ entries }) => {
  // Function to sanitize the title to match filename conventions
  // const sanitizeTitle = (title: string) => {
  //   return title.replace(/[^a-zA-Z0-9]/g, '_'); // Replace special characters with underscores
  // };

  // Function to get thumbnail URL
  const getThumbnailUrl = (entry: ParsedMetadataEntry) => {
    if (entry.type === 'youtubeVideo') {
      const videoId = new URL(entry.link).searchParams.get('v');
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-youtube-thumbnail.jpg'; // Fallback thumbnail
    } else if (entry.type === 'researchPaper') {
      const sanitizedTitle = entry.title;
      return `/assets/research_paper_thumbnails/${sanitizedTitle}.png`; // Path to the thumbnail in the assets directory
    }
    return '/default-thumbnail.jpg'; // General fallback thumbnail
  };

  return (
    <ol className={styles.metadataList}>
      {entries.map((entry, index) => (
        <li key={index} className={styles.metadataListItem}>
          <div className={styles.metadataThumbnail}>
            <img src={getThumbnailUrl(entry)} alt={entry.title} />
          </div>
          <div className={styles.metadataContent}>
            <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.metadataListLink}>
              {entry.title}
            </a>
            <span className={styles.metadataListSpan}>
              {entry.extraInfo} &middot; {entry.publishedDateString}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;

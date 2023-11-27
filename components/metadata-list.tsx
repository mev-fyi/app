import React from 'react';
import { ParsedMetadataEntry } from '@/lib/types';
import styles from './MetadataList.module.css';

const MetadataList: React.FC<{ entries: ParsedMetadataEntry[] }> = ({ entries }) => {
  // Function to get thumbnail URL
  const getThumbnailUrl = (entry: ParsedMetadataEntry) => {
    let thumbnailUrl;
  
    if (entry.type === 'youtubeVideo') {
      const videoId = new URL(entry.link).searchParams.get('v');
      thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-youtube-thumbnail.jpg';
    } else if (entry.type === 'researchPaper') {
      const encodedTitle = encodeURIComponent(entry.title) + '.png';
      thumbnailUrl = `/research_paper_thumbnails/${encodedTitle}`;
    } else {
      thumbnailUrl = '/default-thumbnail.jpg';
    }
  
    console.log(`Thumbnail URL for ${entry.title}: ${thumbnailUrl}`);
    return thumbnailUrl;
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
              {entry.extraInfo}
            </span>
            <span className={styles.metadataListSpan}>
              {entry.publishedDateString}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;

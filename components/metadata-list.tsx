import React from 'react';
import { ParsedMetadataEntry } from '@/lib/types';
import styles from './MetadataList.module.css';


const MetadataList: React.FC<{ entries: ParsedMetadataEntry[] }> = ({ entries }) => {
  // Helper function to extract the domain including the subdomain if available
  const extractDomain = (link: string): string => {
    try {
      const url = new URL(link);
      return url.hostname; // This includes subdomain if present
    } catch (error) {
      console.error(`Error parsing URL: ${error}. Using regex as fallback.`);
      // Attempt to extract the domain using regex as a fallback
      const regexMatch = link.match(/^(?:https?:\/\/)?([^\/]+)/);
      if (regexMatch && regexMatch[1]) {
        return regexMatch[1]; // Return the extracted domain from regex
      } else {
        return 'default'; // A fallback domain or handle appropriately
      }
    }
  };


  // List of domains to check against
  // NOTE 2024-03-17: lazy fix, manually hardcode the predefined domains from the research papers. in which case we only fetch for the title. This is because the 
  //   thumbnail generation for reseacrh papers on the data side isn't matched and stored under the subdirectory corresponding to the domain.
  const predefinedDomains = [
    'papers.ssrn.com', 'www.sciencedirect.com', 'www.researchgate.net', 'xenophonlabs.com', 'moallemi.com','uniswap.org', 'www.sec.gov', 'cms.nil.foundation',
    'arxiv.org', 'dl.acm.org', 'eprint.iacr.org', 'www.nature.com',    'angeris.github.io', 'fc24.ifca.ai', 'people.eecs.berkeley.edu', 'pub.tik.ee.ethz.ch',
    'anthonyleezhang.github.io', 'atiselsts.github.io', 'lamport.azurewebsites.net', 'pmg.csail.mit.edu', 'business.columbia.edu','www.cs.purdue.edu',
    'www.cfainstitute.org',
  ];

  // Function to get thumbnail URL
  const getThumbnailUrl = (entry: ParsedMetadataEntry) => {
    let thumbnailUrl;

    if (entry.type === 'youtubeVideo') {
      const videoId = entry.link ? new URL(entry.link).searchParams.get('v') : null;
      thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-youtube-thumbnail.jpg';
    } else if (entry.type === 'researchPaper' && entry.link) {
      // Extract the domain from the entry's link
      const url = new URL(entry.link);
      const domain = url.hostname;

      // Check if the domain is in the predefined list or part of the domains extracted from your provided list
      if (predefinedDomains.includes(domain)) {
        // Use only the title for the filename
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
        thumbnailUrl = `/research_paper_thumbnails/${encodedTitle}`;
      } else {
        // Use the domain as a subdirectory and the title for the filename
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
        thumbnailUrl = `/research_paper_thumbnails/${domain}/${encodedTitle}`;
      }
    } else {
      try { 
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
        // Case for research papers with no parent directory
        thumbnailUrl = `/research_paper_thumbnails/${encodedTitle}`;
      } catch (error) {
        console.error(`Error parsing URL: ${error}. Using default thumbnail as fallback.`);
        thumbnailUrl = '/default-thumbnail.jpg';
      }
    }

    return thumbnailUrl;
  };
  
  return (
    <ol className={styles.metadataList}>
      {entries.map((entry, index) => (
        <li key={index} className={styles.metadataListItem}>
          {/* Make the thumbnail clickable by wrapping it in an anchor tag */}
          <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.metadataThumbnailLink}>
            <div className={styles.metadataThumbnail}>
              <img src={getThumbnailUrl(entry)} alt={entry.title} />
            </div>
          </a>
          <div className={styles.metadataContent}>
            <div className={styles.metadataTop}>
              <a href={entry.link} target="_blank" rel="noopener noreferrer" className={styles.metadataListLink}>
                {entry.title}
              </a>
            </div>
            <div className={styles.metadataMiddle}>
              {/* Render extraInfo as HTML */}
              <span 
                className={styles.metadataListSpan} 
                dangerouslySetInnerHTML={{ __html: entry.extraInfo }} 
              />
            </div>
            <div className={styles.metadataBottom}>
              <span className={styles.metadataListSpan}>{entry.publishedDateString}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default MetadataList;

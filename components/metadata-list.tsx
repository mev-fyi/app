import React, { useState, useEffect } from 'react';
import { ParsedMetadataEntry } from '@/lib/types';
import styles from './MetadataList.module.css';


const MetadataList: React.FC<{ entries: ParsedMetadataEntry[] }> = ({ entries }) => {
  const [docMappings, setDocMappings] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch('/public/docs_mapping.json')
      .then(response => response.json())
      .then(data => {
        setDocMappings(data);
      });
  }, []);

  const extractDomain = (link: string): string => {
    try {
      const url = new URL(link);
      return url.hostname;
    } catch (error) {
      console.error(`Error parsing URL: ${error}. Using regex as fallback.`);
      const regexMatch = link.match(/^(?:https?:\/\/)?([^\/]+)/);
      if (regexMatch && regexMatch[1]) {
        return regexMatch[1];
      } else {
        return 'default';
      }
    }
  };


  // List of domains to check against
  // NOTE 2024-03-17: lazy fix, manually hardcode the predefined domains from the research papers. in which case we only fetch for the title. This is because the 
  //   thumbnail generation for reseacrh papers on the data side isn't matched and stored under the subdirectory corresponding to the domain.
  const predefinedDomains = [
    'papers.ssrn.com', 'www.sciencedirect.com', 'www.researchgate.net', 'xenophonlabs.com', 'moallemi.com', 'uniswap.org', 'www.sec.gov', 'cms.nil.foundation',
    'arxiv.org', 'dl.acm.org', 'eprint.iacr.org', 'www.nature.com', 'angeris.github.io', 'fc24.ifca.ai', 'people.eecs.berkeley.edu', 'pub.tik.ee.ethz.ch',
    'anthonyleezhang.github.io', 'atiselsts.github.io', 'lamport.azurewebsites.net', 'pmg.csail.mit.edu', 'business.columbia.edu', 'www.cs.purdue.edu',
    'www.cfainstitute.org',
  ];

  const getDocumentName = (link: string) => {
    return docMappings[link] || null;
  };

  const getThumbnailUrl = (entry: ParsedMetadataEntry) => {
    let thumbnailUrl;

    if (entry.type === 'youtubeVideo') {
      const videoId = entry.link ? new URL(entry.link).searchParams.get('v') : null;
      thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/default-youtube-thumbnail.jpg';
    } else if (entry.type === 'researchPaper' && entry.link) {
      const domain = extractDomain(entry.link);
      const documentName = getDocumentName(entry.link);

      if (documentName) {
        thumbnailUrl = `/research_paper_thumbnails/${domain}/${encodeURIComponent(documentName)}`;
      } else if (predefinedDomains.includes(domain)) {
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
        thumbnailUrl = `/research_paper_thumbnails/${encodedTitle}`;
      } else {
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
        thumbnailUrl = `/research_paper_thumbnails/${domain}/${encodedTitle}`;
      }
    } else {
      try {
        const encodedTitle = encodeURIComponent(entry.title) + '.png';
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

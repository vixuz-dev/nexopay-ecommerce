import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords = [], schema = null }) => {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    // Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    if (description) {
      descTag.setAttribute('content', description);
    }

    // Keywords
    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    const keywordsContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    if (keywordsContent) {
      keywordsTag.setAttribute('content', keywordsContent);
    }

    // JSON-LD Schema
    let schemaTag = document.getElementById('seo-schema-jsonld');
    if (!schemaTag) {
      schemaTag = document.createElement('script');
      schemaTag.type = 'application/ld+json';
      schemaTag.id = 'seo-schema-jsonld';
      document.head.appendChild(schemaTag);
    }
    if (schema) {
      schemaTag.text = JSON.stringify(schema);
    }
  }, [title, description, keywords, schema]);

  return null;
};

export { SEO };




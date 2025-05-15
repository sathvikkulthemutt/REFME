import React from 'react';

interface Link {
  _id: string;
  title: string;
  url: string;
  category: string;
  privacy: string;
  created_at: string;
}

interface LinkListProps {
  links: Link[];
  isLoading: boolean;
}

const LinkList: React.FC<LinkListProps> = ({ links, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-panel">
        <h2 className="section-title">Your Links</h2>
        <div className="loading-state">Loading your links...</div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="glass-panel">
        <h2 className="section-title">Your Links</h2>
        <div className="empty-state">
          <p>You haven't saved any links yet. Add your first link!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2 className="section-title">Your Links</h2>
      <div className="links-grid">
        {links.map((link) => (
          <div key={link._id} className="link-card">
            <h3>{link.title}</h3>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.url}
            </a>
            <div className="link-meta">
              <span className="category">{link.category}</span>
              <span className="privacy">{link.privacy}</span>
              <span className="date">
                {new Date(link.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkList;

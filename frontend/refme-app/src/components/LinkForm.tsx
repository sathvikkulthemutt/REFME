import React, { useState } from 'react';
import { linkService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import '../styles/global.css';

const LinkForm: React.FC<{ onLinkAdded: () => void }> = ({ onLinkAdded }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('general');
  const [privacy, setPrivacy] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !url) {
      addNotification('error', 'Please enter both title and URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url); // This will throw if URL is invalid
    } catch (err) {
      addNotification('error', 'Please enter a valid URL');
      return;
    }

    try {
      setIsLoading(true);
      await linkService.saveLink({
        title,
        url,
        category,
        privacy
      });
      
      // Clear form
      setTitle('');
      setUrl('');
      setCategory('general');
      setPrivacy('private');
      
      addNotification('success', 'Link saved successfully!');
      onLinkAdded(); // Trigger refresh of links
    } catch (err: any) {
      addNotification('error', err.response?.data?.msg || 'Failed to save link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h2 className="section-title">Add New Link</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title for your link"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            id="url"
            className="form-control"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="privacy">Privacy</label>
          <select
            id="privacy"
            className="form-control"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Link'}
        </button>
      </form>
    </div>
  );
};

export default LinkForm; 
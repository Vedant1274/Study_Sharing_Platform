import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, Calendar, HardDrive, BookMarked } from 'lucide-react';

const MaterialList = ({ refreshTrigger }) => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `http://localhost:5000/api/materials/search?q=${encodeURIComponent(query)}`
        : 'http://localhost:5000/api/materials';
        
      const res = await axios.get(url);
      setMaterials(res.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [refreshTrigger]); // Refetch when a new material is uploaded

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMaterials(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDownload = async (id, title) => {
    try {
      // Trigger file download
      window.open(`http://localhost:5000/api/materials/download/${id}`, '_blank');
      
      // Optimistically update the UI to reflect incremented download count
      setMaterials(prevMaterials => 
        prevMaterials.map(mat => 
          mat._id === id ? { ...mat, downloadCount: mat.downloadCount + 1 } : mat
        )
      );
    } catch (error) {
      console.error('Error downloading material:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search materials by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Loading materials...
        </div>
      ) : materials.length > 0 ? (
        <div className="materials-grid">
          {materials.map((material) => (
            <div key={material._id} className="card material-card">
              <div>
                <span className="material-subject">{material.subject}</span>
                <h3 className="material-title">{material.title}</h3>
              </div>
              
              <div className="material-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  {formatDate(material.createdAt)}
                </div>
                <div className="meta-item" title="Downloads">
                  <HardDrive size={16} />
                  {material.downloadCount}
                </div>
              </div>

              <button 
                className="btn download-btn" 
                onClick={() => handleDownload(material._id, material.title)}
              >
                <Download size={18} />
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <BookMarked size={48} style={{ margin: '0 auto 1rem', color: '#9ca3af' }} />
          <h3>No materials found</h3>
          <p>Try adjusting your search query or upload a new material.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialList;

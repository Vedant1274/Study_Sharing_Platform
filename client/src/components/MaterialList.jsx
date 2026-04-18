import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, Calendar, HardDrive, BookMarked, Loader, Trash2, Clock, List } from 'lucide-react';

const MaterialList = ({ refreshTrigger }) => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      // Fetch all materials once for instant client-side filtering
      const res = await axios.get('http://localhost:5000/api/materials');
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

  const handleDownload = async (id, title) => {
    try {
      setDownloadingId(id);
      // Trigger file download
      window.open(`http://localhost:5000/api/materials/download/${id}`, '_blank');
      
      // Optimistically update the UI to reflect incremented download count
      setMaterials(prevMaterials => 
        prevMaterials.map(mat => 
          mat._id === id ? { ...mat, downloadCount: mat.downloadCount + 1 } : mat
        )
      );

      // Reset UI state after brief delay
      setTimeout(() => setDownloadingId(null), 1500);
    } catch (error) {
      console.error('Error downloading material:', error);
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id) => {
    console.log('Attempting to delete material with ID:', id);
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        setDeletingId(id);
        const response = await axios.delete(`http://localhost:5000/api/materials/${id}`);
        console.log('Delete API response:', response.data);
        
        // Remove material from local state
        setMaterials(prevMaterials => prevMaterials.filter(mat => mat._id !== id));
      } catch (error) {
        console.error('Error deleting material:', error.response?.data || error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFileExtension = (filePath) => {
    if (!filePath) return '';
    const parts = filePath.split('.');
    return parts[parts.length - 1];
  };

  // Instant client-side filtering
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentUploads = filteredMaterials.slice(0, 5);
  const olderUploads = filteredMaterials.slice(5);

  const renderMaterialCards = (mats) => (
    <div className="materials-grid">
      {mats.map((material) => (
        <div key={material._id} className="card material-card">
          <div>
            <span className="material-subject">{material.subject}</span>
            <span className="file-badge">{getFileExtension(material.filePath)}</span>
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

          <div className="card-actions">
            <button 
              className="btn download-btn" 
              onClick={() => handleDownload(material._id, material.title)}
              disabled={downloadingId === material._id}
            >
              {downloadingId === material._id ? <Loader className="spinner" size={18} /> : <Download size={18} />}
              {downloadingId === material._id ? 'Downloading...' : 'Download'}
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => handleDelete(material._id)}
              disabled={deletingId === material._id}
              style={{ padding: '0.75rem', width: 'auto' }}
              title="Delete material"
            >
              {deletingId === material._id ? <Loader className="spinner" size={18} /> : <Trash2 size={18} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
          <Loader className="spinner" size={32} style={{ margin: '0 auto 1rem' }} />
          <p>Loading materials...</p>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <>
          {searchQuery === '' ? (
            <>
              {recentUploads.length > 0 && (
                <>
                  <h2 className="section-heading"><Clock size={24} color="var(--primary-color)" /> Recent Uploads</h2>
                  {renderMaterialCards(recentUploads)}
                </>
              )}
              {olderUploads.length > 0 && (
                <>
                  <h2 className="section-heading section-divider"><List size={24} color="var(--primary-color)" /> All Materials</h2>
                  {renderMaterialCards(olderUploads)}
                </>
              )}
            </>
          ) : (
            renderMaterialCards(filteredMaterials)
          )}
        </>
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

import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileType, BookOpen, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

const UploadForm = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Client-side validation for unsupported file types
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      
      const fileName = selectedFile.name.toLowerCase();
      const isValidExtension = fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx');

      if (!isValidExtension) {
        setMessage({ type: 'error', text: 'Unsupported file type. Please upload PDF, DOC, or PPT.' });
        setFile(null);
        e.target.value = null; // reset input
        return;
      }

      // Client-side validation for 10MB limit
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size exceeds 10MB limit.' });
        setFile(null);
        e.target.value = null; // reset input
        return;
      }
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subject || !file) {
      setMessage({ type: 'error', text: 'Please fill all fields and select a file.' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('file', file);

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const res = await axios.post('http://localhost:5000/api/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Material uploaded successfully!' });
      setTitle('');
      setSubject('');
      setFile(null);
      
      // Reset file input element manually
      document.getElementById('file-upload').value = '';

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

      if (onUploadSuccess) {
        onUploadSuccess(res.data);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error uploading material. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Upload className="text-primary-color" size={24} color="var(--primary-color)" />
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Upload Material</h2>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <div style={{ position: 'relative' }}>
            <FileType size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              id="title"
              className="form-control"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="e.g., Chapter 1 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <div style={{ position: 'relative' }}>
            <BookOpen size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              id="subject"
              className="form-control"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="e.g., Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="file-upload">File (PDF, DOC, PPT - Max 10MB)</label>
          <input
            type="file"
            id="file-upload"
            className="form-control"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            style={{ padding: '0.5rem' }}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <>
              <Loader className="spinner" size={18} />
              Uploading...
            </>
          ) : (
            'Upload Material'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

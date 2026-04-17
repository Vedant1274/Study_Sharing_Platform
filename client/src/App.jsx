import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import MaterialList from './components/MaterialList';
import { BookMarked } from 'lucide-react';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Increment trigger to re-fetch the list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <BookMarked size={40} color="var(--primary-color)" />
          <h1>StudyHub</h1>
        </div>
        <p>Your centralized platform for sharing and discovering study materials.</p>
      </header>

      <main className="main-content">
        <aside>
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </aside>
        
        <section>
          <MaterialList refreshTrigger={refreshTrigger} />
        </section>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import Tiptap from '../components/core/editor';

const TiptapEditorPage = () => {
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h1 style={{ marginBottom: 24 }}>Tiptap Editor Test Page</h1>
      <Tiptap />
    </div>
  );
};

export default TiptapEditorPage;
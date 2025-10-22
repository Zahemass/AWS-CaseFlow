import React, { useState } from 'react';
import './CreateCaseModal.css';

const CreateCaseModal = ({ onCreate, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() });
  };

  const close = () => {
    console.log('[CreateCaseModal] onClose()'); // 🔎 debug
    onClose?.();
  };

  return (
    <div className="cf-modal-overlay" onClick={close}>
      <div className="cf-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>New Case</h3>
        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Case Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <div className="cf-modal-actions">
            <button type="submit" className="create-btn">Create</button>
            <button type="button" className="cancel-btn" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;

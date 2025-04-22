import React, { useState, useRef, useEffect } from "react";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: props.title,
    content: props.content,
    color: props.color
  });
  const contentEditableRef = useRef(null);

  useEffect(() => {
    if (isEditing && contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  }, [isEditing]);

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this note?")) {
      props.onDelete(props.id);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    const cleanContent = editedNote.content.trim();
    if (cleanContent || editedNote.title.trim()) {
      props.onEdit(props.id, {
        ...editedNote,
        content: cleanContent,
        lastModified: new Date().toLocaleString()
      });
      setIsEditing(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNote(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  }

  const characterCount = props.content.length;
  const wordCount = props.content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div 
      className={`note ${props.pinned ? 'pinned' : ''}`} 
      style={{backgroundColor: props.color}}
      onKeyDown={handleKeyDown}
    >
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            className="edit-title"
            placeholder="Title"
            autoFocus
          />
          <textarea
            ref={contentEditableRef}
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            className="edit-content"
            placeholder="Take a note..."
          />
          <div className="note-controls">
            <div className="note-buttons">
              <button onClick={handleSave} title="Save (Ctrl + Enter)">💾</button>
              <button onClick={() => setIsEditing(false)} title="Cancel (Esc)">❌</button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="note-header">
            <h1>{props.title}</h1>
            <button 
              onClick={() => props.onTogglePin(props.id)}
              className={`pin-button ${props.pinned ? 'pinned' : ''}`}
              title={props.pinned ? 'Unpin note' : 'Pin note'}
            >
              📌
            </button>
          </div>
          <div className="note-content">
            {props.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < props.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div className="note-footer">
            <p className="note-meta">
              <span title="Character count">📝 {characterCount}</span>
              <span title="Word count">📚 {wordCount}</span>
              <span title="Last modified">🕒 {props.lastModified}</span>
            </p>
            <div className="note-buttons">
              <button onClick={handleEdit} title="Edit note">✏️</button>
              <button onClick={handleDelete} title="Delete note">🗑️</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;

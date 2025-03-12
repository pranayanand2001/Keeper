import React, { useState } from "react";

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: props.title,
    content: props.content,
    color: props.color
  });

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this note?")) {
      props.onDelete(props.id);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    props.onEdit(props.id, editedNote);
    setIsEditing(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setEditedNote(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const characterCount = props.content.length;
  const wordCount = props.content.trim().split(/\s+/).length;

  return (
    <div className="note" style={{backgroundColor: props.color}}>
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            className="edit-title"
          />
          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            className="edit-content"
          />
          <input
            type="color"
            name="color"
            value={editedNote.color}
            onChange={handleChange}
          />
          <div className="note-buttons">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <p className="timestamp">Last Modified: {props.lastModified}</p>
          <p>Characters: {characterCount} | Words: {wordCount}</p>
          <div className="note-buttons">
            <button onClick={handleEdit}>✏️</button>
            <button onClick={handleDelete}>🗑️</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Note;

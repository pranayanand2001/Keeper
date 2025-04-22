import React, { useState, useRef, useEffect } from "react";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "", color: "#ffffff", tags: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const contentRef = useRef(null);

  const noteColors = [
    { value: "#ffffff", label: "Default" },
    { value: "#f8e3e3", label: "Soft Red" },
    { value: "#e3f8e3", label: "Soft Green" },
    { value: "#e3e3f8", label: "Soft Blue" },
    { value: "#f8f8e3", label: "Soft Yellow" },
    { value: "#f8e3f8", label: "Soft Purple" },
    { value: "#e3f8f8", label: "Soft Cyan" },
    { value: "#ffe4c4", label: "Bisque" }
  ];

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
    
    if (name === "content") {
      setCharCount(value.length);
    }
  }

  function handleColorChange(color) {
    setNote((prevNote) => ({
      ...prevNote,
      color: color,
    }));
  }

  function handleExpand() {
    setIsExpanded(true);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
      submit(event);
    }
  }

  function submit(event) {
    event.preventDefault();
    if (note.title.trim() !== "" || note.content.trim() !== "") {
      props.onAdd(note);
      setNote({ title: "", content: "", color: "#ffffff", tags: "" });
      setIsExpanded(false);
      setCharCount(0);
    }
  }

  return (
    <div className="create-note">
      <form className={isExpanded ? "expanded" : ""} onKeyDown={handleKeyDown}>
        {isExpanded && (
          <input
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
            autoFocus
          />
        )}
        
        <textarea
          ref={contentRef}
          name="content"
          className="note-content"
          placeholder="Take a note... (Ctrl + Enter to save)"
          value={note.content}
          onChange={handleChange}
          onClick={handleExpand}
        />

        {isExpanded && (
          <div className="note-options">
            <div className="color-picker">
              <label>
                <span role="img" aria-label="color">🎨</span>
              </label>
              <div className="color-buttons">
                {noteColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`color-option ${note.color === color.value ? 'selected' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleColorChange(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            
            <input
              className="tags-input"
              name="tags"
              placeholder="Add tags (comma separated)"
              value={note.tags}
              onChange={handleChange}
            />
            
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              {charCount} characters
            </div>
            
            <button 
              type="submit" 
              onClick={submit}
              title="Save note (Ctrl + Enter)"
              className="add-button"
            >
              <span>+</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
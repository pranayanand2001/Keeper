import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [sortOption, setSortOption] = useState("date");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    // Fetch notes from backend
    fetch("/api/notes")
      .then(response => response.json())
      .then(data => {
        setNotes(data);
        localStorage.setItem("notes", JSON.stringify(data));
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function toggleTheme() {
    setIsDarkTheme(prevTheme => !prevTheme);
  }

  function toggleView() {
    setIsGridView(prevView => !prevView);
  }

  function addNote(note) {
    if (note.content.trim() !== "") {
      const newNote = { ...note, pinned: false, lastModified: new Date().toLocaleString() };
      setNotes((prevNotes) => {
        setHistory([...prevNotes]);
        setRedoStack([]);
        return [...prevNotes, newNote];
      });
      setMessage("Note added");
      setTimeout(() => {
        setMessage("");
      }, 2000);

      // Send new note to backend
      fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newNote)
      });
    }
  }

  function deleteNote(id) {
    setNotes((prevNotes) => {
      setHistory([...prevNotes]);
      setRedoStack([]);
      return prevNotes.filter((note, index) => index !== id);
    });

    // Delete note from backend
    fetch(`/api/notes/${id}`, {
      method: "DELETE"
    });
  }

  function editNote(id, updatedNote) {
    setNotes((prevNotes) => {
      setHistory([...prevNotes]);
      setRedoStack([]);
      return prevNotes.map((note, index) => {
        if (index === id) {
          return { ...updatedNote, lastModified: new Date().toLocaleString() };
        }
        return note;
      });
    });

    // Update note in backend
    fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedNote)
    });
  }

  function undo() {
    if (history.length > 0) {
      setRedoStack([...notes]);
      setNotes(history);
      setHistory([]);
    }
  }

  function redo() {
    if (redoStack.length > 0) {
      setHistory([...notes]);
      setNotes(redoStack);
      setRedoStack([]);
    }
  }

  function togglePin(id) {
    setNotes((prevNotes) => {
      setHistory([...prevNotes]);
      setRedoStack([]);
      return prevNotes.map((note, index) => {
        if (index === id) {
          return { ...note, pinned: !note.pinned };
        }
        return note;
      });
    });
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleSortChange(event) {
    setSortOption(event.target.value);
  }

  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.lastModified) - new Date(a.lastModified);
  }).sort((a, b) => b.pinned - a.pinned);

  return (
    <div className={isDarkTheme ? "dark-theme" : "light-theme"}>
      <Header />
      <div className="controls">
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <select onChange={handleSortChange} value={sortOption}>
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
        <div className="view-controls">
          <button onClick={toggleView}>
            {isGridView ? "📋 List View" : "📑 Grid View"}
          </button>
          <button onClick={toggleTheme}>
            {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        <div className="history-controls">
          <button onClick={undo} disabled={history.length === 0}>
            ↩️ Undo
          </button>
          <button onClick={redo} disabled={redoStack.length === 0}>
            ↪️ Redo
          </button>
        </div>
      </div>
      
      <CreateArea onAdd={addNote} />
      {message && <p className="message">{message}</p>}
      
      <div className={`notes-container ${isGridView ? "grid-view" : "list-view"}`}>
        {sortedNotes.map((noteItem, index) => (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            color={noteItem.color}
            onDelete={deleteNote}
            onEdit={editNote}
            onTogglePin={togglePin}
            pinned={noteItem.pinned}
            lastModified={noteItem.lastModified}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;

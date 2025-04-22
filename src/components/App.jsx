import React, { useState, useEffect } from "react";
import { FaTh, FaList, FaSun, FaMoon } from 'react-icons/fa';
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes == null) {
      return [];
    }
    try {
      return JSON.parse(savedNotes);
    } catch (error) {
      console.error("Failed to parse notes:", error);
      return [];
    }
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
      })
      .catch(error => {
        console.error("Failed to fetch notes:", error);
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  }, [notes]);

  function toggleTheme() {
    setIsDarkTheme(prevTheme => !prevTheme);
  }

  function toggleView() {
    setIsGridView(prevView => !prevView);
  }

  function addNote(note) {
    if (note == null || note.content.trim() === "") {
      console.error("Invalid note");
      return;
    }

    const newNote = { 
      ...note, 
      id: Date.now(), // Add unique ID
      pinned: false, 
      lastModified: new Date().toLocaleString() 
    };
    
    setNotes((prevNotes) => {
      if (!Array.isArray(prevNotes)) {
        console.error("Notes data is corrupted");
        return prevNotes;
      }
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
    }).catch(error => {
      console.error("Failed to add note to backend:", error);
    });
  }

  function deleteNote(noteId) {
    if (noteId == null) {
      console.error("Invalid note ID");
      return;
    }

    try {
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.filter((note) => note.id !== noteId);
        setHistory([...prevNotes]);
        setRedoStack([]);
        return updatedNotes;
      });

      // Delete note from backend
      fetch(`/api/notes/${noteId}`, {
        method: "DELETE"
      }).catch(error => {
        console.error("Failed to delete note from backend:", error);
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

  function editNote(id, updatedNote) {
    if (id == null || updatedNote == null) {
      console.error("Invalid note ID or null note");
      return;
    }

    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...updatedNote, lastModified: new Date().toLocaleString() };
        }
        return note;
      });

      setHistory([...prevNotes]);
      setRedoStack([]);
      return updatedNotes;
    });

    // Update note in backend
    fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedNote)
    }).catch(error => {
      console.error("Failed to update note in backend:", error);
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
      const updatedNotes = prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, pinned: !note.pinned };
        }
        return note;
      });

      setHistory([...prevNotes]);
      setRedoStack([]);
      return updatedNotes;
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
            {isGridView ? <FaList /> : <FaTh /> }
          </button>
          <button onClick={toggleTheme}>
            {isDarkTheme ? <FaSun /> : <FaMoon />}
          </button>
        </div>
        <div className="history-controls">
          <button onClick={undo} disabled={history.length === 0}>
            Undo
          </button>
          <button onClick={redo} disabled={redoStack.length === 0}>
            Redo
          </button>
        </div>
      </div>
      
      <CreateArea onAdd={addNote} />
      {message && <p className="message">{message}</p>}
      
      <div className={`notes-container ${isGridView ? "grid-view" : "list-view"}`}>
        {sortedNotes.map((noteItem) => (
          <Note
            key={noteItem.id}
            id={noteItem.id}
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

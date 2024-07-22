import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  function addNote(note) {
    if (note.content.trim() !== "") {
      setNotes((prevNotes) => {
        return [...prevNotes, note];
      });
      setMessage("Note added");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }

  function deleteNote(id) {
    setNotes((prevNote) => {
      return prevNote.filter((note, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {message && <p>{message}</p>}
      {notes.map((noteItem, index) => (
        <Note
          key={index}
          id={index}
          title={noteItem.title}
          content={noteItem.content}
          color = {noteItem.color}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;

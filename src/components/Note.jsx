import React from "react";

function Note(props) {
  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this note?")) {
      props.onDelete(props.id);
    }
  }

  return (
    <div className="note" style={{backgroundColor: props.color}}>
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={handleDelete}>🗑️</button>
    </div>
  );
}

export default Note;

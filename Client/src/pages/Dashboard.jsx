import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const wsRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
    return;
  }

  const socket = new WebSocket(`ws://localhost:3000?token=${token}`);

  socket.onopen = () => {
    socket.send(JSON.stringify({ action: "READ_NOTES" }));
  };

  socket.onmessage = (e) => {
    const res = JSON.parse(e.data);
    if (res.notes) setNotes(res.notes);
  };

  socket.onerror = (err) => {
    console.error("WS Error", err);
  };

  wsRef.current = socket; // ✅ FIX HERE

  return () => socket.close();
}, []);

  function send(data) {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      alert("WebSocket not connected yet");
    }
  }

  function saveNote() {
    send({
      action: editId ? "UPDATE_NOTE" : "CREATE_NOTE",
      id: editId,
      title,
      content
    });

    setTitle("");
    setContent("");
    setEditId(null);
  }

  function deleteNote(id) {
    send({
      action: "DELETE_NOTE",
      id
    });
  }

  function editNote(note) {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>My Notes</h4>
        <button className="btn btn-danger btn-sm" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Content"
            rows="3"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <button className="btn btn-primary" onClick={saveNote}>
            {editId ? "Update Note" : "Add Note"}
          </button>
        </div>
      </div>

      <div className="row">
        {notes.map(note => (
          <div className="col-md-4 mb-3" key={note._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{note.title}</h5>
                <p>{note.content}</p>
                <small>
                  {new Date(note.updatedAt).toLocaleString()}
                </small>

                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editNote(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {notes.length === 0 && <p>No notes yet 👀</p>}
      </div>
    </div>
  );
}
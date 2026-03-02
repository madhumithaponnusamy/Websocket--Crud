import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function signup() {
    await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    navigate("/");
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-3">Signup</h4>

              <input
                className="form-control mb-2"
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />

              <button className="btn btn-success w-100" onClick={signup}>
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
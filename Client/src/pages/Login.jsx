import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function login() {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="text-center mb-3">Login</h4>

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

              <button className="btn btn-primary w-100" onClick={login}>
                Login
              </button>

              <div className="text-center mt-3">
                <Link to="/signup">Create account</Link> |{" "}
                <Link to="/forgot">Forgot?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

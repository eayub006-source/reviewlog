import { useState } from "react";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      console.log("Login Successful!");
      console.log(response.data);
    } catch (error) {
      console.log("Login Failed!");

      if (error.response) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }

  return (
    <div>
      <h1>ReviewLog</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
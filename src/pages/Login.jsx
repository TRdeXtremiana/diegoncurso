import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarios from "../data/usuarios";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = usuarios.find(
      (u) => u.username === form.username && u.password === form.password
    );

    if (!user) {
      setError("Usuario o contraseña incorrectos");
    } else if (!user.aprobado) {
      setError("Tu cuenta está pendiente de aprobación por un administrador.");
    } else {
      if (user.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/"); // si quieres que los usuarios normales puedan loguearse
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
}

export default Login;

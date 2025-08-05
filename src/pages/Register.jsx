import { useState } from "react";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí podríamos enviar la info a un backend o guardarla en localStorage
    console.log("Nuevo registro pendiente:", form);

    setSuccess(true);
    setForm({ username: "", password: "" });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Registro</h2>
      {success ? (
        <p style={{ color: "green" }}>
          Registro enviado. Un administrador debe aprobar tu cuenta.
        </p>
      ) : (
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
          <button type="submit">Registrarse</button>
        </form>
      )}
    </div>
  );
}

export default Register;

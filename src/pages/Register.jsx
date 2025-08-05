import { useState } from "react";
import usuarios from "../data/usuarios";
import styles from "./Auth.module.css";

function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existe = usuarios.find((u) => u.email === form.email);
    if (existe) {
      setError("Este email ya está registrado.");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      ...form,
      rol: "usuario",
      aprobado: false,
    };

    usuarios.push(nuevoUsuario);
    console.log("Nuevo registro pendiente:", nuevoUsuario);

    setSuccess(true);
    setError("");
    setForm({ nombre: "", apellidos: "", email: "", password: "" });
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>Registro</h2>

        {success ? (
          <p className={styles.success}>
            Registro enviado. Un administrador revisará tu solicitud.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              Nombre:
              <input
                className={styles.input}
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.label}>
              Apellidos:
              <input
                className={styles.input}
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.label}>
              Email:
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.label}>
              Contraseña:
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button}>Registrarse</button>
          </form>
        )}

        <p className={styles.link}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Register;

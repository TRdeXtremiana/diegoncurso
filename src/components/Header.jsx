import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Izquierda */}
        <div className={styles.left}>
          <h1>
            <Link to="/" className={styles.title}>El Diegoncurso</Link>
          </h1>
        </div>

        {/* Centro */}
        <div className={styles.center}>
          {usuario && <span className={styles.welcome}>Hola, {usuario.nombre}</span>}
        </div>

        {/* Derecha */}
        <div className={styles.right}>
          {usuario ? (
            <button onClick={handleLogout} className={styles.loginBtn}>
              Logout
            </button>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

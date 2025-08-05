import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <h1>
        <Link to="/" className={styles.title}>El Diegoncurso</Link>
      </h1>

      <Link to="/login" className={styles.loginBtn}>Login</Link>
    </header>
  );
}

export default Header;

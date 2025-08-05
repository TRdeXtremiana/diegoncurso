import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1>
          <Link to="/" className={styles.title}>El Diegoncurso</Link>
        </h1>
        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn}>Login</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useState, useEffect } from "react";
import styles from "./Comodines.module.css";

function Comodines({ concursoTerminado }) {
  const comodines = ["📞", "👥", "⏱️"]; // llamada, público, 30s
  const [usados, setUsados] = useState([false, false, false]);

  // Marcar comodín como usado
  const handleClick = (index) => {
    if (!usados[index]) {
      const nuevos = [...usados];
      nuevos[index] = true;
      setUsados(nuevos);
    }
  };

  // Reset cuando acaba el concurso
  useEffect(() => {
    if (concursoTerminado) {
      setUsados([false, false, false]);
    }
  }, [concursoTerminado]);

  return (
    <div className={styles.comodinesContainer}>
      {comodines.map((c, i) => (
        <div key={i} className={styles.comodinWrapper}>
          <button
            onClick={() => handleClick(i)}
            className={`${styles.comodinButton} ${usados[i] ? styles.comodinUsado : ""}`}
          >
            {c}
          </button>

          {/* Prohibición encima si está usado */}
          {usados[i] && <span className={styles.prohibido}>🚫</span>}
        </div>
      ))}
    </div>
  );
}

export default Comodines;

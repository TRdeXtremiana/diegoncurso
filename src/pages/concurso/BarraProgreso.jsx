import styles from "./BarraProgreso.module.css";

function BarraProgreso({ total, actual, resultados }) {
  // resultados será un array con "correcto", "incorrecto" o null por cada pregunta
  return (
    <div className={styles.contenedor}>
      {Array.from({ length: total }, (_, i) => {
        let estado = resultados[i]; // "correcto" | "incorrecto" | null
        let clase = styles.pendiente;

        if (estado === "correcto") clase = styles.correcto;
        else if (estado === "incorrecto") clase = styles.incorrecto;
        else if (i === actual - 1) clase = styles.actual;

        return (
          <div key={i} className={`${styles.circulo} ${clase}`}>
            {i + 1}
          </div>
        );
      })}
    </div>
  );
}

export default BarraProgreso;

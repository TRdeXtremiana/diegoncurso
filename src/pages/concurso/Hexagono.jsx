import styles from "./Hexagono.module.css";

function Hexagono({ tipo, texto, seleccionado, esCorrecta, resuelta, onClick }) {
  let clase = styles.hexagono;

  if (tipo === "pregunta") clase = `${styles.hexagono} ${styles.pregunta}`;
  if (tipo === "respuesta") {
    if (seleccionado && !resuelta) clase = `${styles.hexagono} ${styles.seleccionado}`;
    if (resuelta && esCorrecta) clase = `${styles.hexagono} ${styles.correcto}`;
    if (resuelta && seleccionado && !esCorrecta) clase = `${styles.hexagono} ${styles.incorrecto}`;
  }

  return (
    <div className={clase} onClick={onClick}>
      {texto}
    </div>
  );
}

export default Hexagono;

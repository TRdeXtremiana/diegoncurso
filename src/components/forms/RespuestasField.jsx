import styles from "../../pages/admin/IntroduccionDirecta.module.css";


function RespuestasField({ respuestas, correcta, onChangeRespuesta, onChangeCorrecta }) {
  return (
    <div>
      <h4>Respuestas:</h4>
      {respuestas.map((r, i) => (
        <div key={i} className={styles.respuestaRow}>
          <input
            type="radio"
            className={styles.radio}
            name="correcta"
            checked={correcta === i}
            onChange={() => onChangeCorrecta(i)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder={`Respuesta ${i + 1}`}
            value={r}
            onChange={(e) => onChangeRespuesta(i, e.target.value)}
            required
          />
        </div>
      ))}
    </div>
  );
}

export default RespuestasField;

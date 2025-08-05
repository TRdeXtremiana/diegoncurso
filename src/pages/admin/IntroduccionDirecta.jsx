import { useState } from "react";
import PreguntaForm from "../../components/forms/PreguntaForm";
import styles from "./IntroduccionDirecta.module.css";

function IntroduccionDirecta() {
  const [preguntas, setPreguntas] = useState([]);

  const handleNuevaPregunta = (pregunta) => {
    setPreguntas([...preguntas, pregunta]);
    alert("Pregunta añadida directamente ✅");
  };

  return (
    <div className={styles.wrapper}>
  <h2 style={{ margin: "20px 0 10px 0" }}>Introducción directa de preguntas</h2>

  <PreguntaForm modo="directo" autor="Admin" onSubmit={handleNuevaPregunta} />

  {preguntas.length > 0 && (
    <div className={styles.preview}>
      <h3>Preguntas añadidas:</h3>
      <ul>
        {preguntas.map((p) => (
          <li key={p.id}>
            <strong>{p.pregunta}</strong> ({p.categoria} - {p.etiqueta})
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
}

export default IntroduccionDirecta;

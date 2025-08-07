import { useState } from "react";
import PreguntaForm from "../../components/forms/PreguntaForm";
import styles from "./IntroduccionDirecta.module.css";
import { usePreguntasContext } from "../../context/PreguntasContext";
import { logError } from "../../utils/debug";

function IntroduccionDirecta() {
  const { enviarPregunta } = usePreguntasContext();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNuevaPregunta = async (pregunta) => {
    setLoading(true);
    setError(null);
    
    try {
      // Enviar la pregunta al servidor con estado aprobado
      await enviarPregunta({
        ...pregunta,
        estado: 'aprobado'
      });
      
      // Actualizar la lista local
      setPreguntas([...preguntas, pregunta]);
      alert("Pregunta añadida directamente ✅");
    } catch (err) {
      logError(err, "IntroduccionDirecta_handleNuevaPregunta");
      setError("Error al añadir la pregunta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 style={{ margin: "20px 0 10px 0" }}>Introducción directa de preguntas</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <PreguntaForm 
        modo="directo" 
        autor="Admin" 
        onSubmit={handleNuevaPregunta} 
        disabled={loading}
      />
      
      {loading && <div className={styles.loading}>Enviando pregunta...</div>}
      
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

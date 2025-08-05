import { useState } from "react";
import styles from "./FormularioComunidad.module.css";

function FormularioComunidad({ onClose }) {
  const [formData, setFormData] = useState({
    pregunta: "",
    respuestas: ["", "", "", ""],
    correcta: 0, // índice de la respuesta correcta
    explicacion: "",
    autor: "",
  });

  const handleRespuestaChange = (index, value) => {
    const nuevasRespuestas = [...formData.respuestas];
    nuevasRespuestas[index] = value;
    setFormData({ ...formData, respuestas: nuevasRespuestas });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preguntaFinal = {
      ...formData,
      correctaTexto: formData.respuestas[formData.correcta],
    };

    console.log("Pregunta enviada:", preguntaFinal);
    alert("Pregunta enviada (pendiente de revisión).");

    setFormData({
      pregunta: "",
      respuestas: ["", "", "", ""],
      correcta: 0,
      explicacion: "",
      autor: "",
    });

    onClose(); // cerrar modal tras enviar
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Enviar pregunta</h2>

      <label className={styles.label}>
        Pregunta:
        <input
          className={styles.input}
          type="text"
          name="pregunta"
          value={formData.pregunta}
          onChange={(e) =>
            setFormData({ ...formData, pregunta: e.target.value })
          }
          required
        />
      </label>

      <h3>Respuestas:</h3>
      {formData.respuestas.map((resp, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="radio"
            name="correcta"
            checked={formData.correcta === i}
            onChange={() => setFormData({ ...formData, correcta: i })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder={`Respuesta ${i + 1}`}
            value={resp}
            onChange={(e) => handleRespuestaChange(i, e.target.value)}
            required
          />
        </div>
      ))}

      <label className={styles.label}>
        Explicación (opcional):
        <textarea
          className={styles.textarea}
          name="explicacion"
          value={formData.explicacion}
          onChange={(e) =>
            setFormData({ ...formData, explicacion: e.target.value })
          }
        />
      </label>

      <label className={styles.label}>
        Autor (opcional):
        <input
          className={styles.input}
          type="text"
          name="autor"
          value={formData.autor}
          onChange={(e) =>
            setFormData({ ...formData, autor: e.target.value })
          }
        />
      </label>

      <button className={styles.button} type="submit">
        Enviar pregunta
      </button>
    </form>
  );
}

export default FormularioComunidad;

import { useState } from "react";
import categorias from "../../data/categorias";
import RespuestasField from "./RespuestasField";
import styles from "./PreguntaForm.module.css";


function PreguntaForm({ onSubmit, modo = "pendiente", autor = "Anónimo" }) {
  const [formData, setFormData] = useState({
    pregunta: "",
    respuestas: ["", "", "", ""],
    correcta: 0,
    categoria: "",
    etiqueta: "",
    explicacion: "",
    autor,
  });

  const handleRespuestaChange = (index, value) => {
    const nuevas = [...formData.respuestas];
    nuevas[index] = value;
    setFormData({ ...formData, respuestas: nuevas });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoria") {
      setFormData({ ...formData, categoria: value, etiqueta: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaPregunta = {
      id: Date.now(),
      ...formData,
      estado: modo === "directo" ? "aprobado" : "pendiente",
    };

    onSubmit(nuevaPregunta);

    setFormData({
      pregunta: "",
      respuestas: ["", "", "", ""],
      correcta: 0,
      categoria: "",
      etiqueta: "",
      explicacion: "",
      autor,
    });
  };

  return (
  <form className={styles.form} onSubmit={handleSubmit}>
  {/* Pregunta */}
  <label className={`${styles.label} ${styles.fullWidth}`}>
    Pregunta:
    <input
      className={styles.input}
      type="text"
      name="pregunta"
      value={formData.pregunta}
      onChange={handleChange}
      required
    />
  </label>

  {/* Respuestas → también a lo ancho completo */}
  <div className={styles.fullWidth}>
    <RespuestasField
      respuestas={formData.respuestas}
      correcta={formData.correcta}
      onChangeRespuesta={handleRespuestaChange}
      onChangeCorrecta={(i) => setFormData({ ...formData, correcta: i })}
    />
  </div>

  {/* Categoría */}
  <label className={styles.label}>
    Categoría:
    <select
      className={styles.select}
      name="categoria"
      value={formData.categoria}
      onChange={handleChange}
      required
    >
      <option value="">-- Selecciona una categoría --</option>
      {Object.keys(categorias).map((cat, i) => (
        <option key={i} value={cat}>{cat}</option>
      ))}
    </select>
  </label>

  {/* Etiqueta */}
  {formData.categoria && (
    <label className={styles.label}>
      Etiqueta:
      <select
        className={styles.select}
        name="etiqueta"
        value={formData.etiqueta}
        onChange={handleChange}
        required
      >
        <option value="">-- Selecciona una etiqueta --</option>
        {categorias[formData.categoria].map((etiq, i) => (
          <option key={i} value={etiq}>{etiq}</option>
        ))}
      </select>
    </label>
  )}

  {/* Explicación → ancho completo */}
  <label className={`${styles.label} ${styles.fullWidth}`}>
    Explicación (opcional):
    <textarea
      className={styles.textarea}
      name="explicacion"
      value={formData.explicacion}
      onChange={handleChange}
    />
  </label>

  <button className={styles.button} type="submit">
    {modo === "directo" ? "✅ Añadir pregunta" : "➕ Enviar pregunta"}
  </button>
</form>

  );
}

export default PreguntaForm;

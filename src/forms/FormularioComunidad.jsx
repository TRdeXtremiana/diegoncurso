import { useState, useEffect } from "react";
import styles from "./FormularioComunidad.module.css";
import { categoriasService } from "../services/api";
import { usePreguntasContext } from "../context/PreguntasContext";

function FormularioComunidad({ onClose }) {
  const { enviarPregunta } = usePreguntasContext();
  const [categorias, setCategorias] = useState({});
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    pregunta: "",
    respuestas: ["", "", "", ""],
    correcta: 0,
    categoria: "",
    etiqueta: "",
    explicacion: "",
    autor: "",
  });

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categoriasData = await categoriasService.getAllWithTags();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        // Fallback a categorías por defecto
        setCategorias({
          "Videojuegos": ["Pokémon", "The Legend of Zelda", "Kingdom Hearts", "Mario Bros"],
          "Cine": ["Acción", "Comedia", "Drama", "Animación"],
          "Deportes": ["Fútbol", "Baloncesto", "Tenis", "Fórmula 1"],
          "Música": ["Pop", "Rock", "Reggaeton", "Indie"]
        });
      } finally {
        setLoadingCategorias(false);
      }
    };
    cargarCategorias();
  }, []);

  const handleRespuestaChange = (index, value) => {
    const nuevasRespuestas = [...formData.respuestas];
    nuevasRespuestas[index] = value;
    setFormData({ ...formData, respuestas: nuevasRespuestas });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoria") {
      // Reinicia etiqueta si se cambia de categoría
      setFormData({ ...formData, categoria: value, etiqueta: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Enviar la pregunta al servidor
      await enviarPregunta({
        ...formData,
        estado: 'pendiente'
      });
      
      // Resetear el formulario
      setFormData({
        pregunta: "",
        respuestas: ["", "", "", ""],
        correcta: 0,
        categoria: "",
        etiqueta: "",
        explicacion: "",
        autor: "",
      });
      
      // Mostrar mensaje de éxito
      alert("¡Pregunta enviada correctamente! Está pendiente de revisión.");
      
      // Cerrar el formulario
      onClose();
    } catch (err) {
      console.error("Error al enviar la pregunta:", err);
      setError("Error al enviar la pregunta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Enviar pregunta</h2>

      {/* Pregunta */}
      <label className={styles.label}>
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

      {/* Respuestas con radio */}
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
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      {/* Etiqueta dependiente de categoría */}
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
              <option key={i} value={etiq}>
                {etiq}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Explicación */}
      <label className={styles.label}>
        Explicación (opcional):
        <textarea
          className={styles.textarea}
          name="explicacion"
          value={formData.explicacion}
          onChange={handleChange}
        />
      </label>

      {/* Autor */}
      <label className={styles.label}>
        Autor (opcional):
        <input
          className={styles.input}
          type="text"
          name="autor"
          value={formData.autor}
          onChange={handleChange}
        />
      </label>

      {error && <div className={styles.error}>{error}</div>}
      
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar pregunta"}
      </button>
    </form>
  );
}

export default FormularioComunidad;

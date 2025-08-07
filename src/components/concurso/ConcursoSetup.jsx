import { useState, useEffect } from "react";
import { categoriasService } from "../../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "./ConcursoSetup.module.css";
import { usePreguntas } from "../../context/PreguntasContext";

function ConcursoSetup({ onIniciar }) {
  const { preguntas, loading, error } = usePreguntas();
  const [categorias, setCategorias] = useState({});
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
  const [mensajeError, setMensajeError] = useState("");

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

  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria)
        : [...prev, categoria]
    );
    setEtiquetasSeleccionadas([]);
  };

  const toggleEtiqueta = (etiqueta) => {
    setEtiquetasSeleccionadas((prev) =>
      prev.includes(etiqueta)
        ? prev.filter((e) => e !== etiqueta)
        : [...prev, etiqueta]
    );
  };

  const iniciarConcurso = () => {
    if (categoriasSeleccionadas.length === 0 || etiquetasSeleccionadas.length === 0) {
      setMensajeError("Debes seleccionar al menos una categoría y una etiqueta");
      return;
    }

    const preguntasFiltradas = preguntas.filter(
      (p) =>
        p.estado === "aprobado" &&
        categoriasSeleccionadas.includes(p.categoria) &&
        etiquetasSeleccionadas.includes(p.etiqueta)
    );

    if (preguntasFiltradas.length === 0) {
      setMensajeError("No hay preguntas disponibles con los filtros seleccionados");
      return;
    }

    setMensajeError("");
    const seleccionadas = preguntasFiltradas
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(12, preguntasFiltradas.length));

    onIniciar(seleccionadas);
  };

  // datos para gráfico
  const chartData = categoriasSeleccionadas.map((cat) => ({
    name: cat,
    value: etiquetasSeleccionadas.filter((etiq) =>
      categorias[cat].includes(etiq)
    ).length,
  }));

  const colors = ["#6a0dad", "#b14aed", "#ffcc00", "#00b894"];

  // Si está cargando, mostrar un mensaje
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.cargando}>Cargando preguntas...</div>
      </div>
    );
  }

  // Si hay un error, mostrar un mensaje
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {mensajeError && <div className={styles.error}>{mensajeError}</div>}
      {/* Categorías */}
      <div className={styles.column}>
        <h3>1. Selecciona categorías</h3>
        {Object.keys(categorias).map((cat) => (
          <label key={cat} className={styles.option}>
            <input
              type="checkbox"
              checked={categoriasSeleccionadas.includes(cat)}
              onChange={() => toggleCategoria(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Etiquetas */}
      <div className={styles.column}>
        <h3>2. Selecciona etiquetas</h3>
        {categoriasSeleccionadas.map((cat) =>
          categorias[cat].map((etiq) => (
            <label key={etiq} className={styles.option}>
              <input
                type="checkbox"
                checked={etiquetasSeleccionadas.includes(etiq)}
                onChange={() => toggleEtiqueta(etiq)}
              />
              {etiq}
            </label>
          ))
        )}
      </div>

      {/* Gráfico */}
      <div className={styles.column}>
        <h3>Resumen</h3>
        {chartData.length > 0 ? (
          <PieChart width={250} height={250}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : (
          <p>Selecciona categorías y etiquetas para ver el gráfico.</p>
        )}
      </div>

      {/* Botón iniciar */}
      <div className={styles.fullWidth}>
        {etiquetasSeleccionadas.length > 0 && (
          <button className={styles.startBtn} onClick={iniciarConcurso}>
            🚀 Iniciar concurso
          </button>
        )}
      </div>
    </div>
  );
}

export default ConcursoSetup;

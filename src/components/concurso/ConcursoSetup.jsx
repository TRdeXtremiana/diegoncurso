import { useState } from "react";
import categorias from "../../data/categorias";
import preguntasData from "../../data/preguntas";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "./ConcursoSetup.module.css";

function ConcursoSetup({ onIniciar }) {
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);

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
    const preguntasFiltradas = preguntasData.filter(
      (p) =>
        p.estado === "aprobado" &&
        categoriasSeleccionadas.includes(p.categoria) &&
        etiquetasSeleccionadas.includes(p.etiqueta)
    );

    const seleccionadas = preguntasFiltradas
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

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

  return (
    <div className={styles.container}>
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

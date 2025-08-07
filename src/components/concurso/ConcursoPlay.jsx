import { useState, useEffect } from "react";
// import Hexagono from "../../pages/concurso/Hexagono";
import BarraProgreso from "../../pages/concurso/BarraProgreso";
import Comodines from "../../pages/concurso/Comodines";
import styles from "./ConcursoPlay.module.css";


function ConcursoPlay({ preguntas, onReiniciar, loading, error }) {
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [resuelta, setResuelta] = useState(false);
  const [resultados, setResultados] = useState([]);
  
  // Inicializar resultados cuando las preguntas se cargan
  useEffect(() => {
    if (preguntas && preguntas.length > 0) {
      setResultados(Array(preguntas.length).fill(null));
    }
  }, [preguntas]);

  // Si no hay preguntas o están cargando, mostrar un mensaje
  if (loading) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.cargando}>Cargando preguntas...</div>
      </div>
    );
  }

  // Si hay un error, mostrar un mensaje
  if (error) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.error}>{error}</div>
        <button onClick={onReiniciar} className={styles.botonSecundario}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // Si no hay preguntas, mostrar un mensaje
  if (!preguntas || preguntas.length === 0) {
    return (
      <div className={styles.contenedor}>
        <div className={styles.error}>No hay preguntas disponibles</div>
        <button onClick={onReiniciar} className={styles.botonSecundario}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const preguntaActual = preguntas[indice];

  const resolver = () => {
    const esCorrecto = seleccion === preguntaActual.correcta;

    setResultados((prev) =>
      prev.map((r, i) =>
        i === indice ? (esCorrecto ? "correcto" : "incorrecto") : r
      )
    );

    setResuelta(true);
  };

  const siguiente = () => {
    setIndice(indice + 1);
    setSeleccion(null);
    setResuelta(false);
  };

  return (
    <div className={styles.contenedor}>
      <div className={styles.topBar}>
        <div className={styles.leftControls}>
          <button onClick={onReiniciar} className={styles.botonSecundario}>
            Terminar concurso
          </button>
        </div>

        <div className={styles.rightControls}>
          <Comodines />
        </div>
      </div>

      <BarraProgreso
        actual={indice + 1}
        total={preguntas.length}
        resultados={resultados}
      />

      {/* Pregunta */}
      <div className={styles.preguntaBox}>
        {preguntaActual.pregunta}
      </div>

      {/* Respuestas */}
      <div className={styles.respuestasContainer}>
        {preguntaActual.respuestas.map((r, i) => (
          <div
            key={i}
            className={`${styles.respuestaBox} 
              ${seleccion === i ? styles.seleccionada : ""} 
              ${resuelta && preguntaActual.correcta === i ? styles.correcta : ""} 
              ${resuelta && seleccion === i && preguntaActual.correcta !== i ? styles.incorrecta : ""}`}
            onClick={() => !resuelta && setSeleccion(i)}
          >
            <span className={styles.respuestaLetra}>
              {String.fromCharCode(65 + i)}:
            </span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      {/* Botón siguiente */}
      <div className={styles.bottomControls}>
        {!resuelta && seleccion !== null && (
          <button onClick={resolver} className={styles.botonAccion}>
            Resolver
          </button>
        )}
        {resuelta && indice < preguntas.length - 1 && (
          <button onClick={siguiente} className={styles.botonAccion}>
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}


export default ConcursoPlay;

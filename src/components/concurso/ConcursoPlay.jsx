import { useState } from "react";
import Hexagono from "../../pages/concurso/Hexagono";
import BarraProgreso from "../../pages/concurso/BarraProgreso";
import Comodines from "../../pages/concurso/Comodines";


function ConcursoPlay({ preguntas, onReiniciar }) {
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [resuelta, setResuelta] = useState(false);

  const preguntaActual = preguntas[indice];

  const resolver = () => {
    setResuelta(true);
  };

  const siguiente = () => {
    setIndice(indice + 1);
    setSeleccion(null);
    setResuelta(false);
  };

  return (
    <div>
      <BarraProgreso actual={indice + 1} total={preguntas.length} />

      <Hexagono tipo="pregunta" texto={preguntaActual.pregunta} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
        {preguntaActual.respuestas.map((r, i) => (
          <Hexagono
            key={i}
            tipo="respuesta"
            texto={r}
            seleccionado={seleccion === i}
            esCorrecta={preguntaActual.correcta === i}
            resuelta={resuelta}
            onClick={() => !resuelta && setSeleccion(i)}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {!resuelta && seleccion !== null && (
          <button onClick={resolver}>Resolver</button>
        )}
        {resuelta && indice < preguntas.length - 1 && (
          <button onClick={siguiente}>Siguiente pregunta</button>
        )}
        {resuelta && indice === preguntas.length - 1 && (
          <button onClick={onReiniciar}>Reiniciar concurso</button>
        )}
      </div>

      <Comodines />
    </div>
  );
}

export default ConcursoPlay;

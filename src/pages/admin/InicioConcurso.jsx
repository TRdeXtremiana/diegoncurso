import { useState } from "react";
import ConcursoSetup from "../../components/concurso/ConcursoSetup";
import ConcursoPlay from "../../components/concurso/ConcursoPlay";

function InicioConcurso() {
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState(null);

  const handleIniciar = (preguntas) => {
    setPreguntasSeleccionadas(preguntas);
  };

  const handleReiniciar = () => {
    setPreguntasSeleccionadas(null);
  };

  return (
    <div>
      <h2>Inicio del concurso</h2>

      {!preguntasSeleccionadas ? (
        <ConcursoSetup onIniciar={handleIniciar} />
      ) : (
        <ConcursoPlay preguntas={preguntasSeleccionadas} onReiniciar={handleReiniciar} />
      )}
    </div>
  );
}

export default InicioConcurso;

import { useState } from "react";
import ConcursoSetup from "../../components/concurso/ConcursoSetup";
import ConcursoPlay from "../../components/concurso/ConcursoPlay";
import { usePreguntas } from "../../context/PreguntasContext";

function InicioConcurso() {
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState(null);
  const { loading, error } = usePreguntas();

  const handleIniciar = (preguntas) => {
    setPreguntasSeleccionadas(preguntas);
  };

  const handleReiniciar = () => {
    setPreguntasSeleccionadas(null);
  };

  return (
    <div>
      <h2>Concurso</h2>

      {!preguntasSeleccionadas ? (
        <ConcursoSetup onIniciar={handleIniciar} />
      ) : (
        <ConcursoPlay 
          preguntas={preguntasSeleccionadas} 
          onReiniciar={handleReiniciar} 
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

export default InicioConcurso;

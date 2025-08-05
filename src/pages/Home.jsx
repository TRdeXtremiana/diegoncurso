import { useState } from "react";
import FormularioComunidad from "../forms/FormularioComunidad";
import modalStyles from "../forms/Modal.module.css";

function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div>
      <h2>Bienvenido a El Diegoncurso</h2>
      <p>Envía tus preguntas para participar en la comunidad:</p>

      <button onClick={toggleFormulario}>
        {mostrarFormulario ? "Cerrar formulario" : "Añadir pregunta"}
      </button>

      {mostrarFormulario && (
        <div
          className={modalStyles.overlay}
          onClick={toggleFormulario} // cerrar al pulsar fuera
        >
          <div
            className={modalStyles.modal}
            onClick={(e) => e.stopPropagation()} // evita cerrar si clicas dentro
          >
            <button className={modalStyles.closeBtn} onClick={toggleFormulario}>
              ✖
            </button>
            <FormularioComunidad onClose={toggleFormulario} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

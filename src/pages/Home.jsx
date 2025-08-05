import { useState } from "react";
import FormularioComunidad from "../forms/FormularioComunidad";
import modalStyles from "../forms/Modal.module.css";
import styles from "./Home.module.css";

function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bienvenido a El Diegoncurso</h2>
      <p className={styles.subtitle}>Participa con tus preguntas y únete a la diversión 🎮</p>

      <button className={styles.button} onClick={toggleFormulario}>
        {mostrarFormulario ? "Cerrar formulario" : "➕ Añadir pregunta"}
      </button>

      <h3 className={styles.subtitle}>Mira el directo en tiempo real:</h3>

      <div className={styles.streamWrapper}>
        <iframe
          className={styles.stream}
          src="https://player.twitch.tv/?channel=don_diegons&parent=localhost"
          allowFullScreen={true}
          title="Twitch stream de don_diegons"
        ></iframe>
      </div>

      {mostrarFormulario && (
        <div
          className={modalStyles.overlay}
          onClick={toggleFormulario}
        >
          <div
            className={modalStyles.modal}
            onClick={(e) => e.stopPropagation()}
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

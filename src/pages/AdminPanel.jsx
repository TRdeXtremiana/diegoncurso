import { useState } from "react";
import styles from "./AdminPanel.module.css";

import UsuariosPendientes from "./admin/UsuariosPendientes";
import PreguntasPendientes from "./admin/PreguntasPendientes";
import IntroduccionDirecta from "./admin/IntroduccionDirecta";
import InicioConcurso from "./admin/InicioConcurso";

function AdminPanel() {
  const [panel, setPanel] = useState("usuarios");

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <button
          className={panel === "usuarios" ? styles.active : ""}
          onClick={() => setPanel("usuarios")}
        >
          👥 Usuarios pendientes
        </button>
        <button
          className={panel === "preguntas" ? styles.active : ""}
          onClick={() => setPanel("preguntas")}
        >
          ❓ Preguntas pendientes
        </button>
        <button
          className={panel === "introduccion" ? styles.active : ""}
          onClick={() => setPanel("introduccion")}
        >
          ✍️ Introducción directa
        </button>
        <button
          className={panel === "concurso" ? styles.active : ""}
          onClick={() => setPanel("concurso")}
        >
          🎮 Inicio del concurso
        </button>
      </aside>

      <main className={styles.content}>
        {panel === "usuarios" && <UsuariosPendientes />}
        {panel === "preguntas" && <PreguntasPendientes />}
        {panel === "introduccion" && <IntroduccionDirecta />}
        {panel === "concurso" && <InicioConcurso />}
      </main>
    </div>
  );
}

export default AdminPanel;

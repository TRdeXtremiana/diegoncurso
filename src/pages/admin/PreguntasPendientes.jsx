import { useState } from "react";
import preguntasData from "../../data/preguntas";
import styles from "./PreguntasPendientes.module.css";

function PreguntasPendientes() {
  const [preguntas, setPreguntas] = useState(preguntasData);
  const [editando, setEditando] = useState(null);

  const aprobar = (id) => {
    setPreguntas(preguntas.map((p) =>
      p.id === id ? { ...p, estado: "aprobado" } : p
    ));
  };

  const rechazar = (id) => {
    setPreguntas(preguntas.map((p) =>
      p.id === id ? { ...p, estado: "rechazado" } : p
    ));
  };

  const guardarEdicion = (id, nuevaPregunta) => {
    setPreguntas(preguntas.map((p) =>
      p.id === id ? { ...p, ...nuevaPregunta } : p
    ));
    setEditando(null);
  };

  return (
    <div>
      <h2>Preguntas pendientes</h2>
      {preguntas.filter((p) => p.estado === "pendiente").length === 0 ? (
        <p>No hay preguntas pendientes</p>
      ) : (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Categoría</th>
              <th>Etiqueta</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas
              .filter((p) => p.estado === "pendiente")
              .map((p) => (
                <tr key={p.id}>
                  <td>{p.pregunta}</td>
                  <td>{p.categoria}</td>
                  <td>{p.etiqueta}</td>
                  <td>{p.autor || "Anónimo"}</td>
                  <td>
                    <button onClick={() => aprobar(p.id)}>✅ Aprobar</button>
                    <button onClick={() => rechazar(p.id)}>❌ Rechazar</button>
                    <button onClick={() => setEditando(p)}>✍️ Editar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Modal de edición mejorado */}
      {editando && (
        <div className={styles.overlay} onClick={() => setEditando(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.title}>Editar pregunta</h3>

            {/* Pregunta */}
            <div className={styles.field}>
              <label className={styles.label}>Pregunta:</label>
              <input
                type="text"
                className={styles.input}
                value={editando.pregunta}
                onChange={(e) => setEditando({ ...editando, pregunta: e.target.value })}
              />
            </div>

            {/* Respuestas */}
            <div className={styles.field}>
              <label className={styles.label}>Respuestas:</label>
              {editando.respuestas.map((r, i) => (
                <div key={i} className={styles.respuestaRow}>
                  <input
                    type="radio"
                    className={styles.radio}
                    name="correcta"
                    checked={editando.correcta === i}
                    onChange={() => setEditando({ ...editando, correcta: i })}
                  />
                  <input
                    type="text"
                    className={styles.input}
                    value={r}
                    onChange={(e) => {
                      const nuevas = [...editando.respuestas];
                      nuevas[i] = e.target.value;
                      setEditando({ ...editando, respuestas: nuevas });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Explicación */}
            <div className={styles.field}>
              <label className={styles.label}>Explicación (opcional):</label>
              <textarea
                className={styles.textarea}
                value={editando.explicacion || ""}
                onChange={(e) => setEditando({ ...editando, explicacion: e.target.value })}
              />
            </div>

            {/* Botones */}
            <div className={styles.buttons}>
              <button className={styles.cancelBtn} onClick={() => setEditando(null)}>
                Cancelar
              </button>
              <button
                className={styles.saveBtn}
                onClick={() => guardarEdicion(editando.id, editando)}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreguntasPendientes;

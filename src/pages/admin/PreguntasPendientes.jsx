import { useState, useEffect } from "react";
import styles from "./PreguntasPendientes.module.css";
import { usePreguntasContext } from "../../context/PreguntasContext";
import { useNotification } from "../../context/NotificationContext";
import { logError } from "../../utils/debug";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

function PreguntasPendientes() {
  const { preguntas, loading, error, aprobarPregunta, rechazarPregunta, editarPregunta } = usePreguntasContext();
  const { showSuccess, showWarning } = useNotification();
  const [editando, setEditando] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    id: null,
    title: '',
    message: '',
    type: 'warning'
  });

  const aprobar = async (id) => {
    try {
      setLoadingAction(true);
      setActionError(null);
      await aprobarPregunta(id);
      showSuccess("Pregunta aprobada correctamente");
    } catch (err) {
      logError(err, "PreguntasPendientes_aprobar");
      setActionError("Error al aprobar la pregunta. Por favor, intenta de nuevo.");
      showWarning(err.userMessage || "Error al aprobar la pregunta");
    } finally {
      setLoadingAction(false);
    }
  };

  const mostrarConfirmacionRechazar = (id, preguntaTexto) => {
    setConfirmDialog({
      show: true,
      id,
      title: 'Confirmar rechazo',
      message: `¿Estás seguro de que deseas rechazar la pregunta: "${preguntaTexto}"?`,
      type: 'danger'
    });
  };
  
  const rechazar = async (id) => {
    try {
      setLoadingAction(true);
      setActionError(null);
      await rechazarPregunta(id);
      showSuccess("Pregunta rechazada correctamente");
    } catch (err) {
      logError(err, "PreguntasPendientes_rechazar");
      setActionError("Error al rechazar la pregunta. Por favor, intenta de nuevo.");
      showWarning(err.userMessage || "Error al rechazar la pregunta");
    } finally {
      setLoadingAction(false);
    }
  };
  
  const handleConfirmRechazar = () => {
    if (confirmDialog.id) {
      rechazar(confirmDialog.id);
    }
    setConfirmDialog({ ...confirmDialog, show: false, id: null });
  };
  
  const handleCancelRechazar = () => {
    setConfirmDialog({ ...confirmDialog, show: false, id: null });
  };

  const guardarEdicion = async (id, nuevaPregunta) => {
    try {
      setLoadingAction(true);
      setActionError(null);
      await editarPregunta(id, nuevaPregunta);
      setEditando(null);
      showSuccess("Pregunta editada correctamente");
    } catch (err) {
      logError(err, "PreguntasPendientes_guardarEdicion");
      setActionError("Error al editar la pregunta. Por favor, intenta de nuevo.");
      showWarning(err.userMessage || "Error al editar la pregunta");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div>
      <h2>Preguntas pendientes</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          type="error" 
          dismissible={false} 
        />
      )}
      
      {actionError && (
        <ErrorMessage 
          message={actionError} 
          type="error" 
          dismissible={true} 
          onDismiss={() => setActionError(null)} 
        />
      )}
      
      {loading ? (
        <Loader text="Cargando preguntas..." size="medium" />
      ) : preguntas.filter((p) => p.estado === "pendiente").length === 0 ? (
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
                    <button 
                      className={styles.approveBtn}
                      onClick={() => aprobar(p.id)} 
                      disabled={loadingAction}
                    >
                      {loadingAction ? (
                        <>
                          <span className={styles.spinnerSmall}></span>
                          Procesando...
                        </>
                      ) : "✅ Aprobar"}
                    </button>
                    <button 
                      className={styles.rejectBtn}
                      onClick={() => mostrarConfirmacionRechazar(p.id, p.pregunta)} 
                      disabled={loadingAction}
                    >
                      {loadingAction ? (
                        <>
                          <span className={styles.spinnerSmall}></span>
                          Procesando...
                        </>
                      ) : "❌ Rechazar"}
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => setEditando(p)} 
                      disabled={loadingAction}
                    >
                      ✍️ Editar
                    </button>
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
            
            {actionError && (
              <ErrorMessage 
                message={actionError} 
                type="error" 
                dismissible={true} 
                onDismiss={() => setActionError(null)} 
              />
            )}

            {/* Pregunta */}
            <div className={styles.field}>
              <label className={styles.label}>Pregunta:</label>
              <input
                type="text"
                className={styles.input}
                value={editando.pregunta}
                onChange={(e) => setEditando({ ...editando, pregunta: e.target.value })}
                disabled={loadingAction}
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
                    disabled={loadingAction}
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
                    disabled={loadingAction}
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
              <button 
                className={styles.cancelBtn} 
                onClick={() => setEditando(null)}
                disabled={loadingAction}
              >
                Cancelar
              </button>
              <button
                className={styles.saveBtn}
                onClick={() => guardarEdicion(editando.id, editando)}
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <>
                    <span className={styles.spinnerSmall}></span>
                    Guardando...
                  </>
                ) : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Diálogo de confirmación */}
      <ConfirmDialog
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText="Rechazar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRechazar}
        onCancel={handleCancelRechazar}
      />
    </div>
  );
}

export default PreguntasPendientes;

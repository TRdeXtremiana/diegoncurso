import React from 'react';
import './ConfirmDialog.css';

/**
 * Componente para mostrar un diálogo de confirmación
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Mensaje a mostrar
 * @param {string} props.confirmText - Texto del botón de confirmación
 * @param {string} props.cancelText - Texto del botón de cancelación
 * @param {Function} props.onConfirm - Función a ejecutar al confirmar
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 * @param {boolean} props.show - Si se debe mostrar el diálogo
 * @param {string} props.type - Tipo de confirmación ('danger', 'warning', 'info')
 */
function ConfirmDialog({ 
  title = 'Confirmar acción', 
  message, 
  confirmText = 'Confirmar', 
  cancelText = 'Cancelar', 
  onConfirm, 
  onCancel, 
  show = false,
  type = 'warning'
}) {
  if (!show) return null;
  
  const handleConfirm = (e) => {
    e.preventDefault();
    if (onConfirm) onConfirm();
  };
  
  const handleCancel = (e) => {
    e.preventDefault();
    if (onCancel) onCancel();
  };
  
  // Prevenir que los clics en el diálogo cierren el modal
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className="confirm-overlay" onClick={handleCancel}>
      <div className={`confirm-dialog confirm-${type}`} onClick={handleDialogClick}>
        <div className="confirm-header">
          <h3 className="confirm-title">{title}</h3>
        </div>
        
        <div className="confirm-content">
          <p className="confirm-message">{message}</p>
        </div>
        
        <div className="confirm-actions">
          <button 
            className="confirm-cancel" 
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button confirm-${type}-button`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
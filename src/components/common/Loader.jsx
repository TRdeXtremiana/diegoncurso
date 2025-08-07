import React from 'react';
import './Loader.css';

/**
 * Componente para mostrar un indicador de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del loader ('small', 'medium', 'large')
 * @param {string} props.text - Texto a mostrar junto al loader
 * @param {boolean} props.fullScreen - Si el loader debe ocupar toda la pantalla
 * @param {string} props.color - Color del loader
 */
function Loader({ 
  size = 'medium', 
  text = 'Cargando...', 
  fullScreen = false,
  color = 'primary'
}) {
  const loaderClasses = [
    'loader',
    `loader-${size}`,
    `loader-${color}`,
    fullScreen ? 'loader-fullscreen' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={loaderClasses}>
      <div className="loader-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;
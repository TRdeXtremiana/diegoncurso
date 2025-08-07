import React, { Component } from 'react';
import { logError } from '../../utils/debug';
import './ErrorBoundary.css';

/**
 * Componente para capturar errores no controlados en componentes hijos
 * Implementado como clase porque los Error Boundaries solo funcionan con componentes de clase
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para mostrar la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Registrar el error
    logError(error, 'ErrorBoundary', { componentStack: errorInfo.componentStack });
    this.setState({ errorInfo });
    
    // Llamar al callback onError si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Llamar al callback onReset si existe
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    const { fallback, children } = this.props;
    const { hasError, error, errorInfo } = this.state;
    
    if (hasError) {
      // Si se proporciona un componente de fallback personalizado, usarlo
      if (fallback) {
        return React.cloneElement(fallback, { 
          error, 
          errorInfo,
          onReset: this.handleReset 
        });
      }
      
      // Fallback por defecto
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2 className="error-boundary-title">Algo salió mal</h2>
            <p className="error-boundary-message">
              Ha ocurrido un error inesperado. Hemos registrado el problema y estamos trabajando para solucionarlo.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="error-boundary-details">
                <p className="error-boundary-error">{error && error.toString()}</p>
                <details className="error-boundary-stack">
                  <summary>Ver detalles del error</summary>
                  <pre>{errorInfo && errorInfo.componentStack}</pre>
                </details>
              </div>
            )}
            <button 
              className="error-boundary-reset" 
              onClick={this.handleReset}
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
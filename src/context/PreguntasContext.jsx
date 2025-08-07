import { createContext, useContext, useState, useEffect } from "react";
import { preguntasService } from "../services/api";
import { logError } from "../utils/debug";


const PreguntasContext = createContext();

export function PreguntasProvider({ children }) {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar preguntas desde la API
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        setLoading(true);
        const data = await preguntasService.getAll();
        
        // Transformar los datos para mantener compatibilidad con el formato anterior
        const preguntasFormateadas = data.map(pregunta => {
          // Extraer los textos de las respuestas y determinar cuál es la correcta
          const respuestasTexto = pregunta.respuestas.map(r => r.texto);
          const indexCorrecta = pregunta.respuestas.findIndex(r => r.es_correcta === 1);
          
          return {
            ...pregunta,
            respuestas: respuestasTexto,
            correcta: indexCorrecta >= 0 ? indexCorrecta : 0
          };
        });
        
        setPreguntas(preguntasFormateadas);
        setError(null);
      } catch (err) {
        logError(err, "cargarPreguntas");
        setError("Error al cargar las preguntas. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, []);

  const enviarPregunta = async (nueva) => {
    try {
      setLoading(true);
      
      // Preparar los datos para el formato de la API
      const preguntaParaAPI = {
        pregunta: nueva.pregunta,
        categoria: nueva.categoria,
        etiqueta: nueva.etiqueta,
        dificultad: nueva.dificultad || 'facil',
        explicacion: nueva.explicacion || '',
        autor: nueva.autor || 'Anónimo',
        estado: nueva.estado || 'pendiente',
        respuestas: nueva.respuestas,
        correcta: nueva.correcta
      };
      
      const resultado = await preguntasService.create(preguntaParaAPI);
      
      // Recargar las preguntas para obtener la lista actualizada
      const data = await preguntasService.getAll();
      
      // Transformar los datos para mantener compatibilidad con el formato anterior
      const preguntasFormateadas = data.map(pregunta => {
        const respuestasTexto = pregunta.respuestas.map(r => r.texto);
        const indexCorrecta = pregunta.respuestas.findIndex(r => r.es_correcta === 1);
        
        return {
          ...pregunta,
          respuestas: respuestasTexto,
          correcta: indexCorrecta >= 0 ? indexCorrecta : 0
        };
      });
      
      setPreguntas(preguntasFormateadas);
      return resultado;
    } catch (err) {
      logError(err, "enviarPregunta");
      setError("Error al enviar la pregunta. Por favor, intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const aprobarPregunta = async (id) => {
    try {
      setLoading(true);
      await preguntasService.aprobar(id);
      
      // Recargar las preguntas para obtener la lista actualizada
      const data = await preguntasService.getAll();
      
      // Transformar los datos para mantener compatibilidad con el formato anterior
      const preguntasFormateadas = data.map(pregunta => {
        const respuestasTexto = pregunta.respuestas.map(r => r.texto);
        const indexCorrecta = pregunta.respuestas.findIndex(r => r.es_correcta === 1);
        
        return {
          ...pregunta,
          respuestas: respuestasTexto,
          correcta: indexCorrecta >= 0 ? indexCorrecta : 0
        };
      });
      
      setPreguntas(preguntasFormateadas);
    } catch (err) {
      logError(err, "aprobarPregunta");
      setError("Error al aprobar la pregunta. Por favor, intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rechazarPregunta = async (id) => {
    try {
      setLoading(true);
      await preguntasService.rechazar(id);
      
      // Recargar las preguntas para obtener la lista actualizada
      const data = await preguntasService.getAll();
      
      // Transformar los datos para mantener compatibilidad con el formato anterior
      const preguntasFormateadas = data.map(pregunta => {
        const respuestasTexto = pregunta.respuestas.map(r => r.texto);
        const indexCorrecta = pregunta.respuestas.findIndex(r => r.es_correcta === 1);
        
        return {
          ...pregunta,
          respuestas: respuestasTexto,
          correcta: indexCorrecta >= 0 ? indexCorrecta : 0
        };
      });
      
      setPreguntas(preguntasFormateadas);
    } catch (err) {
      logError(err, "rechazarPregunta");
      setError("Error al rechazar la pregunta. Por favor, intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editarPregunta = async (id, datos) => {
    try {
      setLoading(true);
      
      // Preparar los datos para el formato de la API
      const preguntaParaAPI = {
        pregunta: datos.pregunta,
        categoria: datos.categoria,
        etiqueta: datos.etiqueta,
        dificultad: datos.dificultad || 'facil',
        explicacion: datos.explicacion || '',
        autor: datos.autor,
        estado: datos.estado,
        respuestas: datos.respuestas,
        correcta: datos.correcta
      };
      
      const resultado = await preguntasService.update(id, preguntaParaAPI);
      
      // Recargar las preguntas para obtener la lista actualizada
      const data = await preguntasService.getAll();
      
      // Transformar los datos para mantener compatibilidad con el formato anterior
      const preguntasFormateadas = data.map(pregunta => {
        const respuestasTexto = pregunta.respuestas.map(r => r.texto);
        const indexCorrecta = pregunta.respuestas.findIndex(r => r.es_correcta === 1);
        
        return {
          ...pregunta,
          respuestas: respuestasTexto,
          correcta: indexCorrecta >= 0 ? indexCorrecta : 0
        };
      });
      
      setPreguntas(preguntasFormateadas);
      return resultado;
    } catch (err) {
      logError(err, "editarPregunta");
      setError("Error al editar la pregunta. Por favor, intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PreguntasContext.Provider
      value={{
        preguntas,
        loading,
        error,
        enviarPregunta,
        aprobarPregunta,
        rechazarPregunta,
        editarPregunta
      }}
    >
      {children}
    </PreguntasContext.Provider>
  );
}

export function usePreguntas() {
  return useContext(PreguntasContext);
}

// Alias para mantener consistencia con el nombre usado en los componentes
export const usePreguntasContext = usePreguntas;

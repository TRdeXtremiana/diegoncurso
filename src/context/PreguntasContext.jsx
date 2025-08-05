import { createContext, useContext, useState, useEffect } from "react";
import preguntasData from "../data/preguntas";

const PreguntasContext = createContext();

export function PreguntasProvider({ children }) {
  const [preguntas, setPreguntas] = useState([]);

  useEffect(() => {
    // Simulación: en futuro vendrá de la BD
    setPreguntas(preguntasData);
  }, []);

  const enviarPregunta = (nueva) => {
    setPreguntas((prev) => [...prev, nueva]);
  };

  const aprobarPregunta = (id) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "aprobado" } : p))
    );
  };

  const rechazarPregunta = (id) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "rechazado" } : p))
    );
  };

  const editarPregunta = (id, cambios) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );
  };

  return (
    <PreguntasContext.Provider
      value={{ preguntas, enviarPregunta, aprobarPregunta, rechazarPregunta, editarPregunta }}
    >
      {children}
    </PreguntasContext.Provider>
  );
}

export function usePreguntas() {
  return useContext(PreguntasContext);
}

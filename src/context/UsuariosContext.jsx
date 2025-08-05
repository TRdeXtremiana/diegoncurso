import { createContext, useContext, useState, useEffect } from "react";
import usuariosData from "../data/usuarios";

const UsuariosContext = createContext();

export function UsuariosProvider({ children }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Simulación: en futuro vendrá de la BD
    setUsuarios(usuariosData);
  }, []);

  const registrarUsuario = (nuevo) => {
    setUsuarios((prev) => [...prev, nuevo]);
  };

  const aprobarUsuario = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, aprobado: true } : u))
    );
  };

  const rechazarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <UsuariosContext.Provider
      value={{ usuarios, registrarUsuario, aprobarUsuario, rechazarUsuario }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  return useContext(UsuariosContext);
}

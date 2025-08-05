import { createContext, useState, useContext } from "react";
import usuarios from "../data/usuarios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = (email, password) => {
    const user = usuarios.find(
      (u) => u.email === email && u.password === password
    );
    if (user && user.aprobado) {
      setUsuario(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

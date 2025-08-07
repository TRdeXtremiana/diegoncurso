import { useState } from "react";
import usuariosData from "../../data/usuarios";

function UsuariosPendientes() {
  const [usuarios, setUsuarios] = useState(usuariosData);

  const aprobar = (id) => {
    const actualizados = usuarios.map((u) =>
      u.id === id ? { ...u, aprobado: true } : u
    );
    setUsuarios(actualizados);
  };

  
  const rechazar = (id) => {
    const actualizados = usuarios.filter((u) => u.id !== id);
    setUsuarios(actualizados);
  };

  return (
    <div>
      <h2>Usuarios pendientes</h2>
      {usuarios.filter((u) => !u.aprobado).length === 0 ? (
        <p>No hay usuarios pendientes</p>
      ) : (
        <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter((u) => !u.aprobado)
              .map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.apellidos}</td>
                  <td>{u.email}</td>
                  <td>
                    <button onClick={() => aprobar(u.id)}>✅ Aprobar</button>
                    <button onClick={() => rechazar(u.id)}>❌ Rechazar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsuariosPendientes;

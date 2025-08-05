const usuarios = [
  {
    id: 1,
    username: "admin",
    password: "1234",   // en real iría encriptado
    rol: "admin",
    aprobado: true,
  },
  {
    id: 2,
    username: "usuario_demo",
    password: "demo",
    rol: "usuario",
    aprobado: false, // pendiente de aprobación
  }
];

export default usuarios;

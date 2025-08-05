const usuarios = [
  {
    id: 1,
    nombre: "Diego",
    apellidos: "Extremiana",
    email: "dextremiana1998@gmail.com",
    password: "1234", // admin
    rol: "admin",
    aprobado: true,
  },
  {
    id: 2,
    nombre: "Pepe",
    apellidos: "Pepenson",
    email: "pepe@pepenson.com",
    password: "pepe",
    rol: "usuario",
    aprobado: false, // 👈 pendiente de aprobación
  }
];

export default usuarios;

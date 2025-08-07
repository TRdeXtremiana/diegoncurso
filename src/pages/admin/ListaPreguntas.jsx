// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./ListaPreguntas.module.css"; // puedes crearlo o quitarlo
// import Loader from "../../components/Loader"; // opcional si tienes uno

function ListaPreguntas() {
    // const [preguntas, setPreguntas] = useState([]);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     fetch("http://localhost/backend/preguntas.php")
    //         .then((res) => res.json())
    //         .then((data) => setPreguntas(data))
    //         .catch((err) => console.error("Error cargando preguntas:", err));
    // }, []);

    // const handleEditar = (id) => {
    //     navigate(`/admin/editar/${id}`);
    // };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Gestión de Preguntas</h2>

            <table border="1" cellPadding="10" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Pregunta</th>
                        <th>Respuesta Correcta</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {preguntas.map((p) => (
                        <tr key={p.id}>
                            <td>{p.pregunta}</td>
                            <td>{p.respuesta_correcta}</td>
                            <td>
                                <button onClick={() => handleEditar(p.id)}>✏️ Editar</button>
                            </td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </div>
    );
}

export default ListaPreguntas;

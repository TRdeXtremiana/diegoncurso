<?php
require_once 'config.php';

// Manejar diferentes tipos de solicitudes
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener todas las preguntas o una pregunta específica
        if (isset($_GET['id'])) {
            getPregunta($pdo, $_GET['id']);
        } else {
            getPreguntas($pdo);
        }
        break;
    case 'POST':
        // Crear una nueva pregunta
        $data = json_decode(file_get_contents('php://input'), true);
        crearPregunta($pdo, $data);
        break;
    case 'PUT':
        // Actualizar una pregunta existente
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            actualizarPregunta($pdo, $data);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de pregunta no proporcionado']);
        }
        break;
    case 'DELETE':
        // Eliminar una pregunta
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['id'])) {
            eliminarPregunta($pdo, $data['id']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de pregunta no proporcionado']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}

// Función para obtener todas las preguntas
function getPreguntas($pdo) {
    try {
        $stmt = $pdo->query('SELECT * FROM preguntas');
        $preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Obtener las respuestas para cada pregunta desde la tabla respuestas
         foreach ($preguntas as &$pregunta) {
             $stmtRespuestas = $pdo->prepare('SELECT * FROM respuestas WHERE id_pregunta = ? ORDER BY id');
             $stmtRespuestas->execute([$pregunta['id']]);
             $pregunta['respuestas'] = $stmtRespuestas->fetchAll(PDO::FETCH_ASSOC);
         }
        
        echo json_encode($preguntas);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener preguntas: ' . $e->getMessage()]);
    }
}

// Función para obtener una pregunta específica
function getPregunta($pdo, $id) {
    try {
        $stmt = $pdo->prepare('SELECT * FROM preguntas WHERE id = ?');
        $stmt->execute([$id]);
        $pregunta = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($pregunta) {
            // Obtener las respuestas desde la tabla respuestas
             $stmtRespuestas = $pdo->prepare('SELECT * FROM respuestas WHERE id_pregunta = ? ORDER BY id');
             $stmtRespuestas->execute([$id]);
             $pregunta['respuestas'] = $stmtRespuestas->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode($pregunta);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pregunta no encontrada']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al obtener la pregunta: ' . $e->getMessage()]);
    }
}

// Función para crear una nueva pregunta
function crearPregunta($pdo, $data) {
    try {
        // Validar datos requeridos
        $camposRequeridos = ['categoria', 'etiqueta', 'pregunta', 'respuestas', 'correcta', 'dificultad', 'explicacion', 'autor'];
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                http_response_code(400);
                echo json_encode(['error' => "Campo requerido: $campo"]);
                return;
            }
        }
        
        // Iniciar transacción
        $pdo->beginTransaction();
        
        // Insertar la pregunta principal
        $sql = 'INSERT INTO preguntas (categoria, etiqueta, pregunta, correcta, dificultad, explicacion, autor, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['categoria'],
            $data['etiqueta'],
            $data['pregunta'],
            $data['correcta'],
            $data['dificultad'],
            $data['explicacion'],
            $data['autor'],
            $data['estado'] ?? 'pendiente' // Estado por defecto si no se proporciona
        ]);
        
        $preguntaId = $pdo->lastInsertId();
        
        // Insertar las respuestas en la tabla respuestas
         $sqlRespuesta = 'INSERT INTO respuestas (id_pregunta, texto, es_correcta) VALUES (?, ?, ?)';
         $stmtRespuesta = $pdo->prepare($sqlRespuesta);
         
         foreach ($data['respuestas'] as $index => $respuesta) {
             $esCorrecta = ($index == $data['correcta']) ? 1 : 0;
             $stmtRespuesta->execute([$preguntaId, $respuesta, $esCorrecta]);
         }
        
        // Confirmar transacción
        $pdo->commit();
        
        echo json_encode(['id' => $preguntaId, 'mensaje' => 'Pregunta creada con éxito']);
    } catch (PDOException $e) {
        // Revertir transacción en caso de error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear la pregunta: ' . $e->getMessage()]);
    }
}

// Función para actualizar una pregunta existente
function actualizarPregunta($pdo, $data) {
    try {
        // Verificar si la pregunta existe
        $stmt = $pdo->prepare('SELECT id FROM preguntas WHERE id = ?');
        $stmt->execute([$data['id']]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Pregunta no encontrada']);
            return;
        }
        
        // Iniciar transacción
        $pdo->beginTransaction();
        
        // Actualizar la pregunta principal
        $campos = [];
        $valores = [];
        
        foreach ($data as $campo => $valor) {
            if ($campo !== 'id' && $campo !== 'respuestas') {
                $campos[] = "$campo = ?";
                $valores[] = $valor;
            }
        }
        
        if (!empty($campos)) {
            // Añadir el ID al final para la cláusula WHERE
            $valores[] = $data['id'];
            
            $sql = 'UPDATE preguntas SET ' . implode(', ', $campos) . ' WHERE id = ?';
            $stmt = $pdo->prepare($sql);
            $stmt->execute($valores);
        }
        
        // Actualizar las respuestas si se proporcionaron
         if (isset($data['respuestas']) && is_array($data['respuestas'])) {
             // Eliminar respuestas existentes
             $stmtDelete = $pdo->prepare('DELETE FROM respuestas WHERE id_pregunta = ?');
             $stmtDelete->execute([$data['id']]);
             
             // Insertar las nuevas respuestas
             $sqlRespuesta = 'INSERT INTO respuestas (id_pregunta, texto, es_correcta) VALUES (?, ?, ?)';
             $stmtRespuesta = $pdo->prepare($sqlRespuesta);
             
             foreach ($data['respuestas'] as $index => $respuesta) {
                 $esCorrecta = (isset($data['correcta']) && $index == $data['correcta']) ? 1 : 0;
                 $stmtRespuesta->execute([$data['id'], $respuesta, $esCorrecta]);
             }
         }
        
        // Confirmar transacción
        $pdo->commit();
        
        echo json_encode(['mensaje' => 'Pregunta actualizada con éxito']);
    } catch (PDOException $e) {
        // Revertir transacción en caso de error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar la pregunta: ' . $e->getMessage()]);
    }
}

// Función para eliminar una pregunta
function eliminarPregunta($pdo, $id) {
    try {
        // Iniciar transacción
        $pdo->beginTransaction();
        
        // Eliminar primero las respuestas asociadas
         $stmtRespuestas = $pdo->prepare('DELETE FROM respuestas WHERE id_pregunta = ?');
         $stmtRespuestas->execute([$id]);
        
        // Luego eliminar la pregunta
        $stmt = $pdo->prepare('DELETE FROM preguntas WHERE id = ?');
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            // Confirmar transacción
            $pdo->commit();
            echo json_encode(['mensaje' => 'Pregunta eliminada con éxito']);
        } else {
            // Revertir transacción
            $pdo->rollBack();
            http_response_code(404);
            echo json_encode(['error' => 'Pregunta no encontrada']);
        }
    } catch (PDOException $e) {
        // Revertir transacción en caso de error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar la pregunta: ' . $e->getMessage()]);
    }
}
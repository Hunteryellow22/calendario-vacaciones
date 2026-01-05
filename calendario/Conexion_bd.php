<?php
// Habilitar la visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bd_service";
$port = 3306;

try {
    // Crear la cadena de conexión (DSN)
    $dsn = "mysql:host=$servername;port=$port;dbname=$dbname";

    // Crear la conexión PDO
    $conexion = new PDO($dsn, $username, $password);

    // Configurar PDO para que lance excepciones en caso de errores
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  

    // Obtener los datos enviados por POST
    $data = json_decode(file_get_contents("php://input"), true);

    // Validar que los datos no estén vacíos
    if (empty($data)) {
        echo json_encode(["success" => false, "message" => "Datos no recibidos."]);
        exit;
    }

    $dias = $data["dias_total"];
    $colaborador_id = $data["colaborador_id"];
    $dias_vacaciones = $data["dias_vacaciones"];

    if (empty($colaborador_id)) {
        echo json_encode(["success" => false, "message" => "El ID del colaborador es requerido."]);
        exit;
    }

    if (empty($dias_vacaciones)) {
        echo json_encode(["success" => false, "message" => "Los días de vacaciones son requeridos."]);
        exit;
    }

    // Preparar la consulta SQL para insertar vacaciones
    $sql = "INSERT INTO vacaciones (colaborador_id, dias_vacaciones) VALUES (:colaborador_id, :dias_vacaciones)";
    $stmt = $conexion->prepare($sql);

    // Vincular parámetros y ejecutar la consulta
    $stmt->bindParam(":colaborador_id", $colaborador_id, PDO::PARAM_INT);
    $stmt->bindParam(":dias_vacaciones", $dias_vacaciones, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Vacaciones registradas correctamente."]);

        // Preparar la consulta SQL para actualizar días restantes
        $sql = "UPDATE colaboradores SET dias_restantes = GREATEST(dias_restantes - :dias, 0) WHERE id = :colaborador_id";
        $stmt = $conexion->prepare($sql);

        // Vincular parámetros y ejecutar la consulta
        $stmt->bindParam(":dias", $dias, PDO::PARAM_INT);
        $stmt->bindParam(":colaborador_id", $colaborador_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Días restantes actualizados correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al actualizar los días restantes."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar las vacaciones."]);
    }
} catch (PDOException $e) {
    // Capturar y mostrar errores de PDO
    echo json_encode(["success" => false, "message" => "Error de conexión: " . $e->getMessage()]);
} finally {
    // Cerrar la conexión
    $conexion = null;
}
?>
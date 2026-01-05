<?php
$servername = "bdservice.cu7m0846mrv4.us-east-1.rds.amazonaws.com";
$username = "miriam";
$password = "Miriam2207";
$dbname = "bdservice";
$port = 3306; 

try {
    // Crear la cadena de conexión (DSN)
    $dsn = "mysql:host=$servername;port=$port;dbname=$dbname";

    // Crear la conexión PDO
    $conexion = new PDO($dsn, $username, $password);

    // Configurar PDO para que lance excepciones en caso de errores
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

   

    // Obtener y decodificar el JSON de la solicitud
    $input = file_get_contents("php://input");
    if (empty($input)) {
        echo json_encode(["success" => false, "message" => "Datos de entrada no proporcionados."]);
        exit;
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["success" => false, "message" => "Error al decodificar el JSON."]);
        exit;
    }

    // Validar que los datos requeridos estén presentes
    if (
        !isset($data["inicio"]) || 
        !isset($data["colaborador_id"]) || 
        !isset($data["numero_change"]) || 
        !isset($data["fin"]) || 
        !isset($data["aplicativo"])
    ) {
        echo json_encode(["success" => false, "message" => "Faltan datos requeridos en el JSON."]);
        exit;
    }

    // Asignar valores a variables
    $inicio = $data["inicio"];
    $colaborador_id = $data["colaborador_id"];
    $numero_change = $data["numero_change"];
    $fin = $data["fin"];
    $aplicativo = $data["aplicativo"];

    // Validar que los datos no estén vacíos
    if (empty($colaborador_id)) {
        echo json_encode(["success" => false, "message" => "El ID del colaborador es requerido."]);
        exit;
    }

    // Preparar la consulta SQL
    $sql = "INSERT INTO ventana (fecha_inicio, area, n_change, fecha_fin, aplicativo) VALUES (:inicio, :colaborador_id, :numero_change, :fin, :aplicativo)";
    $stmt = $conexion->prepare($sql);

    // Vincular parámetros
    $stmt->bindValue(":inicio", $inicio, PDO::PARAM_STR);
    $stmt->bindValue(":colaborador_id", $colaborador_id, PDO::PARAM_INT);
    $stmt->bindValue(":numero_change", $numero_change, PDO::PARAM_STR);
    $stmt->bindValue(":fin", $fin, PDO::PARAM_STR);
    $stmt->bindValue(":aplicativo", $aplicativo, PDO::PARAM_STR);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Ventana registrada correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar la ventana."]);
    }
} catch (PDOException $e) {
    // Manejar errores de conexión o consulta
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
} finally {
    // Cerrar la conexión (opcional, ya que PHP la cierra automáticamente al final del script)
    $conexion = null;
}
?>
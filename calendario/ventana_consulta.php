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

   

    // Consulta para obtener los datos de las ventanas
    $sql = "SELECT 
                fecha_inicio,
                area,
                n_change,
                fecha_fin,
                aplicativo
            FROM ventana";

    // Ejecutar la consulta
    $stmt = $conexion->query($sql);

    // Obtener todos los resultados
    $ventanas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Devolver los datos en formato JSON
    echo json_encode(["success" => true, "data" => $ventanas]);
} catch (PDOException $e) {
    // Manejar errores de conexión o consulta
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
} finally {
    // Cerrar la conexión (opcional, ya que PHP la cierra automáticamente al final del script)
    $conexion = null;
}
?>
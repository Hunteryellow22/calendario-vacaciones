<?php
// Configuración de la conexión a la base de datos
$servername = "localhost";  // Servidor de la base de datos
$username = "root";         // Nombre de usuario de la base de datos
$password = "";             // Contraseña de la base de datos
$dbname = "bd_service";  // Nombre de la base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

echo "Conexión exitosa";

// Aquí puedes realizar consultas a la base de datos

// Cerrar la conexión
$conn->close();
?>
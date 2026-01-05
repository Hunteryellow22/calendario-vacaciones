
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendario de Ventanas</title>
    <!-- FullCalendar CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Calendario Ventanas</h1>
    <div class="menu-bar">
        <a href="./Index.html">Registro</a>
        <a href="./consulta.php">Consulta</a>
        <a href="./Ventanas.php">Ventanas</a>
    </div>
    <div >
        <label for="colab" >Area de Solucion
    <select id="colab">
            <option value="" selected disabled>Seleccionar</option>
    <option value="1">Altios</option>
    <option value="2">Backend</option>
    <option value="3">Telefonia</option>
    <option value="4">Infraestructura</option>
    <option value="5">Base de datos-KIO</option>
    <option value="6">Redes</option>
    <option value="7">Seguridad</option>
    <option value="8">Sistemas Hoteleros</option>
    <option value="9">TCA</option>
    <option value="10">Wintel</option>
    <option value="11">Mesa de Servicio-SD</option>
        </select>
        <label for="change"># Change
        <input id="change" type="text"></input>
        <label for="change">Aplicativo
        <input id="aplicativo" type="text"></input>
</div>
    <div class="container">
        <div id="calendar"></div>
    </div>
    <form id="ventanasForm">
        <div id="selected-days">
            <h2>Días Seleccionados</h2>
            <span id="selected-days-list"></span>
        </div>
        <button type="submit">Registrar Ventana</button>
        </form>
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js"></script>
    <script src="ventanas.js"></script>
    </body>
</html>
var selectedDays = []; // Array para almacenar los días seleccionados
const monthColors = [
    "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251",
    "#B565A7", "#009B77", "#DD4124", "#D65076", "#45B8AC", "#EFC050"
];
var calendar
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const monthNamesContainer = document.getElementById('month-names');
    const selectedDaysList = document.getElementById('selected-days-list');
   
     // Días festivos en México (ejemplo para 2023)
     const holidays = [
        { title: 'Año Nuevo', date: '2025-01-01', color: 'red', tipo: 'festivo' },
        { title: 'Día de la Constitución', date: '2025-02-03', color: 'blue', tipo: 'festivo' },
        { title: 'Natalicio de Benito Juárez', date: '2025-03-17', color: 'green', tipo: 'festivo' },
        { title: 'Jueves Santo', date: '2025-04-17', color: 'purple', tipo: 'festivo' },
        { title: 'Viernes Santo', date: '2025-04-18', color: 'purple', tipo: 'festivo' },
        { title: 'Día del Trabajo', date: '2025-05-01', color: 'orange', tipo: 'festivo' },
        { title: 'Día de la Independencia', date: '2025-09-16', color: 'red', tipo: 'festivo' },
        { title: 'Día de la Revolución', date: '2025-11-17', color: 'blue', tipo: 'festivo' },
        { title: 'Navidad', date: '2025-12-25', color: 'green', tipo: 'festivo' },
      ];

    // Nombres de los meses
    const months = [
        "Marco", "Hassan", "Huato", "Ale", "Saul", "Mike",
        "Marcos", "Rios", "Justino", "Ramos", "Jose", "Rogo"
    ];

    // Nombres de los dias
    const days = [
        "12", "12", "12", "12", "12", "12",
        "12", "12", "12", "12", "12", "12"
    ];
    
    // Colores para cada mes
 
    
    // Inicializar FullCalendar
        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear', // Vista anual con todos los meses
        locale: 'es', // Idioma: español
        events: holidays,
        selectable: true, // Permite seleccionar días
        selectMirror: true,
        weekends: true, // Muestra los fines de semana
        validRange: { // Limita el calendario al año actual
            start: '2025-01-01',
            end: '2025-12-31'
        },
        businessHours: { // Define días laborables (lunes a viernes)
            daysOfWeek: [1, 2, 3, 4, 5], // Lunes = 1, Domingo = 0
            startTime: '07:00',
            endTime: '23:00',
        },
        selectAllow: function(selectInfo) { // Permite seleccionar solo días laborables
            const day = selectInfo.start.getDay(); // Obtiene el día de la semana (0 = domingo, 6 = sábado)
            const dateStr = selectInfo.start.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            return day !== 0 && day !== 6 && !holidays.includes(dateStr); // Bloquea fines de semana y festivos
        },
        select: function(selectInfo) { // Maneja la selección de días
            const start = selectInfo.start;
            const end = selectInfo.end;
        
            // Agregar todos los días del rango seleccionado, excepto fines de semana
            for (let day = start; day < end; day.setDate(day.getDate() + 1)) {
                const dateStr = day.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const dayOfWeek = day.getDay(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
        
                // Verificar si el día no es fin de semana
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    toggleDaySelection(dateStr); // Agregar o eliminar el día
                }
            }
        
            // Actualizar la lista de días seleccionados
            updateSelectedDaysList();
        },
        dateClick: function(info) { // Maneja clics en días individuales
            const dateStr = info.dateStr;
            const dayOfWeek = info.date.getDay(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
    
        
            // Actualizar la lista de días seleccionados
            updateSelectedDaysList();
        },
    });

    // Renderizar el calendario
    calendar.render();
    
    // Función para agregar o eliminar un día seleccionado
    function toggleDaySelection(dateStr) {
        let color = document.getElementById('colab').value;
        if (!selectedDays.includes(dateStr)) {
            // Agregar el día seleccionado
            selectedDays.push(dateStr);
            // Agregar el día como un evento en el calendario
            calendar.addEvent({
                title: 'Vacaciones',
                start: dateStr,
                allDay: true,
                color: monthColors[color], // Color para días seleccionados
            });
        } else {
            // Eliminar el día seleccionado
            selectedDays = selectedDays.filter(date => date !== dateStr);
            // Eliminar el evento correspondiente al día
            const event = calendar.getEvents().find(event => event.startStr === dateStr);
            if (event) {
                event.remove();
            }
        }
    }

    // Función para actualizar la lista de días seleccionados
    function updateSelectedDaysList() {
        // Limpiar la lista
        selectedDaysList.innerHTML = '';

        // Ordenar los días seleccionados
        selectedDays.sort();

        // Agregar cada día a la lista
        selectedDays.forEach(date => {
            const li = document.createElement('li');
            li.textContent = date;
            selectedDaysList.appendChild(li);
        });
    }

    
});

document.getElementById("vacacionesForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los datos del formulario
    const select_field = document.getElementById('colab');
    const colaborador_id = select_field.value;
    const dias_vacaciones = JSON.stringify(selectedDays);
    const dias = selectedDays.length;

    // Valor definido para la verificación
    const valorDefinido = "Taquito123"; // Cambia esto por el valor que desees

    // Crear el alert personalizado
    const alertMessage = "Ingrese la clave de confirmación:";
    const userInput = prompt(alertMessage); // Mostrar un prompt con un campo de texto

    // Verificar si el usuario ingresó un valor
    if (userInput === null) {
        alert("Operación cancelada."); // El usuario hizo clic en "Cancelar"
        return;
    }

    // Verificar si el valor ingresado es igual al valor definido
    if (userInput === valorDefinido) {
        // Validar que el campo de días de vacaciones sea un JSON válido
        try {
            JSON.parse(dias_vacaciones);
        } catch (error) {
            alert("El campo 'Días de Vacaciones' debe ser un JSON válido.");
            return;
        }

        // Enviar los datos al servidor usando fetch
        fetch("http://localhost/calendario/Conexion_bd.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                colaborador_id: colaborador_id,
                dias_vacaciones: dias_vacaciones,
                dias_total: dias
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Vacaciones registradas correctamente.");
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Exito:", error);
            alert("Vacaciones registradas correctamente.");
        });
    } else {
        // Mostrar alert de error si el valor no coincide
        alert("Error: Clave de confirmación incorrecta.");
    }
});

document.getElementById("colab").addEventListener("change", function () {
    // Borrar los valores del arreglo selectedDays
    selectedDays = [];
    const selectedDaysList = document.getElementById("selected-days-list");
    if(selectedDaysList!=undefined){
    // Seleccionar todos los elementos <li> dentro del contenedor
    const listItems = selectedDaysList.querySelectorAll("li");

    // Recorrer y eliminar cada <li>
    listItems.forEach(li => {
        li.remove();
    });

    // Mensaje de confirmación
    console.log("Todos los elementos <li> han sido borrados.");
    }
    calendar.getEvents().forEach(event => {
        if (event.extendedProps.tipo !== 'festivo') { // Solo elimina si no es un día festivo
          event.remove();
        }
      });
    
    // Mensaje de confirmación
    console.log("El arreglo selectedDays ha sido borrado.");
});

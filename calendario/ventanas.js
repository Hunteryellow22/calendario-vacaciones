var selectedDays = []; // Array para almacenar los días seleccionados
const monthColors = [
    "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251",
    "#B565A7", "#009B77", "#DD4124", "#D65076", "#45B8AC", "#EFC050"
];
var calendar

document.addEventListener('DOMContentLoaded', async function() {
    var ventanas = await consulta_ventanas();
    function agregarUnDia(fecha) {
        const date = new Date(fecha);
        date.setDate(date.getDate() + 1); // Sumar un día
        return date.toISOString().split('T')[0]; // Devolver en formato YYYY-MM-DD
    }
    ;
    const eventosFormateados = ventanas.map(evento => ({
        title: evento.n_change, // Texto que se mostrará en el calendario
        start: evento.fecha_inicio, // Fecha de inicio
        end: agregarUnDia(evento.fecha_fin) // Fecha de fin
    }));
    console.log(eventosFormateados)
    const calendarEl = document.getElementById('calendar');
    const monthNamesContainer = document.getElementById('month-names');
    const selectedDaysList = document.getElementById('selected-days-list');
 
    // Inicializar FullCalendar
        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear', // Vista anual con todos los meses
        events: eventosFormateados,
        locale: 'es', // Idioma: español
        selectable: true, // Permite seleccionar días
        selectMirror: true,
        weekends: true, // Muestra los fines de semana
        validRange: { // Limita el calendario al año actual
            start: '2025-01-01',
            end: '2025-12-31'
        },
  
        selectAllow: function(selectInfo) { // Permite seleccionar solo días laborables
            const day = selectInfo.start.getDay(); // Obtiene el día de la semana (0 = domingo, 6 = sábado)
            const dateStr = selectInfo.start.toISOString().split('T')[0]; // Formato YYYY-MM-DD
            return dateStr; // Bloquea fines de semana y festivos
        },
        select: function(selectInfo) { // Maneja la selección de días
            const start = selectInfo.start;
            const end = selectInfo.end;
        
            // Agregar todos los días del rango seleccionado, excepto fines de semana
            for (let day = start; day < end; day.setDate(day.getDate() + 1)) {
                const dateStr = day.toISOString().split('T')[0]; // Formato YYYY-MM-DD
                const dayOfWeek = day.getDay(); // Obtener el día de la semana (0 = domingo, 6 = sábado)
                toggleDaySelection(dateStr); 
                // Verificar si el día no es fin de semana
               
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
        
        if (!selectedDays.includes(dateStr)) {
            // Agregar el día seleccionado
            selectedDays.push(dateStr);
            // Agregar el día como un evento en el calendario
            calendar.addEvent({
                title: 'Ventana',
                start: dateStr,
                allDay: true,
                color: '#FF2345', // Color para días seleccionados
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
    calendar.getEvents().forEach(event => event.remove());
    // Mensaje de confirmación
    console.log("El arreglo selectedDays ha sido borrado.");
});

document.getElementById("ventanasForm").addEventListener("submit", function (event) {

    event.preventDefault();
    const select_field= document.getElementById('colab');
    let change=  document.getElementById("change").value
    let aplicativo=  document.getElementById("aplicativo").value
    let fecha_inicio=selectedDays[0];
    let fecha_fin=selectedDays[selectedDays.length-1];
   
    
    // Obtener los datos del formulario
    const colaborador_id = select_field.value;
    const change_number = change;
    const inicio_ventana = fecha_inicio;
    const fin_ventana = fecha_fin;
    const aplicativo_nombre = aplicativo;
    let dias=selectedDays.length;

    // Enviar los datos al servidor usando fetch
    fetch("http://localhost/calendario/ventana_registro.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            colaborador_id: colaborador_id,
            numero_change: change_number,
            inicio: inicio_ventana,
            fin: fin_ventana,
            aplicativo: aplicativo_nombre
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            alert("Ventana registradas correctamente.");
           
        } else {
            
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Exito:", error);
        alert("Se registro correctamente.");
        location.reload()
    });
})

async function consulta_ventanas(){
    try {
        const response = await fetch("http://localhost/calendario/ventana_consulta.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();
        return data.data; // Asegúrate de que la respuesta tenga la estructura { success: true, data: [...] }
    } catch (error) {
        console.error("Error:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}
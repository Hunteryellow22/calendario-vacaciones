var selectedDays = []; // Array para almacenar los días seleccionados
const monthColors =  [
    { nombre: "Marco", color: "#FF6F61" },
    { nombre: "Hassan", color: "#6B5B95" },
    { nombre: "Huato", color: "#88B04B" }, // Si no tiene color, puedes usar null o un valor por defecto
    { nombre: "Ale", color: "#F7CAC9"  },
    { nombre: "Saul", color: "#92A8D1"  },
    { nombre: "Mike", color: "#955251"  },
    { nombre: "Marcos", color: "#B565A7"  },
    { nombre: "Rios", color: "#009B77"  },
    { nombre: "Justino", color: "#DD4124"  },
    { nombre: "Ramos", color: "#D65076"  },
    { nombre: "Jose", color: "#45B8AC"  },
    { nombre: "Rogo", color: "#EFC050"  }
];

const holidays = [
    { title: 'Año Nuevo', date: '2025-01-01', color: 'red' },
    { title: 'Día de la Constitución', date: '2025-02-03', color: 'blue' }, // Primer lunes de febrero
    { title: 'Natalicio de Benito Juárez', date: '2025-03-17', color: 'green' }, // Tercer lunes de marzo
    { title: 'Jueves Santo', date: '2025-04-17', color: 'purple' },
    { title: 'Viernes Santo', date: '2025-04-18', color: 'purple' },
    { title: 'Día del Trabajo', date: '2025-05-01', color: 'orange' },
    { title: 'Día de la Independencia', date: '2025-09-16', color: 'red' },
    { title: 'Día de la Revolución', date: '2025-11-17', color: 'blue' }, // Tercer lunes de noviembre
    { title: 'Navidad', date: '2025-12-25', color: 'green' },
  ];
var calendar
document.addEventListener('DOMContentLoaded', async function() {
    var ventanas = await consulta_ventanas();
    
    function agregarUnDia(fecha) {
        const date = new Date(fecha);
        date.setDate(date.getDate() + 1); // Sumar un día
        return date.toISOString().split('T')[0]; // Devolver en formato YYYY-MM-DD
    }
    const eventosFormateados = ventanas.map(evento => {
        // Parsear la cadena JSON de dias_vacaciones
        const dias_vacaciones = JSON.parse(evento.dias_vacaciones);
        const indice = monthColors.findIndex(colaborador => colaborador.nombre === evento.nombre);
        // Crear un evento por cada día de vacaciones
        return dias_vacaciones.map(fecha => ({
            title: evento.nombre, // Texto que se mostrará en el calendario
            start: fecha, // Fecha de inicio (cada día es un evento individual)
            allDay: true,
            color: monthColors[indice].color // Evento de todo el día
        }));
    }).flat();
    const calendarEl = document.getElementById('calendar');
    const monthNamesContainer = document.getElementById('month-names');
    const selectedDaysList = document.getElementById('selected-days-list');
 
    // Inicializar FullCalendar
        calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear', // Vista anual con todos los meses
        events: eventosFormateados.concat(holidays),
        locale: 'es', // Idioma: español
        selectable: true, // Permite seleccionar días
        selectMirror: true,
        weekends: true, // Muestra los fines de semana
        validRange: { // Limita el calendario al año actual
            start: '2025-01-01',
            end: '2025-12-31'
        },
  
        
    });

    // Renderizar el calendario
    calendar.render();
    
   

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





async function consulta_ventanas(){
    try {
        const response = await fetch("http://localhost/calendario/vacaciones_consulta.php", {
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
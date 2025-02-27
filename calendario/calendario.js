document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const monthNamesContainer = document.getElementById('month-names');
    const selectedDaysList = document.getElementById('selected-days-list');
    let selectedDays = []; // Array para almacenar los días seleccionados

    // Días festivos en México (ejemplo para 2023)
    const holidays = [
        '2025-01-01', // Año Nuevo
        '2023-02-06', // Día de la Constitución
        '2023-03-21', // Natalicio de Benito Juárez
        '2023-05-01', // Día del Trabajo
        '2023-09-16', // Día de la Independencia
        '2023-11-20', // Día de la Revolución
        '2023-12-25', // Navidad
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
    const monthColors = [
        "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251",
        "#B565A7", "#009B77", "#DD4124", "#D65076", "#45B8AC", "#EFC050"
    ];

    // Inicializar FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear', // Vista anual con todos los meses
        locale: 'es', // Idioma: español
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
        if (!selectedDays.includes(dateStr)) {
            // Agregar el día seleccionado
            selectedDays.push(dateStr);
            // Agregar el día como un evento en el calendario
            calendar.addEvent({
                title: 'Vacaciones',
                start: dateStr,
                allDay: true,
                color: '#4CAF50', // Color para días seleccionados
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

    // Generar la sección de nombres y colores
    months.forEach((month, index) => {
        // Crear el contenedor para el mes y los días
        const container = document.createElement('div');
        container.classList.add('month-days-container');
        container.style.display = 'flex'; // Usar flexbox para alinear los elementos

        // Crear el elemento del mes
        const monthBox = document.createElement('div');
        monthBox.classList.add('month-box');
        monthBox.textContent = month;
        monthBox.setAttribute('data-month', index);
        monthBox.style.backgroundColor = monthColors[index];
        monthBox.style.width = "70px";
        monthBox.style.height = "30px";
        monthBox.style.marginRight = "12px"; // Separación de 12px entre el mes y los días

        // Crear el elemento de los dias
        const daysBox = document.createElement('div');
        daysBox.classList.add('days-box');
        daysBox.textContent = days[index]; // Usar el índice para obtener los días correspondientes
        daysBox.setAttribute('data-month', index);
        daysBox.style.backgroundColor = monthColors[index];
        daysBox.style.width = "70px";
        daysBox.style.height = "30px";

        // Agregar el mes y los días al contenedor
        container.appendChild(monthBox);
        container.appendChild(daysBox);

        // Agregar el contenedor al calendario
        calendarEl.appendChild(container);
    });
});
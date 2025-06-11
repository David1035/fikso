/* TIPO DE SERVICIO Y TECNOLOGIA me falta crear la lógica*/
const opcionesTiposervicio = {
    'HFC': ['Internet', 'Telefonía', 'TV_Digital', 'One_TV_2.0'],
    'GPON': ['Internet', 'IPTV', 'Telefonía', 'One_TV_2.0'],
    'ADSL': ['Internet', 'IPTV', 'Telefonía', 'One_TV_2.0']
}
const opcionesNaturaleza = {
    'Internet': ['No navega', 'Navegación Lenta', 'Servicio Intermitente', 'Problemas WiFi', 'Configuracion WIFI'],
    'Telefonía': ['No funciona línea telefónica', 'Servicio Intermitente', 'Mala Calidad Voz / Entrecortada', 'Ingresa llamada de otra línea', 'No salen ni entran llamadas'],
    'TV_Digital': ['Sin señal', 'Tv no visualiza algunos canales', 'Mala calidad de imagen', 'Fallas en audio / subtítulos', 'Problemas con paquetes adicionales', 'Problemas con control remoto'],
    'IPTV': ['Sin señal', 'Tv no visualiza algunos canales', 'Mala calidad de imagen', 'Fallas en audio / subtítulos', 'Problemas con paquetes adicionales', 'Problemas con control remoto'],
    'One_TV_2.0': ['Sin señal', 'DRM falló', 'Imagen congelada / TV pixelada', 'Problemas de audio', 'Error de descarga', 'Problemas en comando de voz', 'Configuración de control', 'Problemas app One TV', 'Servicio intermitente']
};

// Cargar opciones de tecnología
function cargarOpcionesTecnology() {
    Object.keys(opcionesTiposervicio).forEach((tecnology, index) => {
        const option = document.createElement('option');
        option.value = tecnology;
        option.textContent = tecnology;
        if (index === 0) option.selected = true; // Seleccionar el primer hijo por defecto
        selectTecnology.appendChild(option);
    });
}

// Filtrar y cargar tipos de servicio
function cargarOpcionesTipoServicio(tecnology) {
    // Limpiar el select antes de agregar opciones
    selectTipoServicio.innerHTML = '';
    const servicios = opcionesTiposervicio[tecnology] || [];
    servicios.forEach((servicio, index) => {
        const option = document.createElement('option');
        option.value = servicio;
        option.textContent = servicio;
        if (index === 0) option.selected = true; // Seleccionar el primer hijo por defecto
        selectTipoServicio.appendChild(option);
    });

    // Cargar naturaleza por defecto para el primer servicio
    const primerTipoServicio = servicios[0] || null;
    if (primerTipoServicio) {
        cargarOpcionesNaturaleza(primerTipoServicio);
    }
}

// Cargar opciones de naturaleza
function cargarOpcionesNaturaleza(tipoServicio) {
    // Limpiar el select antes de agregar opciones
    selectNaturaleza.innerHTML = '';
    const naturalezas = opcionesNaturaleza[tipoServicio] || [];
    naturalezas.forEach((naturaleza, index) => {
        const option = document.createElement('option');
        option.value = naturaleza;
        option.textContent = naturaleza;
        if (index === 0) option.selected = true; // Seleccionar el primer hijo por defecto
        selectNaturaleza.appendChild(option);
    });
}

// Eventos
selectTecnology.addEventListener('change', (event) => {
    const tecnologiaSeleccionada = event.target.value;
    cargarOpcionesTipoServicio(tecnologiaSeleccionada);
});

selectTipoServicio.addEventListener('change', (event) => {
    const tipoServicioSeleccionado = event.target.value;
    cargarOpcionesNaturaleza(tipoServicioSeleccionado);
});

// Inicialización
function inicializarSelects() {
    cargarOpcionesTecnology();
    const tecnologiaSeleccionada = selectTecnology.value;
    cargarOpcionesTipoServicio(tecnologiaSeleccionada);
}

inicializarSelects();


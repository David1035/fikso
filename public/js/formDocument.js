

const fenix = 'hIYIOYDMHRGJF5';
const elite = 'Dp65pKd15lo?&8K';
const pwd = '9j7CJ6yVk9FC$$'
//const pwd = 'A&&MyDogIsZeus**33'
const evidente = 'A&&MyDogIsZeus33'


let horaInicial;
let horaFinal;
let hora;
let fecha;
let tiempoTotal;
const API_URL = 'http://localhost:5000/api/forms/';
// Extensión para manejar el contador con alarmas
let interval; // Variable para el intervalo
let startTime; // Tiempo de inicio del contador
let isRunning = false; // Estado del contador
let aht = ''
const btnInicio = document.getElementById('btnInicio')
const observacionesText = document.getElementById('observaciones');
const btnCopiar = document.getElementById('btnCopiar')
const btnEnviar = document.getElementById('btnEnviar')
const selectTecnology = document.getElementById('tecnology');
const selectTipoServicio = document.getElementById('tipoServicio');
const selectNaturaleza = document.getElementById('naturaleza');
const idLlamada = document.getElementById('id-llamada');



btnEnviar.disabled = true;
btnInicio.addEventListener('click', function(event) {
    event.preventDefault();
    horaInicial = new Date();
    hora = horaInicial.toTimeString().split(' ')[0]; // solo hora
    fecha = new Date();
    //console.log(fecha)
    startCounter()
    insertarTexto()
    btnInicio.disabled = true;
    btnEnviar.disabled = false;
    idLlamada.focus()
})


observacionesText.addEventListener('input', () => {
    observacionesText.style.height = 'auto';
    observacionesText.style.height = `${observacionesText.scrollHeight}px`;
});



btnCopiar.addEventListener('click', function(event) {
    event.preventDefault()
    console.log(horaInicial)
    copiarDatos()
    btnEnviar.focus()
})



btnEnviar.addEventListener('click', async function(event) {
    event.preventDefault()
    if(horaInicial){
        calcularTiempo()
        btnInicio.disabled = false;
    } 
    btnInicio.focus()
    stopCounter()
    try {
        await enviarDatosAlServidor()
        limpiarDatosForm()
        insertarTexto()
        ahtPorDia()
    } catch (error) {
        console.error('Error al enviar los datos al servidor:', error);
    }
})

async function enviarDatosAlServidor() {
    const smnet = document.getElementById('smnet');
    const observaciones = document.getElementById('observaciones');
    const tecnology = document.getElementById('tecnology');
    const tipoServicio = document.getElementById('tipoServicio');
    const naturaleza = document.getElementById('naturaleza');
    const horarioB2B = document.getElementById('horario-b2b');
    const atiendeB2b = document.getElementById('atiende-b2b');
    const celularB2b = document.getElementById('celular-b2b');
    const diasAtencion = document.getElementById('dias-atencion');
    const horarioAtencion = document.getElementById('horario-atencion');
    const documento = document.getElementById('documentoIdentidad');
    const cel = document.getElementById('celular');
    //const actualizacion = document.getElementById('actualizacion-datos');
    //const guion = document.getElementById('guion-agendamiento');
    const permisoEspecial = document.getElementById('permiso-especial')
    const horarioEspecialSabado = document.getElementById('horario-especial-sabado')
    const horarioEspecialDomingo = document.getElementById('horario-especial-domingo')

    //const actualizacionDatos = `¿Actualicé los datos?: ${actualizacion.value}, ¿brindé guion de agendamiento?: ${guion.value}`

    let plantillaCreada;

    if (horarioB2B.value === 'si') {
        plantillaCreada = `Observaciones: ${observaciones.value}, Id de la llamada ${idLlamada.value}, SMNET: ${smnet.value}, Tecnología: ${tecnology.value}, Tipo de servicio: ${tipoServicio.value}, Naturaleza del problema: ${naturaleza.value}. Horario B2B activo. Los datos del representante encargado de atender la visita se especifican a continuación: nombre: ${atiendeB2b.value}, celular: ${celularB2b.value}, días de atención: ${diasAtencion.value}, en el horario: ${horarioAtencion.value}, Si se requiere permiso especial o algún documento: ${permisoEspecial.value}, Horario especial día sábado (si es diferente al indicado): ${horarioEspecialSabado.value}, Horario especial día domingo (si es diferente al indicado): ${horarioEspecialDomingo.value} Doc/NIT: ${documento.value}`;
    } else {
        let celular;
        if(cel.value > 0){
            celular = `, cel: ${cel.value}`
        } else {
            celular = ''
        }
        plantillaCreada = `Observaciones: ${observaciones.value}, Id de la llamada ${idLlamada.value}, Id prueba SMNET: ${smnet.value}, Tecnología: ${tecnology.value}, Tipo de servicio: ${tipoServicio.value}, Naturaleza: ${naturaleza.value}, Documento: ${documento.value}${celular}`;
    }

    const data = {
        idLlamada: idLlamada.value,
        name: document.getElementById('name').value,
        documentoIdentidad: documento.value,
        observaciones: plantillaCreada,
        //actualizacionDatos: actualizacionDatos,
        fecha: fecha,
        hora: hora,
        tiempoPromedio: tiempoTotal,
        tipoPlantilla: document.getElementById('modoDeTrabajo').value
    }

    //Enviar datos al servidor 
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(data),
        })
        if(response.ok) {
            const result = await response.json()
            console.log('Datos enviados con éxito ', result)
        } else {
            console.log('Error al enviar datos', response.statusText)
        }
    } catch (error) {
        console.error('Error al enviar los datos al servidor', error)
    }
}

function calcularTiempo() {
    horaFinal = new Date();
    const modoDeTrabajo = document.getElementById('modoDeTrabajo')

    if(modoDeTrabajo.value === 'N2') {
        const diferenciaMilisegundos = horaFinal - horaInicial;
        const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);
        tiempoTotal = diferenciaSegundos
    } else {
        const diferenciaMilisegundos = horaFinal - horaInicial;
        const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);
        tiempoTotal = diferenciaSegundos
    }
}

async function insertarTexto() {
    const totalTiempotext = document.getElementById('totalTiempoText')
    const tipoAht = 'mensual'
    try {
        const response = await fetch(`${API_URL}average/month`);
        if(!response.ok) throw new Error('Error al obtener el promedio mensual')

        const data = await response.json();
        const aht = data.promedio || 0;
        
        totalTiempotext.textContent = `AHT ${tipoAht} --------- ${aht.toFixed()}, Min ${(aht / 60).toFixed(2)}`;
        totalTiempotext.style.backgroundColor = '#D5D2F5'
    } catch (error) {
        totalTiempotext.textContent = `AHT ${tipoAht} --------- 0, Min 0.00`;
        //totalTiempotext.style.backgroundColor = '#D5D2F5'
    }
}
insertarTexto()

async function ahtPorDia() {
    const ahtDiario = document.getElementById('ahtDiario')
    const tipoAht = 'hoy'
    try {
        const response = await fetch(`${API_URL}average/today`);
        if(!response.ok) throw new Error('Error al obtener el promedio diario');

        const data = await response.json();
        const aht = data.promedio || 0;

        ahtDiario.textContent = `AHT ${tipoAht} --------- ${aht.toFixed()}, Min ${(aht / 60).toFixed(2)}`;
        ahtDiario.style.backgroundColor = '#f9f9f9'
    } catch (error) {
        console.error('error al obtener el promedio diario', error)
    }
}

ahtPorDia()



function insertarTextDinamico() {
    const modoDeTrabajo = document.getElementById('modoDeTrabajo')
    modoDeTrabajo.addEventListener('change' , () => { 
        insertarTexto()
        ahtPorDia()
    })
}
insertarTextDinamico()

//Copiar los datos al portapapeles
function copiarDatos () {
    const smnet = document.getElementById('smnet')
    const observaciones = document.getElementById('observaciones')
    const tecnology = document.getElementById('tecnology');
    const tipoServicio = document.getElementById('tipoServicio')
    const naturaleza = document.getElementById('naturaleza')
    const horarioB2B = document.getElementById('horario-b2b')
    const atiendeB2b = document.getElementById('atiende-b2b')
    const celularB2b = document.getElementById('celular-b2b')
    const diasAtencion = document.getElementById('dias-atencion')
    const horarioAtencion = document.getElementById('horario-atencion')
    const documento = document.getElementById('documentoIdentidad')
    const cel = document.getElementById('celular')
    const permisoEspecial = document.getElementById('permiso-especial')
    const horarioEspecialSabado = document.getElementById('horario-especial-sabado')
    const horarioEspecialDomingo = document.getElementById('horario-especial-domingo')

    if(horarioB2B.value === 'si'){
        let permiso;
        let sabado;
        let domingo;
        permisoEspecial.value === '' ? permiso = '' : permiso = `, Si se requiere permiso especial: ${permisoEspecial.value}`
        horarioEspecialSabado.value === '' ? sabado = '' : sabado = `, Horario especial día sábado: ${horarioEspecialSabado.value}`;
        horarioEspecialDomingo.value === '' ? domingo = '' : domingo = `, Horario especial día domingo: ${horarioEspecialDomingo.value}`

        const plantillaCreada = `Observaciones: ${observaciones.value}, Id de la llamada ${idLlamada.value}, SMNET: ${smnet.value}, Tecnología: ${tecnology.value}, Tipo de servicio: ${tipoServicio.value}, Naturaleza del problema: ${naturaleza.value}. Horario B2B activo. Los datos del representante encargado de atender la visita se especifican a continuación: nombre: ${atiendeB2b.value}, celular: ${celularB2b.value}, días de atención: ${diasAtencion.value}, en el horario: ${horarioAtencion.value}${permiso}${sabado}${domingo} Doc/NIT: ${documento.value}`;
        return navigator.clipboard.writeText(plantillaCreada)
    } else {
        let celular;
        cel.value > 0 ? celular = `, cel: ${cel.value}` : celular = '';

        const plantillaCreada = `Observaciones: ${observaciones.value}, Id de la llamada ${idLlamada.value}, Id prueba SMNET: ${smnet.value}, Tecnología: ${tecnology.value}, Tipo de servicio: ${tipoServicio.value}, Naturaleza: ${naturaleza.value}, Doc: ${documento.value}${celular}`;
        return navigator.clipboard.writeText(plantillaCreada)
        }
}


function limpiarDatosForm () {
    document.getElementById('id-llamada').value = '';
    document.getElementById('smnet').value = '';
    document.getElementById('name').value = '';
    document.getElementById('observaciones').value = '';
    document.getElementById('tecnology').value = '';
    document.getElementById('tipoServicio').value = '';
    document.getElementById('naturaleza').value = '';
    document.getElementById('celular').value = '';
    document.getElementById('horario-b2b').value = 'no';
    document.getElementById('documentoIdentidad').value = '';
    document.getElementById('atiende-b2b').value = '';
    document.getElementById('celular-b2b').value = '';
    document.getElementById('dias-atencion').value = 'Lunes a Viernes';
    //document.getElementById('actualizacion-datos').value = 'no';
    //document.getElementById('guion-agendamiento').value = 'no';
    document.getElementById('horario-atencion').value = '';
    document.getElementById('permiso-especial').value = '';
    document.getElementById('horario-especial-sabado').value = '';
    document.getElementById('horario-especial-domingo').value = '';
    ocultarB2b()
    function reiniciarObservarciones () {
        const observaciones = document.getElementById('observaciones')
        observaciones.style.height = 'auto';
    }
    reiniciarObservarciones()
    
}
limpiarDatosForm()
/*Cambiar de forma dinámica b2b */

function ocultarB2b() {
    const dinamicB2bInvisible = document.getElementById('horario-b2b');
    const invisible = document.getElementById('horario-b2b-invisible');

    function actualizarVisibilidad () {
        if(dinamicB2bInvisible.value === 'si'){
            
            invisible.style.display = 'block';
        }else {
            const invisible = document.getElementById('horario-b2b-invisible');
            invisible.style.display = 'none';
        }
    }
    dinamicB2bInvisible.addEventListener('change', actualizarVisibilidad);
    actualizarVisibilidad()
}   
ocultarB2b() 



// Función para reproducir un sonido genérico
function playSound(frequency = 440, duration = 1000) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, duration);
}

// Función para iniciar el contador
function startCounter() {
    if (isRunning) return; // Evita múltiples inicios
    isRunning = true;

    startTime = Date.now();
    let hasPlayedInitialAlarm = false;
    let nextAlarmTime = 45; // Primera alarma a los 60 segundos

    interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000; // Tiempo transcurrido en segundos

        // Alarma inicial a los 60 segundos
        if (!hasPlayedInitialAlarm && elapsedTime >= 45) {
            playSound(); // Reproduce el sonido
            hasPlayedInitialAlarm = true;
            nextAlarmTime = 170; // Configura la siguiente alarma a los 120 segundos (30 + 120)
        }

        // Alarmas repetitivas cada 140 segundos
        if (elapsedTime >= nextAlarmTime) {
            playSound(); // Reproduce el sonido
            nextAlarmTime += 115; // Actualiza para la siguiente alarma
        }

    }, 100); // Actualización precisa cada 100ms
}


// Función para detener el contador
function stopCounter() {
    clearInterval(interval);
    isRunning = false;
}

const btnFenix = document.getElementById('btn-fenix')
const btnElite = document.getElementById('btn-elite')
const btnPwd = document.getElementById('btn-pwd')
btnFenix.addEventListener('click', () => {
    return navigator.clipboard.writeText(fenix)
})
btnElite.addEventListener('click', () => {
    return navigator.clipboard.writeText(elite)
})
btnPwd.addEventListener('click', () => {
    return navigator.clipboard.writeText(pwd)
})
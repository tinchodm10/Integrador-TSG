/* ================================
   🎬 animacionesCartas.js
   Mapeo de animaciones de cartas
   ================================ */

// Mapeo de nombres de cartas con rutas de animaciones de ENTRADA (CARDS TW)
const animacionesEntrada = {
    // AURELION - Tropas
    "Paladín de la Aurora": "../Assets/Cartas/CARDS TW/AURELION TW/paladinauroraTW.mp4",
    "Escudero Luminoso": "../Assets/Cartas/CARDS TW/AURELION TW/escuderoluminosoTW.mp4",
    "Lancero Solar": "../Assets/Cartas/CARDS TW/AURELION TW/lancerosolarTW.mp4",
    "Jinete del Alba": "../Assets/Cartas/CARDS TW/AURELION TW/jinetedelalbaTW.mp4",
    "Caballero del Alba": "../Assets/Cartas/CARDS TW/AURELION TW/caballerodelalbaTW.mp4",
    
    // AURELION - Estructuras
    "Muralla de Luz": "../Assets/Cartas/CARDS TW/AURELION TW/santuariodelalbaTW.mp4",  // Comparte con Santuario
    "Templo del Sol Eterno": "../Assets/Cartas/CARDS TW/AURELION TW/templodelsoTW.mp4",
    "Torre del Amanecer": "../Assets/Cartas/CARDS TW/AURELION TW/TorreamaencerTW.mp4",
    "Faro de Brillo": "../Assets/Cartas/CARDS TW/AURELION TW/farodebrilloTW.mp4",
    "Santuario del Alba": "../Assets/Cartas/CARDS TW/AURELION TW/santuariodelalbaTW.mp4",
    
    // AURELION - Hechizos
    "Bendición Solar": "../Assets/Cartas/CARDS TW/AURELION TW/bendicionsolarTW.mp4",
    "Tormenta de Luz": "../Assets/Cartas/CARDS TW/AURELION TW/destelloTW.mp4",  // Comparte con Destello Solar
    "Escudo de Luz": "../Assets/Cartas/CARDS TW/AURELION TW/escudodeluzTW.mp4",
    "Destello Solar": "../Assets/Cartas/CARDS TW/AURELION TW/destelloTW.mp4",
    "Renacer Dorado": "../Assets/Cartas/CARDS TW/AURELION TW/RenacerdoradoTW.mp4",
    
    // VALGOR - Tropas
    "Soldado de Hierro": "../Assets/Cartas/CARDS TW/VALGOR TW/soldadodehierroTW.mp4",
    "Acha de Acero": "../Assets/Cartas/CARDS TW/VALGOR TW/hachadeaceroTW.mp4",
    "Lancero de Forja": "../Assets/Cartas/CARDS TW/VALGOR TW/lancerodeforjaTW.mp4",
    "Artillero Blindado": "../Assets/Cartas/CARDS TW/VALGOR TW/artilleroblindadoTW.mp4",
    "Gólem de Forja": "../Assets/Cartas/CARDS TW/VALGOR TW/golemdeforjaTW.mp4",
    
    // VALGOR - Estructuras
    "Muralla de Acero": "../Assets/Cartas/CARDS TW/VALGOR TW/muralladeaceroTW.mp4",
    "Fortaleza del Martillo": "../Assets/Cartas/CARDS TW/VALGOR TW/fortalezadelmartilloTW.mp4",
    "Pilar del Vapor": "../Assets/Cartas/CARDS TW/VALGOR TW/pilarvaporTW.mp4",
    "Foso de Engranajes": "../Assets/Cartas/CARDS TW/VALGOR TW/fosoengranajesTW.mp4",
    "Bastión de Hierro": "../Assets/Cartas/CARDS TW/VALGOR TW/bastiondehierroTW.mp4",
    
    // VALGOR - Hechizos
    "Martillo Ardiente": "../Assets/Cartas/CARDS TW/VALGOR TW/martilloardienteTW.mp4",
    "Blindaje": "../Assets/Cartas/CARDS TW/VALGOR TW/blindajeTW.mp4",
    "Explosión de Forja": "../Assets/Cartas/CARDS TW/VALGOR TW/explosiondeforjaTW.mp4",
    "Refuerzo Mecánico": "../Assets/Cartas/CARDS TW/VALGOR TW/refuezomecTW.mp4"
};

// Mapeo de nombres de cartas con rutas de animaciones de desaparición
const animacionesDesaparicion = {
    // AURELION - Tropas
    "Paladín de la Aurora": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/tropas/paladin de la aurora.mp4",
    "Escudero Luminoso": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/tropas/escudero luminoso.mp4",
    "Lancero Solar": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/tropas/lancero solar.mp4",
    "Jinete del Alba": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/tropas/jinete del alba.mp4",
    "Caballero del Alba": null,
    
    // AURELION - Estructuras
    "Muralla de Luz": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/estructuras/muralla de luz.mp4",
    "Templo del Sol Eterno": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/estructuras/templo del sol.mp4",
    "Torre del Amanecer": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/estructuras/torre del amanecer.mp4",
    "Faro de Brillo": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/estructuras/faro de brillo.mp4",
    "Santuario del Alba": "../Assets/Cartas/CARDS DV/cartas animacion 2/aurelion/estructuras/santuario del alba.mp4",
    
    // VALGOR - Tropas
    "Soldado de Hierro": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/tropas/soldado de hierro.mp4",
    "Acha de Acero": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/tropas/acha de acero.mp4",
    "Lancero de Forja": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/tropas/lancero de forja.mp4",
    "Artillero Blindado": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/tropas/artillero blindado.mp4",
    "Gólem de Forja": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/tropas/golem de forja.mp4",
    
    // VALGOR - Estructuras
    "Muralla de Acero": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/estructuras/muralla de acero.mp4",
    "Fortaleza del Martillo": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/estructuras/fortaleza de martillo.mp4",
    "Pilar del Vapor": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/estructuras/pilar de vapor.mp4",
    "Foso de Engranajes": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/estructuras/foso de engranajes.mp4",
    "Bastión de Hierro": "../Assets/Cartas/CARDS DV/cartas animacion 2/valgor/estructuras/bastion de hierro.mp4"
};

// Función para obtener la ruta de animación de desaparición
function obtenerAnimacionDesaparicion(nombreCarta) {
    return animacionesDesaparicion.hasOwnProperty(nombreCarta) ? animacionesDesaparicion[nombreCarta] : null;
}

// Función para obtener la ruta de animación de entrada
function obtenerAnimacionEntrada(nombreCarta) {
    return animacionesEntrada[nombreCarta] || null;
}

// Función para reproducir animación de entrada (cuando se coloca la carta)
function reproducirAnimacionEntrada(elementoCarta, nombreCarta, callback) {
    console.log(`[ENTRADA] Intentando animar entrada de: ${nombreCarta}`);
    console.log(`[ENTRADA] Elemento recibido:`, elementoCarta);
    
    if (!elementoCarta) {
        console.error(`[ENTRADA] Elemento es nulo o undefined`);
        if (callback) callback();
        return;
    }
    
    const rutaAnimacion = obtenerAnimacionEntrada(nombreCarta);
    
    if (!rutaAnimacion) {
        console.warn(`[ENTRADA] No hay animación de entrada para: ${nombreCarta}`);
        if (callback) callback();
        return;
    }
    
    console.log(`[ENTRADA] Reproduciendo animación de entrada para: ${nombreCarta}`);
    console.log(`[ENTRADA] Ruta: ${rutaAnimacion}`);
    
    // Crear contenedor para el video dentro de la carta
    const contenedorVideo = document.createElement('div');
    contenedorVideo.className = 'contenedor-animacion-entrada';
    contenedorVideo.style.position = 'absolute';
    contenedorVideo.style.top = '0';
    contenedorVideo.style.left = '0';
    contenedorVideo.style.width = '100%';
    contenedorVideo.style.height = '100%';
    contenedorVideo.style.zIndex = '1000';
    contenedorVideo.style.borderRadius = '4px';
    contenedorVideo.style.overflow = 'hidden';
    contenedorVideo.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    
    // Crear elemento de video
    const video = document.createElement('video');
    video.src = rutaAnimacion;
    video.autoplay = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    
    contenedorVideo.appendChild(video);
    
    // Asegurar que el elemento tenga posición relativa
    elementoCarta.style.position = 'relative';
    elementoCarta.appendChild(contenedorVideo);
    
    console.log(`[ENTRADA] Video agregado al DOM`);
    console.log(`[ENTRADA] Elemento video:`, video);
    
    // Cuando termine el video, remover el contenedor
    video.onended = () => {
        console.log(`[ENTRADA] Video terminado para: ${nombreCarta}`);
        contenedorVideo.remove();
        console.log(`[ENTRADA] Contenedor removido`);
        if (callback) callback();
    };
    
    // Event listeners para debugging
    video.onloadstart = () => console.log(`[ENTRADA] Video loading: ${nombreCarta}`);
    video.oncanplay = () => console.log(`[ENTRADA] Video canplay: ${nombreCarta}`);
    video.onplay = () => console.log(`[ENTRADA] Video play: ${nombreCarta}`);
    video.onpause = () => console.log(`[ENTRADA] Video pause: ${nombreCarta}`);
    video.onseeking = () => console.log(`[ENTRADA] Video seeking: ${nombreCarta}`);
    
    // Fallback si hay error
    video.onerror = () => {
        console.error(`[ENTRADA] Error al cargar video: ${rutaAnimacion}`);
        console.error(`[ENTRADA] Error:`, video.error);
        console.error(`[ENTRADA] Error message:`, video.error?.message);
        contenedorVideo.remove();
        if (callback) callback();
    };
    
    // Fallback por timeout - máximo 3 segundos
    setTimeout(() => {
        if (document.body.contains(contenedorVideo)) {
            console.log(`[ENTRADA] Timeout alcanzado para: ${nombreCarta}`);
            contenedorVideo.remove();
            if (callback) callback();
        }
    }, 3000);
}

// Función para reproducir animación de desaparición
function reproducirAnimacionDesaparicion(elemento, nombreCarta, callback) {
    console.log(`[DESAPARICION] Intentando animar desaparición de: ${nombreCarta}`);
    console.log(`[DESAPARICION] Elemento recibido:`, elemento);
    
    if (!elemento) {
        console.error(`[DESAPARICION] Elemento es nulo o undefined`);
        if (callback) callback();
        return;
    }
    
    const rutaAnimacion = obtenerAnimacionDesaparicion(nombreCarta);
    
    if (!rutaAnimacion) {
        // Si no hay animación, simplemente ejecutar callback inmediatamente
        console.warn(`[DESAPARICION] No hay animación de desaparición para: ${nombreCarta}`);
        if (callback) callback();
        return;
    }
    
    console.log(`[DESAPARICION] Reproduciendo animación de desaparición para: ${nombreCarta}`);
    console.log(`[DESAPARICION] Ruta: ${rutaAnimacion}`);
    
    // Crear contenedor para el video dentro de la carta (igual que entrada)
    const contenedorVideo = document.createElement('div');
    contenedorVideo.className = 'contenedor-animacion-desaparicion';
    contenedorVideo.style.position = 'absolute';
    contenedorVideo.style.top = '0';
    contenedorVideo.style.left = '0';
    contenedorVideo.style.width = '100%';
    contenedorVideo.style.height = '100%';
    contenedorVideo.style.zIndex = '1000';
    contenedorVideo.style.borderRadius = '4px';
    contenedorVideo.style.overflow = 'hidden';
    contenedorVideo.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    
    // Crear elemento de video
    const video = document.createElement('video');
    video.src = rutaAnimacion;
    video.autoplay = true;
    video.muted = true;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    
    contenedorVideo.appendChild(video);
    
    // Asegurar que el elemento tenga posición relativa
    elemento.style.position = 'relative';
    elemento.appendChild(contenedorVideo);
    
    console.log(`[DESAPARICION] Video agregado al DOM`);
    console.log(`[DESAPARICION] Elemento video:`, video);
    
    // Cuando termine el video, remover el contenedor
    video.onended = () => {
        console.log(`[DESAPARICION] Video terminado para: ${nombreCarta}`);
        contenedorVideo.remove();
        console.log(`[DESAPARICION] Contenedor removido`);
        if (callback) callback();
    };
    
    // Event listeners para debugging
    video.onloadstart = () => console.log(`[DESAPARICION] Video loading: ${nombreCarta}`);
    video.oncanplay = () => console.log(`[DESAPARICION] Video canplay: ${nombreCarta}`);
    video.onplay = () => console.log(`[DESAPARICION] Video play: ${nombreCarta}`);
    video.onpause = () => console.log(`[DESAPARICION] Video pause: ${nombreCarta}`);
    video.onseeking = () => console.log(`[DESAPARICION] Video seeking: ${nombreCarta}`);
    
    // Fallback si hay error
    video.onerror = () => {
        console.error(`[DESAPARICION] Error al cargar video: ${rutaAnimacion}`);
        console.error(`[DESAPARICION] Error:`, video.error);
        console.error(`[DESAPARICION] Error message:`, video.error?.message);
        contenedorVideo.remove();
        if (callback) callback();
    };
    
    // Fallback por timeout - máximo 3 segundos
    setTimeout(() => {
        if (document.body.contains(contenedorVideo)) {
            console.log(`[DESAPARICION] Timeout alcanzado para: ${nombreCarta}`);
            contenedorVideo.remove();
            if (callback) callback();
        }
    }, 3000);
}

// 🔍 FUNCIÓN DE DIAGNÓSTICO - Mostrar qué animaciones están mapeadas
function diagnosticoAnimaciones() {
    console.log("=== DIAGNÓSTICO DE ANIMACIONES ===");
    console.log("Animaciones de ENTRADA mapeadas:", Object.keys(animacionesEntrada));
    console.log("Total de animaciones de ENTRADA:", Object.keys(animacionesEntrada).length);
    console.log("Animaciones de DESAPARICIÓN mapeadas:", Object.keys(animacionesDesaparicion));
    console.log("Total de animaciones de DESAPARICIÓN:", Object.keys(animacionesDesaparicion).length);
}

// 🎬 FUNCIÓN PARA REPRODUCIR ANIMACIÓN INTRO (Animatic.mp4 o Intro.mp4)
function reproducirAnimacionIntro(nombreArchivo = 'Animatic.mp4', callback) {
    const rutaAnimacion = `../Assets/Animaciones/${nombreArchivo}`;
    
    // Crear contenedor para la animación intro (fullscreen)
    const contenedorIntro = document.createElement('div');
    contenedorIntro.id = 'intro-animation-container';
    contenedorIntro.style.position = 'fixed';
    contenedorIntro.style.top = '0';
    contenedorIntro.style.left = '0';
    contenedorIntro.style.width = '100%';
    contenedorIntro.style.height = '100%';
    contenedorIntro.style.zIndex = '99999';
    contenedorIntro.style.backgroundColor = '#000';
    contenedorIntro.style.display = 'flex';
    contenedorIntro.style.justifyContent = 'center';
    contenedorIntro.style.alignItems = 'center';
    
    // Crear elemento de video
    const video = document.createElement('video');
    video.src = rutaAnimacion;
    video.autoplay = true;
    video.muted = true;
    video.style.maxWidth = '100%';
    video.style.maxHeight = '100%';
    video.style.objectFit = 'cover';
    
    contenedorIntro.appendChild(video);
    document.body.appendChild(contenedorIntro);
    
    console.log(`[INTRO] Reproduciendo animación intro: ${nombreArchivo}`);
    
    // Cuando termine el video, remover el contenedor y llamar callback
    video.onended = () => {
        console.log(`[INTRO] Animación intro terminada`);
        contenedorIntro.remove();
        if (callback) callback();
    };
    
    // Error handling
    video.onerror = () => {
        console.error(`[INTRO] Error al cargar video: ${rutaAnimacion}`);
        console.error(`[INTRO] Error:`, video.error);
        contenedorIntro.remove();
        if (callback) callback();
    };
    
    // Fallback por timeout - máximo 10 segundos para la intro
    setTimeout(() => {
        if (document.body.contains(contenedorIntro)) {
            console.log(`[INTRO] Timeout alcanzado, removiendo contenedor`);
            contenedorIntro.remove();
            if (callback) callback();
        }
    }, 10000);
}

// Ejecutar diagnóstico al cargar
console.log("✅ animacionesCartas.js cargado correctamente");
diagnosticoAnimaciones();

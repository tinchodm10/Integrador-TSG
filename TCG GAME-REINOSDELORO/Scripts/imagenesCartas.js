/* ================================
   🖼️ imagenesCartas.js
   Mapeo de imágenes de cartas
   ================================ */

// Mapeo de nombres de cartas con rutas de imágenes
const imagenesCartas = {
    // AURELION - Tropas
    "Caballero del Alba": "../Assets/Cartas/CARDS IMG/aurelion img/CABALLERO DEL ALBA.svg",
    "Paladín de la Aurora": "../Assets/Cartas/CARDS IMG/aurelion img/PALADIN DE LA AURORA.svg",
    "Escudero Luminoso": "../Assets/Cartas/CARDS IMG/aurelion img/ESCUDERO LUMINOS.svg",
    "Lancero Solar": "../Assets/Cartas/CARDS IMG/aurelion img/LANCERO SOLAR.svg",
    "Jinete del Alba": "../Assets/Cartas/CARDS IMG/aurelion img/JINETE DEL ALBA1.svg",
    
    // AURELION - Estructuras
    "Muralla de Luz": "../Assets/Cartas/CARDS IMG/aurelion img/MURALLA DE LUZ.svg",
    "Templo del Sol": "../Assets/Cartas/CARDS IMG/aurelion img/TEMPLO DEL SOL.svg",
    "Torre del Amanecer": "../Assets/Cartas/CARDS IMG/aurelion img/TORRE DEL AMANECER.svg",
    "Faro de Brillo": "../Assets/Cartas/CARDS IMG/aurelion img/FARO DE BRILLO.svg",
    "Santuario del Alba": "../Assets/Cartas/CARDS IMG/aurelion img/SANTUARIO DEL ALBA.svg",
    
    // AURELION - Hechizos
    "Bendición Solar": "../Assets/Cartas/CARDS IMG/aurelion img/BENDICION SOLAR.svg",
    "Tormenta de Luz": "../Assets/Cartas/CARDS IMG/aurelion img/TORMENTA DE LUZ.svg",
    "Escudo de Luz": "../Assets/Cartas/CARDS IMG/aurelion img/ESCUDO DE LUZ.svg",
    "Destello Solar": "../Assets/Cartas/CARDS IMG/aurelion img/DESTELLO.svg",
    "Renacer Dorado": "../Assets/Cartas/CARDS IMG/aurelion img/RENACER DORADO.svg",
    
    // VALGOR - Tropas
    "Soldado de Hierro": "../Assets/Cartas/CARDS IMG/valgor img/soldado de hierro.svg",
    "Acha de Acero": "../Assets/Cartas/CARDS IMG/valgor img/Hacha de acero.svg",
    "Lancero de Forja": "../Assets/Cartas/CARDS IMG/valgor img/Lancero de forja.svg",
    "Artillero Blindado": "../Assets/Cartas/CARDS IMG/valgor img/artillero blindado.svg",
    "Gólem de Forja": "../Assets/Cartas/CARDS IMG/valgor img/Golem de Forja.svg",
    
    // VALGOR - Estructuras
    "Muralla de Acero": "../Assets/Cartas/CARDS IMG/valgor img/muralla de acero.svg",
    "Fortaleza del Martillo": "../Assets/Cartas/CARDS IMG/valgor img/Fortaleza de martillo.svg",
    "Pilar del Vapor": "../Assets/Cartas/CARDS IMG/valgor img/pilar de vapor.svg",
    "Foso de Engranajes": "../Assets/Cartas/CARDS IMG/valgor img/foso de engranajes.svg",
    "Bastión de Hierro": "../Assets/Cartas/CARDS IMG/valgor img/bastion de hierro.svg",
    
    // VALGOR - Hechizos
    "Martillo Ardiente": "../Assets/Cartas/CARDS IMG/valgor img/martillo ardiente.svg",
    "Blindaje": "../Assets/Cartas/CARDS IMG/valgor img/Blindaje.svg",
    "Explosión de Forja": "../Assets/Cartas/CARDS IMG/valgor img/exlosion de forja.svg",
    "Refuerzo Mecánico": "../Assets/Cartas/CARDS IMG/valgor img/Refuerzo mec.svg"
};

// Función para obtener la ruta de imagen de una carta
function obtenerImagenCarta(nombreCarta) {
    return imagenesCartas[nombreCarta] || null;
}

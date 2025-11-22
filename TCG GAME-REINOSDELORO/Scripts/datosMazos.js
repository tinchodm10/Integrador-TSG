/* ================================
   📘 datosMazos.js
   Contiene la información completa
   de los mazos de "Reinos del Oro".
   ================================ */

// 🔹 Datos base de los mazos
const mazos = [
  {
    monarca: "Aurelion, el Radiante",
    reino: "Sol Dorado",
    unidades: [
      { nombre: "Caballero del Alba", costo: 2, ataque: 2, defensa: 3, cantidad: 3 },      // Balanceado defensor
      { nombre: "Paladín de la Aurora", costo: 4, ataque: 4, defensa: 4, cantidad: 3 },    // Unidad premium balanceada
      { nombre: "Escudero Luminoso", costo: 1, ataque: 1, defensa: 2, cantidad: 3 },       // Defensor básico
      { nombre: "Lancero Solar", costo: 2, ataque: 3, defensa: 2, cantidad: 3 },           // Atacante moderado
      { nombre: "Jinete del Alba", costo: 3, ataque: 3, defensa: 3, cantidad: 3 }
    ],
  
    estructuras: [
      { nombre: "Muralla de Luz", costo: 3, defensa: 4, descripcion: "Habilidad: Aumenta +1 defensa a todas tus tropas.", cantidad: 2 },
      { nombre: "Templo del Sol Eterno", costo: 3, defensa: 3, descripcion: "Habilidad: Aumenta +1 defensa al castillo.", cantidad: 2 },
      { nombre: "Torre del Amanecer", costo: 2, defensa: 2, descripcion: "Habilidad: Aumenta +1 ataque a una tropa aliada.", cantidad: 2 },
      { nombre: "Faro de Brillo", costo: 2, defensa: 2, descripcion: "Habilidad: Reduce -1 defensa a una tropa enemiga.", cantidad: 2 },
      { nombre: "Santuario del Alba", costo: 3, defensa: 3, descripcion: "Habilidad: Aumenta +1 defensa a una tropa aliada.", cantidad: 2 }
    ],
    hechizos: [
      { nombre: "Bendición Solar", costo: 2, descripcion: "Efecto Directo: Aumenta +2 defensa a una tropa aliada.", cantidad: 3 },
      { nombre: "Tormenta de Luz", costo: 3, descripcion: "Efecto Directo: Reduce -2 defensa a una tropa enemiga.", cantidad: 3 },
      { nombre: "Escudo de Luz", costo: 2, descripcion: "Efecto Directo: Aumenta +2 defensa al castillo por un turno.", cantidad: 3 },
      { nombre: "Destello Solar", costo: 3, descripcion: "Efecto Directo: Reduce -3 defensa a una tropa enemiga.", cantidad: 3 },
      { nombre: "Renacer Dorado", costo: 2, descripcion: "Efecto Directo: Aumenta +1 ataque a todas tus tropas por un turno.", cantidad: 3 }
    ]
  },
  {
    monarca: "Valgor, el Conquistador",
    reino: "Hierro Carmesí",
    unidades: [
      { nombre: "Soldado de Hierro", costo: 2, ataque: 3, defensa: 2, cantidad: 3 },       // Atacante moderado
      { nombre: "Acha de Acero", costo: 3, ataque: 3, defensa: 3, cantidad: 3 },          // Balanceado medio
      { nombre: "Lancero de Forja", costo: 2, ataque: 2, defensa: 3, cantidad: 3 },        // Defensor moderado
      { nombre: "Artillero Blindado", costo: 3, ataque: 4, defensa: 2, cantidad: 3 },      // Atacante fuerte pero frágil
      { nombre: "Gólem de Forja", costo: 4, ataque: 4, defensa: 4, cantidad: 3 }
    ],

    estructuras: [
      { nombre: "Muralla de Acero", costo: 3, defensa: 4, descripcion: "Habilidad: Aumenta +1 defensa a tus tropas.", cantidad: 2 },
      { nombre: "Fortaleza del Martillo", costo: 4, defensa: 5, descripcion: "Habilidad: Aumenta +1 ataque a tus tropas.", cantidad: 2 },
      { nombre: "Pilar del Vapor", costo: 3, defensa: 3, descripcion: "Habilidad: Reduce -1 defensa a una tropa enemiga.", cantidad: 2 },
      { nombre: "Foso de Engranajes", costo: 2, defensa: 2, descripcion: "Habilidad: Reduce -1 ataque a una tropa enemiga.", cantidad: 2 },
      { nombre: "Bastión de Hierro", costo: 5, defensa: 5, descripcion: "Habilidad: Aumenta +2 defensa a tus estructuras.", cantidad: 2 }
    ],
    hechizos: [
      { nombre: "Martillo Ardiente", costo: 3, descripcion: "Efecto Directo: Reduce -3 defensa a una tropa enemiga.", cantidad: 3 },
      { nombre: "Blindaje", costo: 2, descripcion: "Efecto Directo: Aumenta +2 defensa a una tropa aliada.", cantidad: 3 },
      { nombre: "Explosión de Forja", costo: 3, descripcion: "Efecto Directo: Reduce -2 defensa a todas las tropas enemigas.", cantidad: 3 },
      { nombre: "Refuerzo Mecánico", costo: 2, descripcion: "Efecto Directo: Aumenta +2 defensa a una estructura.", cantidad: 3 }
    ]
  }
];


// 🔸 Guardar el mazo seleccionado en localStorage
function seleccionarMazo(nombreReino) {
  const mazo = mazos.find(m => m.reino === nombreReino);
  if (mazo) {
    localStorage.setItem("mazoSeleccionado", JSON.stringify(mazo));
    console.log(`Mazo de ${nombreReino} guardado en localStorage`);
  } else {
    console.error("No se encontró el mazo:", nombreReino);
  }
}

// 🔸 Obtener el mazo seleccionado
function obtenerMazoSeleccionado() {
  const data = localStorage.getItem("mazoSeleccionado");
  return data ? JSON.parse(data) : null;
}

// 🔸 Crear un mazo completo (todas las cartas disponibles)
function crearMazoCompleto(mazo) {
  let mazoCompleto = [];
  
  // Crear arrays separados para cada tipo
  let tropas = [];
  let estructuras = [];
  let hechizos = [];
  
  // Agregar tropas según cantidad
  mazo.unidades.forEach(unidad => {
    for (let i = 0; i < unidad.cantidad; i++) {
      tropas.push({ ...unidad, tipo: "tropa" });
    }
  });
  
  // Agregar estructuras según cantidad
  mazo.estructuras.forEach(estructura => {
    for (let i = 0; i < estructura.cantidad; i++) {
      estructuras.push({ ...estructura, tipo: "estructura" });
    }
  });
  
  // Agregar hechizos según cantidad
  mazo.hechizos.forEach(hechizo => {
    for (let i = 0; i < hechizo.cantidad; i++) {
      hechizos.push({ ...hechizo, tipo: "hechizo" });
    }
  });
  
  // Distribución inteligente: intercalar tropas, estructuras y hechizos
  // para asegurar que siempre hay tropas disponibles
  const totalCartas = tropas.length + estructuras.length + hechizos.length;
  let tropaIndex = 0;
  let estructuraIndex = 0;
  let hechizoIndex = 0;
  
  // Calcular proporción de tropas para garantizar distribución
  const proporcionTropas = tropas.length / totalCartas;
  
  for (let i = 0; i < totalCartas; i++) {
    // Determinar qué tipo de carta agregar basado en proporciones
    const posicionRelativa = i / totalCartas;
    
    // Si estamos en una sección donde debería haber tropas y aún hay disponibles
    if (posicionRelativa < proporcionTropas * 1.2 && tropaIndex < tropas.length) {
      mazoCompleto.push(tropas[tropaIndex++]);
    } else if (estructuraIndex < estructuras.length && posicionRelativa < (proporcionTropas + 0.3)) {
      mazoCompleto.push(estructuras[estructuraIndex++]);
    } else if (hechizoIndex < hechizos.length && posicionRelativa < 1.0) {
      mazoCompleto.push(hechizos[hechizoIndex++]);
    } else if (tropaIndex < tropas.length) {
      mazoCompleto.push(tropas[tropaIndex++]);
    } else if (estructuraIndex < estructuras.length) {
      mazoCompleto.push(estructuras[estructuraIndex++]);
    } else if (hechizoIndex < hechizos.length) {
      mazoCompleto.push(hechizos[hechizoIndex++]);
    }
  }
  
  return mazoCompleto;
}

// 🔸 Barajar un mazo (Fisher-Yates)
function barajarMazo(mazo) {
  const copia = [...mazo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// 🔸 Inicializar mano inicial (2 tropas, 1 estructura, 1 hechizo)
function inicializarManoInicial(mazo) {
  const mazoBarajado = barajarMazo(crearMazoCompleto(mazo));
  let mano = [];
  let tropasAdded = 0, estructurasAdded = 0, hechizosAdded = 0;
  
  // Buscar 2 tropas, 1 estructura y 1 hechizo
  for (let carta of mazoBarajado) {
    if (tropasAdded < 2 && carta.tipo === "tropa") {
      mano.push(carta);
      tropasAdded++;
    } else if (estructurasAdded < 1 && carta.tipo === "estructura") {
      mano.push(carta);
      estructurasAdded++;
    } else if (hechizosAdded < 1 && carta.tipo === "hechizo") {
      mano.push(carta);
      hechizosAdded++;
    }
    
    if (tropasAdded === 2 && estructurasAdded === 1 && hechizosAdded === 1) {
      break;
    }
  }
  
  // VALIDACIÓN: Si no se consiguió la mano inicial completa, intenta nuevamente
  if (tropasAdded < 2 || estructurasAdded < 1 || hechizosAdded < 1) {
    console.warn(`Mano inicial incompleta. Tropas: ${tropasAdded}, Estructuras: ${estructurasAdded}, Hechizos: ${hechizosAdded}. Reintentando...`);
    return inicializarManoInicial(mazo);
  }
  
  return mano;
}

// 🔸 Robar una carta aleatoria del mazo
function robarCarta(mazoDisponible) {
  if (mazoDisponible.length === 0) {
    console.warn("No hay más cartas en el mazo");
    return null;
  }
  
  const indiceAleatorio = Math.floor(Math.random() * mazoDisponible.length);
  const carta = mazoDisponible[indiceAleatorio];
  
  // Remover la carta del mazo
  mazoDisponible.splice(indiceAleatorio, 1);
  
  return carta;
}

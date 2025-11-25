class Juego {
    constructor() {
        // Obtener el mazo seleccionado PRIMERO
        const mazoSeleccionado = localStorage.getItem('mazoSeleccionado') || 'Aurelion';
        
        console.log(`Mazo seleccionado: ${mazoSeleccionado}`);
        
        // Asignar los mazos basados en la selección
        // mazos[0] = Aurelion (monarca: "Aurelion, el Radiante")
        // mazos[1] = Valgor (monarca: "Valgor, el Conquistador")
        if (mazoSeleccionado === 'Valgor') {
            this.mazoJugador = mazos[1]; // Valgor
            this.mazoIA = mazos[0]; // Aurelion
        } else {
            this.mazoJugador = mazos[0]; // Aurelion
            this.mazoIA = mazos[1]; // Valgor
        }
        
        console.log(`Jugador: ${this.mazoJugador.monarca}, IA: ${this.mazoIA.monarca}`);
        
        // Intentar cargar el juego guardado
        const juegoGuardado = this.cargarDesdeLocalStorage();
        
        // Si hay juego guardado Y los mazos coinciden, restaurar
        if (juegoGuardado && 
            juegoGuardado.mazoJugador.monarca === this.mazoJugador.monarca &&
            juegoGuardado.mazoIA.monarca === this.mazoIA.monarca) {
            // Restaurar el estado guardado
            Object.assign(this, juegoGuardado);
            console.log('Juego cargado desde localStorage');
        } else {
            // Inicializar un nuevo juego con los mazos correctos
            this.cartasRestantesJugador = [];
            this.cartasRestantesIA = [];
            this.manoJugador = [];
            this.manoIA = [];
            this.cartaSeleccionada = null;
            this.turnoJugador = true;
            this.oroJugador = 2;
            this.oroIA = 1; // IA comienza con 1 oro (más débil)

            // Estado del tablero
            this.tableroJugador = {
                tropas: new Array(3).fill(null),
                estructuras: new Array(2).fill(null),
                castillo: { vida: 30 },
                tropasAtacaron: new Array(3).fill(false)
            };

            this.tableroIA = {
                tropas: new Array(3).fill(null),
                estructuras: new Array(2).fill(null),
                castillo: { vida: 30 },
                tropasAtacaron: new Array(3).fill(false)
            };
            
            // Repartir cartas iniciales para nuevo juego
            this.repartirCartasIniciales();
            console.log('Nuevo juego iniciado');
        }
    }

    inicializarJuego() {
        // Actualizar interfaz
        this.actualizarInterfaz();

        // Agregar evento al botón de terminar turno
        const btnTerminarTurno = document.getElementById('btn-terminar-turno');
        if (btnTerminarTurno) {
            btnTerminarTurno.addEventListener('click', () => {
                console.log('Botón terminar turno clickeado');
                if (this.turnoJugador) {
                    console.log('Es turno del jugador, finalizando turno...');
                    this.finalizarTurno();
                    this.actualizarInterfaz();
                } else {
                    console.log('No es turno del jugador');
                }
            });
        } else {
            console.error('No se encontró el botón de terminar turno');
        }

        // Si la IA empieza primero
        if (!this.turnoJugador) {
            setTimeout(() => this.turnoIA(), 1000);
        }
    }

    // Función auxiliar para eliminar cartas del tablero con animación de desaparición
    async eliminarCartaConAnimacion(elemento, nombreCarta, tablero, indice, tipo) {
        if (!elemento) return; // Si no hay elemento, solo actualizar
        
        return new Promise((resolve) => {
            reproducirAnimacionDesaparicion(elemento, nombreCarta, () => {
                // Después de la animación, actualizar la interfaz
                this.actualizarInterfaz();
                resolve();
            });
        });
    }

    repartirCartasIniciales() {
        // Crear mazos completos con todas las cartas
        const mazoCompletoJugador = crearMazoCompleto(this.mazoJugador);
        const mazoCompletoIA = crearMazoCompleto(this.mazoIA);
        
        // Baraja los mazos
        const mazoBarajadoJugador = barajarMazo(mazoCompletoJugador);
        const mazoBarajadoIA = barajarMazo(mazoCompletoIA);
        
        // Inicializar mano inicial (2 tropas, 1 estructura, 1 hechizo)
        this.manoJugador = inicializarManoInicial(this.mazoJugador);
        this.manoIA = inicializarManoInicial(this.mazoIA);
        
        // Guardar las cartas restantes del mazo barajado
        this.cartasRestantesJugador = mazoBarajadoJugador;
        this.cartasRestantesIA = mazoBarajadoIA;
        
        // Decidir quién empieza
        this.turnoJugador = Math.random() < 0.5;
    }

    actualizarInterfaz() {
        // Limpiar las clases de estado
        document.querySelectorAll('.carta').forEach(carta => {
            carta.classList.remove('puede-atacar', 'objetivo-valido', 'ya-ataco');
        });

        // Actualizar el botón de terminar turno
        const btnTerminarTurno = document.getElementById('btn-terminar-turno');
        if (btnTerminarTurno) {
            btnTerminarTurno.disabled = !this.turnoJugador;
            btnTerminarTurno.textContent = this.turnoJugador ? 'Terminar Turno' : 'Turno del Oponente';
        }

        // Actualizar mano del jugador
        const manoDiv = document.querySelector('.mano');
        if (manoDiv) {
            manoDiv.innerHTML = '';
            this.manoJugador.forEach((carta, index) => {
                const cartaDiv = document.createElement('div');
                cartaDiv.className = 'carta';
                cartaDiv.innerHTML = this.crearHTMLCarta(carta);
                cartaDiv.onclick = () => this.seleccionarCarta(carta, index);
                manoDiv.appendChild(cartaDiv);
            });
        }

        // Actualizar tropas en el tablero - NUEVA ESTRUCTURA
        const tropasPropias = document.querySelector('.zona-tropas.propia .fila-tropas');
        const tropasEnemigas = document.querySelector('.zona-tropas.enemiga .fila-tropas');

        // Actualizar tropas del jugador (lado derecho)
        if (tropasPropias) {
            tropasPropias.innerHTML = '';
            for(let i = 0; i < this.tableroJugador.tropas.length; i++) {
                const tropa = this.tableroJugador.tropas[i];
                const cartaDiv = document.createElement('div');
                cartaDiv.className = 'carta';
                if (tropa) {
                    cartaDiv.innerHTML = this.crearHTMLCarta(tropa);
                    if (this.tableroJugador.tropasAtacaron[i]) {
                        cartaDiv.classList.add('ya-ataco');
                    }
                } else {
                    cartaDiv.innerHTML = `Tropa ${i + 1}`;
                }
                tropasPropias.appendChild(cartaDiv);
            }
        }

        // Actualizar tropas de la IA (lado izquierdo)
        if (tropasEnemigas) {
            tropasEnemigas.innerHTML = '';
            for(let i = 0; i < this.tableroIA.tropas.length; i++) {
                const tropa = this.tableroIA.tropas[i];
                const cartaDiv = document.createElement('div');
                cartaDiv.className = 'carta carta-rival';
                if (tropa) {
                    cartaDiv.innerHTML = this.crearHTMLCarta(tropa);
                } else {
                    cartaDiv.innerHTML = `Tropa ${i + 1}`;
                }
                tropasEnemigas.appendChild(cartaDiv);
            }
        }

        // Actualizar estructuras del jugador (lado derecho)
        const estructurasPropias = document.querySelector('.zona-estructuras.propia .fila-estructuras');
        if (estructurasPropias) {
            estructurasPropias.innerHTML = '';
            for(let i = 0; i < this.tableroJugador.estructuras.length; i++) {
                const estructura = this.tableroJugador.estructuras[i];
                const cartaDiv = document.createElement('div');
                cartaDiv.className = 'carta';
                if (estructura) {
                    cartaDiv.innerHTML = this.crearHTMLCarta(estructura);
                } else {
                    cartaDiv.innerHTML = `Estructura ${i + 1}`;
                }
                estructurasPropias.appendChild(cartaDiv);
            }
        }

        // Actualizar estructuras de la IA (lado izquierdo)
        const estructurasEnemigas = document.querySelector('.zona-estructuras.enemiga .fila-estructuras');
        if (estructurasEnemigas) {
            estructurasEnemigas.innerHTML = '';
            for(let i = 0; i < this.tableroIA.estructuras.length; i++) {
                const estructura = this.tableroIA.estructuras[i];
                const cartaDiv = document.createElement('div');
                cartaDiv.className = 'carta carta-rival';
                if (estructura) {
                    cartaDiv.innerHTML = this.crearHTMLCarta(estructura);
                } else {
                    cartaDiv.innerHTML = `Estructura ${i + 1}`;
                }
                estructurasEnemigas.appendChild(cartaDiv);
            }
        }

        // Actualizar vida de los castillos
        const hpJugador = document.getElementById('hp-jugador');
        const hpEnemigo = document.getElementById('hp-enemigo');
        if (hpJugador) hpJugador.textContent = this.tableroJugador.castillo.vida;
        if (hpEnemigo) hpEnemigo.textContent = this.tableroIA.castillo.vida;

        // Actualizar oro de ambos jugadores
        const oroJugadorSpan = document.getElementById('oro-cantidad');
        const oroIASpan = document.getElementById('oro-ia');
        if (oroJugadorSpan) oroJugadorSpan.textContent = this.oroJugador;
        if (oroIASpan) oroIASpan.textContent = this.oroIA;

        // Actualizar indicador de turno
        const turnoDiv = document.querySelector('.turno');
        if (turnoDiv) {
            turnoDiv.textContent = this.turnoJugador ? 'Tu Turno' : 'Turno del Oponente';
        }

        // Hacer las cartas interactivas si es el turno del jugador
        if (this.turnoJugador) {
            this.hacerCartasInteractivas();
        }

        // Guardar el estado del juego en localStorage
        this.guardarEnLocalStorage();

        // Verificar victoria
        if (this.tableroIA.castillo.vida <= 0) {
            alert('¡Has ganado!');
            this.limpiarLocalStorage();
            location.reload();
        } else if (this.tableroJugador.castillo.vida <= 0) {
            alert('Has perdido...');
            this.limpiarLocalStorage();
            location.reload();
        }
    }

    robarCarta(esJugador) {
        const mazo = esJugador ? this.cartasRestantesJugador : this.cartasRestantesIA;
        const mano = esJugador ? this.manoJugador : this.manoIA;
        
        // Verificar límite de cartas en mano
        if (mano.length >= 4) {
            return false;
        }
        
        if (mazo.length > 0) {
            // Contar tipos de cartas en mano
            const conteoMano = {
                tropas: mano.filter(c => c.tipo === 'tropa').length,
                estructuras: mano.filter(c => c.tipo === 'estructura').length,
                hechizos: mano.filter(c => c.tipo === 'hechizo').length
            };
            
            // Proporciones deseadas: 2 tropas, 1 estructura, 1 hechizo
            let tipoDeseado = null;
            
            // Buscar qué tipo falta o tiene menor cantidad
            if (conteoMano.tropas < 2) {
                tipoDeseado = 'tropa';
            } else if (conteoMano.estructuras < 1) {
                tipoDeseado = 'estructura';
            } else if (conteoMano.hechizos < 1) {
                tipoDeseado = 'hechizo';
            } else {
                // Si la mano está balanceada, robar el tipo más escaso en el mazo
                const conteoMazo = {
                    tropas: mazo.filter(c => c.tipo === 'tropa').length,
                    estructuras: mazo.filter(c => c.tipo === 'estructura').length,
                    hechizos: mazo.filter(c => c.tipo === 'hechizo').length
                };
                
                // Elegir el tipo más escaso en el mazo para mantener balance
                if (conteoMazo.tropas > 0 && conteoMazo.estructuras > 0 && conteoMazo.hechizos > 0) {
                    const minimo = Math.min(conteoMazo.tropas, conteoMazo.estructuras, conteoMazo.hechizos);
                    if (conteoMazo.estructuras === minimo) {
                        tipoDeseado = 'estructura';
                    } else if (conteoMazo.hechizos === minimo) {
                        tipoDeseado = 'hechizo';
                    } else {
                        tipoDeseado = 'tropa';
                    }
                } else if (conteoMazo.estructura > 0) {
                    tipoDeseado = 'estructura';
                } else if (conteoMazo.hechizos > 0) {
                    tipoDeseado = 'hechizo';
                } else {
                    tipoDeseado = 'tropa';
                }
            }
            
            // Buscar la carta del tipo deseado en el mazo
            let indiceCartaEncontrada = -1;
            for (let i = 0; i < mazo.length; i++) {
                if (mazo[i].tipo === tipoDeseado) {
                    indiceCartaEncontrada = i;
                    break;
                }
            }
            
            // Si no encontró el tipo deseado, buscar cualquier carta disponible
            if (indiceCartaEncontrada === -1) {
                indiceCartaEncontrada = 0;
            }
            
            const cartaRobada = mazo[indiceCartaEncontrada];
            mazo.splice(indiceCartaEncontrada, 1);
            mano.push(cartaRobada);
            return true;
        }
        return false;
    }

    crearHTMLCarta(carta) {
        if (!carta || typeof carta !== 'object') {
            console.error('Carta inválida:', carta);
            return 'Error: Carta inválida';
        }

        try {
            // Obtener la imagen de la carta
            const rutaImagen = obtenerImagenCarta(carta.nombre);
            let imagenHTML = '';
            
            if (rutaImagen) {
                imagenHTML = `<img src="${rutaImagen}" alt="${carta.nombre}" class="imagen-carta" />`;
            }
            
            // Crear estructura con imagen y overlay de información
            let html = `<div class="contenedor-carta">${imagenHTML}`;
            
            // Información de la carta (visible al hacer hover)
            html += `<div class="info-carta">`;
            html += `<h3>${carta.nombre}</h3>`;
            
            // Mostrar información según el tipo de carta
            if (carta.tipo === 'tropa') {
                // Tropas: mostrar Costo, ATK y DEF
                html += `
                    <p>Costo: ${carta.costo} 🪙</p>
                    <p>ATK: ${carta.ataque} | DEF: ${carta.defensa}</p>
                `;
            } else if (carta.tipo === 'estructura') {
                // Estructuras: mostrar Costo, DEF y Habilidad
                html += `
                    <p>Costo: ${carta.costo} 🪙</p>
                    <p>DEF: ${carta.defensa}</p>
                    <p style="font-size: 0.7em;">${carta.descripcion}</p>
                `;
            } else if (carta.tipo === 'hechizo') {
                // Hechizos: mostrar Costo y Efecto Directo
                html += `
                    <p>Costo: ${carta.costo} 🪙</p>
                    <p style="font-size: 0.7em;">${carta.descripcion}</p>
                `;
            } else {
                // Por defecto: mostrar Costo, ATK y DEF
                html += `
                    <p>Costo: ${carta.costo} 🪙</p>
                    <p>ATK: ${carta.ataque || 0} | DEF: ${carta.defensa || 0}</p>
                `;
            }
            
            html += `</div></div>`;
            
            return html;
        } catch (error) {
            console.error('Error al crear HTML de la carta:', error);
            return 'Error: Carta inválida';
        }
    }

    // ✅ Validar si se puede jugar una carta (límite de copias duplicadas)
    puedJugarCarta(carta, esJugador = true) {
        const tablero = esJugador ? this.tableroJugador : this.tableroIA;
        
        if (carta.tipo === 'tropa') {
            // Contar cuántas copias de esta tropa ya están en juego
            const copiasEnJuego = tablero.tropas.filter(t => t && t.nombre === carta.nombre).length;
            if (copiasEnJuego >= 3) {
                return false;
            }
        } else if (carta.tipo === 'estructura') {
            // Contar cuántas copias de esta estructura ya están en juego
            const copiasEnJuego = tablero.estructuras.filter(e => e && e.nombre === carta.nombre).length;
            if (copiasEnJuego >= 2) {
                return false;
            }
        }
        // Los hechizos no se quedan en juego, se usan y desaparecen, así que no hay límite de copia
        
        return true;
    }

    seleccionarCarta(carta, index) {
        if (!this.turnoJugador) return;

        // Verificar si tiene suficiente oro
        if (carta.costo !== 0 && carta.costo > this.oroJugador) {
            alert('¡No tienes suficiente oro para jugar esta carta!');
            return;
        }

        // Manejar según el tipo de carta
        if (carta.tipo === 'tropa') {
            // Validar límite de copias duplicadas (máx 3)
            if (!this.puedJugarCarta(carta, true)) {
                alert(`¡Ya tienes 3 copias de "${carta.nombre}" en juego! No puedes jugar más.`);
                return;
            }
            
            // Jugar tropa en el tablero
            for (let i = 0; i < this.tableroJugador.tropas.length; i++) {
                if (!this.tableroJugador.tropas[i]) {
                    this.tableroJugador.tropas[i] = carta;
                    this.manoJugador.splice(index, 1);
                    this.oroJugador -= carta.costo;
                    if (this.manoJugador.length < 4) {
                        this.robarCarta(true);
                    }
                    
                    const indiceColocado = i; // Capturar el índice correctamente
                    const nombreCarta = carta.nombre;
                    
                    console.log(`[JUEGO] Colocando tropa con nombre: "${nombreCarta}" (tipo: ${typeof nombreCarta}, longitud: ${nombreCarta.length})`);
                    
                    // Actualizar interfaz y luego mostrar animación de entrada
                    this.actualizarInterfaz();
                    
                    // Mostrar animación de entrada después de renderizar
                    setTimeout(() => {
                        console.log(`[ENTRADA] Buscando elemento de tropa en índice ${indiceColocado}`);
                        const tropaElement = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta')[indiceColocado];
                        console.log(`[ENTRADA] Elemento encontrado:`, tropaElement);
                        
                        if (tropaElement) {
                            console.log(`[ENTRADA] Iniciando animación de entrada para: ${nombreCarta}`);
                            reproducirAnimacionEntrada(tropaElement, nombreCarta, () => {
                                console.log(`[ENTRADA] Animación de entrada completada para ${nombreCarta}`);
                            });
                        } else {
                            console.error(`[ENTRADA] No se encontró el elemento de tropa en índice ${indiceColocado}`);
                        }
                    }, 50);
                    
                    return;
                }
            }
            alert('¡No hay espacio para jugar más tropas!');
        } else if (carta.tipo === 'estructura') {
            // Validar límite de copias duplicadas (máx 2)
            if (!this.puedJugarCarta(carta, true)) {
                alert(`¡Ya tienes 2 copias de "${carta.nombre}" en juego! No puedes jugar más.`);
                return;
            }
            
            // Jugar estructura en el tablero
            for (let i = 0; i < this.tableroJugador.estructuras.length; i++) {
                if (!this.tableroJugador.estructuras[i]) {
                    this.tableroJugador.estructuras[i] = carta;
                    this.manoJugador.splice(index, 1);
                    this.oroJugador -= carta.costo;
                    
                    // Ejecutar efecto de la estructura
                    this.ejecutarEfectoEstructura(carta, true);
                    
                    if (this.manoJugador.length < 4) {
                        this.robarCarta(true);
                    }
                    
                    const indiceColocado = i; // Capturar el índice correctamente
                    const nombreCarta = carta.nombre;
                    
                    console.log(`[JUEGO] Colocando estructura con nombre: "${nombreCarta}" (tipo: ${typeof nombreCarta}, longitud: ${nombreCarta.length})`);
                    
                    // Actualizar interfaz y luego mostrar animación de entrada
                    this.actualizarInterfaz();
                    
                    // Mostrar animación de entrada después de renderizar
                    setTimeout(() => {
                        console.log(`[ENTRADA] Buscando elemento de estructura en índice ${indiceColocado}`);
                        const estructuraElement = document.querySelectorAll('.zona-estructuras.propia .fila-estructuras .carta')[indiceColocado];
                        console.log(`[ENTRADA] Elemento encontrado:`, estructuraElement);
                        
                        if (estructuraElement) {
                            console.log(`[ENTRADA] Iniciando animación de entrada para: ${nombreCarta}`);
                            reproducirAnimacionEntrada(estructuraElement, nombreCarta, () => {
                                console.log(`[ENTRADA] Animación de entrada completada para ${nombreCarta}`);
                            });
                        } else {
                            console.error(`[ENTRADA] No se encontró el elemento de estructura en índice ${indiceColocado}`);
                        }
                    }, 50);
                    
                    return;
                }
            }
            alert('¡No hay espacio para jugar más estructuras!');
        } else if (carta.tipo === 'hechizo') {
            // Los hechizos requieren seleccionar un objetivo
            this.seleccionarObjetivoParaHechizo(carta, index);
        }
    }

    seleccionarObjetivoParaHechizo(hechizo, index) {
        // Limpiar selecciones anteriores
        this.limpiarObjetivos();
        
        // Guardar el hechizo seleccionado
        this.hechizoSeleccionado = { hechizo, index };
        
        console.log(`🪄 Hechizo seleccionado: ${hechizo.nombre} - Selecciona un objetivo`);
        
        // Resaltar el hechizo en la mano
        const cartasEnMano = document.querySelectorAll('.panel-mano .carta');
        cartasEnMano[index].classList.add('hechizo-seleccionado');
        
        // Determinar si es hechizo ofensivo o defensivo
        const esOfensivo = hechizo.nombre.includes('Tormenta') || hechizo.nombre.includes('Martillo') || 
                          hechizo.nombre.includes('Destello') || hechizo.nombre.includes('Explosión') ||
                          hechizo.nombre.includes('Renacer') || hechizo.nombre.includes('Descarga');
        
        const esDefensivo = hechizo.nombre.includes('Bendición') || hechizo.nombre.includes('Blindaje') || 
                           hechizo.nombre.includes('Escudo') || hechizo.nombre.includes('Refuerzo');
        
        // Hechizos de efecto especial de área
        const esEfectoArea = hechizo.nombre === 'Explosión de Forja' || hechizo.nombre === 'Renacer Dorado';
        
        if (esOfensivo) {
            if (esEfectoArea) {
                // Para hechizos de área, aplicar sin seleccionar objetivo
                this.aplicarHechizo(-1, 'area', 'enemigo');
            } else {
                // Hacer las tropas enemigas objetivos válidos
                const tropasEnemigas = document.querySelectorAll('.zona-tropas.enemiga .fila-tropas .carta');
                Array.from(tropasEnemigas).forEach((tropa, tropaIndex) => {
                    if (this.tableroIA.tropas[tropaIndex]) {
                        tropa.classList.add('objetivo-valido');
                        tropa.style.cursor = 'pointer';
                        tropa.onclick = (e) => {
                            e.stopPropagation();
                            this.aplicarHechizo(tropaIndex, 'tropa', 'enemigo');
                        };
                    }
                });
                
                // Hacer las estructuras enemigas objetivos válidos
                const estructurasEnemigas = document.querySelectorAll('.zona-estructuras.enemiga .fila-estructuras .carta');
                Array.from(estructurasEnemigas).forEach((estructura, estructuraIndex) => {
                    if (this.tableroIA.estructuras[estructuraIndex]) {
                        estructura.classList.add('objetivo-valido');
                        estructura.style.cursor = 'pointer';
                        estructura.onclick = (e) => {
                            e.stopPropagation();
                            this.aplicarHechizo(estructuraIndex, 'estructura', 'enemigo');
                        };
                    }
                });
            }
        }
        
        if (esDefensivo) {
            // Hacer las tropas propias objetivos válidos
            const tropasPropias = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta');
            Array.from(tropasPropias).forEach((tropa, tropaIndex) => {
                if (this.tableroJugador.tropas[tropaIndex]) {
                    tropa.classList.add('objetivo-valido');
                    tropa.style.cursor = 'pointer';
                    tropa.onclick = (e) => {
                        e.stopPropagation();
                        this.aplicarHechizo(tropaIndex, 'tropa', 'propio');
                    };
                }
            });
            
            // Hacer las estructuras propias objetivos válidos
            const estructurasPropias = document.querySelectorAll('.zona-estructuras.propia .fila-estructuras .carta');
            Array.from(estructurasPropias).forEach((estructura, estructuraIndex) => {
                if (this.tableroJugador.estructuras[estructuraIndex]) {
                    estructura.classList.add('objetivo-valido');
                    estructura.style.cursor = 'pointer';
                    estructura.onclick = (e) => {
                        e.stopPropagation();
                        this.aplicarHechizo(estructuraIndex, 'estructura', 'propio');
                    };
                }
            });
        }
        
        // Hacer el castillo propio un objetivo válido para hechizos defensivos
        if (esDefensivo) {
            const castilloPropio = document.querySelector('.castillo.propio');
            castilloPropio.classList.add('objetivo-valido');
            castilloPropio.style.cursor = 'pointer';
            castilloPropio.onclick = (e) => {
                e.stopPropagation();
                this.aplicarHechizo(-1, 'castillo', 'propio');
            };
        }
    }

    aplicarHechizo(indiceObjetivo, tipoObjetivo, tipoEnemigo) {
        if (!this.hechizoSeleccionado) return;
        
        const { hechizo, index } = this.hechizoSeleccionado;
        
        console.log(`Aplicando hechizo: ${hechizo.nombre} a objetivo de tipo ${tipoObjetivo} (${tipoEnemigo})`);
        
        // Sistema de efectos específicos por nombre de carta
        this.ejecutarEfectoHechizo(hechizo, indiceObjetivo, tipoObjetivo, tipoEnemigo, true);
        
        // Aplicar efecto visual de resplandor
        this.aplicarEfectoVisualHechizo(indiceObjetivo, tipoObjetivo, tipoEnemigo, hechizo);
        
        // Mostrar mensaje de confirmación
        let mensajeEfecto = `✨ ${hechizo.nombre}`;
        let nombreObjetivo = '';
        
        if (tipoEnemigo === 'enemigo') {
            if (tipoObjetivo === 'tropa' && this.tableroIA.tropas[indiceObjetivo]) {
                nombreObjetivo = this.tableroIA.tropas[indiceObjetivo].nombre;
            } else if (tipoObjetivo === 'estructura' && this.tableroIA.estructuras[indiceObjetivo]) {
                nombreObjetivo = this.tableroIA.estructuras[indiceObjetivo].nombre;
            }
        } else {
            if (tipoObjetivo === 'tropa' && this.tableroJugador.tropas[indiceObjetivo]) {
                nombreObjetivo = this.tableroJugador.tropas[indiceObjetivo].nombre;
            } else if (tipoObjetivo === 'estructura' && this.tableroJugador.estructuras[indiceObjetivo]) {
                nombreObjetivo = this.tableroJugador.estructuras[indiceObjetivo].nombre;
            } else if (tipoObjetivo === 'castillo') {
                nombreObjetivo = 'tu castillo';
            }
        }
        
        if (nombreObjetivo) {
            mensajeEfecto += ` se aplicó a ${nombreObjetivo}`;
        }
        console.log(mensajeEfecto);
        
        // Descontar el oro y remover el hechizo de la mano
        this.oroJugador -= hechizo.costo;
        this.manoJugador.splice(index, 1);
        
        // Robar una nueva carta si no excede el límite
        if (this.manoJugador.length < 4) {
            this.robarCarta(true);
        }
        
        // Limpiar la selección
        this.limpiarObjetivos();
        this.hechizoSeleccionado = null;
        
        this.actualizarInterfaz();
    }

    aplicarEfectoVisualHechizo(indiceObjetivo, tipoObjetivo, tipoEnemigo, hechizo) {
        let elemento = null;
        let colorClase = 'hechizo-aureo'; // Default

        // Determinar el color según el tipo de hechizo
        if (hechizo.nombre.includes('Luz') || hechizo.nombre.includes('Aurora') || hechizo.nombre.includes('Alba')) {
            colorClase = 'hechizo-aureo'; // Dorado para Aurelion
        } else if (hechizo.nombre.includes('Tormenta') || hechizo.nombre.includes('Destello') || hechizo.nombre.includes('Escudo')) {
            colorClase = 'hechizo-cian'; // Cian para hechizos de defensa
        } else if (hechizo.nombre.includes('Martillo') || hechizo.nombre.includes('Explosión') || hechizo.nombre.includes('Ardiente')) {
            colorClase = 'hechizo-rojo'; // Rojo para Valgor (ataque)
        } else if (hechizo.nombre.includes('Blindaje') || hechizo.nombre.includes('Refuerzo')) {
            colorClase = 'hechizo-verde'; // Verde para defensa
        } else if (hechizo.nombre.includes('Descarga') || hechizo.nombre.includes('Eléctrica')) {
            colorClase = 'hechizo-magenta'; // Magenta para efectos eléctricos
        }

        // Encontrar el elemento y aplicar la animación
        if (tipoObjetivo === 'tropa') {
            const selector = tipoEnemigo === 'enemigo' ? '.zona-tropas.enemiga .fila-tropas .carta' : '.zona-tropas.propia .fila-tropas .carta';
            const tropas = document.querySelectorAll(selector);
            elemento = tropas[indiceObjetivo];
        } else if (tipoObjetivo === 'estructura') {
            const selector = tipoEnemigo === 'enemigo' ? '.zona-estructuras.enemiga .fila-estructuras .carta' : '.zona-estructuras.propia .fila-estructuras .carta';
            const estructuras = document.querySelectorAll(selector);
            elemento = estructuras[indiceObjetivo];
        } else if (tipoObjetivo === 'castillo') {
            elemento = document.querySelector('.castillo.propio');
        }

        if (elemento) {
            // Agregar la clase de animación
            elemento.classList.add(colorClase);
            
            // Remover la clase después de la animación para poder reutilizarla
            setTimeout(() => {
                elemento.classList.remove(colorClase);
            }, 800);
        }
    }

    ejecutarEfectoHechizo(hechizo, indiceObjetivo, tipoObjetivo, tipoEnemigo, esJugador) {
        const tableroPropio = esJugador ? this.tableroJugador : this.tableroIA;
        const tableroEnemigo = esJugador ? this.tableroIA : this.tableroJugador;
        
        // Si el tipo enemigo es 'propio', intercambiamos los tableros
        let tableroObjetivo = tipoEnemigo === 'enemigo' ? tableroEnemigo : tableroPropio;

        switch(hechizo.nombre) {
            // AURELION - HECHIZOS
            case "Bendición Solar":
                if (tipoObjetivo === 'tropa' && tableroObjetivo.tropas[indiceObjetivo]) {
                    tableroObjetivo.tropas[indiceObjetivo].defensa += 2;
                    console.log(`✨ Bendición Solar: +2 DEF a ${tableroObjetivo.tropas[indiceObjetivo].nombre}`);
                } else if (tipoObjetivo === 'estructura' && tableroObjetivo.estructuras[indiceObjetivo]) {
                    tableroObjetivo.estructuras[indiceObjetivo].defensa += 2;
                    console.log(`✨ Bendición Solar: +2 DEF a estructura`);
                } else if (tipoObjetivo === 'castillo') {
                    tableroObjetivo.castillo.vida += 2;
                    console.log(`✨ Bendición Solar: +2 vida al castillo`);
                }
                break;

            case "Tormenta de Luz":
                if (tipoObjetivo === 'tropa' && tableroObjetivo.tropas[indiceObjetivo]) {
                    tableroObjetivo.tropas[indiceObjetivo].defensa -= 2;
                    console.log(`⚡ Tormenta de Luz: -2 DEF a ${tableroObjetivo.tropas[indiceObjetivo].nombre}`);
                }
                break;

            case "Escudo de Luz":
                if (tipoObjetivo === 'castillo') {
                    tableroObjetivo.castillo.vida += 2;
                    console.log(`🛡️ Escudo de Luz: +2 vida al castillo`);
                }
                break;

            case "Destello Solar":
                if (tipoObjetivo === 'tropa' && tableroObjetivo.tropas[indiceObjetivo]) {
                    tableroObjetivo.tropas[indiceObjetivo].defensa -= 3;
                    console.log(`✨ Destello Solar: -3 DEF a ${tableroObjetivo.tropas[indiceObjetivo].nombre}`);
                }
                break;

            case "Renacer Dorado":
                // Aumenta ataque a TODAS las tropas propias
                if (tipoObjetivo === 'area') {
                    for (let i = 0; i < tableroPropio.tropas.length; i++) {
                        if (tableroPropio.tropas[i]) {
                            tableroPropio.tropas[i].ataque += 1;
                        }
                    }
                    console.log(`📣 Renacer Dorado: +1 ATK a todas tus tropas`);
                }
                break;

            // VALGOR - HECHIZOS
            case "Martillo Ardiente":
                if (tipoObjetivo === 'tropa' && tableroObjetivo.tropas[indiceObjetivo]) {
                    tableroObjetivo.tropas[indiceObjetivo].defensa -= 3;
                    console.log(`🔨 Martillo Ardiente: -3 DEF a ${tableroObjetivo.tropas[indiceObjetivo].nombre}`);
                }
                break;

            case "Blindaje":
                if (tipoObjetivo === 'tropa' && tableroObjetivo.tropas[indiceObjetivo]) {
                    tableroObjetivo.tropas[indiceObjetivo].defensa += 2;
                    console.log(`⚙️ Blindaje: +2 DEF a ${tableroObjetivo.tropas[indiceObjetivo].nombre}`);
                }
                break;

            case "Explosión de Forja":
                // Reduce defensa a TODAS las tropas enemigas
                if (tipoObjetivo === 'area') {
                    for (let i = 0; i < tableroEnemigo.tropas.length; i++) {
                        if (tableroEnemigo.tropas[i]) {
                            tableroEnemigo.tropas[i].defensa -= 2;
                        }
                    }
                    console.log(`💥 Explosión de Forja: -2 DEF a todas las tropas enemigas`);
                }
                break;

            case "Refuerzo Mecánico":
                if (tipoObjetivo === 'estructura' && tableroObjetivo.estructuras[indiceObjetivo]) {
                    tableroObjetivo.estructuras[indiceObjetivo].defensa += 2;
                    console.log(`⚙️ Refuerzo Mecánico: +2 DEF a estructura`);
                }
                break;

            default:
                console.warn(`Efecto no definido para: ${hechizo.nombre}`);
        }
    }

    ejecutarEfectoEstructura(estructura, esJugador) {
        const tableroPropio = esJugador ? this.tableroJugador : this.tableroIA;
        const tableroEnemigo = esJugador ? this.tableroIA : this.tableroJugador;

        switch(estructura.nombre) {
            // AURELION - ESTRUCTURAS
            case "Muralla de Luz":
                // Aumenta +1 defensa a todas las tropas propias
                for (let i = 0; i < tableroPropio.tropas.length; i++) {
                    if (tableroPropio.tropas[i]) {
                        tableroPropio.tropas[i].defensa += 1;
                    }
                }
                console.log(`🏰 Muralla de Luz: +1 DEF a todas tus tropas`);
                break;

            case "Templo del Sol Eterno":
                // Aumenta +1 defensa al castillo
                tableroPropio.castillo.vida += 1;
                console.log(`⛪ Templo del Sol Eterno: +1 DEF al castillo`);
                break;

            case "Torre del Amanecer":
                // Aumenta +1 ataque a una tropa (elegida al azar)
                const tropasDisponibles = tableroPropio.tropas.filter(t => t !== null);
                if (tropasDisponibles.length > 0) {
                    const tropaRandom = tropasDisponibles[Math.floor(Math.random() * tropasDisponibles.length)];
                    tropaRandom.ataque += 1;
                    console.log(`🗼 Torre del Amanecer: +1 ATK a ${tropaRandom.nombre}`);
                }
                break;

            case "Faro de Brillo":
                // Reduce -1 defensa a una tropa enemiga (la más fuerte)
                let maxAtaque = -1;
                let indiceMax = -1;
                for (let i = 0; i < tableroEnemigo.tropas.length; i++) {
                    if (tableroEnemigo.tropas[i] && tableroEnemigo.tropas[i].ataque > maxAtaque) {
                        maxAtaque = tableroEnemigo.tropas[i].ataque;
                        indiceMax = i;
                    }
                }
                if (indiceMax !== -1) {
                    tableroEnemigo.tropas[indiceMax].defensa -= 1;
                    console.log(`💡 Faro de Brillo: -1 DEF a ${tableroEnemigo.tropas[indiceMax].nombre}`);
                }
                break;

            case "Santuario del Alba":
                // Aumenta +1 defensa a una tropa propia (la más débil)
                let minDefensa = Infinity;
                let indiceMin = -1;
                for (let i = 0; i < tableroPropio.tropas.length; i++) {
                    if (tableroPropio.tropas[i] && tableroPropio.tropas[i].defensa < minDefensa) {
                        minDefensa = tableroPropio.tropas[i].defensa;
                        indiceMin = i;
                    }
                }
                if (indiceMin !== -1) {
                    tableroPropio.tropas[indiceMin].defensa += 1;
                    console.log(`⛩️ Santuario del Alba: +1 DEF a ${tableroPropio.tropas[indiceMin].nombre}`);
                }
                break;

            // VALGOR - ESTRUCTURAS
            case "Muralla de Acero":
                // Aumenta +1 defensa a todas las tropas propias
                for (let i = 0; i < tableroPropio.tropas.length; i++) {
                    if (tableroPropio.tropas[i]) {
                        tableroPropio.tropas[i].defensa += 1;
                    }
                }
                console.log(`🏰 Muralla de Acero: +1 DEF a todas tus tropas`);
                break;

            case "Fortaleza del Martillo":
                // Aumenta +1 ataque a todas las tropas propias
                for (let i = 0; i < tableroPropio.tropas.length; i++) {
                    if (tableroPropio.tropas[i]) {
                        tableroPropio.tropas[i].ataque += 1;
                    }
                }
                console.log(`🏰 Fortaleza del Martillo: +1 ATK a todas tus tropas`);
                break;

            case "Pilar del Vapor":
                // Reduce -1 defensa a una tropa enemiga (al azar)
                const tropasEnemigas = tableroEnemigo.tropas.filter(t => t !== null);
                if (tropasEnemigas.length > 0) {
                    const tropaEnemiga = tropasEnemigas[Math.floor(Math.random() * tropasEnemigas.length)];
                    tropaEnemiga.defensa -= 1;
                    console.log(`💨 Pilar del Vapor: -1 DEF a ${tropaEnemiga.nombre}`);
                }
                break;

            case "Foso de Engranajes":
                // Reduce -1 ataque a una tropa enemiga (al azar)
                const tropasEnemigas2 = tableroEnemigo.tropas.filter(t => t !== null);
                if (tropasEnemigas2.length > 0) {
                    const tropaEnemiga2 = tropasEnemigas2[Math.floor(Math.random() * tropasEnemigas2.length)];
                    tropaEnemiga2.ataque -= 1;
                    console.log(`⚙️ Foso de Engranajes: -1 ATK a ${tropaEnemiga2.nombre}`);
                }
                break;

            case "Bastión de Hierro":
                // Aumenta +2 defensa a todas las estructuras propias
                for (let i = 0; i < tableroPropio.estructuras.length; i++) {
                    if (tableroPropio.estructuras[i]) {
                        tableroPropio.estructuras[i].defensa += 2;
                    }
                }
                console.log(`🏰 Bastión de Hierro: +2 DEF a todas tus estructuras`);
                break;

            default:
                console.warn(`Efecto no definido para estructura: ${estructura.nombre}`);
        }
    }

// Función para el turno de la IA
    turnoIA() {
        if (this.manoIA.length === 0) {
            this.intentarAtaqueIAUnico();
            this.finalizarTurno();
            return;
        }

        // Buscar cartas que podamos pagar
        let cartasJugables = [];
        
        for (let i = 0; i < this.manoIA.length; i++) {
            const carta = this.manoIA[i];
            if (carta.costo <= this.oroIA) {
                cartasJugables.push({ carta, indice: i });
            }
        }

        // Elegir una carta al azar entre las que podemos pagar (40% de probabilidad de elegir la más cara - REDUCIDO)
        let cartaJugable = null;
        let indiceCarta = -1;

        if (cartasJugables.length > 0) {
            if (Math.random() < 0.4) {
                // Elegir la carta más cara (menos probable ahora)
                cartasJugables.sort((a, b) => b.carta.costo - a.carta.costo);
                cartaJugable = cartasJugables[0].carta;
                indiceCarta = cartasJugables[0].indice;
            } else {
                // Elegir una carta al azar (más probable)
                const randomIndex = Math.floor(Math.random() * cartasJugables.length);
                cartaJugable = cartasJugables[randomIndex].carta;
                indiceCarta = cartasJugables[randomIndex].indice;
            }
        }

        if (!cartaJugable) {
            this.intentarAtaqueIAUnico();
            this.finalizarTurno();
            return;
        }

        // Manejar según el tipo de carta
        if (cartaJugable.tipo === 'tropa') {
            // Validar límite de copias duplicadas (máx 3)
            if (!this.puedJugarCarta(cartaJugable, false)) {
                // Si no puede jugar esta tropa, intenta con hechizo o estructura
                this.manoIA.splice(indiceCarta, 1); // Descartar esta carta
                setTimeout(() => this.turnoIA(), 500);
                return;
            }
            
            // Jugar tropa
            for (let i = 0; i < this.tableroIA.tropas.length; i++) {
                if (!this.tableroIA.tropas[i]) {
                    this.tableroIA.tropas[i] = cartaJugable;
                    this.manoIA.splice(indiceCarta, 1);
                    this.oroIA -= cartaJugable.costo;
                    if (this.manoIA.length < 4) {
                        this.robarCarta(false);
                    }
                    break;
                }
            }
        } else if (cartaJugable.tipo === 'estructura') {
            // Validar límite de copias duplicadas (máx 2)
            if (!this.puedJugarCarta(cartaJugable, false)) {
                // Si no puede jugar esta estructura, intenta con otra carta
                this.manoIA.splice(indiceCarta, 1); // Descartar esta carta
                setTimeout(() => this.turnoIA(), 500);
                return;
            }
            
            // Jugar estructura
            for (let i = 0; i < this.tableroIA.estructuras.length; i++) {
                if (!this.tableroIA.estructuras[i]) {
                    this.tableroIA.estructuras[i] = cartaJugable;
                    this.manoIA.splice(indiceCarta, 1);
                    this.oroIA -= cartaJugable.costo;
                    
                    // Ejecutar efecto de la estructura
                    this.ejecutarEfectoEstructura(cartaJugable, false);
                    
                    if (this.manoIA.length < 4) {
                        this.robarCarta(false);
                    }
                    break;
                }
            }
        } else if (cartaJugable.tipo === 'hechizo') {
            // IA aplica hechizo - lógica simple de elección de objetivo
            this.aplicarHechizoIA(cartaJugable, indiceCarta);
        }

        // Intentar atacar con UNA SOLA tropa
        this.actualizarInterfaz();
        this.intentarAtaqueIAUnico();
        this.actualizarInterfaz();
        this.finalizarTurno();
    }

    mostrarNotificacion(mensaje, tipo = 'ofensivo') {
        const container = document.getElementById('notificaciones-container');
        if (!container) return;

        const notificacion = document.createElement('div');
        notificacion.className = `notificacion-hechizo ${tipo}`;
        notificacion.textContent = mensaje;
        
        container.appendChild(notificacion);

        // Animar entrada
        setTimeout(() => {
            notificacion.style.opacity = '1';
        }, 10);

        // Remover después de 3 segundos
        setTimeout(() => {
            notificacion.classList.add('salir');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }

    aplicarHechizoIA(hechizo, index) {
        // Lógica para que la IA use hechizos - IA más débil
        
        // 50% de probabilidad de que la IA NO use hechizos ofensivos (para no ser tan agresiva)
        if (hechizo.nombre.includes('Tormenta') || hechizo.nombre.includes('Martillo') || 
            hechizo.nombre.includes('Destello') || hechizo.nombre.includes('Descarga') || 
            hechizo.nombre.includes('Explosión') || hechizo.nombre.includes('Renacer')) {
            
            // 50% de probabilidad de descartar el hechizo ofensivo
            if (Math.random() < 0.5) {
                console.log(`🛡️ [IA] Descartó ${hechizo.nombre} (demasiado costoso)`);
                this.oroIA -= hechizo.costo;
                this.manoIA.splice(index, 1);
                if (this.manoIA.length < 4) {
                    this.robarCarta(false);
                }
                return;
            }
            
            if (hechizo.nombre === 'Explosión de Forja' || hechizo.nombre === 'Renacer Dorado') {
                // Afecta a todas las tropas, sin necesidad de seleccionar objetivo
                this.ejecutarEfectoHechizo(hechizo, -1, 'area', 'enemigo', false);
                this.mostrarNotificacion(`⚔️ ${hechizo.nombre} se aplicó`, 'ofensivo');
                console.log(`⚔️ [IA] ${hechizo.nombre} se aplicó`);
            } else {
                // Buscar tropa enemiga con MENOS defensa (menos óptima)
                let menorDefensa = Infinity;
                let indiceObjetivo = -1;
                for (let i = 0; i < this.tableroJugador.tropas.length; i++) {
                    if (this.tableroJugador.tropas[i] && this.tableroJugador.tropas[i].defensa < menorDefensa) {
                        menorDefensa = this.tableroJugador.tropas[i].defensa;
                        indiceObjetivo = i;
                    }
                }
                if (indiceObjetivo !== -1) {
                    this.ejecutarEfectoHechizo(hechizo, indiceObjetivo, 'tropa', 'enemigo', false);
                    const nombreTropa = this.tableroJugador.tropas[indiceObjetivo].nombre;
                    this.mostrarNotificacion(`⚔️ ${hechizo.nombre} se aplicó a ${nombreTropa}`, 'ofensivo');
                    console.log(`⚔️ [IA] ${hechizo.nombre} se aplicó a tu ${nombreTropa}`);
                }
            }
        } else if (hechizo.nombre.includes('Bendición') || hechizo.nombre.includes('Blindaje') || 
                   hechizo.nombre.includes('Escudo') || hechizo.nombre.includes('Refuerzo')) {
            
            // Hechizos de defensa - aplicar a tropa propia más débil
            let menorDefensa = Infinity;
            let indiceObjetivo = -1;
            
            for (let i = 0; i < this.tableroIA.tropas.length; i++) {
                if (this.tableroIA.tropas[i] && this.tableroIA.tropas[i].defensa < menorDefensa) {
                    menorDefensa = this.tableroIA.tropas[i].defensa;
                    indiceObjetivo = i;
                }
            }
            
            if (indiceObjetivo !== -1) {
                this.ejecutarEfectoHechizo(hechizo, indiceObjetivo, 'tropa', 'propio', false);
                const nombreTropa = this.tableroIA.tropas[indiceObjetivo].nombre;
                this.mostrarNotificacion(`🛡️ ${hechizo.nombre} se aplicó a ${nombreTropa}`, 'defensivo');
                console.log(`🛡️ [IA] ${hechizo.nombre} se aplicó a su ${nombreTropa}`);
            }
        }
        
        // Descontar oro
        this.oroIA -= hechizo.costo;
        this.manoIA.splice(index, 1);
        
        if (this.manoIA.length < 4) {
            this.robarCarta(false);
        }
    }

    // Función para finalizar el turno
    finalizarTurno() {
        // Fase de Fin
        // 1. Descartar efectos temporales (por implementar)
        // 2. Destruir unidades con 0 DEF
        const tablero = this.turnoJugador ? this.tableroJugador : this.tableroIA;
        
        for (let i = 0; i < tablero.tropas.length; i++) {
            if (tablero.tropas[i] && tablero.tropas[i].defensa <= 0) {
                tablero.tropas[i] = null;
            }
        }
        
        // 3. Robar una carta
        this.robarCarta(this.turnoJugador);
        
        // Cambiar el turno
        this.turnoJugador = !this.turnoJugador;

        // Inicio del nuevo turno
        // 1. Fase de Oro
        if (this.turnoJugador) {
            this.oroJugador = Math.min(this.oroJugador + 3, 10); // Máximo 10 de oro
            // TODO: Añadir oro de recursos
        } else {
            this.oroIA = Math.min(this.oroIA + 3, 10);
            setTimeout(() => this.turnoIA(), 1000);
        }

        // 2. Fase de Acción - Reiniciar estado de tropas
        const nuevoTablero = this.turnoJugador ? this.tableroJugador : this.tableroIA;
        nuevoTablero.tropasAtacaron.fill(false);

        this.actualizarInterfaz();
    }

    limpiarObjetivos() {
        // Limpiar objetivos válidos anteriores
        document.querySelectorAll('.objetivo-valido').forEach(elemento => {
            elemento.classList.remove('objetivo-valido');
            elemento.onclick = null;
            elemento.style.cursor = '';
        });
        
        // Limpiar hechizo seleccionado visualmente
        document.querySelectorAll('.hechizo-seleccionado').forEach(elemento => {
            elemento.classList.remove('hechizo-seleccionado');
        });
    }

    atacar(indiceAtacante, indiceObjetivo) {
        if (!this.turnoJugador) return; // Solo el jugador puede atacar manualmente

        // Limpiar objetivos antes de atacar
        this.limpiarObjetivos();

        const atacante = this.tableroJugador.tropas[indiceAtacante];
        if (!atacante || this.tableroJugador.tropasAtacaron[indiceAtacante]) return;

        // Buscar objetivo válido
        const tropasEnemigas = this.tableroIA.tropas.filter(tropa => tropa !== null);
        
        if (indiceObjetivo === -1) {
            // Atacar al castillo
            console.log(`${atacante.nombre} ataca al castillo enemigo`);
            console.log(`Daño al castillo: ${atacante.ataque}`);
            this.tableroIA.castillo.vida -= atacante.ataque;
            this.tableroJugador.tropasAtacaron[indiceAtacante] = true;
        } else if (tropasEnemigas.length > 0) {
            // Atacar a una tropa
            const objetivo = this.tableroIA.tropas[indiceObjetivo];
            if (!objetivo) return;
            this.resolverCombate(atacante, objetivo, indiceAtacante, indiceObjetivo);
        }

        this.actualizarInterfaz();
    }

    atacarEstructura(indiceAtacante, indiceEstructura) {
        if (!this.turnoJugador) return; // Solo el jugador puede atacar manualmente

        // Limpiar objetivos antes de atacar
        this.limpiarObjetivos();

        const atacante = this.tableroJugador.tropas[indiceAtacante];
        const estructura = this.tableroIA.estructuras[indiceEstructura];

        if (!atacante || !estructura || this.tableroJugador.tropasAtacaron[indiceAtacante]) return;

        console.log(`${atacante.nombre} (ATK:${atacante.ataque}/DEF:${atacante.defensa}) ataca estructura ${estructura.nombre} (DEF:${estructura.defensa})`);
        
        // Aplicar daño a la estructura
        estructura.defensa -= atacante.ataque;
        console.log(`Daño infligido a ${estructura.nombre}: ${atacante.ataque} (DEF restante: ${estructura.defensa})`);
        
        // Contraataque si la estructura sobrevive
        if (estructura.defensa > 0) {
            console.log(`${estructura.nombre} contraataca`);
            atacante.defensa -= estructura.defensa;
            console.log(`Daño de contraataque a ${atacante.nombre}: ${estructura.defensa} (DEF restante: ${atacante.defensa})`);
        }

        // Marcar que la tropa atacó
        this.tableroJugador.tropasAtacaron[indiceAtacante] = true;

        // Comprobar si la estructura fue destruida - CON ANIMACIÓN EN PLACEHOLDER
        if (estructura.defensa <= 0) {
            console.log(`${estructura.nombre} ha sido destruida`);
            setTimeout(() => {
                const estructurasEnemigas = document.querySelectorAll('.zona-estructuras.enemiga .fila-estructuras .carta');
                const elementoEstructura = estructurasEnemigas[indiceEstructura];
                
                if (elementoEstructura) {
                    console.log(`[ESTRUCTURA] Reproduciendo animación para estructura enemiga en índice ${indiceEstructura}`);
                    reproducirAnimacionDesaparicion(elementoEstructura, estructura.nombre, () => {
                        console.log(`[ESTRUCTURA] Animación completada, removiendo estructura enemiga`);
                        this.tableroIA.estructuras[indiceEstructura] = null;
                        this.actualizarInterfaz();
                    });
                } else {
                    console.warn(`[ESTRUCTURA] No se encontró elemento visual para la estructura enemiga`);
                    this.tableroIA.estructuras[indiceEstructura] = null;
                    this.actualizarInterfaz();
                }
            }, 50);
        }

        // Comprobar si la tropa atacante fue destruida - CON ANIMACIÓN EN PLACEHOLDER
        if (atacante.defensa <= 0) {
            console.log(`${atacante.nombre} ha sido destruida`);
            setTimeout(() => {
                const tropasPropias = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta');
                const elementoAtacante = tropasPropias[indiceAtacante];
                
                if (elementoAtacante) {
                    console.log(`[ESTRUCTURA] Reproduciendo animación para tropa propia en índice ${indiceAtacante}`);
                    reproducirAnimacionDesaparicion(elementoAtacante, atacante.nombre, () => {
                        console.log(`[ESTRUCTURA] Animación completada, removiendo tropa propia`);
                        this.tableroJugador.tropas[indiceAtacante] = null;
                        this.actualizarInterfaz();
                    });
                } else {
                    console.warn(`[ESTRUCTURA] No se encontró elemento visual para la tropa propia`);
                    this.tableroJugador.tropas[indiceAtacante] = null;
                    this.actualizarInterfaz();
                }
            }, 50);
        }
    }

    resolverCombate(atacante, objetivo, indiceAtacante, indiceObjetivo) {
        console.log(`${atacante.nombre} (ATK:${atacante.ataque}/DEF:${atacante.defensa}) ataca a ${objetivo.nombre} (ATK:${objetivo.ataque}/DEF:${objetivo.defensa})`);
        
        // Aplicar daño al objetivo
        objetivo.defensa -= atacante.ataque;
        console.log(`Daño infligido a ${objetivo.nombre}: ${atacante.ataque} (DEF restante: ${objetivo.defensa})`);
        
        // Contraataque si el objetivo sobrevive
        if (objetivo.defensa > 0) {
            console.log(`${objetivo.nombre} contraataca`);
            atacante.defensa -= objetivo.ataque;
            console.log(`Daño de contraataque a ${atacante.nombre}: ${objetivo.ataque} (DEF restante: ${atacante.defensa})`);
        }

        // Comprobar destrucción de unidades - CON ANIMACIÓN EN PLACEHOLDER
        if (objetivo.defensa <= 0) {
            console.log(`${objetivo.nombre} ha sido destruido`);
            // Reproducir animación de desaparición en el placeholder
            setTimeout(() => {
                const tropasEnemigas = document.querySelectorAll('.zona-tropas.enemiga .fila-tropas .carta');
                const elementoObjetivo = tropasEnemigas[indiceObjetivo];
                
                if (elementoObjetivo) {
                    console.log(`[COMBATE] Reproduciendo animación para carta enemiga en índice ${indiceObjetivo}`);
                    reproducirAnimacionDesaparicion(elementoObjetivo, objetivo.nombre, () => {
                        console.log(`[COMBATE] Animación completada, removiendo carta enemiga`);
                        this.tableroIA.tropas[indiceObjetivo] = null;
                        this.actualizarInterfaz();
                    });
                } else {
                    console.warn(`[COMBATE] No se encontró elemento visual para la carta enemiga`);
                    this.tableroIA.tropas[indiceObjetivo] = null;
                    this.actualizarInterfaz();
                }
            }, 50);
        } else {
            // Si sobrevive, mantener la nueva defensa
            this.tableroIA.tropas[indiceObjetivo].defensa = objetivo.defensa;
            this.actualizarInterfaz();
        }

        if (atacante.defensa <= 0) {
            console.log(`${atacante.nombre} ha sido destruido`);
            // Reproducir animación de desaparición en el placeholder
            setTimeout(() => {
                const tropasPropias = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta');
                const elementoAtacante = tropasPropias[indiceAtacante];
                
                if (elementoAtacante) {
                    console.log(`[COMBATE] Reproduciendo animación para carta propia en índice ${indiceAtacante}`);
                    reproducirAnimacionDesaparicion(elementoAtacante, atacante.nombre, () => {
                        console.log(`[COMBATE] Animación completada, removiendo carta propia`);
                        this.tableroJugador.tropas[indiceAtacante] = null;
                        this.actualizarInterfaz();
                    });
                } else {
                    console.warn(`[COMBATE] No se encontró elemento visual para la carta propia`);
                    this.tableroJugador.tropas[indiceAtacante] = null;
                    this.actualizarInterfaz();
                }
            }, 50);
        } else {
            // Si sobrevive, mantener la nueva defensa
            this.tableroJugador.tropas[indiceAtacante].defensa = atacante.defensa;
            this.actualizarInterfaz();
        }

        // Marcar la unidad como que ya atacó este turno
        if (this.tableroJugador.tropas[indiceAtacante]) {
            this.tableroJugador.tropasAtacaron[indiceAtacante] = true;
        }
    }

    // Método para agregar interactividad a las cartas en el tablero
    hacerCartasInteractivas() {
        // Hacer las tropas del jugador interactivas para atacar
        const tropasPropias = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta');
        Array.from(tropasPropias).forEach((tropa, index) => {
            if (this.tableroJugador.tropas[index] && !this.tableroJugador.tropasAtacaron[index]) {
                tropa.classList.add('puede-atacar');
                tropa.onclick = () => this.seleccionarTropaAtacante(index);
            }
        });
    }

    intentarAtaqueIAUnico() {
        // Buscar una tropa que aún no haya atacado
        let tropaAtacante = null;
        let indiceAtacante = -1;

        for (let i = 0; i < this.tableroIA.tropas.length; i++) {
            if (this.tableroIA.tropas[i] && !this.tableroIA.tropasAtacaron[i]) {
                tropaAtacante = this.tableroIA.tropas[i];
                indiceAtacante = i;
                break;
            }
        }

        if (!tropaAtacante) {
            return; // No hay tropas disponibles para atacar
        }

        // Buscar objetivo válido
        const tropasJugador = this.tableroJugador.tropas.filter(tropa => tropa !== null);
        const estructurasJugador = this.tableroJugador.estructuras.filter(estructura => estructura !== null);
        
        if (tropasJugador.length > 0) {
            // 70% de probabilidad de atacar al AZAR
            let indiceObjetivo = -1;
            
            if (Math.random() < 0.7) {
                // Atacar una tropa al azar
                const tropasValidas = [];
                this.tableroJugador.tropas.forEach((tropa, index) => {
                    if (tropa !== null) {
                        tropasValidas.push(index);
                    }
                });
                
                if (tropasValidas.length > 0) {
                    indiceObjetivo = tropasValidas[Math.floor(Math.random() * tropasValidas.length)];
                }
            } else {
                // 30% de probabilidad: Atacar la tropa con menos defensa
                let menorDefensa = Infinity;
                
                this.tableroJugador.tropas.forEach((tropa, index) => {
                    if (tropa && tropa.defensa < menorDefensa) {
                        menorDefensa = tropa.defensa;
                        indiceObjetivo = index;
                    }
                });
            }

            if (indiceObjetivo !== -1) {
                const objetivo = this.tableroJugador.tropas[indiceObjetivo];
                
                console.log(`IA: ${tropaAtacante.nombre} (ATK:${tropaAtacante.ataque}/DEF:${tropaAtacante.defensa}) ataca a ${objetivo.nombre} (ATK:${objetivo.ataque}/DEF:${objetivo.defensa})`);
                
                // Aplicar daño al objetivo
                objetivo.defensa -= tropaAtacante.ataque;
                console.log(`Daño infligido a ${objetivo.nombre}: ${tropaAtacante.ataque} (DEF restante: ${objetivo.defensa})`);

                // Contraataque si el objetivo sobrevive
                if (objetivo.defensa > 0) {
                    console.log(`${objetivo.nombre} contraataca`);
                    tropaAtacante.defensa -= objetivo.ataque;
                    console.log(`Daño de contraataque a ${tropaAtacante.nombre}: ${objetivo.ataque} (DEF restante: ${tropaAtacante.defensa})`);
                }

                // Comprobar destrucción de unidades - CON ANIMACIÓN EN PLACEHOLDER
                if (objetivo.defensa <= 0) {
                    console.log(`${objetivo.nombre} ha sido destruido`);
                    setTimeout(() => {
                        const tropasPropias = document.querySelectorAll('.zona-tropas.propia .fila-tropas .carta');
                        const elementoObjetivo = tropasPropias[indiceObjetivo];
                        
                        if (elementoObjetivo) {
                            console.log(`[IA-TROPA] Reproduciendo animación para tropa propia en índice ${indiceObjetivo}`);
                            reproducirAnimacionDesaparicion(elementoObjetivo, objetivo.nombre, () => {
                                console.log(`[IA-TROPA] Animación completada, removiendo tropa propia`);
                                this.tableroJugador.tropas[indiceObjetivo] = null;
                                this.actualizarInterfaz();
                            });
                        } else {
                            console.warn(`[IA-TROPA] No se encontró elemento visual para la tropa propia`);
                            this.tableroJugador.tropas[indiceObjetivo] = null;
                            this.actualizarInterfaz();
                        }
                    }, 50);
                } else {
                    this.tableroJugador.tropas[indiceObjetivo].defensa = objetivo.defensa;
                    this.actualizarInterfaz();
                }

                if (tropaAtacante.defensa <= 0) {
                    console.log(`${tropaAtacante.nombre} ha sido destruido`);
                    setTimeout(() => {
                        const tropasEnemigas = document.querySelectorAll('.zona-tropas.enemiga .fila-tropas .carta');
                        const elementoAtacante = tropasEnemigas[indiceAtacante];
                        
                        if (elementoAtacante) {
                            console.log(`[IA-TROPA] Reproduciendo animación para tropa enemiga en índice ${indiceAtacante}`);
                            reproducirAnimacionDesaparicion(elementoAtacante, tropaAtacante.nombre, () => {
                                console.log(`[IA-TROPA] Animación completada, removiendo tropa enemiga`);
                                this.tableroIA.tropas[indiceAtacante] = null;
                                this.actualizarInterfaz();
                            });
                        } else {
                            console.warn(`[IA-TROPA] No se encontró elemento visual para la tropa enemiga`);
                            this.tableroIA.tropas[indiceAtacante] = null;
                            this.actualizarInterfaz();
                        }
                    }, 50);
                } else {
                    this.tableroIA.tropas[indiceAtacante].defensa = tropaAtacante.defensa;
                    this.actualizarInterfaz();
                }
                
                this.tableroIA.tropasAtacaron[indiceAtacante] = true;
            }
        } else if (estructurasJugador.length > 0) {
            // Si no hay tropas pero hay estructuras, 50% de probabilidad de atacar al castillo en su lugar
            let indiceEstructura = -1;
            
            if (Math.random() < 0.5) {
                // 50% de que la IA ignore estructuras y ataque el castillo directamente
                this.tableroJugador.castillo.vida -= tropaAtacante.ataque;
                console.log(`IA: ${tropaAtacante.nombre} ataca el castillo (${tropaAtacante.ataque} daño) [evitó estructura]`);
                this.tableroIA.tropasAtacaron[indiceAtacante] = true;
                return;
            }
            
            // 50% ataque una estructura al azar, 50% la más débil
            if (Math.random() < 0.5) {
                // Atacar una estructura al azar
                const estructurasValidas = [];
                this.tableroJugador.estructuras.forEach((estructura, index) => {
                    if (estructura !== null) {
                        estructurasValidas.push(index);
                    }
                });
                
                if (estructurasValidas.length > 0) {
                    indiceEstructura = estructurasValidas[Math.floor(Math.random() * estructurasValidas.length)];
                }
            } else {
                // Atacar la estructura con menos defensa
                let menorDefensa = Infinity;
                
                this.tableroJugador.estructuras.forEach((estructura, index) => {
                    if (estructura && estructura.defensa < menorDefensa) {
                        menorDefensa = estructura.defensa;
                        indiceEstructura = index;
                    }
                });
            }

            if (indiceEstructura !== -1) {
                const estructura = this.tableroJugador.estructuras[indiceEstructura];
                
                console.log(`IA: ${tropaAtacante.nombre} (ATK:${tropaAtacante.ataque}/DEF:${tropaAtacante.defensa}) ataca estructura ${estructura.nombre} (DEF:${estructura.defensa})`);
                
                // Aplicar daño a la estructura
                estructura.defensa -= tropaAtacante.ataque;
                console.log(`Daño infligido a ${estructura.nombre}: ${tropaAtacante.ataque} (DEF restante: ${estructura.defensa})`);

                // Contraataque si la estructura sobrevive
                if (estructura.defensa > 0) {
                    console.log(`${estructura.nombre} contraataca`);
                    tropaAtacante.defensa -= estructura.defensa;
                    console.log(`Daño de contraataque a ${tropaAtacante.nombre}: ${estructura.defensa} (DEF restante: ${tropaAtacante.defensa})`);
                }

                // Comprobar si la estructura fue destruida - CON ANIMACIÓN
                if (estructura.defensa <= 0) {
                    console.log(`${estructura.nombre} ha sido destruida`);
                    setTimeout(() => {
                        const estructurasPropias = document.querySelectorAll('.zona-estructuras.propia .fila-estructuras .carta');
                        const elementoEstructura = estructurasPropias[indiceEstructura];
                        if (elementoEstructura) {
                            reproducirAnimacionDesaparicion(elementoEstructura, estructura.nombre, () => {
                                this.tableroJugador.estructuras[indiceEstructura] = null;
                                this.actualizarInterfaz();
                            });
                        } else {
                            this.tableroJugador.estructuras[indiceEstructura] = null;
                            this.actualizarInterfaz();
                        }
                    }, 100);
                } else {
                    this.tableroJugador.estructuras[indiceEstructura].defensa = estructura.defensa;
                    this.actualizarInterfaz();
                }

                // Comprobar si la tropa atacante fue destruida - CON ANIMACIÓN
                if (tropaAtacante.defensa <= 0) {
                    console.log(`${tropaAtacante.nombre} ha sido destruido`);
                    setTimeout(() => {
                        const tropasEnemigas = document.querySelectorAll('.zona-tropas.enemiga .fila-tropas .carta');
                        const elementoAtacante = tropasEnemigas[indiceAtacante];
                        if (elementoAtacante) {
                            reproducirAnimacionDesaparicion(elementoAtacante, tropaAtacante.nombre, () => {
                                this.tableroIA.tropas[indiceAtacante] = null;
                                this.actualizarInterfaz();
                            });
                        } else {
                            this.tableroIA.tropas[indiceAtacante] = null;
                            this.actualizarInterfaz();
                        }
                    }, 100);
                } else {
                    this.tableroIA.tropas[indiceAtacante].defensa = tropaAtacante.defensa;
                    this.actualizarInterfaz();
                }
                
                this.tableroIA.tropasAtacaron[indiceAtacante] = true;
            }
        } else {
            // Atacar al castillo del jugador
            this.tableroJugador.castillo.vida -= tropaAtacante.ataque;
            console.log(`IA: ${tropaAtacante.nombre} ataca al castillo (${tropaAtacante.ataque} daño)`);
            this.tableroIA.tropasAtacaron[indiceAtacante] = true;
        }
    }

    seleccionarTropaAtacante(indice) {
        if (!this.turnoJugador) return;

        // Limpiar objetivos anteriores
        this.limpiarObjetivos();

        // Guardar la tropa seleccionada para atacar
        this.tropaAtacanteSeleccionada = indice;

        // Verificar si hay tropas enemigas
        const hayTropasEnemigas = this.tableroIA.tropas.some(tropa => tropa !== null);
        
        // Verificar si hay estructuras enemigas
        const hayEstructurasEnemigas = this.tableroIA.estructuras.some(estructura => estructura !== null);

        if (hayTropasEnemigas) {
            // Hacer las tropas enemigas objetivos válidos
            const tropasEnemigas = document.querySelectorAll('.zona-tropas.enemiga .fila-tropas .carta');
            Array.from(tropasEnemigas).forEach((tropa, index) => {
                if (this.tableroIA.tropas[index]) {
                    tropa.classList.add('objetivo-valido');
                    tropa.style.cursor = 'pointer';
                    tropa.onclick = (e) => {
                        e.stopPropagation();
                        this.atacar(this.tropaAtacanteSeleccionada, index);
                    };
                }
            });
        } else if (hayEstructurasEnemigas) {
            // Si NO hay tropas pero hay estructuras, ATACAR AUTOMATICAMENTE la estructura más débil
            let menorDefensa = Infinity;
            let indiceEstructura = -1;
            
            for (let i = 0; i < this.tableroIA.estructuras.length; i++) {
                if (this.tableroIA.estructuras[i] && this.tableroIA.estructuras[i].defensa < menorDefensa) {
                    menorDefensa = this.tableroIA.estructuras[i].defensa;
                    indiceEstructura = i;
                }
            }
            
            if (indiceEstructura !== -1) {
                console.log(`Atacando automáticamente estructura en índice ${indiceEstructura}`);
                this.atacarEstructura(indice, indiceEstructura);
            }
        } else {
            // Solo hay castillo - atacar automáticamente
            this.atacar(indice, -1);
        }
    }

    // Métodos de localStorage
    guardarEnLocalStorage() {
        try {
            const estadoJuego = {
                mazoJugador: this.mazoJugador,
                mazoIA: this.mazoIA,
                cartasRestantesJugador: this.cartasRestantesJugador,
                cartasRestantesIA: this.cartasRestantesIA,
                manoJugador: this.manoJugador,
                manoIA: this.manoIA,
                cartaSeleccionada: this.cartaSeleccionada,
                turnoJugador: this.turnoJugador,
                oroJugador: this.oroJugador,
                oroIA: this.oroIA,
                tableroJugador: this.tableroJugador,
                tableroIA: this.tableroIA
            };
            localStorage.setItem('estadoJuego', JSON.stringify(estadoJuego));
            console.log('Juego guardado en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    cargarDesdeLocalStorage() {
        try {
            const estadoGuardado = localStorage.getItem('estadoJuego');
            if (estadoGuardado) {
                return JSON.parse(estadoGuardado);
            }
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
        }
        return null;
    }

    limpiarLocalStorage() {
        try {
            localStorage.removeItem('estadoJuego');
            console.log('LocalStorage limpiado');
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

}

// Crear una instancia del juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Reproducir animación intro antes de inicializar el juego
    reproducirAnimacionIntro('Animatic.mp4', () => {
        const juego = new Juego();
        juego.inicializarJuego();
    });
});
// Elaborado por Luis Enrique Vergara Badillo 

// Tamano de tablero
var numCuadros = 3;

// Tipo de juego
var gameType;

// Canvas
var canvas = document.getElementById("gato");
var context = canvas.getContext("2d");
var canvasSize = 501;
var espacio = Math.round(canvasSize / numCuadros);
canvas.width = canvasSize;
canvas.height = canvasSize;

// Variables de control
var playerTurn;
var lineColor = "#2e2e2e";
var linewidth = 10;
var bgcolor = "#f3f3f3";
var turnbgcolor = "#333333";
var redColor = " #FF4343";

// Turno
var turno = document.getElementById("Turno");
var turnosJugados = 0;
var juegoFinalizado = false;
var juegoGanado = 0;

// Variables de jugadores
var J1colorpicker = document.getElementById("J1color");
var J2colorpicker = document.getElementById("J2color");
var J1color;
var J2color;
var J1tokenpicker = document.getElementById("J1token");
var J2tokenpicker = document.getElementById("J2token");
var J1token;
var J2token;
var J1name = document.getElementById("J1name").innerHTML;
var J2name = document.getElementById("J2name").innerHTML;
var J1wins = 0;
var J2wins = 0;
var numEmpates = 0;

// Arreglos de fichas
var J1fichas = [];
var J2fichas = [];

// Matriz
var matrizGato;

//Clases
class Ficha {
  constructor(x, y, color, token) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.token = token;
  }
}

class Opciones {
  constructor(cambios, exclusivas, inicia) {
    this.cambios = cambios;
    this.exclusivas = exclusivas;
    this.inicia = inicia;
  }
}
var opt;

//Funcion inicializar
function init() {
  // Dibujar tablero
  dibujaGato(linewidth, lineColor);
  limpiarMatriz();
  // Event
  canvas.addEventListener("mouseup", clicked);
  // Colores
  J1color = J1colorpicker.value;
  J2color = J2colorpicker.value;
  // Opciones Iniciales
  opt = new Opciones(true, false, "p");
  // Fichas
  J1token = J1tokenpicker.options[J1tokenpicker.selectedIndex].value;
  J2token = J2tokenpicker.options[J2tokenpicker.selectedIndex].value;
  // Por defecto empieza el jugador 1
  playerTurn = 1;
  setTurnColor("0");
  // Tipo de juego
  gameType = "gato";
  opc_type("c4");
}

// Dibuja el tablero
function dibujaGato(lineWidth, strokeStyle) {
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = strokeStyle;

  context.beginPath();

  for (let i = 1; i < numCuadros; i++) {
    context.moveTo(i * espacio, 4);
    context.lineTo(i * espacio, canvasSize - 5);
    context.moveTo(4, i * espacio);
    context.lineTo(canvasSize - 5, i * espacio);
  }
  context.stroke();
}

//Dibuja la linea del ganador
function winLine(lineWidth, x1, y1, x2, y2) {
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = redColor;

  context.beginPath();

  context.moveTo(x1 * espacio + espacio / 2, y1 * espacio + espacio / 2);
  context.lineTo(
    (x2 + 1) * espacio - espacio / 2,
    (y2 + 1) * espacio - espacio / 2
  );

  context.stroke();
}

// Evento click en tablero
function clicked(event) {
  if (J1name == "Jugador 1" || J2name == "Jugador 2") {
    alert("Ingrese el nombre de ambos jugadores para comenzar a jugar");
  } else {
    if (!juegoFinalizado) {
      let coords = ObtenerCoords(event);
      let res = ponerFicha(coords);

      if (res == true) {
        dibujaGato(linewidth, lineColor);
        if (!juegoFinalizado) {
          if (playerTurn == 1) {
            playerTurn = 2;
            setTurnColor("2");
          } else {
            playerTurn = 1;
            setTurnColor("1");
          }
        }
      }
    }
  }
}

// Sacar coordenadas del click
function ObtenerCoords(event) {
  let x = new Number();
  let y = new Number();
  let offset = canvas.getBoundingClientRect();

  x = event.clientX - offset.left;
  y = event.clientY - offset.top;

  return { x, y };
}

// Anade nueva ficha en el tablero
function ponerFicha(coords) {
  //Convertir coords a xymatriz
  let matx = Math.trunc(coords.x / espacio);
  let maty = Math.trunc(coords.y / espacio);

  //Para conecta 4
  if (gameType == "c4") {
    maty = getNewY(matx);
  }

  // Verificar si se puede poner la ficha
  let ban = verificarEspacio(matx, maty);

  // Si el espacio no esta ocupado
  if (ban == true) {
    // Agregar a matriz
    matrizGato[matx][maty] = playerTurn;

    if (playerTurn == 1) {
      J1fichas.push(new Ficha(matx, maty, J1color, J1token));
      if (J1token == "x") {
        tache(matx, maty, J1color);
      } else {
        circulo(matx, maty, J1color);
      }
    } else {
      J2fichas.push(new Ficha(matx, maty, J2color, J2token));
      if (J2token == "x") {
        tache(matx, maty, J2color);
      } else {
        circulo(matx, maty, J2color);
      }
    }
    turnosJugados += 1;
    verificar(playerTurn, matx, maty);
    return true;
  }
  return false;
}

// Limpia una ficha
// Para las funciones de cambio de color y de token
function cuadroBlanco(x, y) {
  let xc = x * espacio;
  let yc = y * espacio;

  context.fillStyle = bgcolor;
  context.fillRect(xc, yc, espacio, espacio);
}

// Circulo
function circulo(x, y, color) {
  let cx = x * espacio + 0.5 * espacio;
  let cy = y * espacio + 0.5 * espacio;
  let r = espacio * 0.2;

  context.strokeStyle = color;
  context.beginPath();
  context.arc(cx, cy, r, 0, 2 * Math.PI);
  context.stroke();
}

// Tache
function tache(x, y, color) {
  let c1x = (x + 1) * espacio - 0.3 * espacio;
  let c1y = (y + 1) * espacio - 0.3 * espacio;

  let c2x = x * espacio + 0.3 * espacio;
  let c2y = y * espacio + 0.3 * espacio;

  context.strokeStyle = color;
  context.beginPath();

  context.moveTo(c1x, c1y);
  context.lineTo(c2x, c2y);

  context.moveTo(c2x, c1y);
  context.lineTo(c1x, c2y);

  context.stroke();
}

// Color de la seccion turno
function setTurnColor(playerid) {
  if (turnosJugados < numCuadros * numCuadros) {
    if (playerid == "1") {
      turno.style.backgroundColor = J1color;
      turno.innerHTML = "Turno: " + J1name;
    } else if (playerid == "2") {
      turno.style.backgroundColor = J2color;
      turno.innerHTML = "Turno: " + J2name;
    } else if (playerid == "0") {
      turno.style.backgroundColor = turnbgcolor;
      turno.innerHTML = "Sin jugadores";

      document.getElementById("J1name").textContent = "";
      document.getElementById("J1change").style.display = "inline";

      document.getElementById("J2name").textContent = "";
      document.getElementById("J2change").style.display = "inline";
    }
  } else {
    // Empate
    numEmpates++;
    turno.style.backgroundColor = turnbgcolor;
    turno.innerHTML = "Empates: " + numEmpates;
  }
}

// Banner de ganador
function setTurnWinner(playerid) {
  turno.style.backgroundColor = turnbgcolor;
  if (playerid == 1) turno.innerHTML = "Gandor: " + J1name;
  else if (playerid == 2) turno.innerHTML = "Ganador: " + J2name;
}

// Nuevo token seleccionado
function refreshToken(playerid, ban) {
  if (playerid == "1") {
    JauxToken = J1token;

    if (!juegoFinalizado && (opt.cambios || turnosJugados == 0)) {
      // Sacar nuevo valor
      J1token = J1tokenpicker.options[J1tokenpicker.selectedIndex].value;
      // Redibujar todas las fichas
      for (let i = 0; i < J1fichas.length; i++) {
        J1fichas[i].token = J1token;
        cuadroBlanco(J1fichas[i].x, J1fichas[i].y);
        if (J1token == "x") {
          tache(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        } else {
          circulo(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);

      //Cambiar las otras fichas
      if (opt.exclusivas) intercambiarFichas(playerid);
    }

    if ((!opt.cambios && turnosJugados != 0) || juegoFinalizado) {
      J1tokenpicker.value = JauxToken;
    }
  } else {
    JauxToken = J2token;

    if (!juegoFinalizado && (opt.cambios || turnosJugados == 0)) {
      // Sacar nuevo valor
      J2token = J2tokenpicker.options[J2tokenpicker.selectedIndex].value;
      // Redibujar todas las fichas
      for (let i = 0; i < J2fichas.length; i++) {
        J2fichas[i].token = J2token;
        cuadroBlanco(J2fichas[i].x, J2fichas[i].y);
        if (J2token == "x") {
          tache(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        } else {
          circulo(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);

      //Cambiar las otras fichas
      if (opt.exclusivas) intercambiarFichas(playerid);
    }

    if ((!opt.cambios && turnosJugados != 0) || juegoFinalizado) {
      J2tokenpicker.value = JauxToken;
    }
  }
}

// Cambia las fichas del oponente
function intercambiarFichas(playerid) {
  if (playerid == "1") {
    if (J1token == J2token) {
      if (J1token == "x") J2tokenpicker.value = "o";
      else J2tokenpicker.value = "x";

      J2token = J2tokenpicker.options[J2tokenpicker.selectedIndex].value;
      // Redibujar todas las fichas
      for (let i = 0; i < J2fichas.length; i++) {
        J2fichas[i].token = J2token;
        cuadroBlanco(J2fichas[i].x, J2fichas[i].y);
        if (J2token == "x") {
          tache(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        } else {
          circulo(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);
    }
  } else if (playerid == "2") {
    if (J1token == J2token) {
      if (J2token == "x") J1tokenpicker.value = "o";
      else J1tokenpicker.value = "x";

      // Sacar nuevo valor
      J1token = J1tokenpicker.options[J1tokenpicker.selectedIndex].value;
      // Redibujar todas las fichas
      for (let i = 0; i < J1fichas.length; i++) {
        J1fichas[i].token = J1token;
        cuadroBlanco(J1fichas[i].x, J1fichas[i].y);
        if (J1token == "x") {
          tache(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        } else {
          circulo(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);
    }
  }
}

// Nuevo color seleccionado
function refreshColors(playerid) {
  if (playerid == "1") {
    jcoloraux = J1color;
    //Si el juego no ha finalizado y se permiten cambios a mitad de partida
    if (!juegoFinalizado && (opt.cambios || turnosJugados == 0)) {
      // Sacar nuevo valor
      J1color = J1colorpicker.value;
      // Redibujar todas las fichas
      for (let i = 0; i < J1fichas.length; i++) {
        J1fichas[i].color = J1color;
        cuadroBlanco(J1fichas[i].x, J1fichas[i].y);
        if (J1token == "x") {
          tache(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        } else {
          circulo(J1fichas[i].x, J1fichas[i].y, J1fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);
    }

    // Actualizar turno
    if ((!opt.cambios && turnosJugados != 0) || juegoFinalizado)
      J1colorpicker.value = jcoloraux;

    if (
      playerTurn == 1 &&
      !juegoFinalizado &&
      (opt.cambios || turnosJugados == 0)
    )
      setTurnColor("1");
    else if (playerTurn == 1 && juegoFinalizado) setTurnWinner(1);
  } else {
    jcoloraux = J2color;
    if (!juegoFinalizado && (opt.cambios || turnosJugados == 0)) {
      // Sacar nuevo valor
      J2color = J2colorpicker.value;
      // Redibujar todas las fichas
      for (let i = 0; i < J2fichas.length; i++) {
        J2fichas[i].color = J2color;
        cuadroBlanco(J2fichas[i].x, J2fichas[i].y);
        if (J2token == "x") {
          tache(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        } else {
          circulo(J2fichas[i].x, J2fichas[i].y, J2fichas[i].color);
        }
      }
      dibujaGato(linewidth, lineColor);
    }

    // Actualizar turno
    if ((!opt.cambios && turnosJugados != 0) || juegoFinalizado)
      J2colorpicker.value = jcoloraux;

    if (
      playerTurn == 2 &&
      !juegoFinalizado &&
      (opt.cambios || turnosJugados == 0)
    )
      setTurnColor("2");
    else if (playerTurn == 2 && juegoFinalizado) setTurnWinner(2);
  }
}

// Reinicia la matriz de gato a 0s
function limpiarMatriz() {
  matrizGato = new Array(numCuadros);
  for (let i = 0; i < numCuadros; i++) {
    matrizGato[i] = new Array(numCuadros);
    for (let j = 0; j < numCuadros; j++) matrizGato[i][j] = 0;
  }
}

// Verifica si el espacio no esta ocupado
function verificarEspacio(x, y) {
  if (matrizGato[x][y] == 0) return true;
  return false;
}

// Marcador de cada jugador
function setWins() {
  document.getElementById("J1wins").innerHTML = J1wins;
  document.getElementById("J2wins").innerHTML = J2wins;
}

function reiniciarRonda() {
  limpiarMatriz();
  J1fichas = [];
  J2fichas = [];

  context.fillStyle = bgcolor;
  context.fillRect(0, 0, canvasSize, canvasSize);
  dibujaGato(linewidth, lineColor);
  turnosJugados = 0;

  if (juegoFinalizado) {
    // Quien reinicia al ganar
    if (opt.inicia == "g") {
      if (juegoGanado == 1) {
        setTurnColor("1");
        playerTurn = 1;
      } else {
        playerTurn = 2;
        setTurnColor("2");
      }
    } else if (opt.inicia == "p") {
      if (juegoGanado == 1) {
        setTurnColor("2");
        playerTurn = 2;
      } else {
        playerTurn = 1;
        setTurnColor("1");
      }
    } else if (opt.inicia == "1") {
      playerTurn = 1;
      setTurnColor("1");
    } else if (opt.inicia == "2") {
      playerTurn = 2;
      setTurnColor("2");
    }
  } else {
    if (J1name != "Jugador 1" && J2name != "Jugador 2") {
      if (playerTurn == 1) {
        setTurnColor("1");
      } else {
        setTurnColor("2");
      }
    }
  }

  juegoFinalizado = false;
  juegoGanado = 0;
}

function nuevoJuego() {
  reiniciarRonda();
  playerTurn = 1;
  setTurnColor("0");
  J1wins = 0;
  J2wins = 0;
  numEmpates = 0;
  setWins();
  // Reiniciar nombres
  J1name = "Jugador 1";
  J2name = "Jugador 2";
  // Reiniciar colores por defecto
  J1tokenpicker.value = "x";
  J2tokenpicker.value = "o";
  J1colorpicker.value = "#0e96e6";
  J2colorpicker.value = "#2dd10d";
}

// Cambio de nombres de jugador
function setName1() {
  let name = prompt("Ingresa tu nickname");
  if (name.length != 0 && name.trim().length != 0) {
    if (name != J2name) {
      document.getElementById("J1name").textContent = name;
      document.getElementById("J1change").style.display = "none";
      J1name = name;
      if (playerTurn == 1 && !juegoFinalizado) setTurnColor("1");
    }
  }
}
function setName2() {
  let name = prompt("Ingresa tu nickname");
  if (name.length != 0 && name.trim().length != 0) {
    if (name != J1name) {
      document.getElementById("J2name").textContent = name;
      document.getElementById("J2change").style.display = "none";
      J2name = name;
      if (playerTurn == 2 && !juegoFinalizado) setTurnColor("2");
    }
  }
}

// Verificar Juego ganado4

// Verificar si hay un ganador
function verificar(player, x, y) {
  if (gameType == "gato") {

    let i, j;
    let cont = 0;

    // Vertical
    for (i = 0; i < numCuadros; i++) {
      for (j = 0; j < numCuadros; j++) {
        if (matrizGato[i][j] == player) {
          cont++;
        }
        if (cont == numCuadros) {
          ganador(i, j, i, j - numCuadros + 1);
          return;
        }
      }
      cont = 0;
    }

    // Horizontal 
    for (i = 0; i < numCuadros; i++) {
      for (j = 0; j < numCuadros; j++) {
        if (matrizGato[j][i] == player) {
          cont++;
        }
        if (cont == numCuadros) {
          ganador(j, i, j - numCuadros + 1, i);
          return;
        }
      }
      cont = 0;
    }

    // Diagonal
    cont = 0;
    for (j = 0; j < numCuadros; j++) {
      if (matrizGato[j][j] == player) {
        cont++;
      }
    }
    if (cont == numCuadros) {
      ganador(j - 1, j - 1, j - numCuadros, j - numCuadros);
      return;
    }

    // Diagonal
    cont = 0;
    for (j = 0; j < numCuadros; j++) {
      if (matrizGato[j][numCuadros - 1 - j] == player) {
        cont++;
      }
    }
    if (cont == numCuadros) {
      ganador(numCuadros - 1, 0, 0, numCuadros - 1);
      return;
    }

  } else {

    // Diagonales

    let cont, dif, type, i, j;
    let x1 = x;
    let y1 = y;

    dif = Math.abs(x1 - y1);

    // Diagonal 1
    if (dif < 3 + (numCuadros - 6)) {
      cont = 0;

      if (x1 - y1 > 0) type = "superior";
      else if (x1 - y1 < 0) type = "inferior";
      else type = "principal";

      for (i = 0; i < (numCuadros - dif); i++) {

        if (type == "superior") {
          if (matrizGato[dif + i][i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(dif + i, i, dif + i - 3, i - 3);
            return;
          }
        }
        else if (type == "inferior") {
          if (matrizGato[i][dif + i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(i, dif + i, i - 3, dif + i - 3);
            return;
          }
        }
        else if (type == "principal") {
          if (matrizGato[i][i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(i, i, i - 3, i - 3);
            return;
          }
        }
      }

    }

    // Diagonal 2
    // Mariz rotada 90 grados

    x1 = y;
    y1 = numCuadros - x - 1;

    dif = Math.abs(x1 - y1);

    if (dif < 3 + (numCuadros - 6)) {

      let matrizGatoAux = new Array(numCuadros);
      for (let i = 0; i < numCuadros; i++) {
        matrizGatoAux[i] = new Array(numCuadros);
        for (let j = 0; j < numCuadros; j++) matrizGatoAux[i][j] = 0;
      }

      for (i = 0; i < numCuadros; i++) {
        for (j = 0; j < numCuadros; j++) {
          matrizGatoAux[j][numCuadros - i - 1] = matrizGato[i][j];
        }
      }

      cont = 0;

      if (x1 - y1 > 0) type = "superior";
      else if (x1 - y1 < 0) type = "inferior";
      else type = "principal";

      for (i = 0; i < (numCuadros - dif); i++) {

        if (type == "superior") {
          if (matrizGatoAux[dif + i][i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(numCuadros - i - 1, dif + i, numCuadros - i + 2, dif + i - 3);
            return;
          }
        }
        else if (type == "inferior") {
          if (matrizGatoAux[i][dif + i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(numCuadros - dif - i - 1, i, numCuadros - dif - i + 2, i - 3);
            return;
          }
        }
        else if (type == "principal") {
          if (matrizGatoAux[i][i] == player) cont++;
          else cont = 0;

          if (cont >= 4) {
            ganador(numCuadros - i - 1, i, numCuadros - i + 2, i - 3);
            return;
          }
        }
      }

    }

    // Horizontal y vertical

    let k, ban;

    cont = 0;
    i = x - 3;
    if (i < 0) i = 0;
    j = x + 3;
    if (j >= numCuadros) j = numCuadros - 1;
    k = i;
    ban = true;

    // Horizontal
    while (k <= j) {
      if (matrizGato[k][y] == player) {
        cont++;
      } else {
        cont = 0;
      }
      if (cont >= 4) {
        if (x - 3 > 0) {
          ganador(k - 3, y, k, y);
          return;
        }
        else {
          ganador(k, y, k - 3, y);
          return;
        }
      }
      k++;
    }

    // vertical
    cont = 0;
    ban = true;
    if (y + 3 < numCuadros) {
      k = y;
      while (k <= (y + 3)) {
        if (matrizGato[x][k] == player) {
          cont++;
        } else {
          cont = 0;
        }
        if (cont >= 4) {
          ganador(x, y, x, y + 3);
          return;
        }
        k++;
      }
    }

  }
}

function ganador(x1, y1, x2, y2) {
  setTurnWinner(playerTurn);
  if (playerTurn == 1) J1wins += 1;
  else J2wins += 1;
  juegoFinalizado = true;
  juegoGanado = playerTurn;
  winLine(linewidth, x1, y1, x2, y2);
  setWins();
}

//Opciones

//Actualizar valores a medio juego
function opc_act(bool) {
  opt.cambios = bool;
}

// Fichas eclusivas (solo X o O)
function opc_exc(bool) {
  opt.exclusivas = bool;
  intercambiarFichas("1");
}

// Quien reinicia al ganar
function opc_win(player) {
  opt.inicia = player;
}

// Numero de cuadritos
function setNumC() {
  var nc = document.getElementById("numCuadros").value;
  document.getElementById("nc").textContent = nc;

  numCuadros = nc;
  espacio = Math.round(canvasSize / numCuadros);
  reiniciarRonda();
}

function opc_type(type) {
  gameType = type;
  if (type == "c4") {
    document.getElementById("juegotitle").innerHTML = "Conecta 4";
    document.getElementById("numCuadros").min = 6;
    document.getElementById("numCuadros").value = 6;
    document.getElementById("minrange").innerHTML = 6;
    setNumC();
  } else if (type == "gato") {
    document.getElementById("juegotitle").innerHTML = "Juego del gato ^";
    document.getElementById("numCuadros").min = 3;
    document.getElementById("numCuadros").value = 3;
    document.getElementById("minrange").innerHTML = 3;
    setNumC();
  }
}
// Conecta 4

function getNewY(x) {
  let y = 0;
  while (matrizGato[x][y] == 0 && y < numCuadros) {
    y++;
  }
  return y - 1;
}

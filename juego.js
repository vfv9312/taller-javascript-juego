const canvas = document.getElementById("game");
const juego = canvas.getContext("2d");
const btnUp =document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight =document.querySelector("#right");
const btnDown = document.querySelector("#down");
const vidasHtml = document.querySelector('#Vidas')
const Tiempo = document.getElementById("Tiempo");

window.addEventListener('load', mantenerTamaño);// al cargar la pagina entra a la funcion comienzaJuego
window.addEventListener('resize', mantenerTamaño);// cuando se cambie de tamaño la pantalla del navegador entra la funcion
let TamanoCanvas; //declaramos una variable vacia
let elementoTamaño;

btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

const posicionJugador = {
  x: undefined,
  y: undefined,
}
const posicionTriunfo = {
  x: undefined,
  y: undefined,
}
let lvl = 0;
let posicionEnemigo =[]; // nota diferencia de const y let es el = en const si usamos = para daler algun valor marcara error sin embargo se puede empujar objetos  y en let no ahi problema
let vidas= 3;
let tiempoComienzo ;
let intervaloTiempo;

window.addEventListener("keydown", (movertecla) => { //FUNCION SIN NOMBRE
  let tecla = movertecla.key; //LE DAMOS EL VALER DE LA TECLA PRESIONADA

  switch (tecla) {
    case "ArrowUp":
      moveUp();
      break;

    case "ArrowDown":
      moveDown();
      break;

    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
    moveRight();
      break;

    default:
      break;
  }
});




function mantenerTamaño() {
    if (window.innerHeight > window.innerWidth) { // si la altura es menor a la anchura entra
        TamanoCanvas = window.innerWidth * 0.8; //le damos el 80% de anchura
    } else {// si la altura es mayor a la anchura entra
      TamanoCanvas = window.innerHeight * 0.8;//le damos el 80% de altura a la altura
    }
       //canvas.setAttribute('width', window.innerWidth * 0.80); // modifica el tamaño del ancho del canvas dependiendo cual sea el 80% del area visible osea de adapta
    //canvas.setAttribute('height', window.innerHeight * 0.40); // modifica la altura del canvas un 40 % adaptandose a la pantalla

 

    canvas.setAttribute('width', TamanoCanvas);
    canvas.setAttribute('height', TamanoCanvas);

    elementoTamaño = TamanoCanvas / 10; // dividimos el tañano del canvas entre 10 para tener un valor quenos permitar tener un tamaño de 10 espacios en el canvas y asi darselo a los iconos

    comienzaJuego();
    
}

function comienzaJuego() {


  if (!tiempoComienzo) {
    tiempoComienzo = Date.now();//mostramos en milisegundos la hora actual del dia
    intervaloTiempo = setInterval(muestraTiempo ,100); // setInterval nos indica que despues de 100 milisegundos entra a la funcion
   // muestraTiempo();
  }

 
    //console.log({TamanoCanvas , elementoTamaño});

    const depurarArreglo = maps[lvl].trim().split('\n'); // el trim() elimina espacios de principio a fin que exitan y el split salta y realiza un arreglo apartir de cada elemento que elijas
//El método .trim() se utiliza para eliminar los espacios en blanco al principio y al final de una cadena de texto. Es muy útil para normalizar la entrada de texto en formularios y otros tipos de entradas de usuario.
//El método .split() se utiliza para dividir una cadena de texto en un array de elementos separados por un delimitador específico. Por ejemplo, si tenemos la cadena de texto “Hola, mundo”, podemos dividirla en un array utilizando la coma como delimitador
const FilasColumnas = depurarArreglo.map(fila => fila.trim().split('')); //FilasColumnas se convertira en un arreglo el trim quitara espacios y el
//En JavaScript, el método .map() se utiliza para crear un nuevo arreglo aplicando una función a cada elemento de un arreglo existente. La sintaxis del método .map() 
console.log(FilasColumnas);// podemos ver que creamos un arreglo bidimensional
    juego.font = elementoTamaño +'px Verdana' // modificamos el tamaño del emoji detodos modos como es texto tenemos que poner la tipografia de todos modos
     juego.textAlign = 'end';
      posicionEnemigo = [];
     juego.clearRect(0,0, TamanoCanvas, TamanoCanvas);
     muestaVidas()
    FilasColumnas.forEach((fila, filaIndice) => { fila.forEach((columna, columnaIndice) => { // forech de FilasColumnas fila tendra el valor que tiene al recorrer filaIndice tendra el valor del indice que esta recorriendo
      const emoji = emojis[columna];//emoji obtiene el valor que tiene el caracter que esete en la columna
      const PosX = elementoTamaño * (columnaIndice +1);// PosX tiene el calculo para saber la posicion del caracter
      const PosY = (elementoTamaño * (filaIndice +1)) -7;//reste - 7 para que no se salga del tamaño del canvas
      juego.fillText(emoji, PosX, PosY);//imprimimos el valor emoji que es el emojis que esta en objeto en la posicion que seleccionamos
      if (columna == 'O') { // si coulumna que es la el valor que esta en columna como X o I sea identico a O que es la puerta  entra
        if (!posicionJugador.x && !posicionJugador.y) { // si ya tiene valores las posisiones quiere decir que ya inciamos el juego y dimos clik entonces no entra y si no ahi valores aprenas iniciara la partida por lo que le damos la posicion que iniciara
          posicionJugador.x = PosX; //le damos el valor al objeto para que guardemos esa posicion
          posicionJugador.y = PosY; 
        }
      }
      else if (columna == 'I' || columna == 'Z' || columna == 'U') {//si la I conside mientras da vuelta el forech entra y guardamos su posision de la meta
        posicionTriunfo.x = PosX;
        posicionTriunfo.y = PosY;
      }
      else if (columna == 'X') {// si encuentra X mientras da vuelta el forech entra y empujamos la posicion con 2 decimales maximo al arreglo
          posicionEnemigo.push({
            x: PosX.toFixed(2),
            y: PosY.toFixed(2),
          });
      }

    });
     });
     console.log(posicionEnemigo);
     juego.fillText(emojis['PLAYER'], posicionJugador.x, posicionJugador.y);


     /* esto es un ciclo for anidado
     for(let fila=1; fila <= FilasColumnas.length; fila++) {// este for le dara vuelta a las filas 
      for(let columna=1; columna <= 10; columna++) {//este for le dara vuelta a las columnas
          juego.fillText(emojis[FilasColumnas[fila - 1][columna -1]], elementoTamaño * columna, elementoTamaño * fila -7)//emojis ira cambiandode valor en el objeto dependiendo enel caracter que se encuentre en el arreglo
          //le restamos -1 para que el arreglo cheque del 0
          // empezamos inicializando el valor de filas y columnas en los for con 1 debido a la multiplicacion que dara con el canvas que debe comenzar en 1
          //restamos 7 a la fila a la hora de multiplicas elementoTamapo debido a que si se acopla mejor en el canvas
      }
    }  termina ciclo for anidado */

 // for (let i = 1; i <= 10; i++) {
    //juego.fillText(emojis['X'], elementoTamaño * i, elementoTamaño ); // contenido de texto en este caso un emoji y cordenada x , cordenada y
  //}
     // juego.font = '25px Verdana' // colocar tamaño de letra y tipografia
     //juego.fillText('Vladimir', 140, 70); // contenido de texto y cordenada x , cordenada y
    //juego.fillStyle = "rgb(200, 0, 0)"; // color al canvas
    //juego.fillRect(10, 10, 50, 50); // dibujar cordenada x, cordenada y, altura, anchura
    //juego.clearRect(10,10,10,10);// Borrar dibujos en cierta cordenada x, cordenada y, altura, anchura
    moverJugador();
    
}


function moveUp() {
if ((posicionJugador.y - elementoTamaño)< 0) {// si la posision y - el tamaño de la fugura es mayor a 0 quiere dcir que se salio por arriba
console.warn('te saliste del mapa');
}else{//si no se a salido entonces que continue dismunuyendo
  posicionJugador.y -= elementoTamaño; 
  comienzaJuego();
}

}

function moveLeft() {
if ((posicionJugador.x - elementoTamaño)<= 0) {
  console.log(posicionJugador.x - elementoTamaño);
}
else{
  posicionJugador.x -= elementoTamaño; 
  comienzaJuego();
}
}

function moveRight() {
if ((posicionJugador.x + elementoTamaño) >= (TamanoCanvas + 20)) {
  console.log(TamanoCanvas);
}
else{
  posicionJugador.x += elementoTamaño; 
  comienzaJuego();
}

}

function moveDown() {
if ((posicionJugador.y  + elementoTamaño)> TamanoCanvas) {
  console.log('abajo');
}
else{
  posicionJugador.y += elementoTamaño; 
  comienzaJuego();
}

}

function moverJugador (){
  //juego.ClearRect(valorAnteriorx, valorAnteriory, elementoTamaño, elementoTamaño);
  //console.log({valorAnteriorx, valorAnteriory});
  juego.fillText(emojis['PLAYER'], posicionJugador.x, posicionJugador.y);
  if (posicionTriunfo.x.toFixed(2) == posicionJugador.x.toFixed(2) && posicionTriunfo.y.toFixed(2) == posicionJugador.y.toFixed(2)) {// .toFixed(x) hace que agarre la cantidad de decimales que le indiquemos en este caso solo 2 esto para que no tengamos error que por una decimal ultra larga no conincida
    Triunfo();
  }
  const ColisionEnemiga = posicionEnemigo.find(enemigo => {
    const ColisionEnemigaX = enemigo.x == posicionJugador.x.toFixed(2);
    const ColisionEnemigaY = enemigo.y == posicionJugador.y.toFixed(2);
    return ColisionEnemigaX && ColisionEnemigaY;//retornamos si ambos son true
  });
  
  if (ColisionEnemiga) {//si es true entra
    juego.fillText(emojis['FUEGO'], posicionJugador.x, posicionJugador.y);// ledamos el efecto que se quema el personaje
    lvlFallido(); // entramos a la funcion
  }
}

function lvlFallido() {
  posicionJugador.x = undefined;// reseteamos los valores para puedan que en la funcion comienzaJuego piense que ingrese a la condicional que le da la posicion de la puerta
  posicionJugador.y = undefined;
  vidas--; //restamos una vida que perdio
  if (vidas === 0) {//si pierde las vidas y llega a 0 entra
    lvl = 0; //reseteamos el mapa y lo colocamos en el mapa 0
    vidas = 3;//reseteamos las vidas y le volvemos a dar las 3 vidas
    tiempoComienzo = 0;
    comienzaJuego(); //que ingrese a comienzaJuego
  }
  //comienzaJuego();//no le damos que comiezaJuego para que de tiempo en que se vea el personaje quemandose
}

function Triunfo() {//si ganamos
  lvl += 1;//aumenta uno el lvl haciento que entre el siguiente objeto en el arreglo de mapas
  if (lvl == maps.length) { //si llega al maximo de mapas entra
   finvictoria();//abrimos la funcion
   return; 
 }
  comienzaJuego();
}

function finvictoria() {
  const recordando = localStorage.getItem('recuerdame')
  if (recordando) {
    const tiempoJugador = Math.trunc((Date.now() - tiempoComienzo)/1000);
    if (recordando >= tiempoJugador) {
      const record = localStorage.setItem('recuerdame', Math.trunc((Date.now() - tiempoComienzo)/1000));  
      alert ('Te la mamaste padrino' + emojis['WIN'] + ' imponiendo record : ' + tiempoJugador);//un msj que ya ganamos
    }
    else {
    alert ('Te la mamaste padrino' + emojis['WIN'] + ' pero no has superado el record de: ' + recordando);//un msj que ya ganamos
    }
  }
  else{
    const record = localStorage.setItem('recuerdame', Math.trunc((Date.now() - tiempoComienzo)/1000));  
    alert ('Te la mamaste padrino' + emojis['WIN']);//un msj que ya ganamos
  }
  
  clearInterval(intervaloTiempo)
}

function muestaVidas() {
//const ArregloVidas = Array(vidas).fill(emojis['CORAZON'])// loque hace Array() es crear un arreglo con los espacio que le indiquemos
//console.log(ArregloVidas);// y se imprime los 3 corazones, sin embargo hay otra solucion

vidasHtml.innerHTML = emojis['CORAZON'].repeat(vidas);// El método repeat() construye y devuelve una nueva cadena que contiene el número especificado de copias de la cadena en la cual fue llamada, concatenados.
}

function muestraTiempo() {
  Tiempo.innerHTML = Math.trunc((Date.now() - tiempoComienzo)/1000);
}
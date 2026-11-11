function calcular() {
  var pieza = parseFloat(document.getElementById("pieza").value);
  var precio = parseFloat(document.getElementById("precio").value);
  var resultado = pieza * precio;

  if (pieza >= 10) {
    var descuento = resultado * 0.35;
    var total = resultado - descuento;
    document.getElementById("resultado").innerHTML =
      "El resultado con descuento es: " + total;
  } else {
    document.getElementById("resultado").innerHTML =
      "El resultado es: " + resultado;
  }
}

function CalcSueldo() {
  var sueldo = parseFloat(document.getElementById("sueldo").value);
  var operador2 = document.getElementById("operador2").value;
  switch (operador2) {
    case "Soporte":
      Soport(sueldo);
      break;

    case "ProyectManger":
      Proyect(sueldo);
      break;

    case "ProgDr":
      Progdr(sueldo);
      break;

    case "ProgSr":
      Progsr(sueldo);
      break;

    default:
      document.getElementById("resultado2").innerHTML = "Operación no valida";
      break;
  }
}

function Soport(sueldo) {
  var aumento = sueldo * 0.2;
  var totalSueldo = aumento + sueldo;
  document.getElementById("resultado2").innerHTML =
    "El resultado es: " + totalSueldo;
}

function Proyect(sueldo) {
  var aumento = sueldo * 0.4;
  var totalSueldo = aumento + sueldo;
  document.getElementById("resultado2").innerHTML =
    "El resultado es: " + totalSueldo;
}

function Progdr(sueldo) {
  var aumento = sueldo * 0.25;
  var totalSueldo = aumento + sueldo;
  document.getElementById("resultado2").innerHTML =
    "El resultado es: " + totalSueldo;
}

function Progsr(sueldo) {
  var aumento = sueldo * 0.35;
  var totalSueldo = aumento + sueldo;
  document.getElementById("resultado2").innerHTML =
    "El resultado es: " + totalSueldo;
}

function Calc() {
  var n1 = parseFloat(document.getElementById("n1").value);
  var n2 = parseFloat(document.getElementById("n2").value);

  var operador3 = document.getElementById("operador3").value;

  switch (operador3) {
    case "suma":
      sumar(n1, n2);
      break;

    case "resta":
      restar(n1, n2);
      break;

    case "multiplacion":
      multiplicar(n1, n2);
      break;

    case "division":
      dividir(n1, n2);
      break;

    case "modulo":
      modulo(n1, n2);
      break;

    default:
      document.getElementById("resultado3").innerHTML = "Operación no valida";
      break;
  }
}

function sumar(n1, n2) {
  var resultado = n1 + n2;
  document.getElementById("resultado3").innerHTML =
    "El resultado es: " + resultado;
}

function restar(num1, num2) {
  var resultado = num1 - num2;
  document.getElementById("resultado3").innerHTML =
    "El resultado es: " + resultado;
}

function multiplicar(num1, num2) {
  var resultado = num1 * num2;
  document.getElementById("resultado3").innerHTML =
    "El resultado es: " + resultado;
}

function dividir(num1, num2) {
  if (num2 === 0) {
    document.getElementById("resultado3").innerHTML =
      "No se puede dividir entre cero";
  } else {
    var resultado = num1 / num2;
    document.getElementById("resultado3").innerHTML =
      "El resultado es: " + resultado;
  }
}

function modulo(num1, num2) {
  var resultado = num1 % num2;
  document.getElementById("resultado3").innerHTML =
    "El residuo es: " + resultado;
}

function adivinar() {
    var numeroSecreto = 7;
    var intentos = 0;
    var maxIntentos = 3;
    var acerto = false;

        intentos++;

        var num = parseInt("Intento " + intentos + " de " + maxIntentos + ": ¿Cuál es el número secreto?");

        if (num === numeroSecreto) {
            acerto = true;
            document.getElementById("mensajeJuego").innerHTML = "¡Adivinaste en el intento " + intentos + "!";
        } else if (intentos < maxIntentos) {
            alert("Incorrecto. Intenta de nuevo.");
        } else {
            document.getElementById("mensajeJuego").innerHTML = "Perdiste. El número secreto era " + numeroSecreto;
        }
    }

function Tablas() {
    var inicio = parseInt(document.getElementById("tablaInicio").value);
    var fin = parseInt(document.getElementById("tablaFin").value);
    var tabla = "";
    for (var i = inicio; i <= fin; i++) {
        tabla += "<h4>Tabla del " + i + "</h4>";
        
        for (var j = 1; j <= 10; j++) {
            tabla += i + " x " + j + " = " + (i * j) + "<br>";
        }
        
        tabla += "<hr>";
    }

    document.getElementById("resultadoTablas").innerHTML = tabla;
}

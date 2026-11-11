
window.onload = function () {

    var datosGuardados = localStorage.getItem("registroHabitacion");

    var datosHotel = JSON.parse(datosGuardados);

    document.getElementById("salidaCliente").innerText = datosHotel.nombre;

    document.getElementById("salidaRFC").innerText = datosHotel.rfc;

    document.getElementById("salidaHuespedes").innerText = datosHotel.huespedes;

    document.getElementById("salidaAdultos").innerText = datosHotel.adultos;

    document.getElementById("salidaNinos").innerText = datosHotel.ninos;

    document.getElementById("salidaSubtotal").innerText = "$" + datosHotel.subtotal;

    document.getElementById("salidaExtra").innerText = "$" + datosHotel.extra;

    document.getElementById("salidaTotal").innerText = "$" + datosHotel.total;

    var contenedorLista = document.getElementById("salidaListaHabitaciones");

    contenedorLista.innerHTML = '';

    for (let i = 0; i < datosHotel.habitacion.length; i++) {

        var itemLi = document.createElement("li");

        itemLi.innerText = datosHotel.habitacion[i];

        contenedorLista.appendChild(itemLi);
    }

};

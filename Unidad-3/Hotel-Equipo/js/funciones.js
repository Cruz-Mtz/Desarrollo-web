
var Datos = {
    huespedes: '',
    nombre: '',
    rfc: '',
    ninos: '',
    adultos: '',
    habitacion: [],
    subtotal: 0,
    capacidad: 0,
    extra: 0,
    total: 0,

    calcularTotal: function () {

        this.subtotal = 0;
        this.capacidad = 0;
        this.extra = 0;

        for (let i = 0; i < this.habitacion.length; i++) {

            switch (this.habitacion[i]) {

                case "Sencilla":
                    this.subtotal += 1200;
                    this.capacidad += 2;
                    break;

                case "Doble":
                    this.subtotal += 1700;
                    this.capacidad += 3;
                    break;

                case "Familiar":
                    this.subtotal += 2500;
                    this.capacidad += 4;
                    break;

                case "Suite":
                    this.subtotal += 2800;
                    this.capacidad += 6;
                    break;
            }
        }

        if (this.huespedes > this.capacidad) {

            this.extra = (this.huespedes - this.capacidad) * 500;

        }

        this.total = this.subtotal + this.extra;
    },

    Registrar: function () {

        this.huespedes = document.getElementById("huespedes").value;
        this.nombre = document.getElementById("nombre").value;
        this.rfc = document.getElementById("rfc").value;
        this.ninos = document.getElementById("ninos").value;
        this.adultos = document.getElementById("adultos").value;

        if (this.habitacion.length == 0) {
            alert("Agrega una habitación");
            return;
        }

        this.calcularTotal();

        localStorage.setItem("registroHabitacion", JSON.stringify(this));

        document.getElementById("impTodo").innerHTML =
            "Huéspedes: " + this.huespedes + "<br>" +
            "Nombre: " + this.nombre + "<br>" +
            "RFC: " + this.rfc + "<br>" +
            "Niños: " + this.ninos + "<br>" +
            "Adultos: " + this.adultos + "<br>" +
            "Habitaciones: " + this.habitacion.join(", ") + "<br>" +
            "Capacidad: " + this.capacidad + "<br>" +
            "Subtotal: $" + this.subtotal + "<br>" +
            "Costo extra: $" + this.extra + "<br>" +
            "Total: $" + this.total;

        window.open("ticket.html", "_blank");
    }
};


function agregarHabitacion() {

    var nuevaHabitacion = document.getElementById("habitacion").value;

    if (nuevaHabitacion == "") {
        alert("Selecciona una habitación");
        return;
    }

    Datos.habitacion.push(nuevaHabitacion);

    var listaH = document.getElementById("listaHabitacion");

    var listaLi = document.createElement("li");

    listaLi.innerText = nuevaHabitacion;

    listaH.appendChild(listaLi);

    document.getElementById("habitacion").value = "";
}

function mi_metodo() {
    var nombre = document.getElementById('nombre').value;
    alert(nombre);

    var paterno = document.getElementById('paterno').value;
    alert(paterno);

    var materno = document.getElementById('materno').value;
    alert(materno);

    var fecha = document.getElementById('fecha').value;
    alert(fecha);

    var imagen = document.getElementById('imagen').value;
    alert(imagen);

    var genero = document.getElementsByName('GeneroU');
    alert(genero[0].checked ? genero[0].value : genero[1].value);
}
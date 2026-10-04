function mi_metodo() {
    var texto = document.getElementById('texto').value;
    alert(texto);

    var colorf = document.getElementById('colorf').value;
    alert(colorf);

    var imagen = document.getElementById('imagen').value;
    alert(imagen);

    var activo = document.getElementsByName('activo');
    alert(activo[0].checked ? activo[0].value : activo[1].value);
}
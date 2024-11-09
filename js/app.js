$(document).ready(function () {
    // Ocultar enlaces de acción
    $('#navLinks').hide();

    // Mostrar enlaces de acción en el botón click
    $('#showLinksBtn').on('click', function () {
        $('#navLinks').toggle();
    });
});
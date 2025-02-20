var url;

async function buscarcarta() {
    const idcarta = document.querySelector("#idcarta").value;

    let llamada = new XMLHttpRequest();

    url = 'https://yugipedia.com/index.php?title='+idcarta+'';

    llamada.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200) {

            $('#idcarta').val(idcarta);

            var imagen = $(this.responseText).find('.image img');
            $("#imagen-carta").html('<a href="'+url+'" target="_blank" rel="noopener noreferrer"><img src='+imagen[0].src+'></img></a>');
            var nombre = $(this.responseText).find('.heading div').text();
            $("#nombre-carta").val(String(nombre));

            /* Si es monstruo */
            var tipo = $(this.responseText).find('a[href$="/wiki/Type"]').parent().parent();
            if(tipo.length >= 1) {
                var tipo2 = $(tipo).find('td a');
                $("#tipo-monstruo").val($(tipo2[0]).text());
                $("#tipocarta").val($(tipo2[1]).text());
            }
            /* Si es otro tipo */
        } else {
            $("#imagen-carta").html('');
            reset();
        } 
    }

    llamada.open("GET", url, true);

    llamada.send();
}

document.querySelector("#carta-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    reset();

    const res = await fetch("http://localhost:3999/api/agregarcarta", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            card_id: e.target.querySelector("#idcarta").value,
            img_url: url,
            expansion: e.target.querySelector("#idexpansion").value,
            edicion: e.target.querySelector("#idedicion").value,
            nombre: e.target.querySelector("#nombre-carta").value,
            cantidad: e.target.querySelector("#cantidad").value,
            tipocarta: e.target.querySelector("#tipocarta").value,
            tipo: e.target.querySelector("#tipo-monstruo").value,
            carpeta: e.target.querySelector("#carpeta").value,
            folio: e.target.querySelector("#folio").value,
            vendida: e.target.querySelector("#vendida").value,
            datosventa: e.target.querySelector("#datosventa").value
        })
    })
    const resJson = await res.json();
    if(resJson.message) {
        if(resJson.message == "Completado") return alert("Completado");
        window.location.href = "#"+resJson.message;
        const errores = document.querySelectorAll(".error");
        errores.forEach(err => err.innerHTML = "");
        $("select").css("background-color", "unset");
        $("input").css("background-color", "unset");
        $("#"+resJson.message).css("background-color", "#fda3a3");
        document.querySelector("#"+resJson.message+"_error").innerHTML = "⚠️ " + resJson.error;
        $("#error").css("display", "flex");
    }
    return 
});

async function reset(){
    $(".error").html("");
    $(".error").css("background-color", "unset");

    var inputs = document.querySelectorAll('input');
    inputs.forEach(element => {
        element.value = "";
    });
    var select = document.querySelectorAll('select');
    select.forEach(element => {
        element.value = "";
    });
    $('#imagen-carta').html("");
}
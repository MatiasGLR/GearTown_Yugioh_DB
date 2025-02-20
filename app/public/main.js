var url, url_save;

async function editarcantidad(id, q) {
    try {
        const res = await fetch("http://localhost:3999/api/modificarcantidad", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                card_id: id,
                cantidad: q
            })
        })
        const resJson = await res.json();
        if(resJson.status && resJson.status == "ok") {
            $("#cantidad_carta_"+id).html(""+resJson.cantidad);
        }
        else return alert(resJson.message);
        return 
    } catch (e) {

    }
}

async function borrarcarta(id) {
    try {
        
        const res = await fetch("http://localhost:3999/api/borrarcarta", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                card_id: id,
            })
        })
        const resJson = await res.json();
        if(resJson.message) {
            if(resJson.status && resJson.status == "ok") await filtrarcartas()//$("#body_cartas").html("");
            else return alert(resJson.message);
        }
        return 
    } catch(e) {
        console.error(e);
    }
}

async function filtrarcartas() {
    try {
        const cantidad_input = document.querySelector("#buscar_cantidad").value; 
        const res = await fetch("http://localhost:3999/api/filtrarcartas", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                id: document.querySelector("#buscar_id").value,
                expansion: document.querySelector("#buscar_expansion").value,
                nombre: document.querySelector("#buscar_nombre").value,
                cantidad: cantidad_input == "" ? 0 : cantidad_input
            })
        })
        const resJson = await res.json();
        if(resJson) {
            const b = document.querySelector("#body_cartas");
            $("#body_cartas").html("");
            var str = "";
            resJson.forEach(carta => {
                str = str + `
                    <tr>
                        <td>${carta.id}</td>
                        <td class="carta_imagen"><img src="${carta.img_url}"></td>
                        <td>${carta.nombre}</td>
                        <td id="cantidad_carta_${carta.id}">${carta.cantidad}</td>
                        <td>${carta.carpeta} / ${carta.folio}</td>
                        <td><i id="boton_borrar" class="bi bi-trash" onclick="borrarcarta(${carta.id})"></i> <i id="boton_mas" class="bi bi-patch-plus-fill" onclick="editarcantidad(${carta.id},1)"></i> <i id="boton_menos" class="bi bi-patch-minus-fill" onclick="editarcantidad(${carta.id},-1)"></i></td>
                    </tr>
                `;
            })
            $("#body_cartas").html(str);
        }
        return 
    } catch(e) {
        console.error(e);
    }
}

async function buscarcarta() {
    try {
        const idcarta = document.querySelector("#idcarta").value.trim();
        const errorElement = $("#idcarta_error");
        const imagenContainer = $("#imagen-carta");
        const nombreInput = $("#nombre-carta");
        const tipoMonstruoInput = $("#tipo-monstruo");
        const tipoCartaInput = $("#tipocarta");

        // Validar ID antes de hacer la búsqueda
        if (!idcarta || idcarta.length < 8) {
            errorElement.html("⚠️ La ID de la carta no es válida");
            return;
        }

        // Limpiar resultados anteriores y mostrar mensaje de búsqueda
        imagenContainer.html('');
        errorElement.html("Buscando carta...");

        // Construir la URL correctamente codificada
        url = 'https://images.ygoprodeck.com/images/cards_cropped/'+idcarta+'.jpg';
        const data_url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?id='+idcarta;
        
        var idshow = idcarta;

        if(idcarta.charAt(0) == "0") idshow = idcarta.slice(1); 

        // Hacer la petición con fetch()
        const response = await fetch(data_url);
        if (!response.ok) throw new Error("⚠️ La ID de la carta no es válida");

        // Convertir la respuesta en texto
        const datos = await response.json();
        const json_data = datos.data[0];

        console.log(json_data)

        // Extraer imagen
        const imagen = "https://images.ygoprodeck.com/images/cards_small/"+idshow+".jpg";
        if (imagen) {
            imagenContainer.html(`
                <a href="https://yugipedia.com/index.php?title=${encodeURIComponent(idcarta)}" target="_blank" rel="noopener noreferrer">
                    <img src="`+imagen+`" alt="Carta">
                </a>
            `);
        }

        // Extraer nombre de la carta

        nombreInput.val(json_data.name);

        // Extraer tipo de monstruo (si aplica)
        const tipo_general = json_data.humanReadableCardType;
        const tipo_carta = json_data.race;
        if (tipo_general.length != "undefined" && tipo_carta != "undefined") {
            tipoMonstruoInput.val(tipo_carta);
            tipoCartaInput.val(tipo_general);
        }

        errorElement.html("");

    } catch (error) {
        console.error("Error en buscarcarta:", error);
        $("#imagen-carta").html('');
        $("#idcarta_error").html("⚠️ Carta no encontrada en la base de datos oficial");
    }
}


document.querySelector("#carta-form").addEventListener("submit", async (e) => {
    e.preventDefault();

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
        if(resJson.message == "Completado") {
            reset();
            return alert("Completado");
        }
        window.location.href = "#"+resJson.message;
        const errores = document.querySelectorAll(".error");
        errores.forEach(err => err.innerHTML = "");
        $("select").css("background-color", "field");
        $("input").css("background-color", "field");
        $("#"+resJson.message).css("background-color", "#fda3a3");
        document.querySelector("#"+resJson.message+"_error").innerHTML = "⚠️ " + resJson.error;
        $("#error").css("display", "flex");
    }
    return 
});

async function reset(){
    $(".error").html("");
    $(".error").css("background-color", "unset");

    $("select").css("background-color", "field");
    $("input").css("background-color", "field");

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
import db from "./database.js";

async function modificarcantidad(req, res) {
    const q = req.body.cantidad, card_id = req.body.card_id;
    db.get("SELECT cantidad FROM Cartas WHERE `id`=?", [card_id], (err, row) => {
        if(err) return console.error(err);
        const nueva_cantidad = Number(row.cantidad + q);
        console.log(nueva_cantidad);
        if(nueva_cantidad >= 0) {
            db.run("UPDATE Cartas SET `cantidad`=? WHERE `id`=?", [nueva_cantidad, card_id], (err,row) => {
                if(err) console.error(err);
            })
            return res.status(200).json({status:"ok",cantidad:nueva_cantidad});
        }
    })
}

async function borrarcarta(req, res) {
    const card_id = req.body.card_id;
    try {
        db.run("DELETE FROM Cartas WHERE `id`=?", [card_id], (err, row) => {
            if(err) console.error(err);
            res.status(200).json({status:"ok", message:"Has borrado esta carta de la base de datos"})
        })
    } catch(e) {
        res.status(400).json({message:"Ha ocurrido un error"})
    }
    
}

async function filtrarcartas(req, res) {
    try {
        const cartas = db.all("SELECT * FROM `Cartas` WHERE LOWER(`nombre`) LIKE '%' || LOWER(?) || '%' AND `card_id` LIKE '%' || ? || '%' AND `expansion` LIKE '%' || ? || '%' AND `cantidad` >= ?", [req.body.nombre,req.body.id,req.body.expansion,req.body.cantidad], (err, row) => {
            if(err) console.error(err);
            const arrayCartas = row;
            console.log(row)
            res.status(200).json(arrayCartas);
        });
    } catch(e) {
        if(error.status && error.message && error.error) res.status(200).send({status:error.status,message:error.message,error:error.error});
        else {
            console.log("Error no manejado:", error); // Esto te ayudará a detectar cualquier otro error no esperado
            res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }
}

async function agregarcarta(req, res) {
    try {
        const card_id = String(req.body.card_id);
        if(req.body.card_id == undefined || card_id == "") throw ({status:"Error",message:"idcarta",error:"Debes colocar la ID válida de una carta"}); 
        const img_url = String(req.body.img_url);
        if(img_url == undefined) throw ({status:"Error",message:"idcarta",error:"Debes colocar una ID válida de una carta"});
        const expansion = String(req.body.expansion);
        if(req.body.expansion == undefined || expansion == "") throw ({status:"Error",message:"idexpansion",error:"Debes colocar la expansión"});
        const edicion = String(req.body.edicion);
        if(req.body.edicion == undefined || edicion == "") throw ({status:"Error",message:"idedicion",error:"Debes colocar la edición"});
        const nombre = String(req.body.nombre);
        if(req.body.nombre == undefined || nombre == "") throw ({status:"Error",message:"nombre-carta",error:"Debes colocar el nombre de la carta"});
        const cantidad = Number(req.body.cantidad);
        if(isNaN(cantidad) || cantidad <= 0) throw ({status:"Error",message:"cantidad",error:"Debes colocar una cantidad válida mayor a 0"});
        const tipocarta = String(req.body.tipocarta);
        if(req.body.tipocarta == undefined || tipocarta == "") throw ({status:"Error",message:"tipocarta",error:"Debes colocar un tipo de carta válido"});
        const tipo = String(req.body.tipo);
        if(req.body.tipo == undefined || tipo == "") throw ({status:"Error",message:"tipocarta",error:"Debes colocar un tipo válido"});
        const carpeta = String(req.body.carpeta);
        if(req.body.carpeta == undefined || carpeta == "") throw ({status:"Error",message:"carpeta",error:"Coloca información de la carpeta contenedora"});
        const folio = Number(req.body.folio);
        if(isNaN(folio) || folio <= 0) throw ({status:"Error",message:"folio",error:"Folio no válido"});
        const vendida = String(req.body.vendida);
        const datosventa = String(req.body.datosventa);
        if(vendida == "Si" && (req.body.datosventa == "undefined" || datosventa == "")) throw ({status:"Error",message:"datosventa",error:"Una carta vendida debe de tener una información"});

        db.get("SELECT * FROM Cartas WHERE `card_id`=? AND `carpeta`=? AND `folio`=?", [card_id], (err,row) => {
            if(err) console.error(err);
            if(row == undefined) {
                db.run(`INSERT INTO Cartas (card_id, img_url, expansion, edicion, nombre, cantidad, tipo_carta, tipo, carpeta, folio, vendida, precio_vendida) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [card_id,img_url,expansion,edicion,nombre,cantidad,tipocarta,tipo,carpeta,folio,vendida,datosventa], (err, row) => {
                    if(err) return console.error(err);
                });
            } else {
                const new_cantidad = row.cantidad+cantidad;
                db.run("UPDATE Cartas SET `cantidad`=? WHERE `id`=? AND `nombre`=? AND `carpeta`=? AND `folio`=?", [new_cantidad,row.id,row.nombre,row.carpeta,row.folio])
            }
        })

        

        return res.status(200).json({message:"Completado"});
    } catch (error) {
        if(error.status && error.message && error.error) res.status(200).send({status:error.status,message:error.message,error:error.error});
        else {
            console.log("Error no manejado:", error); // Esto te ayudará a detectar cualquier otro error no esperado
            res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }
}

export const methods = {
    agregarcarta,
    filtrarcartas,
    borrarcarta,
    modificarcantidad
}
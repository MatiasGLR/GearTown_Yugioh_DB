async function agregarcarta(req, res) {
    try {
        const card_id = Number(req.body.id);
        console.log(req.body.id)
        if(isNaN(card_id) || (card_id < 1000000 || card_id > 99999999)) throw ({status:"Error",message:"idcarta",error:"Debes colocar la ID válida de una carta"}); 
        res.status(200).json({message:"Completado"});
    } catch (error) {
        if(error.status && error.message && error.error) res.status(200).send({status:error.status,message:error.message,error:error.error});
        else {
            console.log("Error no manejado:", error); // Esto te ayudará a detectar cualquier otro error no esperado
            res.status(500).send({ status: "Error", message: "Error inesperado", error: "Ha ocurrido un error inesperado" });
        }
    }
}

export const methods = {
    agregarcarta
}
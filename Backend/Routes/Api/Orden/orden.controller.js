
const Orden = require('./orden.model');


const status = (pago) =>{
    
}


exports.crearOrden = (request, response) => {
    const {Total, Estado, Ciudad, CodigoPostal, Colonia, Calle, Productos} = request.body;
    const newOrden = new Orden({
        Total, Estado,  Ciudad, CodigoPostal, Colonia, Calle, Productos
    });
    newOrden.save().then(res => response.send(res)).catch(err => console.log(err));
};

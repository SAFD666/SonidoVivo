const CLASES_ESTADO = {
    "En preparación": "estado-preparacion",
    "Enviado": "estado-enviado",
    "Entregado": "estado-entregado",
    "Cancelado": "estado-cancelado",
};

function EstadoPedido({ estado }) {
    return (
        <span className={`estado-pedido ${CLASES_ESTADO[estado] || ""}`}>
            {estado}
        </span>
    );
}

export default EstadoPedido;
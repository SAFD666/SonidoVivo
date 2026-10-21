const CLASES_ESTADO = {
    "En preparación": "estado-preparacion",
    "Enviado": "estado-enviado",
    "Entregado": "estado-entregado",
    "Cancelado": "estado-cancelado",
};

export const ESTADOS_PEDIDO = Object.keys(CLASES_ESTADO);

function EstadoPedido({ estado }) {
    return (
        <span className={`estado-pedido ${CLASES_ESTADO[estado] || ""}`}>
            {estado}
        </span>
    );
}

export default EstadoPedido;
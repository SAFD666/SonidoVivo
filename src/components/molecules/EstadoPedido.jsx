const CLASES_ESTADO = {
  "En preparación": "estado-preparacion",
  "Enviado": "estado-enviado",
  "Entregado": "estado-entregado",
  "Cancelado": "estado-cancelado",
};

export const ESTADOS_PEDIDO = Object.keys(CLASES_ESTADO);

function EstadoPedido(props) {
  return (
    <span className={`estado-pedido ${CLASES_ESTADO[props.estado] || ""}`}>
      {props.estado}
    </span>
  );
}

export default EstadoPedido;
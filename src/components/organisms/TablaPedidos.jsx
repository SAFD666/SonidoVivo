import { Link } from "react-router-dom";
import EstadoPedido, { ESTADOS_PEDIDO } from "../molecules/EstadoPedido";
import Selector from "../atoms/Selector";

function TablaPedidos({ pedidos, onCambiarEstado }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-admin">
        <caption>Pedidos registrados en la tienda ({pedidos.length})</caption>

        <thead>
          <tr>
            <th scope="col">N° pedido</th>
            <th scope="col">Fecha</th>
            <th scope="col">Cliente</th>
            <th scope="col">Entrega</th>
            <th scope="col">Productos</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col">Cambiar estado</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <th scope="row">
                <Link to={`/admin/pedidos/${pedido.id}`} className="enlace-texto">{pedido.id}</Link>
              </th>
              <td><time dateTime={pedido.fecha}>{pedido.fecha}</time></td>
              <td>
                {pedido.clienteNombre}
                <br />
                <a href={`mailto:${pedido.clienteCorreo}`} className="tabla-correo">{pedido.clienteCorreo}</a>
              </td>
              <td>
                {pedido.tipoEntrega}
                <address className="tabla-direccion">{pedido.direccion}</address>
              </td>
              <td>
                <details className="tabla-detalle">
                  <summary>Ver ({pedido.items.length})</summary>
                  <ul>
                    {pedido.items.map((item) => (
                      <li key={item.codigo}>{item.cantidad} x {item.nombre}</li>
                    ))}
                  </ul>
                </details>
              </td>
              <td>${pedido.total.toLocaleString('es-CL')}</td>
              <td><EstadoPedido estado={pedido.estado} /></td>
              <td>
                <label htmlFor={`estado-${pedido.id}`} className="visually-hidden">
                  Cambiar estado del pedido {pedido.id}
                </label>
                <Selector
                  id={`estado-${pedido.id}`}
                  name="estado"
                  value={pedido.estado}
                  opciones={ESTADOS_PEDIDO}
                  onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPedidos;
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import EstadoPedido from '../components/molecules/EstadoPedido';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';
import { formatearPrecio } from '../utils/precios';

function AdminComprobante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pedidos } = useTienda();

  const pedido = pedidos.find((p) => p.id === id);

  if (!pedido) {
    return (
      <PlantillaAdmin titulo="Comprobante">
        <section className="aviso-no-encontrado">
          <h2>Pedido no encontrado</h2>
          <p>No existe un pedido con el número {id}.</p>
          <Boton texto="Volver a pedidos" className="btn-sonido-vivo" onClick={() => navigate("/admin/pedidos")} />
        </section>
      </PlantillaAdmin>
    );
  }

  return (
    <PlantillaAdmin titulo={`Comprobante ${pedido.id}`}>
      <article className="card">
        <div className="card-body p-4">
          <header className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h2 className="h4 mb-1">Sonido Vivo</h2>
              <p className="mb-0">Comprobante de compra N° <strong>{pedido.id}</strong></p>
            </div>
            <p className="mb-0">
              Fecha: <time dateTime={pedido.fecha}>{pedido.fecha}</time>
            </p>
          </header>

          <section className="mb-4">
            <h3 id="titulo-cliente" className="h6">Datos del cliente</h3>
            <dl className="resultado-datos">
              <div><dt>Nombre</dt><dd>{pedido.clienteNombre}</dd></div>
              <div><dt>Correo</dt><dd>{pedido.clienteCorreo}</dd></div>
              <div><dt>Teléfono</dt><dd>{pedido.telefono}</dd></div>
              <div><dt>Entrega</dt><dd>{pedido.tipoEntrega}</dd></div>
              <div><dt>Dirección</dt><dd><address className="mb-0">{pedido.direccion}</address></dd></div>
            </dl>
          </section>

          <section className="mb-4">
            <h3 id="titulo-detalle" className="h6">Detalle de la compra</h3>
            <div className="table-responsive">
              <table className="table align-middle tabla-admin">
                <thead>
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Producto</th>
                    <th scope="col" className="text-end">Cantidad</th>
                    <th scope="col" className="text-end">Precio unitario</th>
                    <th scope="col" className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.items.map((item) => (
                    <tr key={item.codigo}>
                      <th scope="row">{item.codigo}</th>
                      <td>{item.nombre}</td>
                      <td className="text-end">{item.cantidad}</td>
                      <td className="text-end">{formatearPrecio(item.precio)}</td>
                      <td className="text-end">{formatearPrecio(item.precio * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan="4" className="text-end">Total</th>
                    <td className="text-end"><strong>{formatearPrecio(pedido.total)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <footer className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <p className="mb-0">Estado: <EstadoPedido estado={pedido.estado} /></p>

            <div className="d-flex gap-2 d-print-none">
              <Boton texto="Imprimir" className="btn-sonido-vivo" onClick={() => window.print()} />
              <Boton texto="Volver a pedidos" className="btn btn-secondary" onClick={() => navigate("/admin/pedidos")} />
            </div>
          </footer>
        </div>
      </article>
    </PlantillaAdmin>
  );
}

export default AdminComprobante;
import { Link, useNavigate } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import Indicador from '../components/molecules/Indicador';
import EstadoPedido from '../components/molecules/EstadoPedido';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';
import { formatearPrecio, STOCK_CRITICO } from '../utils/precios';

function AdminDashboard() {
  const navigate = useNavigate();
  const { pedidos, productos, usuarios } = useTienda();

  const pedidosValidos = pedidos.filter((p) => p.estado !== "Cancelado");
  const ventasTotales = pedidosValidos.reduce((total, p) => total + p.total, 0);
  const porDespachar = pedidos.filter((p) => p.estado === "En preparación").length;
  const productosCriticos = productos.filter((p) => p.stock <= STOCK_CRITICO).length;
  const clientes = usuarios.filter((u) => u.rol === "Cliente").length;

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 5);

  return (
    <PlantillaAdmin titulo="Panel de control">
      <section className="admin-bloque">
        <h2 id="titulo-indicadores" className="visually-hidden">Indicadores de la tienda</h2>

        <div className="row g-3">
          <div className="col-12 col-sm-6 col-xl-3">
            <Indicador titulo="Ventas" valor={formatearPrecio(ventasTotales)} detalle={`${pedidosValidos.length} pedidos válidos`} />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <Indicador titulo="Por despachar" valor={porDespachar} detalle="pedidos en preparación" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <Indicador
              titulo="Productos"
              valor={productos.length}
              detalle={`${productosCriticos} con stock crítico`}
              alerta={productosCriticos > 0}
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <Indicador titulo="Clientes" valor={clientes} detalle={`${usuarios.length} usuarios en total`} />
          </div>
        </div>
      </section>

      <div className="row g-4">
        <section className="col-12 col-lg-8">
          <h2 id="titulo-ultimos" className="h5 mb-3">Últimos pedidos</h2>

          <div className="table-responsive">
            <table className="table table-hover align-middle tabla-admin">
              <thead>
                <tr>
                  <th scope="col">N° pedido</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {ultimosPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <th scope="row">
                      <Link to={`/admin/pedidos/${pedido.id}`} className="enlace-texto">{pedido.id}</Link>
                    </th>
                    <td>{pedido.clienteNombre}</td>
                    <td><time dateTime={pedido.fecha}>{pedido.fecha}</time></td>
                    <td><EstadoPedido estado={pedido.estado} /></td>
                    <td>{formatearPrecio(pedido.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link to="/admin/pedidos" className="enlace-texto">Ver todos los pedidos</Link>
        </section>

        <section className="col-12 col-lg-4">
          <h2 id="titulo-accesos" className="h5 mb-3">Accesos rápidos</h2>

          <nav aria-label="Accesos rápidos">
            <ul className="list-unstyled d-grid gap-2">
              <li><Boton texto="Ver stock crítico" className="btn-sonido-vivo btn-ancho-total" onClick={() => navigate("/admin/criticos")} /></li>
              <li><Boton texto="Gestionar productos" className="btn-sonido-vivo btn-ancho-total" onClick={() => navigate("/admin/productos")} /></li>
              <li><Boton texto="Gestionar pedidos" className="btn-sonido-vivo btn-ancho-total" onClick={() => navigate("/admin/pedidos")} /></li>
              <li><Boton texto="Ir a la tienda" className="btn btn-outline-light w-100" onClick={() => navigate("/")} /></li>
            </ul>
          </nav>
        </section>
      </div>
    </PlantillaAdmin>
  );
}

export default AdminDashboard;
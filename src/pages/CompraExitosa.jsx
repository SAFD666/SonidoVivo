import { useLocation, useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import ResumenCompra from '../components/organisms/ResumenCompra';
import EstadoPedido from '../components/molecules/EstadoPedido';
import Boton from '../components/atoms/Boton';

function CompraExitosa() {
  const location = useLocation();
  const navigate = useNavigate();
  const pedido = location.state?.pedido;

  if (!pedido) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>No hay una compra reciente</h2>
          <p>Puedes revisar el historial de tus compras en Mis Pedidos.</p>
          <Boton texto="Ir a Mis Pedidos" className="btn-sonido-vivo" onClick={() => navigate("/mis-pedidos")} />
        </section>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <div className="resultado-compra resultado-exito">
          <h2>¡Compra realizada con éxito!</h2>
          <p>Gracias por tu compra, {pedido.clienteNombre}. Tu pedido ya está en proceso.</p>

          <dl className="resultado-datos">
            <div><dt>N° de pedido</dt><dd>{pedido.id}</dd></div>
            <div><dt>Fecha</dt><dd>{pedido.fecha}</dd></div>
            <div><dt>Entrega</dt><dd>{pedido.tipoEntrega}</dd></div>
            <div><dt>Dirección</dt><dd>{pedido.direccion}</dd></div>
            <div><dt>Estado</dt><dd><EstadoPedido estado={pedido.estado} /></dd></div>
          </dl>
        </div>

        <div className="resultado-resumen">
          <ResumenCompra items={pedido.items} total={pedido.total} />
        </div>

        <div className="resultado-acciones">
          <Boton texto="Ver Mis Pedidos" className="btn-sonido-vivo" onClick={() => navigate("/mis-pedidos")} />
          <Boton texto="Seguir comprando" className="btn btn-secondary" onClick={() => navigate("/catalogo")} />
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default CompraExitosa;
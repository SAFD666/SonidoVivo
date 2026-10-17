import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import EstadoPedido from '../components/molecules/EstadoPedido';
import Precio from '../components/atoms/Precio';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function MisPedidos() {
  const navigate = useNavigate();
  const { pedidos, usuarioActivo } = useTienda();

  const misPedidos = pedidos
    .filter((p) => p.clienteCorreo.toLowerCase() === usuarioActivo.correo.toLowerCase())
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (misPedidos.length === 0) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>Aún no tienes pedidos</h2>
          <p>Cuando realices una compra, aparecerá aquí con su estado.</p>
          <Boton texto="Ir al Catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} />
        </section>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <h2 className="titulo-seccion">Mis Pedidos</h2>
        <p className="subtitulo-catalogo">
          Tienes {misPedidos.length} {misPedidos.length === 1 ? "pedido" : "pedidos"} registrados
        </p>

        <div className="lista-pedidos">
          {misPedidos.map((pedido) => (
            <article key={pedido.id} className="tarjeta-pedido">
              <header className="tarjeta-pedido-cabecera">
                <div>
                  <h3>{pedido.id}</h3>
                  <small>{pedido.fecha}</small>
                </div>
                <EstadoPedido estado={pedido.estado} />
              </header>

              <ul className="tarjeta-pedido-items">
                {pedido.items.map((item) => (
                  <li key={item.codigo}>
                    <span>{item.cantidad} x {item.nombre}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>

              <footer className="tarjeta-pedido-pie">
                <small>{pedido.tipoEntrega} · {pedido.direccion}</small>
                <Precio precio={pedido.total} />
              </footer>
            </article>
          ))}
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default MisPedidos;
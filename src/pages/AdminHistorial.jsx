import { useParams, useNavigate } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import Indicador from '../components/molecules/Indicador';
import TablaPedidos from '../components/organisms/TablaPedidos';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';
import { formatearPrecio } from '../utils/precios';

function AdminHistorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarios, pedidos, cambiarEstadoPedido } = useTienda();

  const usuario = usuarios.find((u) => String(u.id) === id);

  if (!usuario) {
    return (
      <PlantillaAdmin titulo="Historial de pedidos">
        <section className="aviso-no-encontrado">
          <h2>Usuario no encontrado</h2>
          <p>No existe un usuario con ese identificador.</p>
          <Boton texto="Volver a usuarios" className="btn-sonido-vivo" onClick={() => navigate("/admin/usuarios")} />
        </section>
      </PlantillaAdmin>
    );
  }

  const pedidosUsuario = pedidos
    .filter((p) => p.clienteCorreo.toLowerCase() === usuario.correo.toLowerCase())
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const totalComprado = pedidosUsuario
    .filter((p) => p.estado !== "Cancelado")
    .reduce((total, p) => total + p.total, 0);

  return (
    <PlantillaAdmin titulo={`Historial de ${usuario.nombre}`}>
      <section className="admin-bloque">
        <h2 id="titulo-datos-usuario" className="visually-hidden">Datos del usuario</h2>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <dl className="resultado-datos mt-0 pt-0 border-0">
              <div><dt>Nombre</dt><dd>{usuario.nombre}</dd></div>
              <div><dt>Correo</dt><dd>{usuario.correo}</dd></div>
              <div><dt>Estado</dt><dd>{usuario.activo ? "Activo" : "Inactivo"}</dd></div>
            </dl>
          </div>
          <div className="col-6 col-lg-3">
            <Indicador titulo="Pedidos" valor={pedidosUsuario.length} />
          </div>
          <div className="col-6 col-lg-3">
            <Indicador titulo="Total comprado" valor={formatearPrecio(totalComprado)} detalle="sin contar cancelados" />
          </div>
        </div>
      </section>

      <section className="admin-bloque">
        <h2 id="titulo-historial" className="visually-hidden">Pedidos del usuario</h2>

        {pedidosUsuario.length > 0 ? (
          <TablaPedidos pedidos={pedidosUsuario} onCambiarEstado={cambiarEstadoPedido} />
        ) : (
          <p className="aviso-no-encontrado">Este usuario todavía no ha realizado pedidos.</p>
        )}
      </section>

      <Boton texto="Volver a usuarios" className="btn btn-secondary" onClick={() => navigate("/admin/usuarios")} />
    </PlantillaAdmin>
  );
}

export default AdminHistorial;
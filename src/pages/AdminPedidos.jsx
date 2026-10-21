import { useState, useMemo } from 'react';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import TablaPedidos from '../components/organisms/TablaPedidos';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Selector from '../components/atoms/Selector';
import Boton from '../components/atoms/Boton';
import { ESTADOS_PEDIDO } from '../components/molecules/EstadoPedido';
import { useTienda } from '../context/TiendaContext';

const TODOS = "Todos";

function AdminPedidos() {
  const { pedidos, cambiarEstadoPedido } = useTienda();
  const [filtroEstado, setFiltroEstado] = useState(TODOS);
  const [busqueda, setBusqueda] = useState("");

  const pedidosVisibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return pedidos
      .filter((p) => filtroEstado === TODOS || p.estado === filtroEstado)
      .filter((p) =>
        `${p.id} ${p.clienteNombre} ${p.clienteCorreo}`.toLowerCase().includes(termino)
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [pedidos, filtroEstado, busqueda]);

  const limpiarFiltros = () => {
    setFiltroEstado(TODOS);
    setBusqueda("");
  };

  return (
    <PlantillaAdmin titulo="Gestión de pedidos">
      <section aria-labelledby="titulo-filtros-pedidos" className="admin-bloque">
        <h2 id="titulo-filtros-pedidos" className="visually-hidden">Filtros de pedidos</h2>

        <form className="filtros-admin" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Filtrar pedidos</legend>

            <CampoFormulario
              label="Buscar por N°, cliente o correo"
              id="buscar-pedido"
              name="busqueda"
              type="search"
              placeholder="Ej: PED-1001 o cliente@correo.cl"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="mb-3">
              <label className="form-label" htmlFor="filtro-estado">Estado</label>
              <Selector
                id="filtro-estado"
                name="filtroEstado"
                value={filtroEstado}
                opciones={[TODOS, ...ESTADOS_PEDIDO]}
                onChange={(e) => setFiltroEstado(e.target.value)}
              />
            </div>

            <Boton texto="Limpiar filtros" type="button" className="btn btn-secondary" onClick={limpiarFiltros} />
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="titulo-listado-pedidos" className="admin-bloque">
        <h2 id="titulo-listado-pedidos" className="visually-hidden">Listado de pedidos</h2>

        {pedidosVisibles.length > 0 ? (
          <TablaPedidos pedidos={pedidosVisibles} onCambiarEstado={cambiarEstadoPedido} />
        ) : (
          <p className="aviso-no-encontrado">No hay pedidos que coincidan con los filtros.</p>
        )}
      </section>
    </PlantillaAdmin>
  );
}

export default AdminPedidos;
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import TablaProductos from '../components/organisms/TablaProductos';
import FormularioProducto from '../components/organisms/FormularioProducto';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function AdminProductos() {
  const { productos, guardarProducto, eliminarProducto } = useTienda();
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const location = useLocation();

  // Si llegamos desde otra pagina con un producto para editar, el formulario parte abierto
  const [formulario, setFormulario] = useState(() => {
    const productoAEditar = productos.find((p) => p.codigo === location.state?.editar);
    return productoAEditar ? { producto: productoAEditar } : null; // null = cerrado | { producto: null } = nuevo | { producto } = editar
  });

  const productosVisibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos
      .filter((p) =>
        `${p.codigo} ${p.nombre} ${p.marca} ${p.modelo} ${p.categoria}`.toLowerCase().includes(termino)
      )
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
  }, [productos, busqueda]);

  const abrirFormulario = (producto = null) => {
    setMensaje("");
    setFormulario({ producto });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cerrarFormulario = () => {
    setFormulario(null);
  };

  const guardar = (producto) => {
    const esEdicion = Boolean(formulario.producto);
    guardarProducto(producto);
    setMensaje(
      esEdicion
        ? `Producto ${producto.codigo} actualizado correctamente.`
        : `Producto ${producto.codigo} creado correctamente.`
    );
    setFormulario(null);
  };

  const confirmarEliminar = (producto) => {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar "${producto.nombre}" (${producto.codigo})? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    eliminarProducto(producto.codigo);
    setMensaje(`Producto ${producto.codigo} eliminado.`);
    if (formulario?.producto?.codigo === producto.codigo) {
      setFormulario(null);
    }
  };

  return (
    <PlantillaAdmin titulo="Gestión de productos">
      <div className="admin-barra-acciones">
        <Boton texto="+ Nuevo producto" className="btn-sonido-vivo" onClick={() => abrirFormulario()} />
      </div>

      {mensaje && (
        <p className="mensaje-exito" role="status">{mensaje}</p>
      )}

      {formulario && (
        <section className="admin-bloque">
          <FormularioProducto
            key={formulario.producto?.codigo || "nuevo"}
            productoInicial={formulario.producto}
            codigosExistentes={productos.map((p) => p.codigo)}
            onGuardar={guardar}
            onCancelar={cerrarFormulario}
          />
        </section>
      )}

      <section aria-labelledby="titulo-filtros-productos" className="admin-bloque">
        <h2 id="titulo-filtros-productos" className="visually-hidden">Buscar productos</h2>

        <form className="filtros-admin" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Buscar productos</legend>
            <CampoFormulario
              label="Código, nombre, marca, modelo o categoría"
              id="buscar-producto"
              name="busqueda"
              type="search"
              placeholder="Ej: GA001, Yamaha o Pedales"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="titulo-listado-productos" className="admin-bloque">
        <h2 id="titulo-listado-productos" className="visually-hidden">Listado de productos</h2>

        {productosVisibles.length > 0 ? (
          <TablaProductos
            productos={productosVisibles}
            onEditar={(producto) => abrirFormulario(producto)}
            onEliminar={confirmarEliminar}
          />
        ) : (
          <p className="aviso-no-encontrado">No hay productos que coincidan con la búsqueda.</p>
        )}
      </section>
    </PlantillaAdmin>
  );
}

export default AdminProductos;
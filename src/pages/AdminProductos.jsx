import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import TablaProductos from '../components/organisms/TablaProductos';
import FormularioProducto from '../components/organisms/FormularioProducto';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function AdminProductos() {
  const { productos, categorias, guardarProducto, eliminarProducto } = useTienda();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [porEliminar, setPorEliminar] = useState(null); // producto que espera confirmación
  const [eliminando, setEliminando] = useState(false);

  // Si llegamos desde otra página con un producto para editar, el formulario parte abierto
  const [formulario, setFormulario] = useState(() => {
    const productoAEditar = productos.find((p) => p.codigo === location.state?.editar);
    return productoAEditar ? { producto: productoAEditar } : null;
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
    setError("");
    setFormulario({ producto });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cerrarFormulario = () => {
    setFormulario(null);
  };

  // async: POST /productos (nuevo) o PUT /productos/{codigo} (edición)
  const guardar = async (producto) => {
    const esEdicion = Boolean(formulario.producto);
    setError("");
    const resultado = await guardarProducto(producto, esEdicion);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setMensaje(
      esEdicion
        ? `Producto ${resultado.producto.codigo} actualizado correctamente.`
        : `Producto ${resultado.producto.codigo} creado correctamente.`
    );
    setFormulario(null);
  };

  // async: DELETE /productos/{codigo} (el backend lo desactiva, no lo borra)
  const confirmarEliminar = async () => {
    const producto = porEliminar;
    setError("");
    setEliminando(true);
    const resultado = await eliminarProducto(producto.codigo);
    setEliminando(false);
    setPorEliminar(null);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
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

      {mensaje && <p className="mensaje-exito" role="status">{mensaje}</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {formulario && (
        <section className="admin-bloque">
          <FormularioProducto
            key={formulario.producto?.codigo || "nuevo"}
            productoInicial={formulario.producto}
            categorias={categorias}
            codigosExistentes={productos.map((p) => p.codigo)}
            onGuardar={guardar}
            onCancelar={cerrarFormulario}
          />
        </section>
      )}

      <section className="admin-bloque">
        <h2 className="visually-hidden">Buscar productos</h2>
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

      <section className="admin-bloque">
        <h2 className="visually-hidden">Listado de productos</h2>
        {productosVisibles.length > 0 ? (
          <TablaProductos
            productos={productosVisibles}
            onEditar={(producto) => abrirFormulario(producto)}
            onEliminar={(producto) => setPorEliminar(producto)}
          />
        ) : (
          <p className="aviso-no-encontrado">No hay productos que coincidan con la búsqueda.</p>
        )}
      </section>

      {/* Confirmación dentro de la página (en vez de la ventana del navegador) */}
      <Modal show={Boolean(porEliminar)} onHide={() => setPorEliminar(null)} centered data-bs-theme="dark">
        <Modal.Header closeButton>
          <Modal.Title>Eliminar producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar <strong>{porEliminar?.nombre}</strong> ({porEliminar?.codigo})?
          Dejará de mostrarse en la tienda, pero se conserva en los pedidos anteriores.
        </Modal.Body>
        <Modal.Footer>
          <Boton texto="Cancelar" className="btn btn-secondary" onClick={() => setPorEliminar(null)} />
          <Boton
            texto={eliminando ? "Eliminando..." : "Eliminar"}
            className="btn btn-danger"
            deshabilitado={eliminando}
            onClick={confirmarEliminar}
          />
        </Modal.Footer>
      </Modal>
    </PlantillaAdmin>
  );
}

export default AdminProductos;
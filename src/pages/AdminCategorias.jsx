import { useState } from 'react';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

const CATEGORIA_VACIA = { nombre: "", imagen: "" };

function AdminCategorias() {
  const { categorias, productos, guardarCategoria } = useTienda();
  const [editando, setEditando] = useState(null); // null = nueva | nombre de la categoría que se edita
  const [datos, setDatos] = useState(CATEGORIA_VACIA);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const contarProductos = (nombre) => productos.filter((p) => p.categoria === nombre).length;

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const editar = (categoria) => {
    setEditando(categoria.nombre);
    setDatos({ nombre: categoria.nombre, imagen: categoria.imagen });
    setError("");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const limpiar = () => {
    setEditando(null);
    setDatos(CATEGORIA_VACIA);
    setError("");
  };

  const enviar = (e) => {
    e.preventDefault();
    if (datos.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    const resultado = guardarCategoria(editando, datos);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }

    setMensaje(editando ? `Categoría "${datos.nombre.trim()}" actualizada.` : `Categoría "${datos.nombre.trim()}" creada.`);
    limpiar();
  };

  return (
    <PlantillaAdmin titulo="Gestión de categorías">
      {mensaje && <p className="mensaje-exito" role="status">{mensaje}</p>}

      <div className="row g-4">
        <section className="col-12 col-lg-5">
          <form className="card card-body" onSubmit={enviar} noValidate>
            <h2 className="h5 mb-3">{editando ? `Editar: ${editando}` : "Nueva categoría"}</h2>

            {error && <p className="alert alert-danger py-2">{error}</p>}

            <fieldset className="border rounded p-3 mb-3">
              <legend className="float-none w-auto px-2 fs-6">Datos de la categoría</legend>
              <CampoFormulario label="Nombre" id="categoria-nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej: Instrumentos de Viento" />
              <CampoFormulario label="Imagen (ruta o URL)" id="categoria-imagen" name="imagen" value={datos.imagen} onChange={cambiar} placeholder="Ej: /img/viento.png" />
              <p className="form-text mb-0">Si la dejas vacía, se usa el logo de la tienda.</p>
            </fieldset>

            <div className="d-flex gap-2">
              <Boton texto={editando ? "Guardar cambios" : "Crear categoría"} type="submit" className="btn-sonido-vivo" />
              {editando && <Boton texto="Cancelar" type="button" className="btn btn-secondary" onClick={limpiar} />}
            </div>
          </form>
        </section>

        <section className="col-12 col-lg-7">
          <h2 className="visually-hidden">Listado de categorías</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle tabla-admin">
              <caption>Categorías de la tienda ({categorias.length})</caption>
              <thead>
                <tr>
                  <th scope="col">Imagen</th>
                  <th scope="col">Nombre</th>
                  <th scope="col" className="text-end">Productos</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.nombre}>
                    <td><img src={categoria.imagen} alt={categoria.nombre} className="tabla-miniatura" /></td>
                    <th scope="row">{categoria.nombre}</th>
                    <td className="text-end">{contarProductos(categoria.nombre)}</td>
                    <td>
                      <Boton texto="Editar" className="btn btn-sm btn-outline-warning" onClick={() => editar(categoria)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PlantillaAdmin>
  );
}

export default AdminCategorias;
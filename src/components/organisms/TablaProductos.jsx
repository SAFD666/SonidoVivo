import Boton from "../atoms/Boton";
import EtiquetaStock from "../atoms/EtiquetaStock";

function TablaProductos({ productos, onEditar, onEliminar }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-admin">
        <caption>Productos del catálogo ({productos.length})</caption>

        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Marca / Modelo</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col">Oferta</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.codigo}>
              <th scope="row">{p.codigo}</th>
              <td>
                <img src={p.imagen} alt={p.nombre} className="tabla-miniatura" loading="lazy" />
              </td>
              <td>{p.nombre}</td>
              <td>
                {p.marca}
                <br />
                <span className="tabla-direccion">{p.modelo}</span>
              </td>
              <td>{p.categoria}</td>
              <td>${Number(p.precio).toLocaleString('es-CL')}</td>
              <td><EtiquetaStock stock={p.stock} /></td>
              <td>{p.esOferta ? "Sí" : "No"}</td>
              <td>
                <div className="acciones-tabla">
                  {onEditar && (
                    <Boton texto="Editar" className="btn btn-sm btn-outline-warning" onClick={() => onEditar(p)} />
                  )}
                  <Boton texto="Eliminar" className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(p)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaProductos;
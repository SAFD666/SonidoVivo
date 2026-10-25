import Boton from "../atoms/Boton";

function TablaUsuarios({ usuarios, onEditar, onVerPedidos }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle tabla-admin">
        <caption>Usuarios registrados ({usuarios.length})</caption>

        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <th scope="row">{usuario.nombre}</th>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <span className={`badge ${usuario.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Boton texto="Editar" className="btn btn-sm btn-outline-warning" onClick={() => onEditar(usuario)} />
                  {onVerPedidos && usuario.rol === "Cliente" && (
                    <Boton texto="Ver pedidos" className="btn btn-sm btn-outline-light" onClick={() => onVerPedidos(usuario)} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
import { useState } from 'react';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function AdminPerfil() {
  const { usuarioActivo, guardarUsuario } = useTienda();
  const [nombre, setNombre] = useState(usuarioActivo.nombre);
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const enviar = (e) => {
    e.preventDefault();
    setMensaje("");

    const nuevosErrores = {};
    if (nombre.trim().length < 3) nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (password && password.length < 6) nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const resultado = guardarUsuario({ ...usuarioActivo, nombre: nombre.trim(), password });
    if (resultado.exito) {
      setMensaje("Tus datos se actualizaron correctamente.");
      setPassword("");
    }
  };

  return (
    <PlantillaAdmin titulo="Mi perfil">
      {mensaje && <p className="mensaje-exito" role="status">{mensaje}</p>}

      <div className="row g-4">
        <section className="col-12 col-lg-5">
          <h2 className="h5 mb-3">Mis datos</h2>
          <dl className="resultado-datos mt-0 pt-0 border-0">
            <div><dt>Nombre</dt><dd>{usuarioActivo.nombre}</dd></div>
            <div><dt>Correo</dt><dd>{usuarioActivo.correo}</dd></div>
            <div><dt>Rol</dt><dd>{usuarioActivo.rol}</dd></div>
            <div><dt>Estado</dt><dd>{usuarioActivo.activo ? "Activo" : "Inactivo"}</dd></div>
          </dl>
        </section>

        <section className="col-12 col-lg-7">
          <form className="card card-body" onSubmit={enviar} noValidate>
            <h2 className="h5 mb-3">Actualizar mis datos</h2>

            <fieldset className="border rounded p-3 mb-3">
              <legend className="float-none w-auto px-2 fs-6">Datos de acceso</legend>

              <CampoFormulario
                label="Nombre completo"
                id="perfil-nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={errores.nombre}
              />

              <CampoFormulario
                label="Nueva contraseña (opcional)"
                id="perfil-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errores.password}
              />
              <p className="form-text mb-0">Déjala vacía para mantener tu contraseña actual.</p>
            </fieldset>

            <div>
              <Boton texto="Guardar cambios" type="submit" className="btn-sonido-vivo" />
            </div>
          </form>
        </section>
      </div>
    </PlantillaAdmin>
  );
}

export default AdminPerfil;
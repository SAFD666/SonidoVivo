import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario";
import Selector from "../atoms/Selector";
import Boton from "../atoms/Boton";

const ROLES = ["Cliente", "Vendedor", "Administrador"];

const USUARIO_VACIO = {
  nombre: "",
  correo: "",
  password: "",
  rol: "Cliente",
  activo: true,
};

function FormularioUsuario({ usuarioInicial, esUsuarioActual = false, onGuardar, onCancelar }) {
  const esEdicion = Boolean(usuarioInicial);
  const [datos, setDatos] = useState(
    usuarioInicial ? { ...usuarioInicial, password: "" } : USUARIO_VACIO
  );
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (datos.nombre.trim().length < 3) nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if ((!esEdicion || datos.password) && datos.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onGuardar({ ...datos, nombre: datos.nombre.trim(), correo: datos.correo.trim() });
  };

  return (
    <form className="card card-body mb-4" onSubmit={enviar} noValidate aria-labelledby="titulo-form-usuario">
      <h2 id="titulo-form-usuario" className="h5 mb-3">
        {esEdicion ? `Editar usuario: ${usuarioInicial.nombre}` : "Nuevo usuario"}
      </h2>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Datos personales</legend>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoFormulario label="Nombre completo" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej: Juan Pérez" error={errores.nombre} />
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario label="Correo electrónico" id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ejemplo@correo.cl" error={errores.correo} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Acceso al sistema</legend>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoFormulario
              label={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
              id="password"
              name="password"
              type="password"
              value={datos.password}
              onChange={cambiar}
              error={errores.password}
            />
            {esEdicion && <p className="form-text">Déjala vacía para mantener la contraseña actual.</p>}
          </div>
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label" htmlFor="rol">Rol</label>
            <Selector id="rol" name="rol" value={datos.rol} onChange={cambiar} opciones={ROLES} />
          </div>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="activo"
            name="activo"
            checked={datos.activo}
            onChange={cambiar}
            disabled={esUsuarioActual}
          />
          <label className="form-check-label" htmlFor="activo">Usuario activo (puede iniciar sesión)</label>
        </div>
        {esUsuarioActual && <p className="form-text">No puedes desactivar tu propia cuenta.</p>}
      </fieldset>

      <div className="d-flex gap-2">
        <Boton texto={esEdicion ? "Guardar cambios" : "Crear usuario"} type="submit" className="btn-sonido-vivo" />
        <Boton texto="Cancelar" type="button" className="btn btn-secondary" onClick={onCancelar} />
      </div>
    </form>
  );
}

export default FormularioUsuario;
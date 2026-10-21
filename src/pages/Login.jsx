import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlantillaPublica from "../components/templates/PlantillaPublica";
import CampoFormulario from "../components/molecules/CampoFormulario";
import Boton from "../components/atoms/Boton";
import { useTienda } from '../context/TiendaContext';

const FORMULARIO_VACIO = { nombre: "", correo: "", password: "", confirmar: "" };

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { iniciarSesion, registrarUsuario } = useTienda();

  const [modoRegistro, setModoRegistro] = useState(false);
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");

  const destino = location.state?.desde || "/";

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const cambiarModo = () => {
    setModoRegistro(!modoRegistro);
    setDatos(FORMULARIO_VACIO);
    setErrores({});
    setMensajeError("");
  };

  const validar = () => {
    const nuevosErrores = {};
    if (modoRegistro && datos.nombre.trim().length < 3) nuevosErrores.nombre = "Ingresa tu nombre completo.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (datos.password.length < 6) nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres.";
    if (modoRegistro && datos.password !== datos.confirmar) nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    setMensajeError("");
    if (!validar()) return;

    const resultado = modoRegistro
      ? registrarUsuario(datos.nombre.trim(), datos.correo.trim(), datos.password)
      : iniciarSesion(datos.correo.trim(), datos.password);

    if (resultado.exito) {
      const destinoPorRol = resultado.usuario.rol === "Cliente" ? "/" : "/admin";
      navigate(location.state?.desde || destinoPorRol, { replace: true });
    } else {
      setMensajeError(resultado.mensaje);
    }
  };

  return (
    <PlantillaPublica>
      <div className="Titulo">
        <h2>{modoRegistro ? "Crear Cuenta" : "Iniciar Sesión"}</h2>

        {location.state?.desde && (
          <p className="aviso-login">Debes iniciar sesión para continuar.</p>
        )}

        {mensajeError && (
          <div className="alert alert-danger py-2">{mensajeError}</div>
        )}

        <form onSubmit={enviar} noValidate>
          {modoRegistro && (
            <CampoFormulario label="Nombre completo" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Juan Pérez" error={errores.nombre} />
          )}

          <CampoFormulario label="Correo electrónico" id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ejemplo@correo.com" error={errores.correo} />

          <CampoFormulario label="Contraseña" id="password" name="password" type="password" value={datos.password} onChange={cambiar} placeholder="Ingresa tu contraseña" error={errores.password} />

          {modoRegistro && (
            <CampoFormulario label="Confirmar contraseña" id="confirmar" name="confirmar" type="password" value={datos.confirmar} onChange={cambiar} placeholder="Repite tu contraseña" error={errores.confirmar} />
          )}

          <Boton
            texto={modoRegistro ? "Registrarme" : "Ingresar"}
            type="submit"
            className="btn-sonido-vivo btn-ancho-total"
          />
        </form>

        <p className="cambiar-modo-login">
          {modoRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button type="button" className="enlace-texto" onClick={cambiarModo}>
            {modoRegistro ? "Inicia sesión" : "Regístrate aquí"}
          </button>
        </p>
      </div>
    </PlantillaPublica>
  );
}

export default Login;
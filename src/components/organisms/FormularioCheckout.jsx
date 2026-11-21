import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario";
import Selector from "../atoms/Selector";
import Boton from "../atoms/Boton";

// "Cliente Prueba" -> { nombre: "Cliente", apellidos: "Prueba" }
function separarNombre(nombreCompleto = "") {
  const [nombre = "", ...apellidos] = nombreCompleto.trim().split(" ");
  return { nombre, apellidos: apellidos.join(" ") };
}

// Formulario del checkout. Recibe por props las opciones que vienen de la API
// (props.tiposEntrega, props.metodosPago, props.regiones) y avisa con props.onConfirmar.
function FormularioCheckout(props) {
  const separado = separarNombre(props.usuario?.nombre);

  const [datos, setDatos] = useState({
    nombre: separado.nombre,
    apellidos: separado.apellidos,
    correo: props.usuario ? props.usuario.correo : "",
    telefono: "",
    tipoEntrega: props.tiposEntrega[0],
    metodoPago: props.metodosPago[0],
    idRegion: "",
    idComuna: "",
    calle: "",
    numero: "",
    depto: "",
    simularRechazo: false,
  });
  const [errores, setErrores] = useState({});

  // Retiro en tienda no necesita dirección de despacho
  const esRetiro = datos.tipoEntrega.toLowerCase().startsWith("retiro");
  const comunas = props.regiones.find((r) => String(r.id) === datos.idRegion)?.comunas || [];

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevo = { ...datos, [name]: type === "checkbox" ? checked : value };
    if (name === "idRegion") nuevo.idComuna = ""; // al cambiar de región, se vuelve a elegir la comuna
    setDatos(nuevo);
  };

  const validar = () => {
    const nuevosErrores = {};
    if (datos.nombre.trim().length < 2) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (datos.apellidos.trim().length < 2) nuevosErrores.apellidos = "Ingresa tus apellidos.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (!/^\+?\d{8,12}$/.test(datos.telefono.replace(/\s/g, ""))) nuevosErrores.telefono = "Ingresa un teléfono válido (ej: +56912345678).";
    if (!esRetiro) {
      if (!datos.idComuna) nuevosErrores.idComuna = "Elige la región y la comuna.";
      if (datos.calle.trim().length < 3) nuevosErrores.calle = "Ingresa la calle.";
      if (!datos.numero.trim()) nuevosErrores.numero = "Ingresa el número.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validar()) return;

    props.onConfirmar({
      nombre: `${datos.nombre.trim()} ${datos.apellidos.trim()}`,
      telefono: datos.telefono,
      tipoEntrega: datos.tipoEntrega,
      metodoPago: datos.metodoPago,
      simularRechazo: datos.simularRechazo,
      direccion: esRetiro
        ? null
        : { calle: datos.calle.trim(), numero: datos.numero.trim(), depto: datos.depto.trim(), idComuna: Number(datos.idComuna) },
    });
  };

  return (
    <form className="formulario-checkout" onSubmit={enviar} noValidate>
      <h3>Datos de la compra</h3>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Datos personales</legend>
        <div className="row">
          <div className="col-12 col-md-6">
            <CampoFormulario label="Nombre" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej: Juan" error={errores.nombre} />
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario label="Apellidos" id="apellidos" name="apellidos" value={datos.apellidos} onChange={cambiar} placeholder="Ej: Pérez Soto" error={errores.apellidos} />
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario label="Correo electrónico" id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ejemplo@correo.com" error={errores.correo} />
          </div>
          <div className="col-12 col-md-6">
            <CampoFormulario label="Teléfono" id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar} placeholder="+56912345678" error={errores.telefono} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Entrega</legend>
        <div className="mb-3">
          <label className="form-label" htmlFor="tipoEntrega">Tipo de entrega</label>
          <Selector id="tipoEntrega" name="tipoEntrega" value={datos.tipoEntrega} onChange={cambiar} opciones={props.tiposEntrega} />
        </div>

        {esRetiro ? (
          <p className="form-text mb-0">Retiras tu pedido en la tienda de Viña del Mar: no necesitas dirección.</p>
        ) : (
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label" htmlFor="idRegion">Región</label>
              <select id="idRegion" name="idRegion" className="form-select" value={datos.idRegion} onChange={cambiar}>
                <option value="">Elige una región</option>
                {props.regiones.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label" htmlFor="idComuna">Comuna</label>
              <select id="idComuna" name="idComuna" className="form-select" value={datos.idComuna} onChange={cambiar} disabled={!datos.idRegion}>
                <option value="">Elige una comuna</option>
                {comunas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errores.idComuna && <small className="text-danger">{errores.idComuna}</small>}
            </div>
            <div className="col-12 col-md-6">
              <CampoFormulario label="Calle" id="calle" name="calle" value={datos.calle} onChange={cambiar} placeholder="Av. Libertad" error={errores.calle} />
            </div>
            <div className="col-6 col-md-3">
              <CampoFormulario label="Número" id="numero" name="numero" value={datos.numero} onChange={cambiar} placeholder="450" error={errores.numero} />
            </div>
            <div className="col-6 col-md-3">
              <CampoFormulario label="Depto (opcional)" id="depto" name="depto" value={datos.depto} onChange={cambiar} placeholder="12B" />
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Pago</legend>
        <div className="mb-3">
          <label className="form-label" htmlFor="metodoPago">Método de pago</label>
          <Selector id="metodoPago" name="metodoPago" value={datos.metodoPago} onChange={cambiar} opciones={props.metodosPago} />
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="simularRechazo" name="simularRechazo" checked={datos.simularRechazo} onChange={cambiar} />
          <label className="form-check-label" htmlFor="simularRechazo">Simular pago rechazado (demo)</label>
        </div>
      </fieldset>

      <Boton
        texto={props.enviando ? "Procesando pago..." : "Confirmar y pagar"}
        type="submit"
        deshabilitado={props.enviando}
        className="btn-sonido-vivo btn-ancho-total"
      />
    </form>
  );
}

export default FormularioCheckout;
import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario";
import Selector from "../atoms/Selector";
import Boton from "../atoms/Boton";

const TIPOS_ENTREGA = ["Retiro en Tienda (Viña del Mar)", "Despacho Starken", "Despacho Chilexpress"];
const METODOS_PAGO = ["Tarjeta de crédito", "Tarjeta de débito", "Transferencia bancaria"];

// "Cliente Prueba" -> { nombre: "Cliente", apellidos: "Prueba" }
function separarNombre(nombreCompleto = "") {
  const [nombre = "", ...apellidos] = nombreCompleto.trim().split(" ");
  return { nombre, apellidos: apellidos.join(" ") };
}

function FormularioCheckout({ usuario, onConfirmar }) {
  const { nombre, apellidos } = separarNombre(usuario?.nombre);

  const [datos, setDatos] = useState({
    nombre,
    apellidos,
    correo: usuario ? usuario.correo : "",
    telefono: "",
    direccion: "",
    tipoEntrega: TIPOS_ENTREGA[0],
    metodoPago: METODOS_PAGO[0],
    simularRechazo: false,
  });
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (datos.nombre.trim().length < 2) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (datos.apellidos.trim().length < 2) nuevosErrores.apellidos = "Ingresa tus apellidos.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (!/^\+?\d{8,12}$/.test(datos.telefono.replace(/\s/g, ""))) nuevosErrores.telefono = "Ingresa un teléfono válido (ej: +56912345678).";
    if (datos.direccion.trim().length < 5) nuevosErrores.direccion = "Ingresa una dirección válida.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validar()) return;

    // El pedido guarda el nombre completo (nombre + apellidos)
    onConfirmar({
      ...datos,
      nombre: `${datos.nombre.trim()} ${datos.apellidos.trim()}`,
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
          <Selector id="tipoEntrega" name="tipoEntrega" value={datos.tipoEntrega} onChange={cambiar} opciones={TIPOS_ENTREGA} />
        </div>
        <CampoFormulario label="Dirección" id="direccion" name="direccion" value={datos.direccion} onChange={cambiar} placeholder="Av. Libertad 450, Viña del Mar" error={errores.direccion} />
      </fieldset>

      <fieldset className="border rounded p-3 mb-3">
        <legend className="float-none w-auto px-2 fs-6">Pago</legend>
        <div className="mb-3">
          <label className="form-label" htmlFor="metodoPago">Método de pago</label>
          <Selector id="metodoPago" name="metodoPago" value={datos.metodoPago} onChange={cambiar} opciones={METODOS_PAGO} />
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="simularRechazo" name="simularRechazo" checked={datos.simularRechazo} onChange={cambiar} />
          <label className="form-check-label" htmlFor="simularRechazo">Simular pago rechazado (demo)</label>
        </div>
      </fieldset>

      <Boton texto="Confirmar y pagar" type="submit" className="btn-sonido-vivo btn-ancho-total" />
    </form>
  );
}

export default FormularioCheckout;
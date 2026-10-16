import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario";
import Selector from "../atoms/Selector";
import Boton from "../atoms/Boton";

const TIPOS_ENTREGA = ["Retiro en Tienda (Viña del Mar)", "Despacho Starken", "Despacho Chilexpress"];
const METODOS_PAGO = ["Tarjeta de crédito", "Tarjeta de débito", "Transferencia bancaria"];

function FormularioCheckout({ usuario, onConfirmar }) {
  const [datos, setDatos] = useState({
    nombre: usuario ? usuario.nombre : "",
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
    if (datos.nombre.trim().length < 3) nuevosErrores.nombre = "Ingresa tu nombre completo.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (!/^\+?\d{8,12}$/.test(datos.telefono.replace(/\s/g, ""))) nuevosErrores.telefono = "Ingresa un teléfono válido (ej: +56912345678).";
    if (datos.direccion.trim().length < 5) nuevosErrores.direccion = "Ingresa una dirección válida.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (validar()) {
      onConfirmar(datos);
    }
  };

  return (
    <form className="formulario-checkout" onSubmit={enviar} noValidate>
      <h3>Datos de entrega</h3>

      <CampoFormulario label="Nombre completo" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Juan Pérez" error={errores.nombre} />
      <CampoFormulario label="Correo electrónico" id="correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ejemplo@correo.com" error={errores.correo} />
      <CampoFormulario label="Teléfono" id="telefono" name="telefono" type="tel" value={datos.telefono} onChange={cambiar} placeholder="+56912345678" error={errores.telefono} />
      <CampoFormulario label="Dirección" id="direccion" name="direccion" value={datos.direccion} onChange={cambiar} placeholder="Av. Libertad 450, Viña del Mar" error={errores.direccion} />

      <div className="mb-3">
        <label className="form-label" htmlFor="tipoEntrega">Tipo de entrega</label>
        <Selector id="tipoEntrega" name="tipoEntrega" value={datos.tipoEntrega} onChange={cambiar} opciones={TIPOS_ENTREGA} />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="metodoPago">Método de pago</label>
        <Selector id="metodoPago" name="metodoPago" value={datos.metodoPago} onChange={cambiar} opciones={METODOS_PAGO} />
      </div>

      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="simularRechazo" name="simularRechazo" checked={datos.simularRechazo} onChange={cambiar} />
        <label className="form-check-label" htmlFor="simularRechazo">Simular pago rechazado (demo)</label>
      </div>

      <Boton texto="Confirmar y pagar" type="submit" className="btn-sonido-vivo btn-ancho-total" />
    </form>
  );
}

export default FormularioCheckout;
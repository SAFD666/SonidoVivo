import { useState } from 'react';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';

const MENSAJE_VACIO = { nombre: "", correo: "", asunto: "", mensaje: "" };

function Contacto() {
  const [datos, setDatos] = useState(MENSAJE_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (datos.nombre.trim().length < 3) nuevosErrores.nombre = "Ingresa tu nombre.";
    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) nuevosErrores.correo = "Ingresa un correo válido.";
    if (datos.asunto.trim().length < 3) nuevosErrores.asunto = "Ingresa el asunto.";
    if (datos.mensaje.trim().length < 10) nuevosErrores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    setEnviado(false);
    if (!validar()) return;

    setEnviado(true);
    setDatos(MENSAJE_VACIO);
  };

  return (
    <PlantillaPublica>
      <section className="contenedor-principal text-start">
        <header className="mb-4">
          <h2 className="titulo-seccion">Contacto</h2>
          <p className="subtitulo-catalogo text-start">
            ¿Tienes dudas sobre un producto o un pedido? Escríbenos y te responderemos a la brevedad.
          </p>
        </header>

        <div className="row g-4">
          <section className="col-12 col-lg-7">
            <form className="card card-body" onSubmit={enviar} noValidate>
              <h3 className="h5 mb-3">Envíanos un mensaje</h3>

              {enviado && (
                <p className="mensaje-exito" role="status">
                  ¡Gracias! Recibimos tu mensaje y te responderemos pronto.
                </p>
              )}

              <fieldset className="border rounded p-3 mb-3">
                <legend className="float-none w-auto px-2 fs-6">Tus datos</legend>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <CampoFormulario label="Nombre" id="contacto-nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej: Juan Pérez" error={errores.nombre} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CampoFormulario label="Correo electrónico" id="contacto-correo" name="correo" type="email" value={datos.correo} onChange={cambiar} placeholder="ejemplo@correo.cl" error={errores.correo} />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border rounded p-3 mb-3">
                <legend className="float-none w-auto px-2 fs-6">Tu consulta</legend>
                <CampoFormulario label="Asunto" id="contacto-asunto" name="asunto" value={datos.asunto} onChange={cambiar} placeholder="Ej: Consulta por despacho" error={errores.asunto} />

                <div className="mb-3 campo-formulario">
                  <label className="form-label" htmlFor="contacto-mensaje">Mensaje</label>
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    className="form-control"
                    rows="5"
                    value={datos.mensaje}
                    onChange={cambiar}
                    placeholder="Escribe tu consulta"
                  />
                  {errores.mensaje && <small className="texto-error">{errores.mensaje}</small>}
                </div>
              </fieldset>

              <div>
                <Boton texto="Enviar mensaje" type="submit" className="btn-sonido-vivo" />
              </div>
            </form>
          </section>

          <aside className="col-12 col-lg-5">
            <div className="card card-body h-100">
              <h3 className="h5 mb-3">Otras formas de contactarnos</h3>
              <dl className="resultado-datos mt-0 pt-0 border-0">
                <div><dt>Dirección</dt><dd><address className="mb-0">Av. Libertad 450, Viña del Mar</address></dd></div>
                <div><dt>Teléfono</dt><dd><a href="tel:+56912345678">+56 9 1234 5678</a></dd></div>
                <div><dt>Correo</dt><dd><a href="mailto:contacto@sonidovivo.cl">contacto@sonidovivo.cl</a></dd></div>
                <div><dt>Horario</dt><dd>Lun a vie 10:00–19:00 · Sáb 10:00–14:00</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Contacto;
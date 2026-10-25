import { useState } from "react";
import CampoFormulario from "../molecules/CampoFormulario";
import Selector from "../atoms/Selector";
import Boton from "../atoms/Boton";

export const CATEGORIAS_PRODUCTO = [
  "Guitarras Acústicas",
  "Guitarras Eléctricas",
  "Bajos",
  "Baterías y Percusión",
  "Teclados y Pianos",
  "Amplificadores",
  "Pedales y Efectos",
  "Estudio y Grabación",
  "Accesorios",
];

const IMAGEN_POR_CATEGORIA = {
  "Guitarras Acústicas": "/img/acustica.png",
  "Guitarras Eléctricas": "/img/electrica.png",
  "Bajos": "/img/bajo electrico.png",
  "Baterías y Percusión": "/img/baterias.png",
  "Teclados y Pianos": "/img/pianos y teclados.png",
  "Amplificadores": "/img/amplificadores.png",
  "Pedales y Efectos": "/img/pedales de efecto.png",
  "Estudio y Grabación": "/img/estudio y grabacion.png",
  "Accesorios": "/img/accesorios.png",
};

const PRODUCTO_VACIO = {
  codigo: "",
  nombre: "",
  marca: "",
  modelo: "",
  categoria: CATEGORIAS_PRODUCTO[0],
  precio: "",
  stock: "",
  imagen: "",
  descripcion: "",
  esOferta: false,
};

function FormularioProducto({ productoInicial, codigosExistentes = [], onGuardar, onCancelar }) {
  const esEdicion = Boolean(productoInicial);
  const [datos, setDatos] = useState(
    productoInicial ? { ...PRODUCTO_VACIO, ...productoInicial } : PRODUCTO_VACIO
  );
  const [errores, setErrores] = useState({});

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  };

  const validar = () => {
    const nuevosErrores = {};
    const codigo = String(datos.codigo).trim().toUpperCase();
    const precio = Number(datos.precio);
    const stock = Number(datos.stock);

    if (!esEdicion) {
      if (!/^[A-Z]{2}\d{3}$/.test(codigo)) {
        nuevosErrores.codigo = "Formato: 2 letras y 3 números (ej: GA006).";
      } else if (codigosExistentes.includes(codigo)) {
        nuevosErrores.codigo = "Ya existe un producto con ese código.";
      }
    }
    if (datos.nombre.trim().length < 3) nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
    if (!datos.marca.trim()) nuevosErrores.marca = "La marca es obligatoria.";
    if (datos.precio === "" || !Number.isInteger(precio) || precio <= 0) {
      nuevosErrores.precio = "El precio debe ser un número entero mayor a 0.";
    }
    if (datos.stock === "" || !Number.isInteger(stock) || stock < 0) {
      nuevosErrores.stock = "El stock debe ser un número entero igual o mayor a 0.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const codigo = String(datos.codigo).trim().toUpperCase();
    onGuardar({
      ...datos,
      id: codigo,
      codigo,
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      modelo: datos.modelo.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      imagen: datos.imagen.trim() || IMAGEN_POR_CATEGORIA[datos.categoria],
    });
  };

  const vistaPrevia = datos.imagen.trim() || IMAGEN_POR_CATEGORIA[datos.categoria];

  return (
    <form className="formulario-producto" onSubmit={enviar} noValidate>
      <h2 id="titulo-form-producto">
        {esEdicion ? `Editar producto ${datos.codigo}` : "Nuevo producto"}
      </h2>

      <fieldset>
        <legend>Identificación</legend>
        <div className="formulario-grilla">
          {esEdicion ? (
            <div className="mb-3 campo-formulario">
              <label className="form-label" htmlFor="codigo">Código</label>
              <input id="codigo" className="form-control" value={datos.codigo} readOnly />
              <small className="texto-ayuda">El código no se puede modificar.</small>
            </div>
          ) : (
            <CampoFormulario label="Código" id="codigo" name="codigo" value={datos.codigo} onChange={cambiar} placeholder="Ej: GA006" error={errores.codigo} />
          )}

          <CampoFormulario label="Nombre" id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} placeholder="Ej: Guitarra Acústica Folk" error={errores.nombre} />
          <CampoFormulario label="Marca" id="marca" name="marca" value={datos.marca} onChange={cambiar} placeholder="Ej: Yamaha" error={errores.marca} />
          <CampoFormulario label="Modelo" id="modelo" name="modelo" value={datos.modelo} onChange={cambiar} placeholder="Ej: F310" />

          <div className="mb-3 campo-formulario">
            <label className="form-label" htmlFor="categoria">Categoría</label>
            <Selector id="categoria" name="categoria" value={datos.categoria} onChange={cambiar} opciones={CATEGORIAS_PRODUCTO} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Precio y stock</legend>
        <div className="formulario-grilla">
          <CampoFormulario label="Precio (CLP)" id="precio" name="precio" type="number" min="1" step="1" value={datos.precio} onChange={cambiar} placeholder="Ej: 129990" error={errores.precio} />
          <CampoFormulario label="Stock (unidades)" id="stock" name="stock" type="number" min="0" step="1" value={datos.stock} onChange={cambiar} placeholder="Ej: 10" error={errores.stock} />
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="esOferta" name="esOferta" checked={datos.esOferta} onChange={cambiar} />
          <label className="form-check-label" htmlFor="esOferta">Mostrar en Ofertas</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Presentación</legend>
        <div className="formulario-grilla-imagen">
          <div>
            <CampoFormulario label="Imagen (ruta o URL)" id="imagen" name="imagen" value={datos.imagen} onChange={cambiar} placeholder="Ej: /img/productos/GA006.jpg" />
            <small className="texto-ayuda">Si lo dejas vacío, se usa la imagen de la categoría.</small>

            <div className="mb-3 mt-3 campo-formulario">
              <label className="form-label" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" className="form-control" rows="3" value={datos.descripcion} onChange={cambiar} placeholder="Características principales del producto" />
            </div>
          </div>

          <figure className="vista-previa">
            <img src={vistaPrevia} alt="Vista previa del producto" />
            <figcaption>Vista previa</figcaption>
          </figure>
        </div>
      </fieldset>

      <div className="acciones-formulario">
        <Boton texto={esEdicion ? "Guardar cambios" : "Crear producto"} type="submit" className="btn-sonido-vivo" />
        <Boton texto="Cancelar" type="button" className="btn btn-secondary" onClick={onCancelar} />
      </div>
    </form>
  );
}

export default FormularioProducto;
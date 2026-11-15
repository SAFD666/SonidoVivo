import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Precio from '../components/atoms/Precio';
import EtiquetaStock from '../components/atoms/EtiquetaStock';
import ContadorCantidad from '../components/atoms/ContadorCantidad';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, agregarAlCarrito } = useTienda();
  const [cantidad, setCantidad] = useState(1);
  const [mensajeAgregado, setMensajeAgregado] = useState(false);

  const producto = productos.find(
    (p) => String(p.codigo) === String(id) || String(p.id) === String(id)
  );

  // 1) MONTAJE y DESMONTAJE: guarda el título original y lo restaura al salir
  useEffect(() => {
    const tituloOriginal = document.title;
    return () => {
      document.title = tituloOriginal;
    };
  }, []);

  // 2) ACTUALIZACIÓN: cada vez que cambia el producto, cambia el título de la pestaña
  useEffect(() => {
    if (producto) {
      document.title = `${producto.nombre} · Sonido Vivo`;
    }
  }, [producto]);

  // 3) Oculta el mensaje "agregado" después de 2,5 s (y limpia el temporizador)
  useEffect(() => {
    if (!mensajeAgregado) return;
    const temporizador = setTimeout(() => setMensajeAgregado(false), 2500);
    return () => clearTimeout(temporizador);
  }, [mensajeAgregado]);

  // El return temprano va DESPUÉS de los hooks
  if (!producto) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>Producto no encontrado</h2>
          <p>El código o identificador ingresado no existe en nuestro catálogo.</p>
          <Boton
            texto="Volver al Catálogo"
            onClick={() => navigate('/catalogo')}
            className="btn-sonido-vivo"
          />
        </section>
      </PlantillaPublica>
    );
  }

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad);
    setMensajeAgregado(true);
  };

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <article className="ficha-detalle-card">
          <figure className="ficha-imagen-marco">
            <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
          </figure>

          <section className="ficha-datos-panel">
            <header className="ficha-cabecera">
              <span className="codigo-item">
                Marca: {producto.marca} | Modelo: {producto.modelo} | Cód: {producto.codigo}
              </span>
              <h1 className="ficha-titulo">{producto.nombre}</h1>
            </header>

            <div className="ficha-estado-stock">
              <EtiquetaStock stock={producto.stock} />
            </div>

            <div className="precio-texto ficha-precio-destacado">
              <Precio precio={producto.precio} />
            </div>

            <p className="ficha-descripcion-cuerpo">{producto.descripcion}</p>

            <footer className="ficha-compra-panel">
              <div className="ficha-selector-cantidad">
                <label className="ficha-cantidad-label">Cantidad:</label>
                <ContadorCantidad
                  cantidad={cantidad}
                  maximo={producto.stock}
                  onChange={(nuevaCantidad) => setCantidad(nuevaCantidad)}
                />
              </div>

              <Boton
                texto={producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                onClick={handleAgregarAlCarrito}
                deshabilitado={producto.stock <= 0}
                className="btn-sonido-vivo btn-comprar"
              />

              {mensajeAgregado && (
                <p className="mensaje-agregado">
                  Se agregaron {cantidad} unidad(es) al carrito.
                </p>
              )}
            </footer>
          </section>
        </article>
      </section>
    </PlantillaPublica>
  );
}

export default DetalleProducto;
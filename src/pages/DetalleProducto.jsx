import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Precio from '../components/atoms/Precio';
import EtiquetaStock from '../components/atoms/EtiquetaStock';
import ContadorCantidad from '../components/atoms/ContadorCantidad';
import Boton from '../components/atoms/Boton';
import { productos } from '../data/productos';

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  const producto = productos.find(
    (p) => String(p.codigo) === String(id) || String(p.id) === String(id)
  );

  if (!producto) {
    return (
      <PlantillaPublica>
        <main className="contenedor-principal aviso-no-encontrado">
          <h2>Producto no encontrado</h2>
          <p>El código o identificador ingresado no existe en nuestro catálogo.</p>
          <Boton
            texto="Volver al Catálogo"
            onClick={() => navigate("/catalogo")}
            className="btn-sonido-vivo"
          />
        </main>
      </PlantillaPublica>
    );
  }

  const handleAgregarAlCarrito = () => {
    alert(`Agregaste ${cantidad} unidad(es) de "${producto.nombre}"`);
  };

  return (
    <PlantillaPublica>
      <main className="contenedor-principal">
        <article className="ficha-detalle-card">
          <figure className="ficha-imagen-marco">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              loading="lazy"
            />
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

            <p className="ficha-descripcion-cuerpo">
              {producto.descripcion}
            </p>

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
                texto="Añadir al Carrito"
                onClick={handleAgregarAlCarrito}
                deshabilitado={producto.stock <= 0}
                className="btn-sonido-vivo btn-comprar"
              />
            </footer>
          </section>
        </article>
      </main>
    </PlantillaPublica>
  );
}

export default DetalleProducto;

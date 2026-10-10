import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Precio from '../components/atoms/Precio';
import EtiquetaStock from '../components/atoms/EtiquetaStock';
import ContadorCantidad from '../components/atoms/ContadorCantidad';
import Boton from '../components/atoms/Boton';

const PRODUCTOS = [
  {
    codigo: "GE001",
    nombre: "Guitarra Eléctrica Squier Stratocaster Affinity",
    marca: "Squier",
    modelo: "Affinity Series HSS",
    categoria: "Guitarras Eléctricas",
    stock: 8,
    precio: 399990,
    imagen: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=600&q=80",
    descripcion: "Cuerpo ligero de álamo con mástil de arce en perfil C. Configuración de cápsulas HSS que entrega versatilidad para géneros desde funk y blues hasta rock pesado."
  },
  {
    codigo: "GE002",
    nombre: "Guitarra Eléctrica Yamaha RGX121Z",
    marca: "Yamaha",
    modelo: "RGX121Z Flat Black",
    categoria: "Guitarras Eléctricas",
    stock: 12,
    precio: 349990,
    imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    descripcion: "Diseño ergonómico con diapasón de palisandro de 24 trastes. Sistema de pastillas H-S-H y puente trémolo vintage de alta precisión tonal."
  },
  {
    codigo: "GA001",
    nombre: "Guitarra Acústica Folk Yamaha F310",
    marca: "Yamaha",
    modelo: "F310 Natural",
    categoria: "Guitarras Acústicas",
    stock: 15,
    precio: 149990,
    imagen: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80",
    descripcion: "Tapa armónica de abeto laminado, aros y fondo de meranti. Calibración cómoda de fábrica, tono balanceado y excelente proyección acústica."
  },
  {
    codigo: "GA002",
    nombre: "Guitarra Electroacústica Fender CD-60SCE",
    marca: "Fender",
    modelo: "CD-60SCE Dreadnought",
    categoria: "Guitarras Acústicas",
    stock: 6,
    precio: 289990,
    imagen: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&q=80",
    descripcion: "Cuerpo con corte (cutaway) y tapa de abeto macizo. Incluye preamplificador y afinador Fishman Classic Design integrado para conexión directa a consola o amplificador."
  }
];

function DetalleProducto() {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);

  const producto = PRODUCTOS.find((p) => String(p.codigo) === String(id));

  if (!producto) {
    return (
      <PlantillaPublica>
        <main className="contenedor-principal aviso-no-encontrado">
          <h2>Producto no encontrado</h2>
          <p>El código o identificador ingresado no existe en nuestro catálogo.</p>
          <Boton texto="Volver al Catálogo" to="/catalogo" className="btn-sonido-vivo" />
        </main>
      </PlantillaPublica>
    );
  }

  const handleAgregarAlCarrito = () => {
    alert(`no tenemos carrito aun, awantate panzon`);
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
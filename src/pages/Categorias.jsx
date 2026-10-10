import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';

import FiltroCategoria from "../components/molecules/FiltroCategoria";
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import Boton from '../components/atoms/Boton';

const PRODUCTOS = [
  {
    codigo: "GE001",
    nombre: "Guitarra Eléctrica Squier Stratocaster Affinity",
    marca: "Squier",
    modelo: "Affinity Series HSS",
    categoria: "Guitarras Eléctricas",
    slugCategoria: "guitarras-electricas",
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
    slugCategoria: "guitarras-electricas",
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
    slugCategoria: "guitarras-acusticas",
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
    slugCategoria: "guitarras-acusticas",
    stock: 6,
    precio: 289990,
    imagen: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&q=80",
    descripcion: "Cuerpo con corte (cutaway) y tapa de abeto macizo. Incluye preamplificador y afinador Fishman Classic Design integrado para conexión directa a consola o amplificador."
  },
  {
    codigo: "BA001",
    nombre: "Bajo Eléctrico Ibanez GSR200",
    marca: "Ibanez",
    modelo: "GIO GSR200 Jewel Blue",
    categoria: "Bajos Eléctricos",
    slugCategoria: "bajos-electricos",
    stock: 7,
    precio: 279990,
    imagen: "https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=600&q=80",
    descripcion: "Bajo de 4 cuerdas con circuito activo Phat II Bass Boost para realce de frecuencias graves. Configuración de cápsulas estilo P/J de bobina dividida."
  },
  {
    codigo: "TE001",
    nombre: "Teclado Sensitivo Yamaha PSR-E373",
    marca: "Yamaha",
    modelo: "PSR-E373 61 Teclas",
    categoria: "Teclados y Pianos",
    slugCategoria: "teclados-y-pianos",
    stock: 9,
    precio: 229990,
    imagen: "https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=600&q=80",
    descripcion: "61 teclas sensibles a la pulsación, generador de tonos LSI con 622 voces de alta fidelidad, efectos DSP integrados y conexión USB to HOST para grabación digital."
  },
  {
    codigo: "AM001",
    nombre: "Amplificador de Guitarra Fender Champion 20",
    marca: "Fender",
    modelo: "Champion 20W",
    categoria: "Amplificadores",
    slugCategoria: "amplificadores",
    stock: 10,
    precio: 159990,
    imagen: "https://images.unsplash.com/photo-1558098329-a11cff621af4?w=600&q=80",
    descripcion: "Potencia de 20 watts con altavoz de diseño especial de 8 pulgadas. Modelado de amplificadores clásicos con controles de reverb, delay, coro y distorsión."
  },
  {
    codigo: "BA002",
    nombre: "Batería Electrónica Alesis Turbo Mesh Kit",
    marca: "Alesis",
    modelo: "Turbo Mesh Kit 7 Piezas",
    categoria: "Baterías",
    slugCategoria: "baterias",
    stock: 4,
    precio: 429990,
    imagen: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=80",
    descripcion: "Pads de malla completa (mesh) de respuesta natural y bajo rebote sonoro. Módulo con 120 sonidos, 10 kits clásicos y pistas de práctica incluidas."
  }
];

function Categorias() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const productosBaseCategoria = useMemo(() => {
    return PRODUCTOS.filter((prod) => prod.slugCategoria === slug);
  }, [slug]);

  const marcasDisponibles = useMemo(() => {
    const listaMarcas = productosBaseCategoria.map((p) => p.marca);
    return [...new Set(listaMarcas)];
  }, [productosBaseCategoria]);

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(productosBaseCategoria);

  useEffect(() => {
    setMarcasSeleccionadas([]);
    setProductosVisibles(productosBaseCategoria);
  }, [productosBaseCategoria]);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  const aplicarFiltros = () => {
    if (marcasSeleccionadas.length === 0) {
      setProductosVisibles(productosBaseCategoria);
    } else {
      setProductosVisibles(
        productosBaseCategoria.filter((p) => marcasSeleccionadas.includes(p.marca))
      );
    }
  };

  const handleVerDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  const nombreCategoria = productosBaseCategoria.length > 0 
    ? productosBaseCategoria[0].categoria 
    : slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Categoría';

  return (
    <PlantillaPublica>
      <main className="contenedor-principal">
        

        <header className="cabecera-categoria">
          <h1 className="titulo-seccion">{nombreCategoria}</h1>
          <p className="subtitulo-catalogo">
            Mostrando {productosVisibles.length} {productosVisibles.length === 1 ? 'producto disponible' : 'productos disponibles'}
          </p>
        </header>

        {productosBaseCategoria.length > 0 ? (
          <div className="catalogo-layout">
            <aside>
              <FiltroCategoria
                marcasDisponibles={marcasDisponibles}
                marcasSeleccionadas={marcasSeleccionadas}
                onCambiarMarca={toggleMarca}
                onAplicar={aplicarFiltros}
              />
            </aside>

            <section>
              {productosVisibles.length > 0 ? (
                <CatalogoProductos 
                  productos={productosVisibles} 
                  onVer={handleVerDetalle} 
                />
              ) : (
                <div className="aviso-no-encontrado">
                  <p>No se encontraron productos para las marcas seleccionadas.</p>
                  <Boton 
                    texto="Restablecer Filtros" 
                    onClick={() => {
                      setMarcasSeleccionadas([]);
                      setProductosVisibles(productosBaseCategoria);
                    }} 
                    className="btn-sonido-vivo" 
                  />
                </div>
              )}
            </section>
          </div>
        ) : (
          <section className="aviso-no-encontrado">
            <h2>No hay productos en esta categoría</h2>
            <p>Por el momento no disponemos de stock para la categoría seleccionada.</p>
            <Boton texto="Ver Todo el Catálogo" to="/catalogo" className="btn-sonido-vivo"  onClick={() => navigate("/catalogo")} />
          </section>
        )}
      </main>
    </PlantillaPublica>
  );
}

export default Categorias;
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';
import FiltroCategoria from "../components/molecules/FiltroCategoria";
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import Boton from '../components/atoms/Boton';
import { generarSlug } from '../data/productos';
import { useTienda } from '../context/TiendaContext';

function Categorias() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { productos } = useTienda();

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [marcasAplicadas, setMarcasAplicadas] = useState([]);

  // Al cambiar de categoria, se limpian los filtros
  useEffect(() => {
    setMarcasSeleccionadas([]);
    setMarcasAplicadas([]);
  }, [slug]);

  const productosBaseCategoria = useMemo(() => {
    return productos.filter((prod) => generarSlug(prod.categoria) === slug);
  }, [productos, slug]);

  const marcasDisponibles = useMemo(() => {
    return [...new Set(productosBaseCategoria.map((p) => p.marca))];
  }, [productosBaseCategoria]);

  const productosVisibles = useMemo(() => {
    if (marcasAplicadas.length === 0) return productosBaseCategoria;
    return productosBaseCategoria.filter((p) => marcasAplicadas.includes(p.marca));
  }, [productosBaseCategoria, marcasAplicadas]);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  const aplicarFiltros = () => {
    setMarcasAplicadas(marcasSeleccionadas);
  };

  const restablecer = () => {
    setMarcasSeleccionadas([]);
    setMarcasAplicadas([]);
  };

  const handleVerDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  const nombreCategoria = productosBaseCategoria.length > 0
    ? productosBaseCategoria[0].categoria
    : slug ? slug.replace(/-/g, ' ') : 'Categoría';

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
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
                  <Boton texto="Restablecer Filtros" onClick={restablecer} className="btn-sonido-vivo" />
                </div>
              )}
            </section>
          </div>
        ) : (
          <section className="aviso-no-encontrado">
            <h2>No hay productos en esta categoría</h2>
            <p>Por el momento no disponemos de stock para la categoría seleccionada.</p>
            <Boton texto="Ver Todo el Catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} />
          </section>
        )}
      </section>
    </PlantillaPublica>
  );
}

export default Categorias;
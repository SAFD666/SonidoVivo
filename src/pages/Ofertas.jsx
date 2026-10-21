import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import FiltroCategoria from '../components/molecules/FiltroCategoria';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function Ofertas() {
  const navigate = useNavigate();
  const { productos } = useTienda();

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [marcasAplicadas, setMarcasAplicadas] = useState([]);

  const productosEnOferta = useMemo(() => {
    return productos.filter((p) => p.esOferta === true);
  }, [productos]);

  const marcasDisponibles = useMemo(() => {
    return [...new Set(productosEnOferta.map((p) => p.marca))];
  }, [productosEnOferta]);

  const productosVisibles = useMemo(() => {
    if (marcasAplicadas.length === 0) return productosEnOferta;
    return productosEnOferta.filter((p) => marcasAplicadas.includes(p.marca));
  }, [productosEnOferta, marcasAplicadas]);

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

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <header className="cabecera-categoria">
          <h1 className="titulo-seccion">Ofertas Especiales</h1>
          <p className="subtitulo-catalogo">
            Aprovecha nuestros descuentos en instrumentos y equipos seleccionados ({productosVisibles.length} disponibles)
          </p>
        </header>

        {productosEnOferta.length > 0 ? (
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
                  <p>No hay ofertas disponibles para las marcas seleccionadas.</p>
                  <Boton texto="Ver todas las ofertas" onClick={restablecer} className="btn-sonido-vivo" />
                </div>
              )}
            </section>
          </div>
        ) : (
          <section className="aviso-no-encontrado">
            <h2>No hay ofertas por ahora</h2>
            <p>Vuelve pronto: renovamos nuestras ofertas constantemente.</p>
            <Boton texto="Ver todo el catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} />
          </section>
        )}
      </section>
    </PlantillaPublica>
  );
}

export default Ofertas;
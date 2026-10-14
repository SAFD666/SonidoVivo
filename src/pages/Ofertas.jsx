import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import FiltroCategoria from '../components/molecules/FiltroCategoria';
import Boton from '../components/atoms/Boton';

import { productos } from '../data/productos';

function Ofertas() {
  const navigate = useNavigate();

  const productosEnOferta = useMemo(() => {
    return productos.filter((p) => p.esOferta === true);
  }, []);

  const marcasDisponibles = useMemo(() => {
    return [...new Set(productosEnOferta.map((p) => p.marca))];
  }, [productosEnOferta]);

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(productosEnOferta);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  const aplicarFiltros = () => {
    if (marcasSeleccionadas.length === 0) {
      setProductosVisibles(productosEnOferta);
    } else {
      setProductosVisibles(
        productosEnOferta.filter((p) => marcasSeleccionadas.includes(p.marca))
      );
    }
  };

  const handleVerDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  return (
    <PlantillaPublica>
      <main className="contenedor-principal">
        <header className="cabecera-categoria">
          <h1 className="titulo-seccion">Ofertas Especiales</h1>
          <p className="subtitulo-catalogo">
            Aprovecha nuestros descuentos en instrumentos y equipos seleccionados ({productosVisibles.length} disponibles)
          </p>
        </header>

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
                <Boton
                  texto="Ver todas las ofertas"
                  onClick={() => {
                    setMarcasSeleccionadas([]);
                    setProductosVisibles(productosEnOferta);
                  }}
                  className="btn-sonido-vivo"
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </PlantillaPublica>
  );
}

export default Ofertas;
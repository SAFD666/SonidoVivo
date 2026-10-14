import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import FiltroCategoria from '../components/molecules/FiltroCategoria';
import { productos } from '../data/productos';

function Catalogo() {
  const navigate = useNavigate();
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState(productos);

  const marcasDisponibles = useMemo(() => {
    return [...new Set(productos.map((p) => p.marca))];
  }, []);

  const toggleMarca = (marca) => {
    if (marcasSeleccionadas.includes(marca)) {
      setMarcasSeleccionadas(marcasSeleccionadas.filter((m) => m !== marca));
    } else {
      setMarcasSeleccionadas([...marcasSeleccionadas, marca]);
    }
  };

  const aplicarFiltros = () => {
    if (marcasSeleccionadas.length === 0) {
      setProductosVisibles(productos);
    } else {
      setProductosVisibles(
        productos.filter((p) => marcasSeleccionadas.includes(p.marca))
      );
    }
  };

  const handleVerDetalle = (producto) => {
    navigate(`/producto/${producto.codigo}`);
  };

  return (
    <PlantillaPublica>
      <div className="contenedor-principal">
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
            <h2 className="titulo-seccion">Instrumentos y Equipos</h2>
            <p className="subtitulo-catalogo">
              Mostrando {productosVisibles.length} productos disponibles
            </p>
            <CatalogoProductos
              productos={productosVisibles}
              onVer={handleVerDetalle}
            />
          </section>
        </div>
      </div>
    </PlantillaPublica>
  );
}

export default Catalogo;

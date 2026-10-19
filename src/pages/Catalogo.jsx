import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PlantillaPublica from '../components/templates/PlantillaPublica';
import CatalogoProductos from '../components/organisms/CatalogoProductos';
import FiltroCategoria from '../components/molecules/FiltroCategoria';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

// sirve para que busque sin tildes, osea acustica encuentra igual acústica
const normalizar = (texto) =>
  texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function Catalogo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { productos } = useTienda();

  const busqueda = searchParams.get("buscar") || "";

  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [marcasAplicadas, setMarcasAplicadas] = useState([]);

  const marcasDisponibles = useMemo(() => {
    return [...new Set(productos.map((p) => p.marca))];
  }, [productos]);

  const productosVisibles = useMemo(() => {
    const termino = normalizar(busqueda);

    return productos.filter((p) => {
      const coincideMarca =
        marcasAplicadas.length === 0 || marcasAplicadas.includes(p.marca);

      const textoProducto = normalizar(`${p.nombre} ${p.marca} ${p.modelo} ${p.categoria}`);
      const coincideBusqueda = textoProducto.includes(termino);

      return coincideMarca && coincideBusqueda;
    });
  }, [productos, marcasAplicadas, busqueda]);

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

  const limpiarTodo = () => {
    setMarcasSeleccionadas([]);
    setMarcasAplicadas([]);
    navigate("/catalogo");
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
            <h2 className="titulo-seccion">
              {busqueda ? `Resultados para "${busqueda}"` : "Instrumentos y Equipos"}
            </h2>
            <p className="subtitulo-catalogo">
              Mostrando {productosVisibles.length} {productosVisibles.length === 1 ? "producto" : "productos"}
            </p>

            {productosVisibles.length > 0 ? (
              <CatalogoProductos
                productos={productosVisibles}
                onVer={handleVerDetalle}
              />
            ) : (
              <div className="aviso-no-encontrado">
                <h2>Sin resultados</h2>
                <p>No encontramos productos que coincidan con tu búsqueda o filtros.</p>
                <Boton texto="Ver todo el catálogo" className="btn-sonido-vivo" onClick={limpiarTodo} />
              </div>
            )}
          </section>
        </div>
      </div>
    </PlantillaPublica>
  );
}

export default Catalogo;
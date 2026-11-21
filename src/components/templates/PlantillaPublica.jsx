import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import Boton from '../atoms/Boton';
import { useTienda } from '../../context/TiendaContext';

// Plantilla de las páginas públicas. Muestra el estado de la petición del catálogo a la API
// (cargando / error con reintento), como pide la Guía 20 y el indicador IE3.2.2.
function PlantillaPublica(props) {
  const { cargandoCatalogo, errorCatalogo, recargarCatalogo } = useTienda();

  return (
    <div>
      <Navbar />
      <main>
        {cargandoCatalogo && (
          <p className="contenedor-principal" role="status">Cargando catálogo...</p>
        )}
        {errorCatalogo && (
          <div className="contenedor-principal">
            <div className="alert alert-danger d-flex justify-content-between align-items-center gap-2" role="alert">
              <span>{errorCatalogo}</span>
              <Boton texto="Reintentar" className="btn btn-sm btn-outline-light" onClick={recargarCatalogo} />
            </div>
          </div>
        )}
        {props.children}
      </main>
      <Footer />
    </div>
  );
}

export default PlantillaPublica;
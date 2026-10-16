import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Carrito from '../components/organisms/Carrito';
import ResumenCompra from '../components/organisms/ResumenCompra';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function PaginaCarrito() {
  const navigate = useNavigate();
  const {
    carrito,
    totalCarrito,
    cambiarCantidadCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useTienda();

  if (carrito.length === 0) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega instrumentos o accesorios desde nuestro catálogo.</p>
          <Boton
            texto="Ir al Catálogo"
            className="btn-sonido-vivo"
            onClick={() => navigate("/catalogo")}
          />
        </section>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <h2 className="titulo-seccion">Mi Carrito</h2>

        <div className="carrito-layout">
          <div>
            <Carrito
              items={carrito}
              onCambiarCantidad={cambiarCantidadCarrito}
              onEliminar={eliminarDelCarrito}
            />

            <div className="acciones-carrito">
              <Boton
                texto="Seguir comprando"
                className="btn btn-secondary"
                onClick={() => navigate("/catalogo")}
              />
              <Boton
                texto="Vaciar carrito"
                className="btn btn-outline-danger"
                onClick={vaciarCarrito}
              />
            </div>
          </div>

          <div>
            <ResumenCompra items={carrito} total={totalCarrito} />
            <Boton
              texto="Ir a pagar"
              className="btn-sonido-vivo btn-ancho-total mt-3"
              onClick={() => navigate("/checkout")}
            />
          </div>
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default PaginaCarrito;
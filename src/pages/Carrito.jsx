import { useNavigate } from "react-router-dom";
import PlantillaPublica from "../components/templates/PlantillaPublica";
import Carrito from "../components/organisms/Carrito";
import ResumenCompra from "../components/organisms/ResumenCompra";
import Boton from "../components/atoms/Boton";
import { useTienda } from "../context/TiendaContext";

function PaginaCarrito() {
  const navigate = useNavigate();

  const {
    carrito,
    totalCarrito,
    cantidadTotalItems,
    cambiarCantidadCarrito,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useTienda();

  if (carrito.length === 0) {
    return (
      <PlantillaPublica>
        <section className="Contenedor-principal pagina-carrito">
          <h1 className="titulo-seccion">Mi carrito de compras</h1>

          <section className="carrito-vacio">

            <h2>Tu carrito está vacío</h2>

            <p>
              Explora nuestro catálogo y encuentra tu próximo instrumento.
            </p>

            <Boton
              texto="Ir al catálogo"
              className="btn-sonido-vivo"
              onClick={() => navigate("/catalogo")}
            />
          </section>
        </section>
      </PlantillaPublica>
    );
  }

  return (
    <PlantillaPublica>
      <section className="Contenedor-principal pagina-carrito">
        <h1 className="titulo-seccion">Mi carrito de compras</h1>

        <p className="subtitulo-catalogo">
          {cantidadTotalItems}{" "}
          {cantidadTotalItems === 1 ? "producto" : "productos"} en tu carrito
        </p>

        <div className="carrito-layout">
          <div>
            <Carrito
              items={carrito}
              onCambiarCantidad={cambiarCantidadCarrito}
              onEliminar={eliminarDelCarrito}
            />

            <div className="acciones-carrito">
              <Boton texto="Continuar comprando" className="btn-secundario-carrito" onClick={() => navigate("/catalogo")} />

              <Boton texto="Vaciar carrito" className="btn-vaciar-carrito" onClick={() => {

                  if ( window.confirm(
                      "¿Quieres eliminar todos los productos del carrito?")) {
                    vaciarCarrito();}
                }}/>

            </div>
          </div>

          <div>
            <ResumenCompra
              items={carrito}
              total={totalCarrito}
            />

            <Boton texto="Ir a pagar" className="btn-sonido-vivo" onClick={() => navigate("/checkout")}
            />

            <p className="carrito-nota">
              El stock se descontará cuando se registre el pedido.
            </p>

          </div>

        </div>
      </section>
    </PlantillaPublica>
  );
}

export default PaginaCarrito;
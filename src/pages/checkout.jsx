import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import FormularioCheckout from '../components/organisms/FormularioCheckout';
import ResumenCompra from '../components/organisms/ResumenCompra';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function Checkout() {
  const navigate = useNavigate();
  const { carrito, totalCarrito, productos, usuarioActivo, crearPedido } = useTienda();

  if (carrito.length === 0) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>No hay productos para pagar</h2>
          <p>Tu carrito está vacío.</p>
          <Boton
            texto="Ir al Catálogo"
            className="btn-sonido-vivo"
            onClick={() => navigate("/catalogo")}
          />
        </section>
      </PlantillaPublica>
    );
  }

  const confirmarCompra = (datosEntrega) => {
    // 1. Pago rechazado (simulado desde el formulario)
    if (datosEntrega.simularRechazo) {
      navigate("/pago-fallido", {
        state: { motivo: "El banco rechazó la transacción. Intenta con otro método de pago." },
      });
      return;
    }

    // 2. Verificar que todavía haya stock suficiente de cada producto
    const sinStock = carrito.find((item) => {
      const productoActual = productos.find((p) => p.codigo === item.codigo);
      return !productoActual || item.cantidad > productoActual.stock;
    });

    if (sinStock) {
      navigate("/pago-fallido", {
        state: { motivo: `No hay stock suficiente de "${sinStock.nombre}".` },
      });
      return;
    }

    // 3. Pago aprobado: se crea el pedido (descuenta stock y vacía el carrito)
    const pedido = crearPedido(datosEntrega);
    navigate("/compra-exitosa", { state: { pedido } });
  };

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <h2 className="titulo-seccion">Finalizar Compra</h2>

        <div className="carrito-layout">
          <FormularioCheckout usuario={usuarioActivo} onConfirmar={confirmarCompra} />
          <ResumenCompra items={carrito} total={totalCarrito} />
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Checkout;
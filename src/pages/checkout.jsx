import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import FormularioCheckout from '../components/organisms/FormularioCheckout';
import ResumenCompra from '../components/organisms/ResumenCompra';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';
import { obtenerOpciones, listarRegiones } from '../services/pedidoService';
import { obtenerMensajeError } from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { carrito, totalCarrito, usuarioActivo, crearPedido } = useTienda();

  const [opciones, setOpciones] = useState(null);
  const [regiones, setRegiones] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Al entrar: tipos de entrega, métodos de pago y regiones desde la API
  useEffect(() => {
    async function cargar() {
      try {
        const [datosOpciones, datosRegiones] = await Promise.all([obtenerOpciones(), listarRegiones()]);
        setOpciones(datosOpciones);
        setRegiones(datosRegiones);
      } catch (error) {
        setErrorCarga(obtenerMensajeError(error));
      }
    }
    cargar();
  }, []);

  if (carrito.length === 0) {
    return (
      <PlantillaPublica>
        <section className="contenedor-principal aviso-no-encontrado">
          <h2>No hay productos para pagar</h2>
          <p>Tu carrito está vacío.</p>
          <Boton texto="Ir al Catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} />
        </section>
      </PlantillaPublica>
    );
  }

  const confirmarCompra = async (datosEntrega) => {
    // 1. Pago rechazado (simulado desde el formulario, no llega a la API)
    if (datosEntrega.simularRechazo) {
      navigate("/pago-fallido", {
        state: { motivo: "El banco rechazó la transacción. Intenta con otro método de pago." },
      });
      return;
    }

    // 2. El servidor valida el stock, calcula el total y crea el pedido
    setEnviando(true);
    const resultado = await crearPedido(datosEntrega);
    setEnviando(false);

    if (resultado.exito) {
      navigate("/compra-exitosa", { state: { pedido: resultado.pedido } });
    } else {
      // Por ejemplo: "Stock insuficiente para ..." (409) o "La dirección es obligatoria..." (400)
      navigate("/pago-fallido", { state: { motivo: resultado.mensaje } });
    }
  };

  return (
    <PlantillaPublica>
      <section className="contenedor-principal">
        <h2 className="titulo-seccion">Finalizar Compra</h2>

        {errorCarga && <div className="alert alert-danger">{errorCarga}</div>}
        {!opciones && !errorCarga && <p role="status">Cargando opciones de entrega...</p>}

        {opciones && (
          <div className="carrito-layout">
            <FormularioCheckout
              usuario={usuarioActivo}
              tiposEntrega={opciones.tiposEntrega}
              metodosPago={opciones.metodosPago}
              regiones={regiones}
              enviando={enviando}
              onConfirmar={confirmarCompra}
            />
            <ResumenCompra items={carrito} total={totalCarrito} />
          </div>
        )}
      </section>
    </PlantillaPublica>
  );
}

export default Checkout;
import { useLocation, useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Boton from '../components/atoms/Boton';

function PagoFallido() {
  const navigate = useNavigate();
  const location = useLocation();
  const motivo = location.state?.motivo;




  return (
    <PlantillaPublica>
      <section className="contenedor-principal aviso-no-encontrado">
        <h1>Pago fallido</h1>

        <p>No se pudo completar tu compra.</p>

        <p>
          {motivo || 'Ocurrio un problema con el pago. Intentalo nuevamente.'}
        </p>

        <Boton texto="Intentar nuevamente" className='btn-sonido-vivo' onClick={() => navigate('/checkout')} />

        <Boton texto="Volver al carrito" className="btn-secundario-carrito" onClick={() => navigate('/carrito')}/>
      </section>
    </PlantillaPublica>
  );
}

export default PagoFallido;
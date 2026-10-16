import { useLocation, useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Boton from '../components/atoms/Boton';


function CompraExitosa() {
  const navigate = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <PlantillaPublica>

        <section className='contenedor-princial aviso no encontrado'>
            <h1>Compra exitosaa</h1>

            <p>Tu pedido ha sido registrado correctamente.</p>
            <p>Gracias por comprar en Sonido Vivo.</p>

            {pedido && (<p>Tu pedido ha sido registrado correctamente.</p>)}

            <Boton texto={"Volver al catalago"} className='btn-sonido-vivo' onClick={() => navigate('/catalogo')} />
        </section>

    </PlantillaPublica>
  );
}


export default CompraExitosa;
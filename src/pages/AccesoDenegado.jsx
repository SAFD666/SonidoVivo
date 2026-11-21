import { useNavigate } from 'react-router-dom';
import PlantillaPublica from '../components/templates/PlantillaPublica';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

// Se muestra cuando un usuario con sesión intenta abrir una ruta de otro rol.
// (El backend igual rechazaría sus peticiones con 403: esta página solo evita mostrar algo que no puede usar.)
function AccesoDenegado(props) {
  const navigate = useNavigate();
  const { usuarioActivo } = useTienda();

  return (
    <PlantillaPublica>
      <section className="contenedor-principal aviso-no-encontrado">
        <h2>Acceso denegado</h2>
        <p>
          Tu rol <strong>{usuarioActivo?.rol}</strong> no tiene permiso para ver esta página.
          {props.roles && <> Requiere: {props.roles.join(" o ")}.</>}
        </p>
        <Boton texto="Volver al inicio" className="btn-sonido-vivo" onClick={() => navigate("/")} />
      </section>
    </PlantillaPublica>
  );
}

export default AccesoDenegado;
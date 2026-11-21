import { Navigate, useLocation } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';
import AccesoDenegado from '../pages/AccesoDenegado';

// Protege una página (props.children):
//  - Mientras se verifica la sesión guardada (recarga de página), muestra un aviso.
//  - Sin sesión → al login (y vuelve a esta página después).
//  - Con sesión pero sin el rol necesario → página "Acceso denegado".
function RutaProtegida(props) {
  const { usuarioActivo, cargandoSesion } = useTienda();
  const location = useLocation();

  if (cargandoSesion) {
    return <p className="contenedor-principal" role="status">Verificando tu sesión...</p>;
  }

  if (!usuarioActivo) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (props.roles && !props.roles.includes(usuarioActivo.rol)) {
    return <AccesoDenegado roles={props.roles} />;
  }

  return props.children;
}

export default RutaProtegida;
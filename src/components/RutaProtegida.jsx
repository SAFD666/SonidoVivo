import { Navigate, useLocation } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';

// Muestra la página (props.children) solo si hay sesión y, si se indican roles, solo para esos roles.
function RutaProtegida(props) {
  const { usuarioActivo } = useTienda();
  const location = useLocation();

  if (!usuarioActivo) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (props.roles && !props.roles.includes(usuarioActivo.rol)) {
    return <Navigate to="/" replace />;
  }

  return props.children;
}

export default RutaProtegida;
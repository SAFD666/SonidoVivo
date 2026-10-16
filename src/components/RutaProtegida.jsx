import { Navigate, useLocation } from 'react-router-dom';
import { useTienda } from '../context/TiendaContext';

// Muestra la página solo si hay sesión iniciada y, si se indican roles, solo para esos roles.
function RutaProtegida({ roles, children }) {
  const { usuarioActivo } = useTienda();
  const location = useLocation();

  if (!usuarioActivo) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  if (roles && !roles.includes(usuarioActivo.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaProtegida;
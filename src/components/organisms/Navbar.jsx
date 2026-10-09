import { Link, useNavigate } from 'react-router-dom';
import Boton from "../atoms/Boton";
function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="header-sonido-vivo">
      <div className="logo-container">
        <Link to="/" className="enlace-logo">
          <span className="logo-icono"></span>
          <h1>Sonido Vivo</h1>
        </Link>
      </div>

      <nav className="menu-navegacion">
        <ul>
          <li><Boton texto="Inicio"  className="btn-sonido-vivo" onClick={() => navigate("/inicio") }/></li>
          <li><Boton texto="Catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo") } /></li>
          <li><Boton texto="Iniciar Sesión"  className="btn-sonido-vivo" onClick={() => navigate("/login") }/></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
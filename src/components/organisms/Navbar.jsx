import { Link } from 'react-router-dom';

function Navbar() {
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
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalogo">Catálogo</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-sonido-vivo">
      <p>© 2026 Sonido Vivo. Todos los derechos reservados.</p>
      <address>Viña del Mar, Región de Valparaíso</address>
      <div>
        <Link to="/catalogo">Ver productos disponibles</Link>
      </div>
    </footer>
  );
}

export default Footer;
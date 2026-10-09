import { Link } from 'react-router-dom';
import Boton from "../atoms/Boton";

function Footer() {
  return (
    <footer className="footer-sonido-vivo">
      <p>© 2026 Sonido Vivo. Todos los derechos reservados.</p>
      <address>Viña del Mar, Región de Valparaíso</address>
      <div>
        <Boton texto="Ver productos disponibles" to="/catalogo" className="btn-sonido-vivo" />
      </div>
    </footer>
  );
}

export default Footer;
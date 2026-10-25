import { Link, useNavigate } from 'react-router-dom';
import Boton from "../atoms/Boton";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-sonido-vivo">
      <nav>
        <ul className="list-inline mb-3">
          <li className="list-inline-item mx-2"><Link to="/nosotros">Nosotros</Link></li>
          <li className="list-inline-item mx-2"><Link to="/blog">Blog</Link></li>
          <li className="list-inline-item mx-2"><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>

      <p>© 2026 Sonido Vivo. Todos los derechos reservados.</p>
      <address>Viña del Mar, Región de Valparaíso</address>
      <div>
        <Boton texto="Ver productos disponibles" onClick={() => navigate("/catalogo")} className="btn-sonido-vivo" />
      </div>
    </footer>
  );
}

export default Footer;
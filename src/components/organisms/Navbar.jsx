import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Boton from "../atoms/Boton";
import BarraBusqueda from "../molecules/BarraBusqueda";
import { useTienda } from '../../context/TiendaContext';

function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { usuarioActivo, cerrarSesion, cantidadTotalItems } = useTienda();

  const buscar = (texto) => {
    if (texto) {
      navigate(`/catalogo?buscar=${encodeURIComponent(texto)}`);
    } else {
      navigate("/catalogo");
    }
  };

  return (
    <header className="header-sonido-vivo">
      <div className="logo-container">
        <Link to="/" className="enlace-logo">
          <img src="/img/logotipo.jpg" alt="logo vivo" className='enlace-logo'/>
          <h1>Sonido Vivo</h1>
        </Link>
      </div>

      <BarraBusqueda
        valorInicial={searchParams.get("buscar") || ""}
        onBuscar={buscar}
      />

      <nav className="menu-navegacion">
        <ul>
          <li><Boton texto="Catálogo" className="btn-sonido-vivo" onClick={() => navigate("/catalogo")} /></li>
          <li><Boton texto="Ofertas" className="btn-sonido-vivo" onClick={() => navigate("/ofertas")} /></li>

          {(!usuarioActivo || usuarioActivo.rol === "Cliente") && (
            <li><Boton texto={`Carrito (${cantidadTotalItems})`} className="btn-sonido-vivo" onClick={() => navigate("/carrito")} /></li>
          )}

          {usuarioActivo ? (
            <>
              {usuarioActivo.rol === "Cliente" ? (
                <li><Boton texto="Mis Pedidos" className="btn-sonido-vivo" onClick={() => navigate("/mis-pedidos")} /></li>
              ) : (
                <li><Boton texto="Panel Admin" className="btn-sonido-vivo" onClick={() => navigate("/admin")} /></li>
              )}

              <li><Boton texto={`Salir (${usuarioActivo.nombre.split(' ')[0]})`} className="btn-sonido-vivo" onClick={() => { cerrarSesion(); navigate("/"); }} /></li>
            </>
          ) : (
            <li><Boton texto="Iniciar Sesión" className="btn-sonido-vivo" onClick={() => navigate("/login")} /></li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
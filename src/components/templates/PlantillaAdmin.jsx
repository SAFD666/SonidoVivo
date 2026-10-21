import { NavLink, useNavigate } from 'react-router-dom';
import Boton from '../atoms/Boton';
import { useTienda } from '../../context/TiendaContext';

function PlantillaAdmin({ titulo, children }) {
  const navigate = useNavigate();
  const { usuarioActivo, cerrarSesion } = useTienda();

  return (
    <div className="plantilla-admin">
      <aside className="admin-sidebar" aria-label="Menú de administración">
        <header className="admin-marca">
          <img src="/img/logotipo.jpg" alt="Logo Sonido Vivo" />
          <p>Panel Sonido Vivo</p>
        </header>

        <nav className="admin-menu" aria-label="Secciones del panel">
          <ul>
            <li><NavLink to="/admin/productos">Productos</NavLink></li>
            <li><NavLink to="/admin/pedidos">Pedidos</NavLink></li>
            <li><NavLink to="/" end>Ir a la tienda</NavLink></li>
          </ul>
        </nav>

        <footer className="admin-usuario">
          <p>{usuarioActivo?.nombre}</p>
          <p className="admin-rol">{usuarioActivo?.rol}</p>
          <Boton
            texto="Cerrar sesión"
            className="btn btn-outline-light btn-sm"
            onClick={() => { cerrarSesion(); navigate("/"); }}
          />
        </footer>
      </aside>

      <main className="admin-contenido">
        <header className="admin-cabecera">
          <h1 className="titulo-seccion">{titulo}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}

export default PlantillaAdmin;
import { Routes, Route } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';
import RutaProtegida from './components/RutaProtegida';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import Checkout from './pages/checkout';
import CompraExitosa from './pages/CompraExitosa';
import PagoFallido from './pages/PagoFallido';
import MisPedidos from './pages/MisPedidos';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductos from './pages/AdminProductos';
import AdminCategorias from './pages/AdminCategorias';
import AdminCriticos from './pages/AdminCriticos';
import AdminPedidos from './pages/AdminPedidos';
import AdminComprobante from './pages/AdminComprobante';
import AdminReportes from './pages/AdminReportes';
import AdminPerfil from './pages/AdminPerfil';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminHistorial from './pages/AdminHistorial';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Blog from './pages/Blog';
import DetalleBlog from './pages/DetalleBlog';
import './App.css';

const ROLES_ADMIN = ["Administrador", "Vendedor"];
const SOLO_ADMIN = ["Administrador"];

function App() {
  return (
    <TiendaProvider>
      <Routes>
        {/* Rutas publicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/categoria/:slug" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<DetalleBlog />} />

        {/* Rutas solo para clientes con sesion */}
        <Route path="/checkout" element={<RutaProtegida roles={["Cliente"]}><Checkout /></RutaProtegida>} />
        <Route path="/compra-exitosa" element={<RutaProtegida roles={["Cliente"]}><CompraExitosa /></RutaProtegida>} />
        <Route path="/pago-fallido" element={<RutaProtegida roles={["Cliente"]}><PagoFallido /></RutaProtegida>} />
        <Route path="/mis-pedidos" element={<RutaProtegida roles={["Cliente"]}><MisPedidos /></RutaProtegida>} />

        {/* Rutas solo para Administrador y Vendedor */}
        <Route path="/admin" element={<RutaProtegida roles={ROLES_ADMIN}><AdminDashboard /></RutaProtegida>} />
        <Route path="/admin/productos" element={<RutaProtegida roles={ROLES_ADMIN}><AdminProductos /></RutaProtegida>} />
        <Route path="/admin/categorias" element={<RutaProtegida roles={ROLES_ADMIN}><AdminCategorias /></RutaProtegida>} />
        <Route path="/admin/criticos" element={<RutaProtegida roles={ROLES_ADMIN}><AdminCriticos /></RutaProtegida>} />
        <Route path="/admin/pedidos" element={<RutaProtegida roles={ROLES_ADMIN}><AdminPedidos /></RutaProtegida>} />
        <Route path="/admin/pedidos/:id" element={<RutaProtegida roles={ROLES_ADMIN}><AdminComprobante /></RutaProtegida>} />
        <Route path="/admin/reportes" element={<RutaProtegida roles={ROLES_ADMIN}><AdminReportes /></RutaProtegida>} />
        <Route path="/admin/perfil" element={<RutaProtegida roles={ROLES_ADMIN}><AdminPerfil /></RutaProtegida>} />

        {/* Rutas solo para Administrador */}
        <Route path="/admin/usuarios" element={<RutaProtegida roles={SOLO_ADMIN}><AdminUsuarios /></RutaProtegida>} />
        <Route path="/admin/usuarios/:id/pedidos" element={<RutaProtegida roles={SOLO_ADMIN}><AdminHistorial /></RutaProtegida>} />
      </Routes>
    </TiendaProvider>
  );
}

export default App;
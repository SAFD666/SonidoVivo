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
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';
import './App.css';

const ROLES_ADMIN = ["Administrador", "Vendedor"];

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

        {/* Rutas solo para clientes con sesion */}
        <Route path="/checkout" element={<RutaProtegida roles={["Cliente"]}><Checkout /></RutaProtegida>} />
        <Route path="/compra-exitosa" element={<RutaProtegida roles={["Cliente"]}><CompraExitosa /></RutaProtegida>} />
        <Route path="/pago-fallido" element={<RutaProtegida roles={["Cliente"]}><PagoFallido /></RutaProtegida>} />
        <Route path="/mis-pedidos" element={<RutaProtegida roles={["Cliente"]}><MisPedidos /></RutaProtegida>} />

        {/* Rutas solo para Administrador y Vendedor */}
        <Route path="/admin/productos" element={<RutaProtegida roles={ROLES_ADMIN}><AdminProductos /></RutaProtegida>} />
        <Route path="/admin/pedidos" element={<RutaProtegida roles={ROLES_ADMIN}><AdminPedidos /></RutaProtegida>} />
      </Routes>
    </TiendaProvider>
  );
}

export default App;
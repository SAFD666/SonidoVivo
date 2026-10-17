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
import './App.css';

function App() {
  return (
    <TiendaProvider>
      <Routes>
        {/* Rutas para todo publico */}
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/categoria/:slug" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        {/* Rutas para los de sesion iniciada */}
        <Route path="/checkout" element={<RutaProtegida roles={["Cliente"]}><Checkout /></RutaProtegida>} />
        <Route path="/compra-exitosa" element={<RutaProtegida roles={["Cliente"]}><CompraExitosa /></RutaProtegida>} />
        <Route path="/pago-fallido" element={<RutaProtegida roles={["Cliente"]}><PagoFallido /></RutaProtegida>} />
        <Route path="/mis-pedidos" element={<RutaProtegida roles={["Cliente"]}><MisPedidos /></RutaProtegida>} />
      </Routes>
    </TiendaProvider>
  );
}

export default App;
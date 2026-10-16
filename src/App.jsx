import { Routes, Route } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import CompraExitosa from './pages/CompraExitosa';
import PagoFallido from './pages/PagoFallido';
import Checkout from './pages/checkout';
import RutaProtegida from './components/RutaProtegida';
import './App.css';

function App() {
  return (
    <TiendaProvider>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/categoria/:slug" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pago-fallido" element={<PagoFallido />}></Route>
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout" element={<RutaProtegida roles={["Cliente"]}><Checkout /> </RutaProtegida>}/>
      </Routes>
    </TiendaProvider>
  );
}
export default App;
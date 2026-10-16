import { Routes, Route } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias';
import Ofertas from './pages/Ofertas';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
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
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </TiendaProvider>
  );
}
export default App;
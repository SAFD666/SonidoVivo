import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Categorias from './pages/Categorias'; 
import Login from './pages/Login';
import './App.css';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/categoria/:slug" element={<Categorias />} /> 
      <Route path="/producto/:id" element={<DetalleProducto />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
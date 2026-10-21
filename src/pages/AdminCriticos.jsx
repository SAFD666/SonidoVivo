import { useNavigate } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import TablaProductos from '../components/organisms/TablaProductos';
import { useTienda } from '../context/TiendaContext';
import { STOCK_CRITICO } from '../utils/precios';

function AdminCriticos() {
  const navigate = useNavigate();
  const { productos } = useTienda();

  const productosCriticos = productos
    .filter((p) => p.stock <= STOCK_CRITICO)
    .sort((a, b) => a.stock - b.stock);

  const sinStock = productosCriticos.filter((p) => p.stock === 0).length;

  const reponer = (producto) => {
    navigate("/admin/productos", { state: { editar: producto.codigo } });
  };

  return (
    <PlantillaAdmin titulo="Stock crítico">
      <section aria-labelledby="titulo-criticos" className="admin-bloque">
        <h2 id="titulo-criticos" className="visually-hidden">Productos con stock crítico</h2>

        <p className="subtitulo-catalogo text-start">
          Productos con {STOCK_CRITICO} unidades o menos.
          {sinStock > 0 && <strong> {sinStock} ya están agotados.</strong>}
        </p>

        {productosCriticos.length > 0 ? (
          <TablaProductos productos={productosCriticos} onEditar={reponer} />
        ) : (
          <p className="mensaje-exito" role="status">
            Todos los productos tienen stock suficiente.
          </p>
        )}
      </section>
    </PlantillaAdmin>
  );
}

export default AdminCriticos;
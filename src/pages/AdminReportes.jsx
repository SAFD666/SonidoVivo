import { useMemo } from 'react';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import Indicador from '../components/molecules/Indicador';
import EstadoPedido, { ESTADOS_PEDIDO } from '../components/molecules/EstadoPedido';
import { useTienda } from '../context/TiendaContext';
import { formatearPrecio } from '../utils/precios';

function AdminReportes() {
  const { pedidos, productos } = useTienda();

  const reporte = useMemo(() => {
    const validos = pedidos.filter((p) => p.estado !== "Cancelado");
    const totalVentas = validos.reduce((total, p) => total + p.total, 0);

    const porEstado = ESTADOS_PEDIDO.map((estado) => {
      const delEstado = pedidos.filter((p) => p.estado === estado);
      return {
        estado,
        cantidad: delEstado.length,
        monto: delEstado.reduce((total, p) => total + p.total, 0),
      };
    });

    const ventasPorCategoria = {};
    const ventasPorProducto = {};

    validos.forEach((pedido) => {
      pedido.items.forEach((item) => {
        const subtotal = item.precio * item.cantidad;
        const producto = productos.find((p) => p.codigo === item.codigo);
        const categoria = producto ? producto.categoria : "Sin categoría";

        if (!ventasPorCategoria[categoria]) {
          ventasPorCategoria[categoria] = { categoria, unidades: 0, monto: 0 };
        }
        ventasPorCategoria[categoria].unidades += item.cantidad;
        ventasPorCategoria[categoria].monto += subtotal;

        if (!ventasPorProducto[item.codigo]) {
          ventasPorProducto[item.codigo] = { codigo: item.codigo, nombre: item.nombre, unidades: 0, monto: 0 };
        }
        ventasPorProducto[item.codigo].unidades += item.cantidad;
        ventasPorProducto[item.codigo].monto += subtotal;
      });
    });

    return {
      totalVentas,
      pedidosValidos: validos.length,
      ticketPromedio: validos.length > 0 ? Math.round(totalVentas / validos.length) : 0,
      porEstado,
      porCategoria: Object.values(ventasPorCategoria).sort((a, b) => b.monto - a.monto),
      masVendidos: Object.values(ventasPorProducto).sort((a, b) => b.unidades - a.unidades).slice(0, 5),
    };
  }, [pedidos, productos]);

  return (
    <PlantillaAdmin titulo="Reportes">
      <section className="admin-bloque">
        <h2 className="visually-hidden">Resumen de ventas</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <Indicador titulo="Ventas totales" valor={formatearPrecio(reporte.totalVentas)} detalle="sin contar cancelados" />
          </div>
          <div className="col-6 col-md-4">
            <Indicador titulo="Pedidos válidos" valor={reporte.pedidosValidos} />
          </div>
          <div className="col-6 col-md-4">
            <Indicador titulo="Ticket promedio" valor={formatearPrecio(reporte.ticketPromedio)} detalle="por pedido" />
          </div>
        </div>
      </section>

      <div className="row g-4 admin-bloque">
        <section className="col-12 col-lg-6">
          <h2 className="h5 mb-3">Pedidos por estado</h2>
          <div className="table-responsive">
            <table className="table align-middle tabla-admin">
              <thead>
                <tr>
                  <th scope="col">Estado</th>
                  <th scope="col" className="text-end">Pedidos</th>
                  <th scope="col" className="text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {reporte.porEstado.map((fila) => (
                  <tr key={fila.estado}>
                    <th scope="row"><EstadoPedido estado={fila.estado} /></th>
                    <td className="text-end">{fila.cantidad}</td>
                    <td className="text-end">{formatearPrecio(fila.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="col-12 col-lg-6">
          <h2 className="h5 mb-3">Ventas por categoría</h2>
          <div className="table-responsive">
            <table className="table align-middle tabla-admin">
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col" className="text-end">Unidades</th>
                  <th scope="col" className="text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {reporte.porCategoria.map((fila) => (
                  <tr key={fila.categoria}>
                    <th scope="row">{fila.categoria}</th>
                    <td className="text-end">{fila.unidades}</td>
                    <td className="text-end">{formatearPrecio(fila.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="admin-bloque">
        <h2 className="h5 mb-3">Productos más vendidos</h2>
        {reporte.masVendidos.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle tabla-admin">
              <thead>
                <tr>
                  <th scope="col">Puesto</th>
                  <th scope="col">Código</th>
                  <th scope="col">Producto</th>
                  <th scope="col" className="text-end">Unidades</th>
                  <th scope="col" className="text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {reporte.masVendidos.map((fila, indice) => (
                  <tr key={fila.codigo}>
                    <th scope="row">{indice + 1}°</th>
                    <td>{fila.codigo}</td>
                    <td>{fila.nombre}</td>
                    <td className="text-end">{fila.unidades}</td>
                    <td className="text-end">{formatearPrecio(fila.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="aviso-no-encontrado">Todavía no hay ventas registradas.</p>
        )}
      </section>
    </PlantillaAdmin>
  );
}

export default AdminReportes;
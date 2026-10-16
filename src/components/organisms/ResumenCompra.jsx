import Precio from "../atoms/Precio";

function ResumenCompra({ items, total }) {
  const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <aside className="resumen-compra">
      <h3>Resumen de compra</h3>

      <ul className="resumen-lista">
        {items.map((item) => (
          <li key={item.codigo}>
            <span>{item.cantidad} x {item.nombre}</span>
            <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
          </li>
        ))}
      </ul>

      <div className="resumen-fila">
        <span>Productos</span>
        <span>{cantidadItems}</span>
      </div>

      <div className="resumen-fila">
        <span>Envío</span>
        <span>Por pagar</span>
      </div>

      <div className="resumen-fila resumen-total">
        <span>Total</span>
        <Precio precio={total} />
      </div>
    </aside>
  );
}

export default ResumenCompra;
import ItemCarrito from "../molecules/ItemCarrito";

function Carrito({ items, onCambiarCantidad, onEliminar }) {
  return (
    <section className="lista-carrito">
      {items.map((item) => (
        <ItemCarrito
          key={item.codigo}
          codigo={item.codigo}
          nombre={item.nombre}
          imagen={item.imagen}
          precio={item.precio}
          cantidad={item.cantidad}
          stock={item.stock}
          onCambiarCantidad={(nuevaCantidad) => onCambiarCantidad(item.codigo, nuevaCantidad)}
          onEliminar={() => onEliminar(item.codigo)}
        />
      ))}
    </section>
  );
}

export default Carrito;
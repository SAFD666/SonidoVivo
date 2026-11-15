import ItemCarrito from "../molecules/ItemCarrito";

function Carrito(props) {
  return (
    <section className="lista-carrito">
      {props.items.map((item) => (
        <ItemCarrito
          key={item.codigo}
          codigo={item.codigo}
          nombre={item.nombre}
          imagen={item.imagen}
          precio={item.precio}
          cantidad={item.cantidad}
          stock={item.stock}
          onCambiarCantidad={(nuevaCantidad) => props.onCambiarCantidad(item.codigo, nuevaCantidad)}
          onEliminar={() => props.onEliminar(item.codigo)}
        />
      ))}
    </section>
  );
}

export default Carrito;
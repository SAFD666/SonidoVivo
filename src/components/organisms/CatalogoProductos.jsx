import TarjetaProducto from "../molecules/TarjetaProducto";

function CatalogoProductos({ productos, onVer }) {
  return (
    <div className="grilla-catalogo">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.codigo}
          codigo={producto.codigo}
          nombre={producto.nombre}
          marca={producto.marca}
          modelo={producto.modelo}
          precio={producto.precio}
          stock={producto.stock}
          imagen={producto.imagen}
          onVer={() => onVer(producto)}
        />
      ))}
    </div>
  );
}

export default CatalogoProductos;
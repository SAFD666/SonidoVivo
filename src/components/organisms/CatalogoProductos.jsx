import TarjetaProducto from "../molecules/TarjetaProducto";

function CatalogoProductos(props) {
  return (
    <div className="grilla-catalogo">
      {props.productos.map((producto) => (
        <TarjetaProducto
          key={producto.codigo}
          codigo={producto.codigo}
          nombre={producto.nombre}
          marca={producto.marca}
          modelo={producto.modelo}
          precio={producto.precio}
          stock={producto.stock}
          imagen={producto.imagen}
          esOferta={producto.esOferta}
          onVer={() => props.onVer(producto)}
        />
      ))}
    </div>
  );
}

export default CatalogoProductos;
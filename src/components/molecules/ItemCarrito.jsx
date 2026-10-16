import Precio from "../atoms/Precio";
import ContadorCantidad from "../atoms/ContadorCantidad";
import Boton from "../atoms/Boton";

function ItemCarrito({ nombre, codigo, imagen, precio, cantidad, stock, onCambiarCantidad, onEliminar }) {
  return (
    <div className="item-carrito">

      <img src={imagen} alt={nombre} className="item-carrito-imagen" />

      <div className="item-carrito-datos">
        <span className="codigo-item">Cód: {codigo}</span>
        <h5>{nombre}</h5>
        <Precio precio={precio} />
      </div>

      <ContadorCantidad
        cantidad={cantidad}
        maximo={stock}
        onChange={onCambiarCantidad}
      />

      <div className="item-carrito-subtotal">
        <small>Subtotal</small>
        <Precio precio={precio * cantidad} />
      </div>

      <Boton texto="Eliminar" className="btn btn-outline-danger btn-sm" onClick={onEliminar} />

    </div>
  );
}

export default ItemCarrito;
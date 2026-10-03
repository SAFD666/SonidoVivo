import Boton from "../atoms/Boton";
import EtiquetaStock from "../atoms/EtiquetaStock";
import Precio from "../atoms/Precio";

function TarjetaProducto({ codigo, nombre, marca, modelo, precio, stock, imagen, onVer }) {
  return (
    <article className="tarjeta-producto">
      <figure>
        <img 
          src={imagen || "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80"} 
          alt={nombre} 
          loading="lazy" 
        />
      </figure>

      <div>
        <span className="codigo-item">Cód: {codigo}</span>
        <h3>{nombre}</h3>
        <p><strong>Marca:</strong> {marca} | <strong>Modelo:</strong> {modelo}</p>
        <div>
          <EtiquetaStock stock={stock} />
        </div>
        <Precio precio={precio} />
      </div>

      <div className="tarjeta-pie">
        <Boton 
          texto="Ver detalle" 
          className="btn-comprar" 
          onClick={onVer} 
        />
      </div>
    </article>
  );
}

export default TarjetaProducto;
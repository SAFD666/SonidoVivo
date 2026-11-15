function EtiquetaStock(props) {
  const tieneStock = props.stock > 0;

  return (
    <span className={`etiqueta-stock ${tieneStock ? 'disponible' : 'agotado'}`}>
      Stock: {props.stock} {props.stock === 1 ? 'unidad' : 'unidades'}
    </span>
  );
}

export default EtiquetaStock;
function EtiquetaStock({ stock }) {
  const tieneStock = stock > 0;
  return (
    <span className={`etiqueta-stock ${tieneStock ? 'disponible' : 'agotado'}`}>
      Stock: {stock} {stock === 1 ? 'unidad' : 'unidades'}
    </span>
  );
}

export default EtiquetaStock;
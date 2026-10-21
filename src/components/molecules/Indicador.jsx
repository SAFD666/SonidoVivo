function Indicador({ titulo, valor, detalle, alerta = false }) {
  return (
    <article className={alerta ? "indicador alerta" : "indicador"}>
      <h3>{titulo}</h3>
      <p><strong>{valor}</strong></p>
      {detalle && <p>{detalle}</p>}
    </article>
  );
}

export default Indicador;
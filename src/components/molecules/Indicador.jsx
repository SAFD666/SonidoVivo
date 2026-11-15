function Indicador(props) {
  return (
    <article className={props.alerta ? "indicador alerta" : "indicador"}>
      <h3>{props.titulo}</h3>
      <p><strong>{props.valor}</strong></p>
      {props.detalle && <p>{props.detalle}</p>}
    </article>
  );
}

export default Indicador;
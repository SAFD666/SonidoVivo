function Boton(props) {
  const className = props.className || "btn-sonido-vivo";

  return (
    <button type="button" className={className} onClick={props.onClick}>
      {props.texto}
    </button>
  );
}

export default Boton;
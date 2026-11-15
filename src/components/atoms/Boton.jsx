function Boton(props) {
  return (
    <button
      type={props.type || "button"}
      className={props.className || "btn-sonido-vivo"}
      onClick={props.onClick}
      disabled={props.deshabilitado}
    >
      {props.texto}
    </button>
  );
}

export default Boton;
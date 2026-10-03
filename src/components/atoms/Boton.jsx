function Boton({ texto, onClick, className = "btn-sonido-vivo", type = "button" }) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {texto}
    </button>
  );
}

export default Boton;
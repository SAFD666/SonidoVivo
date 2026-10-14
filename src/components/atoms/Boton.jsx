function Boton({ texto, onClick, className = "btn-sonido-vivo", type = "button", deshabilitado = false }) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={deshabilitado}
    >
      {texto}
    </button>
  );
}

export default Boton;
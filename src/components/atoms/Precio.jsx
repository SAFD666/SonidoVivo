function Precio(props) {
  return (
    <p className="precio-texto">
      ${props.precio?.toLocaleString('es-CL')}
    </p>
  );
}

export default Precio;
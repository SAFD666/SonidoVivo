function Precio(props) {
  return (
    <p>

      ${props.precio.toLocaleString('es-CL')}
    
    </p>
  );
}

export default Precio;
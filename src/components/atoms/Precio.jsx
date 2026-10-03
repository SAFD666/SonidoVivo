function Precio({ precio }) {
  return (
    <p className="precio-texto">
      ${precio?.toLocaleString('es-CL')}
    </p>
  );
}

export default Precio;
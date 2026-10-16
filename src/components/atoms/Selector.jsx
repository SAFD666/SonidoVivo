function Selector({ id, name, value, onChange, opciones }) {
  return (
    <select
      id={id}
      name={name}
      className="form-select"
      value={value}
      onChange={onChange}
    >
      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  );
}

export default Selector;
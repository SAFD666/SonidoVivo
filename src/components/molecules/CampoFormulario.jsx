import CampoTexto from "../atoms/CampoTexto";

function CampoFormulario({ label, id, name, type, placeholder, value, onChange, required, min, step, error }) {
    return (
        <div className="mb-3 campo-formulario">

            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <CampoTexto
             id={id}
             name={name}
             type={type}
             placeholder={placeholder}
             value={value}
             onChange={onChange}
             required={required}
             min={min}
             step={step}
            />

            {error && <small className="texto-error">{error}</small>}

        </div>
    );
}

export default CampoFormulario;
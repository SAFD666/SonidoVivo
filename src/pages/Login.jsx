import React from 'react';
import PlantillaPublica from "../components/templates/PlantillaPublica";

function Login() {
  return (
    <PlantillaPublica>

    <div className="Titulo">
      <h2>Iniciar Sesión</h2>

      <form>
        <div className="Grupo-input">
          <label>Correo electrónico</label>

          <input
            type="email"
            id="Correo"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="Grupo-input">
          <label htmlFor="password">Contraseña</label>

          <input
            type="password"
            id="Contraseña"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button type="button" className="btn-Ingresar">
          Ingresar
        </button>
      </form>
    </div>
    
    </PlantillaPublica>
  );
}

export default Login;
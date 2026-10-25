import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantillaAdmin from '../components/templates/PlantillaAdmin';
import TablaUsuarios from '../components/organisms/TablaUsuarios';
import FormularioUsuario from '../components/organisms/FormularioUsuario';
import CampoFormulario from '../components/molecules/CampoFormulario';
import Boton from '../components/atoms/Boton';
import { useTienda } from '../context/TiendaContext';

function AdminUsuarios() {
  const { usuarios, usuarioActivo, guardarUsuario } = useTienda();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [formulario, setFormulario] = useState(null); 
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const usuariosVisibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return usuarios
      .filter((u) => `${u.nombre} ${u.correo} ${u.rol}`.toLowerCase().includes(termino))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [usuarios, busqueda]);

  const abrirFormulario = (usuario = null) => {
    setMensaje("");
    setError("");
    setFormulario({ usuario });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = (datos) => {
    const resultado = guardarUsuario(datos);
    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }
    setError("");
    setMensaje(datos.id ? `Usuario ${datos.nombre} actualizado.` : `Usuario ${datos.nombre} creado.`);
    setFormulario(null);
  };

  return (
    <PlantillaAdmin titulo="Gestión de usuarios">
      <div className="d-flex justify-content-end mb-3">
        <Boton texto="+ Nuevo usuario" className="btn-sonido-vivo" onClick={() => abrirFormulario()} />
      </div>

      {mensaje && <p className="mensaje-exito" role="status">{mensaje}</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {formulario && (
        <FormularioUsuario
          key={formulario.usuario?.id || "nuevo"}
          usuarioInicial={formulario.usuario}
          esUsuarioActual={formulario.usuario?.id === usuarioActivo.id}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      <section className="admin-bloque">
        <h2 id="titulo-buscar-usuarios" className="visually-hidden">Buscar usuarios</h2>
        <form className="filtros-admin" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Buscar usuarios</legend>
            <CampoFormulario
              label="Nombre, correo o rol"
              id="buscar-usuario"
              name="busqueda"
              type="search"
              placeholder="Ej: Cliente o admin@sonidovivo.cl"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </fieldset>
        </form>
      </section>

      <section className="admin-bloque">
        <h2 id="titulo-listado-usuarios" className="visually-hidden">Listado de usuarios</h2>
        {usuariosVisibles.length > 0 ? (
          <TablaUsuarios
            usuarios={usuariosVisibles}
            onEditar={abrirFormulario}
            onVerPedidos={(usuario) => navigate(`/admin/usuarios/${usuario.id}/pedidos`)}
          />
        ) : (
          <p className="aviso-no-encontrado">No hay usuarios que coincidan con la búsqueda.</p>
        )}
      </section>
    </PlantillaAdmin>
  );
}

export default AdminUsuarios;
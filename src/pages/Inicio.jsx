import { useNavigate } from 'react-router-dom';
import Boton from "../components/atoms/Boton";
import PlantillaPublica from "../components/templates/PlantillaPublica";


const CATEGORIAS = [
  { nombre: "Guitarras Acústicas", ruta: "/catalogo" },
  { nombre: "Guitarras Eléctricas", ruta: "/catalogo" },
  { nombre: "Bajos Eléctricos", ruta: "/catalogo" },
  { nombre: "Baterías", ruta: "/catalogo" },
  { nombre: "Teclados y Pianos", ruta: "/catalogo" },
  { nombre: "Amplificadores", ruta: "/catalogo" },
  { nombre: "Micrófonos", ruta: "/catalogo" },
  { nombre: "Pedales de Efecto", ruta: "/catalogo" },
  { nombre: "Estudio y Grabación", ruta: "/catalogo" },
  { nombre: "Accesorios", ruta: "/catalogo" },
];

function Inicio() {
  const navigate = useNavigate();
  
  return (
    <PlantillaPublica>
      <section className="bienvenida">
        <div className="hero-contenido">
          <h2>Instrumentos Musicales y Equipos de Sonido</h2>
          <p>Atención a clientes de Viña del Mar y envíos a todo Chile</p>

          <Boton
            texto="Ver Catálogo Completo"
            className="btn-sonido-vivo btn-hero"
            onClick={() => navigate("/catalogo")}
          />
          
        </div>
      </section>

      <section className="contenedor-principal">
        <h2 className="titulo-seccion">
          Nuestras Categorías
        </h2>

        <div className="grilla-categoria">
          {CATEGORIAS.map((cat, idx) => (
            <article key={idx} className="categoria-menu">
              <Boton
              texto="Ver Catálogo Completo"
              className="btn-sonido-vivo btn-hero"
              onClick={() => navigate("/catalogo")}
            />
            </article>
          ))}
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Inicio;
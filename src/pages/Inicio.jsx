import { useNavigate } from 'react-router-dom';
import Boton from "../components/atoms/Boton";
import PlantillaPublica from "../components/templates/PlantillaPublica";


const CATEGORIAS = [
  { nombre: "Guitarras Acústicas", ruta: "/categoria/guitarras-acusticas", imagen: "/img/acustica.png" },
  { nombre: "Guitarras Eléctricas", ruta: "/categoria/guitarras-electricas", imagen: "/img/electrica.png" },
  { nombre: "Bajos", ruta: "/categoria/bajos", imagen: "/img/bajo electrico.png" },
  { nombre: "Baterías y Percusión", ruta: "/categoria/baterias-y-percusion", imagen: "/img/baterias.png" },
  { nombre: "Teclados y Pianos", ruta: "/categoria/teclados-y-pianos", imagen: "/img/pianos y teclados.png" },
  { nombre: "Amplificadores", ruta: "/categoria/amplificadores", imagen: "/img/amplificadores.png" },
  { nombre: "Pedales y Efectos", ruta: "/categoria/pedales-y-efectos", imagen: "/img/pedales de efecto.png" },
  { nombre: "Estudio y Grabación", ruta: "/categoria/estudio-y-grabacion", imagen: "/img/estudio y grabacion.png" },
  { nombre: "Accesorios", ruta: "/categoria/accesorios", imagen: "/img/accesorios.png" },
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
            <article key={idx} className="tarjeta-producto" onClick={() => navigate(cat.ruta)}>
            
              <figure >
              <img src={cat.imagen} alt={cat.nombre}/>
              </figure>
              
            <h3>{cat.nombre}</h3>
            
            </article>
          ))}
        </div>
      </section>
    </PlantillaPublica>
  );
}

export default Inicio;
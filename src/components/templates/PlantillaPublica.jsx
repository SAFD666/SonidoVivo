import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

function PlantillaPublica(props) {
  return (
    <div>
      <Navbar />
      <main>
        {props.children}
      </main>
      <Footer />
    </div>
  );
}

export default PlantillaPublica;
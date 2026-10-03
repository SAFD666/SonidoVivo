
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

function PlantillaPublica({ children }) {
  return (
    <div >
      <Navbar />
      <main >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default PlantillaPublica;
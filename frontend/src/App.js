import "./App.css";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className='main__container'>
      <MainNav />
      <main className='main__content'>
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;

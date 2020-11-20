import "./App.css";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className='main__container'>
      <MainNav />
      <main className='main__content'>
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;

import { Route, Switch } from "react-router-dom";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import Signup from "./components/Form/Signup/Signup";
import "./App.css";

function App() {
  return (
    <div className='main__container'>
      <MainNav />
      <main className='main__content'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;

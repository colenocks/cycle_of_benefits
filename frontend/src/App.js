import { Route, Switch } from "react-router-dom";
import MainNav from "./components/Navigation/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Form/Login/Login";
import Signup from "./components/Form/Signup/Signup";
import About from "./components/About/About";
import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Dashboard/Dashboard";
import SingleProject from "./components/SingleProject/SingleProject";
import ProjectList from "./components/ProjectList/ProjectList";
import Contact from "./components/Contact/Contact";
import "./App.css";

function App() {
  return (
    <div className='main__container'>
      <MainNav />
      <main className='main__content'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route
            exact
            path='/project/:id'
            render={(props) => <SingleProject {...props} />}
          />
          <Route exact path='/projects' component={ProjectList} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/about' component={About} />
          <Route exact path='/contact-us' component={Contact} />
          <Route exact path='/admin' component={Admin} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;

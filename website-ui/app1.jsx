import { Outlet } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// import Login from '../src/pages/Login';
// import Homepage from '../website-ui/Home';
// import Privacy from '../website-ui/Legals/privacy';
// import TermsOfService from '../website-ui/Legals/terms-service';
// import CookiePolicy from '../website-ui/Legals/cookie';
// import FeaturesPage from '../website-ui/features';
import Navbar from './navbar';
import Footer from './footer';
function AppUI() {
  return (
    <div className="AppUI">
      <Navbar/>
      
      {/* Renders the matching child route element here */}
      <Outlet /> 
      
      <Footer/>                
    </div>
  );
}


export default AppUI;
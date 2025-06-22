import HomePage from '../pages/home';
import AddStoryPage from '../pages/add-story';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import AboutPage from '../pages/about/about-page';

const routes = {
  '/': new HomePage(),
  '/add-story': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/about': new AboutPage(),
};

export default routes;
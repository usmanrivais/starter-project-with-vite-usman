import HomePage from '../pages/home';
import AddStoryPage from '../pages/add-story';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import AboutPage from '../pages/about/about-page';
import NotFoundPage from '../pages/not-found-page';
import FavoritesPage from '../pages/favorites';


const routes = {
  '/': new HomePage(),
  '/add-story': new AddStoryPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/about': new AboutPage(),
  '/not-found': new NotFoundPage(),
  '/favorites': new FavoritesPage(),
};

export default routes;
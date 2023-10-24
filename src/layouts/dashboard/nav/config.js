// component
import { permission_check } from 'src/_mock/permission_check';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    show: 1,
    title: 'dashboard',
    path: '/app',
    icon: icon('ic_analytics'),
  },
  {
    show: permission_check('user_view') ? 1 : 0,
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'product',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'Permission',
  //   path: '/permissions',
  //   icon: icon('ic_blog'),
  // },
  {
    show: permission_check('role_view') ? 1 : 0,
    title: 'Role',
    path: '/roles',
    icon: icon('ic_blog'),
  },
  {
    show: permission_check('city_view') ? 1 : 0,
    title: 'City',
    path: '/city',
    icon: icon('ic_blog'),
  },
  {
    show: permission_check('area_view') ? 1 : 0,
    title: 'Area',
    path: '/area',
    icon: icon('ic_blog'),
  },
  {
    show: permission_check('property_view') ? 1 : 0,
    title: 'Property',
    path: '/property',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Owner',
  //   path: '/property-owner',
  //   icon: icon('ic_disabled'),
  // },
  {
    show: permission_check('task_view') ? 1 : 0,
    title: 'Tasks',
    path: '/tasks',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

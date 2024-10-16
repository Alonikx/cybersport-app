import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
    HOME: 'home',
    PROFILE: 'profile',
    INFO: 'info',
    VIDEOS: 'videos',
    ADD_INFO: 'add_info', 
    POLICY: 'policy',
    ADD_TOURNIR: 'add_tournir',
    CHANGE_INFO: 'change_info'
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.PROFILE, `/${DEFAULT_VIEW_PANELS.PROFILE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.INFO, `/${DEFAULT_VIEW_PANELS.INFO}`, []),
      createPanel(DEFAULT_VIEW_PANELS.VIDEOS, `/${DEFAULT_VIEW_PANELS.VIDEOS}`, []),
      createPanel(DEFAULT_VIEW_PANELS.ADD_INFO, `/${DEFAULT_VIEW_PANELS.ADD_INFO}`, []),
      createPanel(DEFAULT_VIEW_PANELS.ADD_TOURNIR, `/${DEFAULT_VIEW_PANELS.ADD_TOURNIR}`, []),
      createPanel(DEFAULT_VIEW_PANELS.POLICY, `/${DEFAULT_VIEW_PANELS.POLICY}`, []),
      createPanel(DEFAULT_VIEW_PANELS.CHANGE_INFO, `/${DEFAULT_VIEW_PANELS.CHANGE_INFO}`, [])


      
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());

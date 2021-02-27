import defaultSettings from '../../config/defaultSettings';

const updateColorWeak = (colorWeak) => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel = {
  namespace: 'settings',
  state: {
    "navTheme": "dark",
    "primaryColor": "#1890ff",
    "layout": "top",
    "contentWidth": "Fluid",
    "fixedHeader": false,
    "fixSiderbar": true,
    "title": "ADMIN",
    "pwa": false,
    "iconfontUrl": "",
    "menu": {
      "locale": true
    },
    "headerHeight": 48,
    "splitMenus": false
  },
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload;

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      updateColorWeak(!!colorWeak);
      return { ...state, ...payload };
    },
  },
};
export default SettingModel;


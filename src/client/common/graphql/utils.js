import { IS_LOGGED_IN } from './queries';

export const setIsLoggedIn = isLoggedIn => (proxy, { data: success }) => {
  if (!success) {
    return;
  }

  const data = proxy.readQuery({
    query: IS_LOGGED_IN
  });

  data.authState.isLoggedIn = isLoggedIn;
  proxy.writeQuery({
    query: IS_LOGGED_IN,
    data
  });
};

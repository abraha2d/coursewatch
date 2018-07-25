/**
 *
 * Utils
 *
 */

const loadAuth2 = () => {
  return new Promise(cb => window.gapi.load("auth2", cb)).then(() => {
    const params = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
    };
    return window.gapi.auth2.init(params);
  });
};

export { loadAuth2 };

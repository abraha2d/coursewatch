/**
 *
 * Utils
 *
 */

const loadAuth2 = () => {
  return new Promise(cb => window.gapi.load("auth2", cb)).then(() => {
    const params = {
      client_id:
        "988780152592-ccs5v79t0vuhvd0t1fhko53ugfmpheo1.apps.googleusercontent.com"
    };
    return window.gapi.auth2.init(params);
  });
};

export { loadAuth2 };

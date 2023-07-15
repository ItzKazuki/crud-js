
// save to console
let dataCookieLogin = {};

//getter setter
function cookieLogin(id, username, password, is_admin) {
    dataCookieLogin.id = id;
    dataCookieLogin.username = username;
    dataCookieLogin.password = password;
    dataCookieLogin.is_admin = is_admin;
}

export { dataCookieLogin, cookieLogin };


// make sleep function
function sleep(delay) {
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

// validate isset cookie class
function isLogin(account) {
    if (!account.id) return false;
    if (!account.is_admin) return { login: true, admin: false };

    return { login: true, admin: true };
}

export { sleep, isLogin }
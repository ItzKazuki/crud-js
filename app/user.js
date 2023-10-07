import captcha from './lib/captcha.js';
import Users from "./model/users.model.js";
import { main, admin, user, rl } from '../index.js';
import { success, error, failed, danger } from "./lib/color.js";
import { Cookie, getUser, removeUser } from "./lib/cookie.js";

// ----------------------- Account --------------------------------- \\

function greetings() {
    if(!getUser().is_admin) {
        if (
            getUser().username == undefined &&
            getUser().password == undefined
        ) return;
        return success(`\nWelcome ${getUser().username}`);
    }

    if (
        getUser().username == undefined &&
        getUser().password == undefined
    ) {
        danger("kamu belum login, sliahkan login terlebih dahulu");
        return main();
    }

    return success(`\nWelcome to admin ${getUser().username}`);
}

async function register() {
    console.log("Welcome to register\n");
    console.log('\n----------- Form Register Account -----------');
    const username = await rl.question("username: ");
    const password = await rl.question("password: ", { hidden: true });
    const limit = await captcha(); // make a chaptcha
    console.log('----------- End Form Register Account -----------\n');

    if (limit) {
        error('limit has reach, please try again later..');
        return main();
    }

    const user = new Users({
        username: username,
        password: password
    });

    Users.create(user, (err, res) => {
        if (err) {
            failed(err.message);
            return main();
        }

        success("sukses membuat user baru, here's the detail: ");
        console.table([res], ['id', 'username', 'is_admin']);
        return main();
    });
}

async function login() {
    console.log("Welcome to login page\n");
    if (getUser().is_admin == true) {
        console.log(
            `success login with username ${getUser().username}, redirecting to admin command`
        );
        return admin();
    }

    console.log('\n----------- Form Login Account -----------');
    const username = await rl.question("username: ");
    const password = await rl.question("password: ", { hidden: true });
    const limit = await captcha(); // make a chaptcha
    console.log('----------- End Form Login Account -----------\n');

    if (limit) {
        error('limit has reach, please try again later..');
        return main();
    }

    Users.find('username', username, async (err, res) => {
        if (err) {
            error("wrong username or password, please try again");
            return main();
        }

        const validatePassword = await Users.validatePassword(
            password,
            res.password
        );

        if (!validatePassword) {
            error("wrong username or password, please try again");
            return main();
        }

        // cookieLogin(res.id, res.username, res.password, res.is_admin);
        // set user to cookie
        new Cookie({
            id: res.id,
            username: res.username,
            password: res.password,
            is_admin: res.is_admin
        });

        // check admin atau bukan
        if (!res.is_admin) {
            success(`success login with username ${res.username}`);
            return main();
        }

        success(
            `success login with username ${res.username}, redirecting to admin command`
        );
        return admin();
    });
}

async function updateAccount() {
    const confirm = await rl.question('apakah anda yakin? (y/n) ');
    
    if(confirm == 'y') {
        // jalanin update akunnya
        console.log('\n----------- Form Update Account -----------');
        let username = await rl.question('masukan username baru (kosongkan jika tidak ingin di ubah): ');
        const password = await rl.question('masukan password baru: ');
        const limit = await captcha();
        console.log('----------- End Form Update Account -----------\n');

        if (limit) {
            error('limit has reach, please try again later..');
            return main();
        }

        if(username == '') username += getUser().username;

        Users.updateById(getUser().id, { username: username, password: password }, (err, res) => {
            if(err) {
                failed(err);
                return user();
            }

            success(`berhasil mengubah username dan password`);
            logout(); // menghapus akun dari cookie
            return main();
        })
    }

    success('berhasil membatalkan update akun!');
    return user();
}

async function removeMyAccount () {
    const confrim = await rl.question('apakah anda yakin? (y/n)');
    
    if(confrim == 'y') {
        // jalanin apus akunnya

        console.log('\n----------- Form Update Account -----------');
        const password = await rl.question('masukan password anda: ');
        const limit = await captcha();
        console.log('----------- End Form Update Account -----------\n');

        if (limit) {
            error('limit has reach, please try again later..');
            return main();
        }

        const validate = await Users.validatePassword(password, getUser().password);

        if(!validate) {
            error('password salah, silahkan coba lagi');
            return user();
        }

        Users.remove(getUser().id, (err, res) => {
            if (err) {
                failed(err);
                return user();
            }

            success('berhasil menghapus akun anda, terimaksih telah menggunakan layanan kami!');
            removeUser();
            return main();

        })
    }

    console.log('berhasil membatalkan update akun!');
    return user();
}

function myAccount() {
    if (!getUser().username) {
        error("kamu belum login, login terlebih dahulu");
        return login();
    }
    
    console.table([getUser()], ['id', 'username', 'is_admin']);
    return user();
}
// ----------------------- End Account --------------------------------- \\

export { updateAccount, removeMyAccount, register, login, myAccount, greetings };
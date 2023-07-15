import * as readline from "node:readline/promises";
import appConfig from './app/config/app.config.js';
import { getUser, removeUser } from "./app/lib/cookie.js";
import { stdin as input, stdout as output } from "node:process";
import {
    register,
    login,
    myAccount,
    updateAccount,
    removeMyAccount,
    greetings
} from "./app/user.js";
import {
    showListClient,
    showListStaff,
    cleanupClient,
    deleteStaff,
    addStaff,
} from "./app/admin.js";
import { failed, info, pending, ncInfo } from "./app/lib/color.js";
import { addMenu, deleteMenu, editMenu, listMenu } from "./app/menu.js";
import { sleep } from "./app/lib/package.js";

//import function
const rl = readline.createInterface({ input, output });

async function main() {
    greetings();
    // di isni ada list command kek daftar menu, daftar staff(buat admin) trus beli makanan
    console.log("\n ----------------- List Command ----------------------");
    console.log("1. register page");
    console.log("2. login page");
    console.log("3. list menu");
    console.log("4. list staff");
    if (getUser().is_admin) {
        console.log("5. admin page");
    } else {
        console.log("5. my account");
    }
    console.log("6. exit");
    console.log("-------------------- End List Command ------------------\n");

    const command = await rl.question(ncInfo("Masukan command: "));

    switch (command) {
        case "1":
            if (getUser().id) {
                info('you already login, please try again later...')
                main();
            } else {
                register();
            }
            break;
        case "2":
            if (getUser().id) {
                info('you already login, please try again later...')
                main();
            } else {
                login();
            }
            break;
        case "3":
            listMenu();
            break;
        case "4":
            showListStaff();
            break;
        case "5":
            if (getUser().is_admin) {
                admin();
            } else {
                myAccount();
            }
            break;
        case "6":
            info('stopping process...');
            sleep(5000)
            pending('bye :)');
            removeUser();
            process.exit();
        default:
            info("\nMasukan command yang benar");
            info("contoh 1,2,dll...");
            main();
    }
}

async function user() {
    console.log("\n ----------------- My Account----------------------");
    console.log("1. update akun");
    console.log("2. remove my account");
    if (getUser().is_admin) {
        console.log("3. admin page");
    } else {
        console.log("3. main page");
    }
    console.log('4. logout')
    console.log("-------------------- End My Account ------------------\n");

    const command = await rl.question(ncInfo("Masukan command: "));

    switch (command) {
        case '1':
            updateAccount();
            break;
        case '2':
            removeMyAccount();
            break;
        case '3':
            if (getUser().is_admin) {
                admin();
            } else {
                main();
            }
            break;
        case '4':
            removeUser();
            main();
            break;
        default:
            info('masukan command yang benar!');
            info("contoh 1,2,dll...");
            main();
    }
}

async function admin() {
    if (getUser().username == undefined || !getUser().is_admin) return main();
    greetings();

    console.log("\n ----------------- List Command Admin ----------------------");
    console.log("1. tambah menu");
    console.log("2. edit menu");
    console.log("3. hapus menu");
    console.log("4. list staff");
    console.log("5. list client");
    console.log("6. rekrut staff");
    console.log("7. hapus staff");
    console.log("8. back to client");
    console.log("9. cleanup client user");
    console.log("10. my account");
    console.log(
        "-------------------- End List Command Admin ------------------\n"
    );

    const command = await rl.question(ncInfo("Masukan command: "));

    switch (command) {
        case "1":
            addMenu();
            break;
        case "2":
            editMenu();
            break;
        case "3":
            deleteMenu();
            break;
        case "4":
            showListStaff();
            break;
        case "5":
            showListClient();
            break;
        case "6":
            addStaff();
            break;
        case "7":
            deleteStaff();
            break;
        case "8":
            main();
            break;
        case "9":
            cleanupClient();
            break;
        case "10":
            myAccount();
            break;
        default:
            info("\nMasukan command yang benar");
            info("contoh 1,2,dll...");
            admin();
    }
}

info("Starting application.... ");

if(appConfig.debug) {
    console.log('\n---------- App Info ------------');
    info(`app version: ${appConfig.version}`);
    info(`app build: ${appConfig.build}`);
    info(`app author: ${appConfig.author}`);
    console.log('---------- End App Info ------------');
}

main();

export { admin, main, user, rl };

import Users from "./model/users.model.js";
import { admin, main, rl } from '../index.js';
import appConfig from './config/app.config.js';
import { success, error, failed } from "./lib/color.js";
import { getUser } from "./lib/cookie.js";

function checkIsAdministrator() {
    if(getUser().id != appConfig.administrator) {
        error('kamu bukan administrator, mengalihkan ke admin page');
        admin();
        return true;
    }
    
    return false;
}

// -------------------- Admin ------------------------------ \\

async function showListStaff() {
    Users.find("is_admin", true, (err, res) => {
        if (err) {
            error(err.kind);
            return admin();
        }

        if(res[0] == undefined) {
            success("list staff: ");
            console.table(res);
            return admin();
        }

        //kl datanya banyak keluarin ini
        const staff = res.map((i) => i.username);
        success("list staff: ");
        console.table(staff);
        return admin();
    });
}

async function cleanupClient() {
    const confirmation = await rl.question("are you sure? (y/n) ");
    if (confirmation == 'y') {
        if(checkIsAdministrator()) return;

        const retype_pwd = await rl.question(
            "confirm delete users with admin password: "
        );
    
        const validate = await Users.validatePassword(
            retype_pwd,
            getUser().password
        );
    
        if (!validate) {
            error("password yang anda masukan salah, silahkan coba lagi");
            return admin();
        }
    
        // remove users where is_admin false
        Users.removeAll((err, res) => {
            if (err) {
                failed(err);
                return admin();
            }
    
            success(
                `berhasil menghapus client, total terhapus: ${res.affectedRows}`
            );
            return admin();
        });
    }

    success("successfuly cancel deleting users");
    return admin();
}

async function showListClient() {
    Users.find("is_admin", false, (err, res) => {
        if (err) {
            failed(err.kind);
            return admin();
        }

        if(res[0] == undefined) {
            success("list users: ");
            console.table(res);
            return admin();
        }
        
        const client = res.map((i) => i.username);
        success("list users: ");
        console.table(client);
        return admin();
    });
}

function deleteStaff() {
    Users.find('is_admin', true, async (err, res) => {
        if(checkIsAdministrator()) return;

        const listStaff = res.map(user => {
            return {
                id: user._id.toString(), username: user.username 
            }
        });
        console.table(listStaff);
        
        const idStaff = await rl.question('masukan id staff: ');
        const checkIsSameId = listStaff.find(data => data.id == idStaff) ? true : false;

        if (!checkIsSameId) {
            error('id user tidak ditemukan! silahkan coba lagi!');
            return admin();
        }

        Users.remove(idStaff, (err, res) => {
            if(err) {
                failed(err);
                return admin()
            }

            success(`berhasil menghapus staff dengan id: ${idStaff}`);
            return admin();
        })
    })
}

function addStaff() {
    Users.find('is_admin', false, async (err, res) => {
        if(checkIsAdministrator()) return;

        // ngambil semua client
        const listClient = res.map(user => {
            return {
                id: user._id.toString(), username: user.username 
            }
        });
        console.table(listClient);

        const idClient = await rl.question('masukan id client: ');
        const checkIsSameId = listClient.find(user => user.id == idClient) ? true : false;

        if (!checkIsSameId) {
            error('id user tidak ditemukan! silahkan coba lagi!');
            return admin();
        }

        Users.updateStaffById(idClient, (err, res) => {
            if(err) {
                error(err);
                return admin();
            }

            success(`berhasil menambah admin dengan id ${idClient}`);
            return admin();
        })
    })
}

// -------------------- End Admin ------------------------------ \\

export { showListClient, showListStaff, cleanupClient, deleteStaff, addStaff };
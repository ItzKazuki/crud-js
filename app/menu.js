import captcha from './lib/captcha.js';
import Menu from "./model/menu.model.js";
import { main, admin, user, rl } from '../index.js';
import { success, error, info, failed } from "./lib/color.js";
import { getUser } from "./lib/cookie.js";

async function addMenu() {
    console.log('\n------------ Menu ---------------');
    const name = await rl.question('nama menu: ');
    const description = await rl.question('deskripsi menu: ');
    const price = await rl.question('harga menu: ');
    const limit = await captcha();
    console.log('------------ End Menu ---------------\n');

    if(limit) {
        failed('limit has reached, please try again later');
        return admin();
    }

    const menu = new Menu({
        name: name,
        description: description,
        price: parseInt(price),
        username: getUser().username
    });

    Menu.create(menu, (err, res) => {
        if(err) {
            failed(err);
            return admin();
        }

        success('berhasil menambah menu, ini detailnya: ');
        console.table([res], ['id', 'name', 'description', 'username']);
        return admin();
    })
}

async function deleteMenu() {
    Menu.getAll(async (err, res) => {

        const listMenu = res.map(i => {
            return {
                id: i._id.toString(), name: i.name, description: i.description, price: i.price, username: i.username 
            }
        });
        // tamilkan datanya
        console.table(listMenu);

        // ambil dan cari id nya
        const idMenu = await rl.question('\nmasukan id: ');
        // kalo ada, return true, selain itu false
        const checkIsSameId = listMenu.find(menu => menu.id == idMenu) ? true : false;

        if (!checkIsSameId) {
            error('id menu tidak ditemukan! silahkan coba lagi!');
            return admin();
        }

        Menu.remove(idMenu, (err, res) => {
            if(err) {
                console.error(err);
                return admin();
            }

            success(`berhasil menghapus menu dengan id: ${idMenu}`);
            return admin();
        })
    })
}

function editMenu() {
    Menu.getAll(async (err, res) => {

        const listMenu = res.map(menu => {
            return {
                id: menu._id.toString(), name: menu.name, description: menu.description, price: menu.price, username: menu.username 
            }
        });
        console.table(listMenu);

        // cari id nya
        const idMenu = await rl.question('masukan id: ');
        const checkIsSameId = listMenu.find(menu => menu.id == idMenu) ? true : false;

        if (!checkIsSameId) {
            error('id menu tidak ditemukan! silahkan coba lagi!');
            return admin();
        }

        console.log('\n------------ Update Menu ---------------');
        let name = await rl.question('nama menu baru (kosongkan jika tidak ingin di ubah): ');
        let description = await rl.question('deskripsi menu (kosongkan jika tidak ingin di ubah): ');
        let price = await rl.question('harga menu (kosongkan jika tidak ingin di ubah): ');
        console.log('------------ End Update Menu ---------------\n');

        const getMenu = listMenu.find(d => d._id.toString() == idMenu);

        if(name == '') name += getMenu.name;
        if(description == '') description += getMenu.description;
        if(price == '') price += getMenu.price;

        const menu = {
            name: name,
            description: description,
            price: parseInt(price),
            username: getUser().username
        }

        Menu.updateById(idMenu, menu, (err, res) => {
            if(err) {
                console.log(err);
                admin();
                return;
            }

            success(`berhasil update menu dengan id: ${idMenu}`);
            return admin();
        })
    })
}

function listMenu() {
    Menu.getAll((err, res) => {
        if(err) {
            failed(err);
            return admin();
        }
        
        const listMenu = res.map(i => {
            return {
                id: i._id.toString(), name: i.name, description: i.description, price: i.price 
            }
        });

        success('\nmenu yang tersedia: ');
        // tampilkan listMenu
        console.table(listMenu);
        return admin();
    })
}


export { addMenu, editMenu, deleteMenu, listMenu };


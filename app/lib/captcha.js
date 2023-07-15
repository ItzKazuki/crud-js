import { main, admin, rl } from '../../index.js';

let hasTry = 0;

function isLimit(backTo) {
    // backTo = string
    failed('limit has reached, please try again later');
    if(backTo == 'admin') {
        return admin();
    } else if(backTo == 'main') {
        return main();
    } else {
        failed('masukan parameter di function captcha!')
        return main(); // kalo kosong params nya ttp di kembaliin + error code + back to main()
    }
}

async function createCaptcha(backTo) {
    hasTry += 1; // nambahin satu tiap kali coba
    if (hasTry == 15) return isLimit(backTo); // check timeout try

    const captcha = Math.floor(Math.random() * 9999); // cari angka dari 1000-9999
    console.log(`captcha: ${captcha}`); // tampilin ke console
    const verify = await rl.question("retype chaptcha: ");

    if (captcha == verify) return; // kalo belum sama, bakal loop ke sini terus
    return createCaptcha();
}

export default createCaptcha;
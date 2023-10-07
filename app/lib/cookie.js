// save to memory 
let dataUser = {};

//constructor
const Cookie = function(user) {
    // return to variable
    this.id = user.id,
    this.username = user.username,
    this.password = user.password,
    this.is_admin = user.is_admin
    
    // set to dataUser object
    dataUser.id = user.id,
    dataUser.username = user.username,
    dataUser.password = user.password,
    dataUser.is_admin = user.is_admin
};

// getter and setter

const getUser = () => ({
    id: dataUser.id,
    username: dataUser.username,
    password: dataUser.password,
    is_admin: dataUser.is_admin,
});

function setUser(user) {
    dataUser.id = user.id;
    dataUser.username = user.username;
    dataUser.password = user.password;
    dataUser.is_admin = user.is_admin;
    return true;
}

function removeUser() {
    delete dataUser.id;
    delete dataUser.username;
    delete dataUser.password;
    delete dataUser.is_admin;
    return true;
}

// // user dump
// const newCookie = new Cookie({
//     id: 17862102980,
//     username: 'kazuki',
//     password: 'HA*&WU)SJJDHJSDHJN*@*@)(2789q37910',
//     is_admin: true
// })

// getUser().username = 'hahahahha'

// console.log(newCookie)
// console.log(getUser())

export { Cookie, getUser, setUser, removeUser }

/*
Implement save object.

object ga boleh di publikasikan karena bisa di manipulasi. agar tidak dapat di manipulasi menggunakan getter setter. 
getter (tempat menerima seperti username, id, email, dll).
setter (mengirim data seperti username, password, dll).
*/
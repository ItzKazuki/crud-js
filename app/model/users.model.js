import db from '../lib/mongodb.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

const collection = db.collection('users');

//constructor
const Users = function(users) {
    this.username = users.username,
    this.password = users.password,
    this.is_admin = false
};

// check username and password 
async function validateAccount(user) {
    const isUsernameContainSpace = user.username.split(' ')[1] ? true : false;
    const isPasswordContainSpace = user.password.split(' ')[1] ? true : false;

    //check username
    if(user.username.length <= 4) {
        return {error: 'short_username', message: 'username terlalu pendek, silahkan coba username lain.'};
    }

    if(user.username.length >= 14) {
        return {error: 'long_username', message: 'username terlalu panjang, silahkan coba username lain.'};
    }

    // checkpassword
    if(user.password <= 3) {
        return {error: 'short_passord', message: 'password terlalu pendek, silahkan coba password lain.'} ;
    }

    if(user.password <= 20) {
        return {error: 'long_password', message: 'password terlalu panjang, silahkan coba password lain.'};
    }

    if(isPasswordContainSpace || isUsernameContainSpace) {
        return {error: 'contain_space', message: 'username atau password mengandung spasi, coba gunakan username atau password lain'};
    }

    user.password = await Users.hashPassword(user.password);
    return true;
}

//create a hash to password
Users.hashPassword = async password => await bcrypt.hash(password, await bcrypt.genSalt(10));

// for validate password, 
Users.validatePassword = async (candidatePassword, hashPassword) => await bcrypt.compare(candidatePassword, hashPassword);

Users.create = (newUser, result) => {
    // ngecek dulu username nya duble atau engga
    Users.find('username', newUser.username, async (err, res) => {
        const status = await validateAccount(newUser);

        if(res) {
            result({error: 'found', message: 'username sudah digunakan, silahkan coba username lain.'});
            return;
        }

        if(status.error) {
            result(status);
            return;
        }

        try {
          const createUser = await collection.insertOne(newUser);
          result(null, {id: createUser.insertedId.toString() , ...newUser});
        } catch {
          result(err, null);
        }

    })
};

Users.find = async (by, find, result) => {
  let query = {};
  query[`${by}`] = find;

  try {
    const findResult = await collection.find({ [by]: find }).toArray();

     // kalo cuma 1 doang ambil array pertama
    if (findResult.length == 1) {
        // console.log('found user: ', res[0]);
        const fristData = findResult[0];
        result(null, {
          id: fristData._id.toString(),
          username: fristData.username,
          password: fristData.password,
          is_admin: fristData.is_admin
        });
        return;
    }

    // kalo lebih dari 1 tampilin semua array
    if (findResult.length >= 1) {
        // console.log('found user: ', res[0]);
        result(null, findResult);
        return;
    }

    // kenaoa ga pake if else else if banh ntar ribet co, gini aja easy to read wkkwk

    result({kind: 'not_found'});
  } catch (err) {
    result(err, null);
  }
};

Users.getAll = async result => {
  try {
    const res = await collection.find({}).toArray();
    result(null, res)
  } catch (err) {
    result(err, null)
  }
}

//kl mw di update harus update 
Users.updateById = async (id, user, result) => {
    const status = await validateAccount(user);

    if(status.error) {
        result(status);
        return;
    }

  try {
    const updateQuery = {
      $set: user
    }
    const findQuery = {
      _id: new ObjectId(id)
    }
    
    const updateResult = await collection.findOneAndUpdate(findQuery, updateQuery, { returnOriginal: false })
    if(!updateResult.lastErrorObject.n) {
      result(updateResult, null);
      return;
    }

    result(null, updateResult)
  } catch (err) {
    result(err, null)
  }
}

Users.updateStaffById = async (id, result) => {
    try {
    const updateQuery = {
      $set: {
        is_admin: true  
      }
    }
    const findQuery = {
      _id: new ObjectId(id)
    }
    
    const updateResult = await collection.findOneAndUpdate(findQuery, updateQuery, { returnOriginal: false })
    if(!updateResult.lastErrorObject.n) {
      result(updateResult, null);
      return;
    }

    result(null, updateResult)
  } catch (err) {
    result(err, null)
  }
}

Users.remove = async (id, result) => {
    try {
      const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
      result(null, deleteResult)
    } catch (err) {
      result(err, null)
    }
}

Users.removeAll = async result => {
    try {
      const deleteResult = await collection.deleteMany({ is_admin: false });
      result(null, deleteResult)
    } catch (err) {
      result(err, null)
    }
}

export default Users;

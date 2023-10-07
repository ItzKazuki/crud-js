import db from '../lib/mongodb.js';

const collection = db.collection('menus');
const Menu = function(menu) {
    this.name = menu.name,
    this.description = menu.description,
    this.price = menu.price,
    this.username = menu.username
}

Menu.create = async (newMenu, result) => {
    try {
      const createMenu = await collection.insertOne(newMenu);
      result(null, {id: createMenu.insertedId.toString() , ...newMenu});
    } catch {
      result(err, null);
    }
}

Menu.find = async (by, find, result) => {
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
          name: fristData.name,
          description: fristData.description,
          price: fristData.price,
          username: fristData.username
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
}

Menu.getAll = async result => {
  try {
    const res = await collection.find({}).toArray();
    result(null, res)
  } catch (err) {
    result(err, null)
  }
}

Menu.updateById = async (id, data, result) => {
    try {
    const updateQuery = {
      $set: data
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

Menu.remove = async (id, result) => {
    try {
      const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
      result(null, deleteResult)
    } catch (err) {
      result(err, null)
    }
}

Menu.removeAll = async result => {
    try {
      const deleteResult = await collection.deleteMany({});
      result(null, deleteResult)
    } catch (err) {
      result(err, null)
    }
}

export default Menu;
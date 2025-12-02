const models = require('../models');

const { Item } = models;

const inventoryPage = async (req, res) => res.render('inv');
const makerPage = async (req, res) => res.render('maker');

const makeItem = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'object name required'});
  }

   const itemData = {
    name: req.body.name,
    pieces: req.body.pieces,
    id: req.body.id,
    inv: req.body.inv,
    xOverall: req.body.xOverall,
    yOverall: req.body.yOverall,
    owner: req.session.account._id,
  };
  try {
    const newItem = new Item(itemData);
    await newItem.save();
    return res.status(201).json({
      name: newItem.name,
      pieces: newItem.pieces,
      id: newItem.id,
      inv: newItem.inv,
      xOverall: newItem.xOverall,
      yOverall: newItem.yOverall,
      //NTS reminder to calc xOverall & yOverall -- Think it might be working testing required
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'item already exists' });
    }
    return res.status(500).json({ error: 'error occured making new item' });
  }
}

const updateItem = async(req,res)=> {
  try{
  const itemData = {
    id: req.body.id,
    name: req.body.name,
    inv: req.body.inv,
    xNew: req.body.xNew,
    yNew: req.body.yNew,
    owner: req.session.account._id,
  };
  const updated = await Item.findOneAndUpdate( //Worlds best builtin function
    { _id: itemData.id, owner: itemData.owner },
    { xOverall: itemData.xNew, yOverall: itemData.yNew },
  );
  return res.status(200).json(updated);
}
catch(err){
  console.log(err);
  return res.status(500).json({error: 'error occured while updating'})
}
  // console.log(updated);
}

const getItems = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Item.find(query).select('name pieces inv xOverall yOverall').lean().exec();

    return res.json({ items: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'error retrieving items' });
  }
};

module.exports = {
  makerPage,
  makeItem,
  updateItem,
  getItems,
  inventoryPage,
}
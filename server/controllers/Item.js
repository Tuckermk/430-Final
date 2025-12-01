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

const getItems = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Item.find(query).select('name pieces xOverall yOverall').lean().exec();

    return res.json({ items: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'error retrieving items' });
  }
};

module.exports = {
  makerPage,
  makeItem,
  getItems,
  inventoryPage,
}
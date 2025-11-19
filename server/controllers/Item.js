const models = require('../models');

const { Item } = models;

const makerPage = async (req, res) => res.render('app');

const makeItem = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'object name required'});
  }

   const itemData = {
    name: req.body.name,
    owner: req.session.account._id,
  };
  try {
    const newItem = new Item(itemData);
    await newItem.save();
    return res.status(201).json({
      name: newItem.name,
      //NTS reminder to calc xOverall & yOverall
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'item already exists' });
    }
    return res.status(500).json({ error: 'error occured making new item' });
  }
}
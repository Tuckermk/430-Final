import ItemModel from '../server/models/Item.js';

const helper = require('./helper.jsx');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');
//Handler that sends the post request with the information on Maker page
//additionally calculates the center of the screen at creation as to put the new Item there
const handleItem = (e, onItemAdded) => {
   e.preventDefault();
   helper.hideError();

   const name = e.target.querySelector('#itemName').value;
   const pieces = e.target.querySelector('#itemPieces').value;
   const inv = e.target.querySelector('#itemInventory').value;
   const xOverall = innerWidth/2;
   const yOverall = innerHeight/2;

   if(!name || !pieces){
      helper.handleError('all fields required');
      return false;
   }
  //  console.log(e.target.action);
   helper.sendPost(e.target.action, {name, pieces, inv, xOverall , yOverall}, onItemAdded);
   return false;
};

const ItemForm = (props) => {
   return (
      <form id ="itemForm"
         name="itemForm"
         onSubmit={(e) => handleItem(e,props.triggerReload)}
         action="/maker"
         method='POST'
         className='itemForm'
      >
        <label htmlFor='name'>Name: </label>
        <input id='itemName' type='text' name='name' placeholder='Item Name'/>
        <label htmlFor='pieces'>Pieces: </label>
        <input id='itemPieces' type='array' name='pieces' placeholder='(0,1), (1,1), (2,1)' onChange={props.onPiecesChange}/>
        <label htmlFor='destination'>Send to: </label>
        <select name="channel" id="itemInventory">
           <option value="Inv1">Inventory1</option>
           <option value="Inv2">Inventory2</option>
           <option value="Inv3">Inventory3</option>
           <option value="Inv4">Inventory4: Premium Only</option>
           <option value="Inv5">Inventory5: Premium Only</option>
        </select>
        <input className='makeItemSubmit' type='submit' value="Make Item" />
      </form>
   )
};
//Houses the React which triggers the send
//also actively calls block maker as you input things to show you what you are making
const Maker = () => {
  const [reloadItems, setReloadItems] = useState(false);
  const [tempShape,setTempShape] = useState(false);

  const tempItemRef = React.useRef(new ItemModel());
  const fillInOnChange = (e) => {
    if(!e.target.value){return;};
    const tempItem = tempItemRef.current;
    let pieces = e.target.value; //BE QUIET YOU DUMB ERROR
    tempItem.name = 'tempItem';
    tempItem.pieces = pieces;
    let xCenter = innerWidth/2;
    let yCenter = innerHeight/2;
    try {
      let tempShape = helper.blockMaker(tempItem, 'maker',xCenter,yCenter);
      // console.log(tempShape);
      setTempShape(tempShape);
    } catch (err) {
      helper.hideError(err);
    }
  };

  return (
    <div>
      <div id="makeItem">
        <ItemForm 
          triggerReload={() => setReloadItems(!reloadItems)}
          onPiecesChange = {fillInOnChange}/>
      </div>
        <div id="tempArea">
          <div id='item'>
          {tempShape}  
        </div>
      </div>
    </div>
  );
}


const init = () => {
  const makerDiv = document.getElementById('maker');
  if (!makerDiv) return;
  const root = createRoot(makerDiv);
  root.render(<Maker/>);
};
window.onload = init;
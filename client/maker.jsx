const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');

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
        <input id='itemPieces' type='array' name='pieces' placeholder='(0,1), (1,1), (2,1)'/>
        <select name="channel" id="itemInventory">
           <option value="Inv1">Inventory1</option>
           <option value="Inv2">Inventory2</option>
        </select>
        <input className='makeItemSubmit' type='submit' value="Make Item" />
      </form>
   )
};

const Maker = () => {
  const [reloadItems, setReloadItems] = useState(false);

  return (
    <div>
      <div id="makeItem">
        <ItemForm triggerReload={() => setReloadItems(!reloadItems)}/>
      </div>
    </div>
  );
}
const init = () => {
  const makerDiv = document.getElementById('maker');
  if (!makerDiv) return;
  const root = createRoot(makerDiv);
  root.render(<ItemForm><Maker/></ItemForm>);
};
window.onload = init;
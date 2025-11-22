const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';

//Inventory Items are going to be called ite here since Dragging has a item key
function ItemDragging({ite, children}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: "ITE",
    item: {id: ite._id},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: ite.xOverall,
        top: ite.yOverall,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab", //cool little styling thing i found
      }}
    >
      {children}
    </div>
  )
}

const ScreenDropLayer = ({ onDrop, children }) => {
  const [, dropRef] = useDrop(() => ({
    accept: "ITE",
    //v these should be item not ite, i think
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      onDrop(item.id, offset.x, offset.y);
    },
  }));

  return (
    <div
      ref={dropRef}
      style={{
        position: "fixed",
        inset: 0,
      }}
    >
      {children}
    </div>
  );
};

//NTS Need to make board
//perhaps go find making a chessboard for example?

const ItemList = (props) => {
   const [items, setItems] = useState(props.items);

  useEffect(() => {
  const loadItemsFromServer = async () => {
    const response = await fetch('/getItems');
    const data = await response.json();

   const merged = data.items.map(ite => {
   const pos = props.positions[ite._id] || { x: 20, y: 20 }; //NTS Probably the thing to alter to make it work with a cloud server
   return {
      _id: ite._id,
      name: ite.name,
      pieces: ite.pieces,
      x: pos.x,
      y: pos.y,
   };
   });


    setItems(merged);
  };
  loadItemsFromServer();
}, [props.reloadItems, props.positions]);

   if(items.length === 0){
      return (
         <div className="itemList">
            <h3 className='emptyItem'>No Items Yet</h3>
         </div>
      );
   }

   const itemNodes = items.map(ite => {
      return (
         <ItemDragging key={ite._id} item={ite}>
            <div className="item">
               {/* NTS reminder to change the artwork */}
            <img src="/assets/img/domoface.jpeg" alt='domo face' className='domoFace'/> 
            <h3 className='itemName'>Name: {ite.name}</h3>
            <h3 className='itemPieces'>Pieces: {ite.pieces}</h3>
            </div>
         </ItemDragging>
      );
   });

   return(
      <div className='ItemList'>
         {itemNodes}
      </div>
   );
}

const App = () => {
  const [reloadItems, setReloadItems] = useState(false);
  const [positions, setPositions] = useState({}); // store id → {x,y}

  const moveItem = (id, x, y) => {
    setPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <ScreenDropLayer onDrop={moveItem}>
      <ItemForm triggerReload={() => setReloadItems(!reloadItems)} />
      <ItemList items={[]} reloadItems={reloadItems} positions={positions}/>
    </ScreenDropLayer>
  );
};

const init = () => {
   const root = createRoot(document.getElementById('app'));
   root.render(
    <DndProvider backend={HTML5Backend}>
      <App/>
    </DndProvider>
  );
}

window.onload = init;
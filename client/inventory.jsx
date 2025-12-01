const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';

function ItemDragging({item, children}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: "ITE",
    item: {id: item._id, name: item.name, },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab", //cool little styling thing i found
      }}
    >
      {children}
    </div>
  );
}


const ScreenDropLayer = ({ onDrop, children }) => {
  const [, dropRef] = useDrop(() => ({
    accept: "ITE",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      let xNew = offset.x;
      let yNew = offset.y;
      let name = item.name;
      let id = item.id;
      helper.sendPost('/update', {id, name, xNew , yNew});
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

   const merged = data.items.map(i => {
   const pos = props.positions[i._id] || {x: i.xOverall, y: i.yOverall};
   console.log(pos);
   return {
      _id: i._id,
      name: i.name,
      pieces: i.pieces,
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

   const itemNodes = items.map(it => {
      return (
         <ItemDragging key={it._id} item={it}>
            <div className="item">
               {/* NTS reminder to change the artwork */}
               <img src="/assets/img/domoface.jpeg" alt='domo face' className='domoFace'/> 
               <h3 className='itemName'>Name: {it.name}</h3>
               <h3 className='itemPieces'>Pieces: {it.pieces}</h3>
               <h3 className='Pos'>POS: {it.x},{it.y}</h3>
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

const Inv = () => {
  const [reloadItems, setReloadItems] = useState(false);
  const [positions, setPositions] = useState({}); // store id → {x,y}

  const moveItem = (id, x, y) => {
    setPositions(prev => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <ScreenDropLayer onDrop={moveItem}>
      <ItemList items={[]} reloadItems={reloadItems} positions={positions}/>
    </ScreenDropLayer>
  );
};

const init = () => {
   const invDiv = document.getElementById('inv');
   if (!invDiv) return;
   const root = createRoot(invDiv);
   root.render(
    <DndProvider backend={HTML5Backend}>
      <Inv/>
   </DndProvider>
  );
}

window.onload = init;
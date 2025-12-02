const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';

const squareSize = 50;
//NTS Fix the misaligned visual while dragging
function ItemDragging({item, children}) {
  const [{isDragging}, drag] = useDrag(() => ({
    type: "ITE",
    item: {id: item._id, name: item.name, inv: item.inv, x: item.x, y:item.y},
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
      const offset = monitor.getSourceClientOffset();
      if (!offset) return;

      let {name, id} = item;
      let xNew = offset.x;
      let yNew = offset.y - 50; //NTS 50 is here due to Screen Drop Area being down 50
      helper.sendPost('/update', {id, name, xNew , yNew});
      onDrop(item.id, xNew, yNew);
    },
  }));
  return (
    <div
      ref={dropRef}
      style={{
        position: "fixed",
        inset: "0px",
        top: "50px",
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
   return {
      _id: i._id,
      name: i.name,
      pieces: i.pieces,
      x: pos.x,
      y: pos.y,
      inv: i.inv,
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
   let currentChannel = document.getElementById('channelSelect');
   //Parser/visual side to arrange the blocks
   const blockMaker = (it) => {
      const split = it.pieces.match(/\(\s*[-\d.]+\s*,\s*[-\d.]+\s*\)/g); //The regex here is AI generated
      return split.map((coor) => {
         if(it.inv !== currentChannel.value){return;} //NTS Test required, Should skip items when not in current inventory
         let trimmed = coor.replace('(','').replace(')','')
            .trim().split(','); //certainly a line of all time
         let x = trimmed[0] *squareSize;
         // console.log(trimmed[0]);
         let y = -trimmed[1] *squareSize; 
         // console.log(trimmed[1]);
         return (
            <img key={coor} src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"
            style={{position: "absolute", left: x, top: y}}/>
         );
      });
};

   const itemNodes = items.map(it => {
      return (
         <ItemDragging key={it._id} item={it}>
            <div className="item">
            {blockMaker(it)}
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

let root;
const socket = io();
const handleChannelSelect = () => {
   const channelSelect = document.getElementById('channelSelect');
   channelSelect.addEventListener('change', ()=> {
      socket.emit('room change', channelSelect.value);
      initRender();
   })
}

const initRender = () => {
   root.render(
    <DndProvider backend={HTML5Backend}>
      <Inv/>
   </DndProvider>
  );
}

const init = () => {
   const invDiv = document.getElementById('inv');
   if (!invDiv) {return;}
   root = createRoot(invDiv);
   socket.on('newItem');
   handleChannelSelect();
   initRender();
}

window.onload = init;
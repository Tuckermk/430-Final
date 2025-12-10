const helper = require('./helper.jsx');
const React = require('react');
const {useState,useEffect, useRef} = React;
const {createRoot} = require('react-dom/client');

import { DndProvider } from 'react-dnd';
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';

let premium = false;

function ItemDragging({ item, containerRef, children }) {
  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: 'ITE',
    item: { id: item._id, name: item.name, inv: item.inv, x: item.x, y: item.y },
    collect: (monitor) => ({ opacity: monitor.isDragging() ? 0.4 : 1 }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  
const getStyles = (left, top) => {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity,
  }};


  return (
    <div ref={preview} style={{ opacity }}>
      <div ref={drag} style={getStyles(item.x, item.y)}>
        {children}
      </div>
    </div>
  );
}


const ScreenDropLayer = ({ onDrop, children }) => {
  const dropRef = useRef();
  const [, drop] = useDrop(() => ({
    accept: "ITE",
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (!offset || !dropRef.current) return;
      let {name, id} = item;
      const rect = dropRef.current.getBoundingClientRect();
      const xNew = offset.x - rect.left;
      const yNew = offset.y - rect.top;
      
      helper.sendPost('/update', {id, name, xNew , yNew});
      onDrop(item.id, xNew, yNew);
    },
  }));
  drop(dropRef);
  return (
    <div ref={dropRef} id="boardArea">
      {children}
    </div>
  );
};
const ScreenDeleteLayer = ({ onDrop, children }) => { //needs to be found & tested
  const [, dropRef] = useDrop(() => ({
    accept: "ITE",
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (!offset) return;

      let {name, id} = item;
      let xNew = offset.x;
      let yNew = offset.y;
      helper.sendPost('/delete', {id, name, xNew , yNew});
      onDrop(item.id, xNew, yNew);
    },
  }));
  return (
    <div name='deleteArea' id='deleteArea' ref={dropRef}>
      {children}
    </div>
  );
};


//NTS Need to make board
//perhaps go find making a chessboard for example?
let currentInv = 'Inv1';
const ItemList = (props) => {
  const containerRef = useRef();
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

  if (items.length === 0) {
    return (
      <div className="itemList" ref={containerRef}>
        <h3 className="emptyItem">No Items Yet</h3>
      </div>
    );
  }

  const itemNodes = items.map((it) => (
    <ItemDragging key={it._id} item={it} containerRef={containerRef}>
      <div className="item">{helper.blockMaker(it, currentInv)}</div>
    </ItemDragging>
  ));

  return (
    <div className="ItemList" ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {itemNodes}
    </div>
  );
};

const Inv = () => {
  const [reloadItems, setReloadItems] = useState(false);
  const [positions, setPositions] = useState({}); // store id -> {x,y}

  const moveItem = (id, x, y) => {
    setPositions(prev => ({ ...prev, [id]: { x, y } }));
  };
  const deleteItem = (id) => {
    setPositions(prev => {
      const copy = {...prev};
      delete copy[id];
      return copy;
    });
  };

  return (
    <div id='InventoryArea'>
    <ScreenDropLayer onDrop={moveItem}>
      <ItemList items={[]} reloadItems={reloadItems} positions={positions}/>
    </ScreenDropLayer>
    <ScreenDeleteLayer onDrop={deleteItem}>
        <div>
          DROP HERE TO DELETE
        </div>
    </ScreenDeleteLayer>
    </div>
  );
};

let root;
const initRender = () => {
   root.render(
    <DndProvider backend={HTML5Backend}>
      <Inv/>
   </DndProvider>
  );
}

const socket = io();

const returnToLastButton =(checkedButton,attemptedButton) =>{
  checkedButton.checked = true;
  attemptedButton.checked = false;
}

const handleChannelSelect = () => {
  const inv1 = document.getElementById('Inv1');
  let checkedButton = inv1;
  let attemptedButton;
   inv1.addEventListener('change', ()=> {
      if(inv1.checked){
        socket.emit('room change', inv1.value);
        currentInv = 'Inv1';
        initRender();
        checkedButton = inv1;
      }
      
   });
   const inv2 = document.getElementById('Inv2');
   
   inv2.addEventListener('change', ()=> {
    if(inv2.checked){
      socket.emit('room change', inv2.value);
      currentInv = 'Inv2';
      initRender();
      checkedButton = inv2;
    }
   });  

   const inv3 = document.getElementById('Inv3');
   
   inv3.addEventListener('change', ()=> {
    if(inv3.checked){
      socket.emit('room change', inv3.value);
      currentInv = 'Inv3';
      initRender();
      checkedButton = inv3;
    }
   });  
   const inv4 = document.getElementById('Inv4');
   
   inv4.addEventListener('change', ()=> {
    if(!premium){
      attemptedButton = inv4;
      returnToLastButton(checkedButton, attemptedButton);
      return;
    }
      if(inv4.checked){
        socket.emit('room change', inv4.value);
        currentInv = 'Inv4';
        initRender();
        checkedButton = inv4;
      }
      
   });  
   const inv5 = document.getElementById('Inv5');
   
   inv5.addEventListener('change', ()=> {
    if(!premium){
      attemptedButton = inv5;
      returnToLastButton(checkedButton,attemptedButton);
      return;
    }
      if(inv5.checked){
        socket.emit('room change', inv5.value);
        currentInv = 'Inv5';
        initRender();
        checkedButton = inv5;
      }
   });  

   const prem = document.getElementById('prem');
   
   prem.addEventListener('change', ()=> {
    premium = prem.checked;
   });  
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
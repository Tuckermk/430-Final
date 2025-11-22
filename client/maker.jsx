const helper = require('./helper.js');
const React = require('react');
const {useState,useEffect} = React;
const {createRoot} = require('react-dom/client');

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';

const handleItem = (e, onItemAdded) => {
   e.preventDefault();
   helper.hideError();

   const name = e.target.querySelector('#itemName').value;
  //  NTS need to make a pieces parser, go find the one i made for the Unity version perhaps?
   const pieces = e.target.querySelector('#itemPieces').value;
   const xOverall = innerWidth/2;
   const yOverall = innerHeight/2;

   if(!name || !pieces){
      helper.handleError('all fields required');
      return false;
   }
   helper.sendPost(e.target.action, {name, pieces, xOverall , yOverall}, onItemAdded);
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
         <input id='itemPieces' type='array' name='pieces' placeholder='[0,1], [1,1], [2,1]'/>
         <input className='makeItemSubmit' type='submit' value="Make Item" />
      </form>
   )
};
//NTS Follow Domo D maker page setup for this area
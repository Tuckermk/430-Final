const React = require('react');
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('itemMessage').classList.remove('hidden');
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  document.getElementById('itemMessage').classList.add('hidden');

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }
  if(handler){
   handler(result);
  }
};
const hideError = () => {
   document.getElementById('itemMessage').classList.add('hidden');
}


//Why yes I did change help to jsx just to have this here
//Block maker takes in a Item and the in use inventory, 
// then splits its pieces array then spits out the React for a block at each spot
const squareSize = 50;
const blockMaker = (it, currentInv, makerX = 0, makerY = 0) => {
      const split = it.pieces.match(/\(\s*[-\d.]+\s*,\s*[-\d.]+\s*\)/g); // i hate using regex but it is so good
      return split.map((coor) => {
         if(it.inv !== currentInv && currentInv !== 'maker'){return;}
         let trimmed = coor.replace('(','').replace(')','')
            .trim().split(','); //certainly a line of all time
            let x = trimmed[0] *squareSize;
            // console.log(trimmed[0]);
            let y = -trimmed[1] *squareSize; 
            // console.log(trimmed[1]);
        if(currentInv === 'maker'){
          x += makerX;
          y += makerY;
        }
         return (
            <img key={coor} src="/assets/img/block.png" alt="block" className="block"
            style={{position: "absolute", left: x, top: y,}}/>
         );
      });
    }
module.exports = {
  handleError,
  sendPost,
  hideError,
  blockMaker,
}
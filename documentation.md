Purpose:
   The purpose being this application is a easy way to manage a block-based inventory. imagined for use for a DND party that would prefer their character to have a reasonable carrying capacity while not having to do math, instead they get to play Tetris and arrange the block-based representations of their items in their inventory.

React Usage:
   I am using React for basically every part of the project that is not on the nav bar. Starting from the bottom, each individual Block is a component nested in a relevant group into a Item component that defines a which is then intern nested within Inventory which additionally has 2 drop layers which are React components using React-DND to move items around.

MongoDB data: doing this in a name : type | usage | example 
   _id : ObjectID() | unique id for the object | ObjectID('692f4516d8b6263874342d3a')
   name: string | name of item assigned by user | "Test Item"
   pieces : string array of tuples | defines an item saved like | "(0,0) ,(1,0), (0,-1)" 
   inv: string | the inventory the item is in | "Inv1"
   xOverall: number | where the item is on the x axis | 218.5
   yOverall: number | where the item is on the y axis | 179
   owner: ObjectID() | unique id for the account that owns the shape | ObjectID('692f44621acf2b7de1dc21f6')
   createdDate: date | time when the item got made | 2025-12-02T20:15:34.597+00:00

Things that went well: 
   I did get the basic functionality I wanted out of the app. Including item creation, drag and drop, seperate inventories, a way to visualize what you are making while still being based around just simple (x,y) coordinates
Things that did not go well:
   Just a few of the small features that I tried/had to figure out how to get done, such as the preview of where you are dropping an item to go is misaligned. Had to learn how to make use of useRef from react as to both lessen the impact of items being dropped just really far from the cursor then later for also creating the representation of what an item looks like whilst your making it. Then a few other issues such as errors thtat did not actually effect functionality at all not going away which got cleaned up eventually.
Things I learned:
   To at least a beginners tier React-DND as well as the useRef function from React. Also how to make a checkerboard using CSS in a quick way.
If I were to continue:
   Align-to-Grid functionality & a way to restrict the size of the board would be first and second. The checkerboard exists to be aligned to but not right now. Then this was supposed to have a board size that was controllable and so you dont have to mentally keep track of that.
Above and Beyond Work: 
   Not sure if Socket.io counts but I used it for setting up the 5 different inventories
Borrowed Things:
   In the Inventory.jsx file the useEffect and getStyles is ripped straight from the example react DND had in their documentation specifically the draggablebox.js file from https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer. The useEffect is supposed to remove the default visual effect you get from dragging things, however it works once per item then never again, probably my fault. the getStyles is using a Webkit transform and CSS to move items around whilst you are dragging them.
   The Artwork for the favicon and logo I got from itch.io for free its from the following: https://bangbloom.itch.io/pickaxe-shield-chest-hammer-bottle-knife-cartoon


EndPoints:
   URL: /getItems 
      Methods: GET
      Middleware: Requires Login
      Query Params: None
      description: gets all the items of an account
      Return: JSON
   URL: /update 
      Methods: POST
      Middleware: Requires Login
      Query Params: item ID, or name
      Description:updates the queried item
      Return: a success message
   URL: /delete 
      Methods: POST
      Middleware: Requires Login
      Query Params: item ID, or name
      Description: removes the queried item
      Return: a success message 
   URL: /login 
      Methods: GET,POST
      Middleware: Requires Secure, Requires Logout
      Query Params: None
      Description: Gets the login page or sends login info
      Return: Login page
   URL: /signup
      Methods: POST
      Middleware: Requires Secure, Requires Logout
      Query Params: None
      Description: Creates a new account
      Return: a success message
   URL: /logout
      Methods: GET
      Middleware: Requires Login
      Query Params: None
      Description: Logs the user out by destroying the session
      Return: Redirect to login screen
   URL: /maker
      Methods: GET, POST
      Middleware: Requires Login
      Query Params: None
      Description: Gets the maker page or sends a new item to be made
      Return: The maker page or JSON of the new item
    URL: /
      Methods: GET
      Middleware: Requires Secure, Requires Logout
      Query Params: None
      Description: Sends the person to login page or first inventory page if they stayed signed in
      Return: Login or inventory page
   Everything else redirects to /
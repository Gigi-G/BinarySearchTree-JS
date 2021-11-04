/* -------------------------------------------------------------------------------
This code is licensed under MIT License.

Copyright (c) 2019 I Putu Prema Ananda D.N

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
---------------------------------------------------------------------------------- */

/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable brace-style */
/* eslint-disable func-names */

let root = null;
let lastState = null;
let msg = '';
let printOutput = '';
let canvasWidth;
let delay = 1000;

class Node {
  constructor(d, height, y, parent, loc) {
    if (d instanceof Node) { // if parameter passed is a node then use all properties of the node to be cloned for the new node
      this.data = d.data;
      this.left = d.left;
      this.right = d.right;
      this.parent = d.parent;
      this.loc = d.loc;
      this.height = d.height;
      this.x = d.x;
      this.y = d.y;
      this.highlighted = d.highlighted;
    }
    else {
      this.data = d;
      this.left = null;
      this.right = null;
      this.parent = parent;
      this.loc = loc;
      this.height = height;
      this.x = canvasWidth / 2;
      this.y = y;
      this.highlighted = false;
    }
  }
}

// CLONE THE CURRENT TREE INCLUDING ITS CHILD AND THE CHILD OF ITS CHILD AND SO ON..
function treeClone(node) {
  if (node == null) return null;
  const neww = new Node(node);
  neww.left = treeClone(node.left);
  neww.right = treeClone(node.right);
  return neww;
}

// DELAY CODE EXECUTION FOR SPECIFIED MILLISECONDS
function sleep(ms) {
  const start = Date.now();
  while (Date.now() < start + ms);
}

// UNHIGHLIGHT ALL NODES
function unhighlightAll(node) {
  if (node !== null) {
    node.highlighted = false;
    unhighlightAll(node.left);
    unhighlightAll(node.right);
  }
}

// GET CURRENT HEIGHT/LEVEL OF A NODE
function getHeight(node) {
  if (node == null) return 0;
  return node.height;
}

function comparator(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}

function rotate(curr, x) {
  let p = x.parent;
  let b = null;
  if (x === p.left) {
    p.left = b = x.right;
    p.left.loc = b.loc= x.right.loc;
    x.right = p;
    x.right.loc = p.loc;
  } else {
    p.right = b = x.left;
    p.right.loc = b.loc = x.left.loc;
    x.left = p;
    x.left.loc = p.loc;
  }
  x.parent = p.parent;
  x.parent.loc = p.parent.loc;
  p.parent = x;
  p.parent.loc = x.loc;
  if (b) {
    b.parent = p;
  }
  if (x.parent) {
    if (p === x.parent.left) {
      x.parent.left = x;
      x.parent.left.loc = x.loc;
    } else {
      x.parent.right = x;
      x.parent.right.loc = x.loc;
    }
  } else {
    curr = x;
    curr.loc = x.loc;
  }
  return curr;
}

function splay(curr, x) {
  while (x.parent) {
    let p = x.parent;
    let g = p.parent;
    if (g) this.rotate(curr, (x === p.left) === (p === g.left) ? p : x);
    curr = this.rotate(curr, x);
  }
  return curr;
}

// SEARCH AN ELEMENT IN THE TREE
function search(curr, key) {
  if (!curr) { // if current node is null then element does not exist in the tree
    msg = 'Searching for ' + key + ' : (Element not found)';
    self.postMessage([root, msg, '']);
    return 0;
  }
  unhighlightAll(root);
  curr.highlighted = true;
  self.postMessage([root, msg, '']);
  if (key < curr.data) { // if key < current node's data then look at the left subtree
    msg = 'Searching for ' + key + ' : ' + key + ' < ' + curr.data + '. Looking at left subtree.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.left, key);
  }
  else if (key > curr.data) { // if key > current node's data then look at the right subtree
    msg = 'Searching for ' + key + ' : ' + key + ' > ' + curr.data + '. Looking at right subtree.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    search(curr.right, key);
  }
  else { // notify the main thread that an element is found and highlight that element
    msg = 'Searching for ' + key + ' : ' + key + ' == ' + curr.data + '. Element found!';
    self.postMessage([root, msg, '']);
    sleep(delay);
  }
  return curr;
}

function findSplay(curr, key) {
  let p = search(curr, key);
  this.splay(curr, p);
  return p;
}

// DELETE AN ELEMENT FROM THE TREE
function pop(startingNode, key) {
  let node = startingNode;
  if (!node) { // if current node is null then element to delete does not exist in the tree
    msg = 'Searching for ' + key + ' : (Element not found)';
    self.postMessage([root, msg, '']);
    return null;
  }
  else {
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, '']);
    if (key < node.data) { // if key < current node's data then look at the left subtree
      msg = 'Searching for ' + key + ' : ' + key + ' < ' + node.data + '. Looking at left subtree.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.left = pop(node.left, key);
    }
    else if (key > node.data) { // if key > current node's data then look at the right subtree
      msg = 'Searching for ' + key + ' : ' + key + ' > ' + node.data + '. Looking at right subtree.';
      self.postMessage([root, msg, '']);
      sleep(delay);
      node.right = pop(node.right, key);
    }
    else {
      msg = key + ' == ' + node.data + '. Found node to delete.'; // notify the main thread that node to delete is found.
      self.postMessage([root, msg, '']);
      sleep(delay);
      if (!node.left && !node.right) { // if node has no child (is a leaf) then just delete it.
        msg = 'Node to delete is a leaf. Delete it.';
        node = null;
        self.postMessage([root, msg, '']);
      }
      else if (!node.left) { // if node has RIGHT child then set parent of deleted node to right child of deleted node
        msg = 'Node to delete has no left child.\nSet parent of deleted node to right child of deleted node';
        self.postMessage([root, msg, '']);
        sleep(delay);
        // CODE FOR BLINKING ANIMATION AND BLA BLA BLA..
        for (let i = 0; i < 2; i += 1) {
          node.right.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.right.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        // END CODE FOR BLINKING ANIMATION AND BLA BLA BLA..
        let del = node;
        node.right.parent = node.parent;
        node.right.loc = node.loc;
        node = node.right;
        del = null;
        node.y -= 40;
      }
      else if (!node.right) { // if node has LEFT child then set parent of deleted node to left child of deleted node
        msg = 'Node to delete has no right child.\nSet parent of deleted node to left child of deleted node';
        self.postMessage([root, msg, '']);
        sleep(delay);
        for (let i = 0; i < 2; i += 1) {
          node.left.highlighted = true;
          if (node === root) node.highlighted = true;
          else node.parent.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          node.left.highlighted = false;
          if (node === root) node.highlighted = false;
          else node.parent.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        let del = node;
        node.left.parent = node.parent;
        node.left.loc = node.loc;
        node = node.left;
        del = null;
        node.y -= 40;
      }
      else { // if node has TWO children then find largest node in the left subtree. Copy the value of it into node to delete. After that, recursively delete the largest node in the left subtree
        msg = 'Node to delete has two children.\nFind largest node in left subtree.';
        self.postMessage([root, msg, '']);
        sleep(delay);
        let largestLeft = node.left;
        while (largestLeft.right) {
          unhighlightAll(root);
          largestLeft.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft = largestLeft.right;
        }
        unhighlightAll(root);
        largestLeft.highlighted = true;
        msg = 'Largest node in left subtree is ' + largestLeft.data + '.\nCopy largest value of left subtree into node to delete.';
        self.postMessage([root, msg, '']);
        sleep(delay);
        // CODE FOR BLINKING ANIMATION AND BLA BLA BLA...
        for (let i = 0; i < 2; i += 1) {
          largestLeft.highlighted = true;
          node.highlighted = true;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
          largestLeft.highlighted = false;
          node.highlighted = false;
          self.postMessage([root, msg, '']);
          sleep(delay / 2);
        }
        // END CODE FOR BLINKING ANIMATION AND BLA BLA BLA...
        node.data = largestLeft.data;
        unhighlightAll(root);
        self.postMessage([root, msg, '']);
        sleep(delay);
        msg = 'Recursively delete largest node in left subtree';
        self.postMessage([root, msg, '']);
        sleep(delay);
        node.left = pop(node.left, largestLeft.data);
      }
    }
  }
  if (node == null) return node;

  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1; // update the heights of all nodes traversed by the pop() function

  return node; // return the modifications back to the caller
}

// INSERT AN ELEMENT TO THE TREE
function push(node, data, posY, parent, loc) {
  let curr = node;

  if (curr != null) { // highlight current node in each recursion step
    curr.highlighted = true;
    self.postMessage([root, msg, '']);
  }

  if (curr == null) { // if current node is null then place the new node there
    msg = 'Found a null node. Inserted ' + data + '.';
    curr = new Node(data, 1, posY, parent, loc);
  }
  else if (data < curr.data) { // if new data < current node's data, then go to left subtree
    msg = data + ' < ' + curr.data + '. Looking at left subtree.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.left = push(curr.left, data, posY + 40, curr, 'left');
  }
  else if (data >= curr.data) { // if new data >= current node's data, then go to right subtree
    msg = data + ' >= ' + curr.data + '. Looking at right subtree.';
    self.postMessage([root, msg, '']);
    sleep(delay);
    curr.highlighted = false;
    curr.right = push(curr.right, data, posY + 40, curr, 'right');
  }

  curr.height = Math.max(getHeight(curr.left), getHeight(curr.right)) + 1; // update the heights of all nodes traversed by the push() function

  return curr; // return the modifications back to the caller
}

// AFTER INSERT OR DELETE, ALWAYS UPDATE ALL NODES POSITION IN THE CANVAS
// FORMULA FOR DETERMINING NODE POSITION IS: (NODE'S PARENT POSITION - ((2 ^ (NODE'S CURRENT HEIGHT + 1)) * 10)))
function updatePosition(node) {
  if (node != null) {
    if (node.loc === 'left') node.x = node.parent.x - ((2 ** (getHeight(node.right) + 1)) * 10);
    else if (node.loc === 'right') node.x = node.parent.x + ((2 ** (getHeight(node.left) + 1)) * 10);
    else if (node.loc === 'root') {
      node.x = canvasWidth / 2;
      node.y = 50;
    }
    if (node.parent != null) node.y = node.parent.y + 40;
    if (node.left != null) node.left.parent = node; // update parent information of current node
    if (node.right != null) node.right.parent = node; // update parent information of current node
    updatePosition(node.left);
    updatePosition(node.right);
  }
}

// PRINT ALL NODES PRE-ORDERLY. THE ROUTE IS C - L - R
function printPreOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Printing the value';
    printOutput = node.data;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Going to left subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPreOrder(node.left);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going to right subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPreOrder(node.right);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going back up';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULL';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// PRINT ALL NODES IN-ORDERLY. THE ROUTE IS L - C - R
function printInOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going to left subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printInOrder(node.left);

    msg = 'Printing the value';
    printOutput = node.data;
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Going to right subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printInOrder(node.right);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going back up';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULL';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// PRINT ALL NODES POST-ORDERLY. THE ROUTE IS L - R - C
function printPostOrder(node) {
  if (node !== null) {
    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going to left subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPostOrder(node.left);

    unhighlightAll(root);
    node.highlighted = true;
    msg = 'Going to right subtree';
    self.postMessage([root, msg, '', '']);
    sleep(delay);

    printPostOrder(node.right);

    msg = 'Printing the value';
    printOutput = node.data;
    unhighlightAll(root);
    node.highlighted = true;
    self.postMessage([root, msg, printOutput + ' ', '']);
    sleep(delay);
    msg = 'Going back up';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
  else {
    msg += '... NULL';
    self.postMessage([root, msg, '', '']);
    sleep(delay);
  }
}

// EVENT LISTENER TO LISTEN COMMANDS FROM THE MAIN THREAD. THE TREE WILL EXECUTE EVERYTHING THE MAIN THREAD WANTS.
// AT EACH STEP IN THE ALGORITHM, THE TREE WILL NOTIFY THE MAIN THREAD ABOUT CHANGES IN THE TREE SO THE MAIN THREAD CAN DISPLAY THE CHANGES STEP-BY-STEP TO USERS FOR EASIER UNDERSTANDING
self.addEventListener('message', (event) => {
  switch (event.data[0]) {
    case 'Insert': {
      lastState = treeClone(root); // save last state of the tree before inserting
      const value = event.data[1]; // get value from user input
      canvasWidth = event.data[2]; // get canvasWidth from main thread. Important for node positioning
      root = push(root, value, 50, null, 'root'); // push it
      updatePosition(root); // update all node position
      self.postMessage([root, msg, 'Finished']); // let main thread know that operation has finished
      break;
    }
    case 'Delete': {
      lastState = treeClone(root); // save last state of the tree before deleting
      const key = event.data[1]; // get value from user input
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']); // send message to main thread that the tree is empty
      }
      else {
        root = pop(root, key); // delete it
        updatePosition(root); // update the node position
        unhighlightAll(root); // unhighlight all nodes
        self.postMessage([root, msg, 'Finished']); // let main thread know that operation has finished
      }
      break;
    }
    case 'Find': {
      const key = event.data[1]; // get value from user input
      if (root == null) {
        self.postMessage([root, 'Tree is empty', 'Finished']); // send message to main thread that the tree is empty
      }
      else {
        //search(root, key);
        root = findSplay(root, key);
        updatePosition(root);
        unhighlightAll(root); // unhighlight all nodes
        self.postMessage([root, msg, 'Finished']); // let main thread know that operation has finished
      }
      break;
    }
    case 'Print Pre Order': {
      if (root == null) {
        self.postMessage([root, 'Tree is empty', '', 'Finished']); // send message to main thread that the tree is empty
      }
      else {
        printPreOrder(root);
        unhighlightAll(root); // unhighlight all nodes after operation
        self.postMessage([root, 'Print Finished', '', 'Finished']); // let main thread know that operation has finished
      }
      break;
    }
    case 'Print In Order': {
      if (root == null) {
        self.postMessage([root, 'Tree is empty', '', 'Finished']); // send message to main thread that the tree is empty
      }
      else {
        printInOrder(root);
        unhighlightAll(root); // unhighlight all nodes after operation
        self.postMessage([root, 'Print Finished', '', 'Finished']); // let main thread know that operation has finished
      }
      break;
    }
    case 'Print Post Order': {
      if (root == null) {
        self.postMessage([root, 'Tree is empty', '', 'Finished']); // send message to main thread that the tree is empty
      }
      else {
        printPostOrder(root);
        unhighlightAll(root); // unhighlight all nodes after operation
        self.postMessage([root, 'Print Finished', '', 'Finished']); // let main thread know that operation has finished
      }
      break;
    }
    case 'Undo': {
      root = treeClone(lastState); // replace contents of current tree with the last tree state before deletion/insertion happened
      updatePosition(root); // update node position
      self.postMessage([root, '', 'Finished']); // let main thread know that operation has finished
      break;
    }
    case 'Set Animation Speed': {
      delay = event.data[1]; // get delay value from user input (slider)
      break;
    }
    default: break;
  }
});

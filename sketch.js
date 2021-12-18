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

// BEGIN PREDEFINED DATASETS
/* TODO: enable users to autofill tree with one of these datasets */
// let num = [30, 15, 37, 7, 26, 19, 28, 32, 45, 34, 42, 36, 35, 31, 33, 6, 5, 4, 3, 29];
// let num = [1000, 500, 2000, 505, 506, 1999, 1998, 504, 499, 498, 497, 496];
// let num = [1000, 500, 2000, 505, 506, 1999, 504, 499, 1996, 2001];
// let num = [1000, 500, 2000, 499];
// END PREDEFINED DATASETS

let tree = null;
let controlDiv;
let controlBar;
let insertForm;
let insertButton;
let deleteForm;
let deleteButton;
let insertSForm;
let insertSButton;
let deleteSForm;
let deleteSButton;
let searchForm;
let searchButton;
let printInOrderButton;
let printPreOrderButton;
let printPostOrderButton;
let undoButton;
let animationSpeedSliderLabel;
let animationSpeedSlider;
let lastMsg = '';
let printOutput = '';
let value;
let BST;
let payload;

function enableUI() {
  insertForm.removeAttribute('disabled');
  insertButton.removeAttribute('disabled');
  deleteForm.removeAttribute('disabled');
  deleteButton.removeAttribute('disabled');
  insertSForm.removeAttribute('disabled');
  insertSButton.removeAttribute('disabled');
  deleteSForm.removeAttribute('disabled');
  deleteSButton.removeAttribute('disabled');
  searchForm.removeAttribute('disabled');
  searchButton.removeAttribute('disabled');
  printPreOrderButton.removeAttribute('disabled');
  printInOrderButton.removeAttribute('disabled');
  printPostOrderButton.removeAttribute('disabled');
  undoButton.removeAttribute('disabled');
  animationSpeedSlider.removeAttribute('disabled');
}

function disableUI() {
  insertForm.attribute('disabled', '');
  insertButton.attribute('disabled', '');
  deleteForm.attribute('disabled', '');
  deleteButton.attribute('disabled', '');
  insertSForm.attribute('disabled', '');
  insertSButton.attribute('disabled', '');
  deleteSForm.attribute('disabled', '');
  deleteSButton.attribute('disabled', '');
  searchForm.attribute('disabled', '');
  searchButton.attribute('disabled', '');
  printPreOrderButton.attribute('disabled', '');
  printInOrderButton.attribute('disabled', '');
  printPostOrderButton.attribute('disabled', '');
  undoButton.attribute('disabled', '');
  animationSpeedSlider.attribute('disabled', '');
}

function setAnimSpeed() {
  const animDelay = Math.abs(animationSpeedSlider.value());
  payload = ['Set Animation Speed', animDelay];
  BST.postMessage(payload);
}

function undo() {
  payload = ['Undo'];
  BST.postMessage(payload);
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
  };
  undoButton.attribute('disabled', ''); // disable undo button after use.
}

function displayNode(curr) {
  if (curr != null) {
    ellipseMode(CENTER);
    textAlign(CENTER);
    stroke('black');
    strokeWeight(3);
    if (curr.left != null) line(curr.x, curr.y, curr.left.x, curr.left.y);
    if (curr.right != null) line(curr.x, curr.y, curr.right.x, curr.right.y);
    noStroke();
    fill('red');
    if (curr.highlighted) ellipse(curr.x, curr.y, 40, 40);
    fill(231, 173, 173);
    ellipse(curr.x, curr.y, 30, 30);
    fill('black');
    text(curr.data, curr.x, curr.y + 5);
    displayNode(curr.left);
    displayNode(curr.right);
  }
}

function printPreOrder() {
  disableUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Print Pre Order'];
  BST.postMessage(payload); // send message 'Print Pre Order' to the BST to print all elements pre-orderly
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Finished') enableUI();
  };
  return 0;
}

function printInOrder() {
  disableUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Print In Order'];
  BST.postMessage(payload); // send message 'Print In Order' to the BST to print all elements in-orderly
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Finished') enableUI();
  };
  return 0;
}

function printPostOrder() {
  disableUI();
  lastMsg = '';
  printOutput = '';
  payload = ['Print Post Order'];
  BST.postMessage(payload); // send message 'Print Post Order' to the BST to print all elements post-orderly
  BST.onmessage = function (event) {
    tree = event.data[0];
    lastMsg = event.data[1];
    printOutput += event.data[2];
    if (event.data[3] === 'Finished') enableUI();
  };
  return 0;
}

function insert() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(insertForm.value(), 10);
  insertForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Insert', value, width];
  BST.postMessage(payload); // send message 'Insert', inputted value and canvas width to ask the Tree to insert new element
  BST.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the BST after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function insertSplay() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(insertSForm.value(), 10);
  insertSForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['InsertSplay', value, width];
  BST.postMessage(payload); // send message 'InsertSplay', inputted value and canvas width to ask the Tree to insert new element
  BST.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the BST after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function del() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(deleteForm.value(), 10);
  deleteForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Delete', value];
  BST.postMessage(payload); // send message 'Delete' and inputted value to ask the Tree to delete an element
  BST.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the BST after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function delSplay() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(deleteSForm.value(), 10);
  deleteSForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['DeleteSplay', value];
  BST.postMessage(payload); // send message 'DeleteSplay' and inputted value to ask the Tree to delete an element
  BST.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the BST after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function find() {
  lastMsg = '';
  printOutput = '';
  value = parseInt(searchForm.value(), 10);
  searchForm.value('');
  if (isNaN(value) === true) return undefined;
  disableUI();
  payload = ['Find', value];
  BST.postMessage(payload); // send message 'Find' and inputted value to ask the Tree to find an element
  BST.onmessage = function (event) {
    tree = event.data[0]; // receive our tree modifications from the BST so the browser's main thread can display changes at each step in the algo instead of the final change
    lastMsg = event.data[1]; // also receive message from the BST after each step in the algorithm is done
    if (event.data[2] === 'Finished') enableUI();
  };
  return 0;
}

function addControls(type, name, onClick) {
  let element;
  switch (type) {
    case 'Input':
      element = createInput();
      element.size(60);
      break;
    case 'Button':
      element = createButton(name);
      element.mousePressed(onClick);
      break;
    case 'Slider':
      element = createSlider(-2000, -500, -1000, 20);
      element.mouseReleased(onClick);
      element.touchEnded(onClick);
      break;
    case 'Label':
      element = createP(name);
      element.class('control-label');
      break;
    default: break;
  }
  const tableEntry = createElement('td');
  tableEntry.child(element);
  controlBar.child(tableEntry);
  return element;
}

function setup() {
  // INITIALIZE WEB WORKER THREAD FOR THE TREE ALGORITHM AND VISUALIZATION
  BST = new Worker('BST.js');

  // BEGIN VISUALIZATION CONTROLS STUFF
  controlDiv = createDiv();
  controlDiv.parent('mainContent');
  controlDiv.id('controlSection');
  controlBar = createElement('table');
  controlDiv.child(controlBar);
  insertForm = addControls('Input', '', '');
  insertButton = addControls('Button', 'Insert Natural', insert);
  insertSForm = addControls('Input', '', '');
  insertSButton = addControls('Button', 'Insert Splay', insertSplay);
  deleteForm = addControls('Input', '', '');
  deleteButton = addControls('Button', 'Delete Natural', del);
  deleteSForm = addControls('Input', '', '');
  deleteSButton = addControls('Button', 'Delete Splay', delSplay);
  searchForm = addControls('Input', '', '');
  searchButton = addControls('Button', 'Find', find);
  printPreOrderButton = addControls('Button', 'Pre Order', printPreOrder);
  printInOrderButton = addControls('Button', 'In Order', printInOrder);
  printPostOrderButton = addControls('Button', 'Post Order', printPostOrder);
  undoButton = addControls('Button', 'Undo', undo);
  animationSpeedSliderLabel = addControls('Label', 'Animation Speed:', '');
  animationSpeedSlider = addControls('Slider', '', setAnimSpeed);
  // END VISUALIZATION CONTROLS STUFF

  // SET CANVAS AND TEXT SIZE
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight / 1.3;
  const canvas = createCanvas(w, h);
  canvas.parent('mainContent');
  textSize(11);
}

function draw() {
  background('white');
  displayNode(tree);
  fill('black');
  textAlign(LEFT);
  text(lastMsg, 30, 50);
  text(printOutput, 30, 70);
}

window.onresize = function() {
  // assigns new values for width and height variables
  w = document.documentElement.clientWidth;
  h = document.documentElement.clientHeight / 1.3;
  resizeCanvas(w, h);
}

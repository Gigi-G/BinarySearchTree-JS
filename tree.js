/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable brace-style */
class Node {
  constructor(data, height, x, y, parent, loc) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.parent = parent;
    this.loc = loc;
    this.height = height;
    this.balanceFactor = 0;
    this.x = width / 2;
    this.y = y;
  }

  display() {
    stroke('white');
    strokeWeight(3);
    ellipseMode(CENTER);
    textAlign(CENTER);
    textSize(15);
    if (this.left != null) line(this.x, this.y, this.left.x, this.left.y);
    if (this.right != null) line(this.x, this.y, this.right.x, this.right.y);
    ellipse(this.x, this.y, 30, 30);
    text(this.data, this.x, this.y + 5);
  }

  static display(curr) {
    if (curr != null) {
      curr.display();
      Node.display(curr.left);
      Node.display(curr.right);
    }
  }

  static pop(startingNode, key) {
    let node = startingNode;
    if (!node) return null;
    else {
      if (key < node.data) node.left = Node.pop(node.left, key);
      else if (key > node.data) node.right = Node.pop(node.right, key);
      else {
        if (!node.left && !node.right) {
          node = null;
        }
        else if (!node.left) { // if node has RIGHT child
          let del = node;
          node = node.right;
          del = null;
        }
        else if (!node.right) { // if node has LEFT child
          let del = node;
          node = node.left;
          del = null;
        }
        else { // if node has TWO children
          let largestLeft = node.left;
          while (largestLeft.right) largestLeft = largestLeft.right;
          node.data = largestLeft.data;
          node.left = Node.pop(node.left, largestLeft.data);
        }
      }
    }
    if (node == null) return node;

    node.height = Math.max(Node.getHeight(node.left), Node.getHeight(node.right)) + 1;

    return node;
  }

  static getHeight(node) {
    if (node == null) return 0;
    return node.height;
  }

  static push(node, data, posX, posY, parent, loc) {
    let curr = node;

    if (curr == null) {
      curr = new Node(data, 1, posX, posY, parent, loc);
    }
    else if (data < curr.data) {
      curr.left = Node.push(curr.left, data, posX, posY + 40, curr, 'left');
    }
    else if (data > curr.data) {
      curr.right = Node.push(curr.right, data, posX, posY + 40, curr, 'right');
    }

    curr.height = Math.max(Node.getHeight(curr.left), Node.getHeight(curr.right)) + 1;

    return curr;

  }

  static updatePosition(node) {
    if (node != null) {
      if (node.loc == 'left') {
        console.log('updating node ' + node.data + ' position');
        console.log(node.data + '.x = ' + node.parent.data + '.x ' + ' - (2 ^ '  + (Node.getHeight(node.right) + 1) + ' * 10)');
        node.x = node.parent.x - (pow(2, Node.getHeight(node.right) + 1) * 10);
      }
      else if (node.loc == 'right') {
        console.log('updating node ' + node.data + ' position');
        console.log(node.data + '.x = ' + node.parent.data + '.x ' + ' + (2 ^ '  + (Node.getHeight(node.left) + 1) + ' * 10)');
        node.x = node.parent.x + (pow(2, Node.getHeight(node.left) + 1) * 10);
      }
      Node.updatePosition(node.left);
      Node.updatePosition(node.right);
    }
  }

  static printPreOrder(node) {
    if (node !== null) {
      console.log(node);
      this.printPreOrder(node.left);
      this.printPreOrder(node.right);
    }
  }

  static printInOrder(node) {
    if (node !== null) {
      this.printInOrder(node.left);
      console.log(node);
      this.printInOrder(node.right);
    }
  }

  static printPostOrder(node) {
    if (node !== null) {
      this.printPostOrder(node.left);
      this.printPostOrder(node.right);
      console.log(node);
    }
  }
}

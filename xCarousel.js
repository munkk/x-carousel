class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  connectTailWithHead() {
    this.tail.next = this.head;
    this.head.prev = this.tail;
  }

  pop() {
    //in case of empty list
    if (this.length === 0) {
      return false;
    }
    //get popped node
    const popped = this.tail;
    //save newTail to a variable (could be null)
    const newTail = this.tail.prev;
    //if newTail is not null
    if (newTail) {
      //sever connection to popped node
      newTail.next = null;
      //sever connection from popped node
      this.tail.prev = null;
      //in case of 1 length list
    } else {
      //make sure to edit head in case newTail is null
      this.head = null;
    }
    //assign new tail (could be null)
    this.tail = newTail;
    // subtract length
    this.length--;

    return popped;
  }

  shift() {
    //in case list is empty
    if (!this.head) {
      return false;
    }
    //save shifted node to variable
    const shiftedNode = this.head;
    //make the new head the next (might be null)
    const newHead = this.head.next; //might be null
    //if list is more than 1
    if (this.head !== this.tail) {
      newHead.prev = null;
      shiftedNode.next = null;
    } else {
      this.tail = null;
    }
    this.head = newHead;
    this.length--;
    return shiftedNode;
  }

  unshift(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
    return this;
  }

  insertAtIndex(index, val) {
    //if index doesn't exist
    if (index > this.length) {
      return false;
    }
    if (index === 0) {
      this.unshift(val);
    } else if (index === this.length) {
      this.push(val);
    } else {
      const newNode = new Node(val);
      const after = this.accessAtIndex(index);
      const before = after.prev;
      after.prev = newNode;
      before.next = newNode;
      newNode.next = after;
      newNode.prev = before;
      this.length++;
    }
    return this;
  }

  removeAtIndex(index) {
    let removedNode;
    if (index >= this.length) {
      return false;
    }
    if (index == 0) {
      removedNode = this.shift();
    } else if (index == this.length - 1) {
      removedNode = this.pop();
    } else {
      removedNode = this.getNodeAtIndex(index);
      const after = removedNode.next;
      const before = removedNode.prev;
      removedNode.next = null;
      removedNode.prev = null;
      before.next = after;
      after.prev = before;
      this.length--;
    }
    return removedNode;
  }

  getNodeAtIndex(index) {
    if (index >= this.length || index < 0) {
      return false;
    }
    let currentIndex = 0;
    let currentNode = this.head;
    while (currentIndex !== index) {
      currentNode = currentNode.next;
      currentIndex++;
    }
    return currentNode;
  }

  setNodeAtIndex(index, val) {
    const foundNode = this.getNodeAtIndex(index);
    if (foundNode) {
      foundNode.value = val;
      return foundNode;
    }
    return null;
  }

  printList() {
    console.log(list);
    if (this.head) {
      let current = this.head;
      while (current.next) {
        console.log(current);
        current = current.next;
      }
      console.log(current);
    } else {
      console.log("empty list");
    }
  }
}

const classes = {
  itemCurrent: "x-current",
  itemPast: "x-prev",
  itemFuture: "x-next",
};

const classRemover = new RegExp(
  "\\b(" +
    classes.itemCurrent +
    "|" +
    classes.itemPast +
    "|" +
    classes.itemFuture +
    ")(.*?)(\\s|$)",
  "g"
);
const whiteSpaceRemover = new RegExp("\\s\\s+", "g");

const noop = () => null;

class xSlide {
  id = null;
  item = null;
  element = null;

  constructor(id, item, element) {
    this.id = id;
    this.item = item;
    this.element = element;
  }
}

class xCarousel {
  elementToMount = null;
  items = null;
  list = null;
  carousel = null;
  cells = null;
  cellSize = null;
  theta = null;
  radius = null;
  currentIndex = 0;

  onMoveRight = null; //cb
  onMoveLeft = null; //cb

  constructor(options) {
    this.elementToMount = options.elementToMount;
    this.items = options.items;
    this.cellSize = options.cellSize || 400;
    this.list = new DoublyLinkedList();

    this.onInit = options.onInit || noop;
    this.onMoveRight = options.onMoveRight || noop;
    this.onMoveLeft = options.onMoveLeft || noop;

    this.init();
  }

  init() {
    if (!this.elementToMount) return;

    const scene = document.createElement("div");
    scene.classList.add("scene");
    scene.style.width = this.cellSize + 'px';
    scene.style.height = this.cellSize + 'px';

    this.carousel = document.createElement("div");
    this.carousel.classList.add("carousel");

    this.cells = this.items;

    this.items.forEach((item, idx) => {
      const element = document.createElement("div");
      element.classList.add("carousel__cell");
      element.style.width = this.cellSize + 'px';
      element.style.height = this.cellSize + 'px';;

      if (item.slot) {
        element.appendChild(item.slot);
      }

      const slide = new xSlide(idx, item, element);
      this.carousel.appendChild(element);
      this.list.push(slide);
    });
    this.list.connectTailWithHead();

    scene.appendChild(this.carousel);

    const leftHandler = document.createElement("div");
    leftHandler.classList.add("xLeftHandler");
    leftHandler.addEventListener("click", this.moveLeft.bind(this));
    scene.appendChild(leftHandler);

    const rightHandler = document.createElement("div");
    rightHandler.classList.add("xRightHandler");

    rightHandler.addEventListener("click", this.moveRight.bind(this));

    scene.appendChild(rightHandler);

    this.elementToMount.appendChild(scene);

    this.changeCarousel();

    this.onInit(this);
  }

  changeCarousel() {
    const cellCount = this.list.length;
    this.theta = 360 / cellCount;
    this.radius = Math.round(this.cellSize / 2 / Math.tan(Math.PI / cellCount));

    let currentNode = this.list.getNodeAtIndex(0);
    while (true) {
      const cellAngle = this.theta * currentNode.value.id;
      currentNode.value.element.style.transform =
        "rotateY" + "(" + cellAngle + "deg) translateZ(" + this.radius + "px)";

      if (currentNode.value.id === this.list.length - 1) break;

      currentNode = currentNode.next;
    }

    this.update();
    this.rotateCarousel();
  }

  rotateCarousel() {
    const angle = this.theta * this.currentIndex * -1;
    this.carousel.style.transform =
      "translateZ(" + -this.radius + "px) " + "rotateY" + "(" + angle + "deg)";
  }

  moveRight() {
    this.currentIndex++;
    this.update();
    this.rotateCarousel();

    this.onMoveRight(this.currentNode);
  }

  moveLeft() {
    this.currentIndex--;
    this.update();
    this.rotateCarousel();

    this.onMoveRight(this.currentNode);
  }

  get actualIndex() {
    return Math.sign(this.currentIndex) < 0
      ? this.cells.length - Math.abs(this.currentIndex)
      : this.currentIndex % this.cells.length;
  }

  get currentNode() {
    return this.list.getNodeAtIndex(this.actualIndex);
  }

  removeExtraClasses(element) {
    return (element.className = element.className
      .replace(classRemover, "")
      .replace(whiteSpaceRemover, " "));
  }

  update() {
    const centerNode = this.currentNode;
    const centerElement = centerNode.value.element;

    this.removeExtraClasses(centerElement);
    centerElement.classList.add("x-current");

    let counter = 0;
    const max = Math.floor(this.list.length / 2);
    let currentNode = centerNode;
    while (counter < max) {
      const element = currentNode.next.value.element;
      this.removeExtraClasses(element);
      element.classList.add("x-next-" + counter);
      currentNode = currentNode.next;
      counter++;
    }

    counter = 0;
    currentNode = centerNode;
    while (counter < max) {
      const element = currentNode.prev.value.element;
      this.removeExtraClasses(element);
      element.classList.add("x-prev-" + counter);
      currentNode = currentNode.prev;
      counter++;
    }
  }
}

(function (window) {
  return;

  var linkedList = new DoublyLinkedList();

  var carousel = null;
  var cells = null;
  var originClassList = null;
  var currentIndex = 0;
  var theta = null;
  var radius = null;
  var rotateFn = "rotateY";

  var cellSize = 400;

  classes = {
    itemCurrent: "x-current",
    itemPast: "x-prev",
    itemFuture: "x-next",
  };

  var classRemover = new RegExp(
    "\\b(" +
      classes.itemCurrent +
      "|" +
      classes.itemPast +
      "|" +
      classes.itemFuture +
      ")(.*?)(\\s|$)",
    "g"
  );
  var whiteSpaceRemover = new RegExp("\\s\\s+", "g");

  defaults = {};

  window.xCarousel = function (element) {
    // var settings = { ...defaults, ...options };

    if (!element || !element.children.length) return;

    init(element);
  };

  function init(element) {
    var scene = document.createElement("div");
    scene.classList.add("scene");

    carousel = document.createElement("div");
    carousel.classList.add("carousel");

    cells = Array.from(element.children);
    cells.forEach(function (child) {
      child.classList.add("carousel__cell");
      carousel.appendChild(child);
      linkedList.push(child);
    });
    linkedList.connectTailWithHead();

    originClassList = [...cells[currentIndex].classList];

    scene.appendChild(carousel);

    leftHandler = document.createElement("div");
    leftHandler.classList.add("xLeftHandler");
    leftHandler.addEventListener("click", moveLeft);
    scene.appendChild(leftHandler);

    rightHandler = document.createElement("div");
    rightHandler.classList.add("xRightHandler");

    rightHandler.addEventListener("click", moveRight);

    scene.appendChild(rightHandler);

    element.appendChild(scene);

    onOrientationChange();
  }

  function moveRight() {
    currentIndex++;

    update();

    rotateCarousel();
  }

  function moveLeft() {
    currentIndex--;

    update();

    rotateCarousel();
  }

  function rotateCarousel() {
    var angle = theta * currentIndex * -1;
    carousel.style.transform =
      "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
  }

  function onOrientationChange() {
    originClassList = [...cells[currentIndex].classList];

    // var checkedRadio = document.querySelector(
    //   'input[name="orientation"]:checked'
    // );
    // isHorizontal = checkedRadio.value == "horizontal";
    // rotateFn = isHorizontal ? "rotateY" : "rotateX";
    changeCarousel();
    //applyPastFutureClasses();
  }

  function getActualIndex() {
    return Math.sign(currentIndex) < 0
      ? cells.length - Math.abs(currentIndex)
      : currentIndex % cells.length;
  }

  function removeExtraClasses(element) {
    return (element.className = element.className
      .replace(classRemover, "")
      .replace(whiteSpaceRemover, " "));
  }

  function update() {
    const centerNode = linkedList.getNodeAtIndex(getActualIndex());
    const centerElement = centerNode.value;

    removeExtraClasses(centerElement);
    centerElement.classList.add("x-current");

    let counter = 0;
    const max = Math.floor(cells.length / 2);
    let currentNode = centerNode;
    while (counter < max) {
      const element = currentNode.next.value;
      removeExtraClasses(element);
      element.classList.add("x-next-" + counter);
      currentNode = currentNode.next;
      counter++;
    }

    counter = 0;
    currentNode = centerNode;
    while (counter < max) {
      const element = currentNode.prev.value;
      removeExtraClasses(element);
      element.classList.add("x-prev-" + counter);
      currentNode = currentNode.prev;
      counter++;
    }

    console.log("done");

    const prevElement = centerNode.prev.value;
    prevElement.style.transform = `rotateY( ${
      theta * getActualIndex()
    }deg) translate3d(-200px, 50px, ${radius + 10}px)  scale(0.5)`;

    // var arr = Array.from(cells);

    // var currentCell = cells[index];

    // var rightEndItems = arr.slice(index + 1, index + Math.ceil(arr.length / 2));
    // var rightStartItems = arr.slice(
    //   0,
    //   Math.floor(arr.length / 2) - rightEndItems.length
    // );

    // var futureItems = [...rightEndItems, ...rightStartItems];

    // //----------
    // arr.forEach((item) => linkedList.push(item));

    // -------------

    //   var past1 = selectedIndex - 2 >= 0 ? cells[selectedIndex - 2] : cells[cells.length - 2];
    //   if (past1) {
    //     past1.style.transform = transformCellOrigin;
    //   }

    //   var past0 = selectedIndex - 1 >= 0 ? cells[selectedIndex - 1] : cells[cells.length - 1];
    //   if (past0) {
    //     past0.style.transform = `rotateY( ${
    //       theta * selectedIndex
    //     }deg) translate3d(-200px, 50px, ${radius + 10}px)  scale(0.5)`;
    //   }
  }

  function changeCarousel() {
    cellCount = cells.length;
    theta = 360 / cellCount;

    //var cellSize = isHorizontal ? cellWidth : cellHeight;
    radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));

    //----

    transformCellOrigin =
      rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";

    //------

    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (i < cellCount) {
        // visible cell
        cell.style.opacity = 1;
        var cellAngle = theta * i;
        cell.style.transform =
          rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";

        update();
      } else {
        // hidden cell
        cell.style.opacity = 0;
        cell.style.transform = "none";
      }
    }

    rotateCarousel();
  }
})(window);

// var carousel = document.querySelector(".carousel");

// var originClassList = [];
// var transformCellOrigin = "";
// var cells = carousel.querySelectorAll(".carousel__cell");
// var cellCount; // cellCount set from cells-range input value

// var selectedIndex = 0;

// var cellWidth = carousel.offsetWidth;
// var cellHeight = carousel.offsetHeight;
// var isHorizontal = true;
// var rotateFn = isHorizontal ? "rotateY" : "rotateX";
// var radius, theta;
// // console.log( cellWidth, cellHeight );

// function rotateCarousel() {
//   var angle = theta * selectedIndex * -1;
//   carousel.style.transform =
//     "translateZ(" + -radius + "px) " + rotateFn + "(" + angle + "deg)";
// }

// var prevButton = document.querySelector(".previous-button");
// prevButton.addEventListener("click", function () {
//   selectedIndex--;

//   update();

//   rotateCarousel();
// });

// var nextButton = document.querySelector(".next-button");
// nextButton.addEventListener("click", function () {
//   selectedIndex++;

//   update();

//   applyPastFutureClasses();

//   rotateCarousel();
// });

// var cellsRange = document.querySelector(".cells-range");
// cellsRange.addEventListener("change", changeCarousel);
// cellsRange.addEventListener("input", changeCarousel);

// function applyPastFutureClasses() {
//   return;

//   var pastBeforeCell =
//     selectedIndex - 2 >= 0 ? cells[selectedIndex - 2] : cells[cells.length - 2];
//   pastBeforeCell.classList.add("pastBeforeCell");

//   var pastCell =
//     selectedIndex - 1 >= 0 ? cells[selectedIndex - 1] : cells[cells.length - 1];
//   pastCell.classList.add("past-item");

//   pastCell.style.transform = `rotateY( ${
//     theta * selectedIndex
//   }deg) translate3d(-200px, 50px, ${radius + 10}px)  scale(0.5)`;

//   var future =
//     selectedIndex + 1 < cells.length ? cells[selectedIndex + 1] : cells[0];
//   future.classList.add("future-item");
// }

// function changeCarousel() {
//   cellCount = cellsRange.value;
//   theta = 360 / cellCount;
//   var cellSize = isHorizontal ? cellWidth : cellHeight;
//   radius = Math.round(cellSize / 2 / Math.tan(Math.PI / cellCount));

//   //----

//   transformCellOrigin =
//     rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";

//   //------

//   for (var i = 0; i < cells.length; i++) {
//     var cell = cells[i];
//     if (i < cellCount) {
//       // visible cell
//       cell.style.opacity = 1;
//       var cellAngle = theta * i;
//       cell.style.transform =
//         rotateFn + "(" + cellAngle + "deg) translateZ(" + radius + "px)";

//       update();
//     } else {
//       // hidden cell
//       cell.style.opacity = 0;
//       cell.style.transform = "none";
//     }
//   }

//   rotateCarousel();
// }

// function update() {
//   var arr = Array.from(cells);

//   var currentCell = cells[selectedIndex];

//   var futureCells = arr.slice(
//     selectedIndex + 1,
//     Math.floor(cells.length / 2 + selectedIndex)
//   );

//   var pastCells = [
//     ...arr.slice(0, selectedIndex).reverse(),
//     ...arr.slice(Math.floor(cells.length / 2 + selectedIndex)).reverse(),
//   ];

//   //-------------

//   currentCell.className = [...originClassList, "x-current"].join(" ");

//   futureCells.forEach((cell, idx) => {
//     cell.className = [...originClassList, "x-future", "x-future-" + idx].join(
//       " "
//     );
//   });

//   pastCells.forEach((cell, idx) => {
//     cell.className = [...originClassList, "x-past", "x-past-" + idx].join(" ");
//   });

//   // -------------

//   //   var past1 = selectedIndex - 2 >= 0 ? cells[selectedIndex - 2] : cells[cells.length - 2];
//   //   if (past1) {
//   //     past1.style.transform = transformCellOrigin;
//   //   }

//   //   var past0 = selectedIndex - 1 >= 0 ? cells[selectedIndex - 1] : cells[cells.length - 1];
//   //   if (past0) {
//   //     past0.style.transform = `rotateY( ${
//   //       theta * selectedIndex
//   //     }deg) translate3d(-200px, 50px, ${radius + 10}px)  scale(0.5)`;
//   //   }
// }

// var orientationRadios = document.querySelectorAll('input[name="orientation"]');
// (function () {
//   for (var i = 0; i < orientationRadios.length; i++) {
//     var radio = orientationRadios[i];
//     radio.addEventListener("change", onOrientationChange);
//   }
// })();

// function onOrientationChange() {
//   originClassList = [...cells[selectedIndex].classList];

//   var checkedRadio = document.querySelector(
//     'input[name="orientation"]:checked'
//   );
//   isHorizontal = checkedRadio.value == "horizontal";
//   rotateFn = isHorizontal ? "rotateY" : "rotateX";
//   changeCarousel();
//   applyPastFutureClasses();
// }

// // set initials
// onOrientationChange();

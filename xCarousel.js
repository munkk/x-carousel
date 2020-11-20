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
  autoSlide = null; // interval time
  autoSlideInterval = null; // interval reference for clearInterval()

  onMoveRight = null; //cb
  onMoveLeft = null; //cb

  constructor(options) {
    this.elementToMount = options.elementToMount;
    this.items = options.items;
    this.cellSize = options.cellSize || 400;
    this.list = new DoublyLinkedList();
    this.autoSlide = options.autoSlide;
    this.pauseOnHover = options.pauseOnHover || true;

    this.onInit = options.onInit || noop;
    this.onMoveRight = options.onMoveRight || noop;
    this.onMoveLeft = options.onMoveLeft || noop;

    this.mouseIn = false;

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

    if(this.pauseOnHover) {
      scene.addEventListener('mouseenter',  () => {
          this.mouseIn = true;
          this.stopAutoSlide(false);
      });
      scene.addEventListener('mouseleave', () => {
        this.mouseIn = false;
        this.autoSlideInit();
      });
    }

    this.elementToMount.appendChild(scene);

    this.changeCarousel();

    this.onInit(this);
    this.autoSlideInit();
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
    this.stopAutoSlide(true);
  }

  moveLeft() {
    this.currentIndex--;
    this.update();
    this.rotateCarousel();

    this.onMoveRight(this.currentNode);
    this.stopAutoSlide(true);
  }

  stopAutoSlide(reset = false) {
    if(!!this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }

    return reset && !this.mouseIn ? this.autoSlideInit() : () => {};
  }

  autoSlideInit() {
    if(
        this.autoSlide && 
        typeof this.autoSlide === 'number' && 
        this.autoSlide > 0
      ) {
        this.autoSlideInterval = setInterval(
          this.moveRight.bind(this), this.autoSlide
        )
    }
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


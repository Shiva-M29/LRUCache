
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = this;
    this.next = this;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = null; 
  }
  addToFront(node) {
    if (this.head === null) {
      this.head = node;
    } else {
      const tail = this.head.prev;
      node.next = this.head;
      node.prev = tail;
      tail.next = node;
      this.head.prev = node;
      this.head = node;
    }
  }
  
  removeNode(node) {
    if (node.next === node) { 
      this.head = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
      if (this.head === node) {
        this.head = node.next;
      }
    }
  }
  
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }
  
  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const node = this.map.get(key);
    this.moveToFront(node);
    return node.value;
  }
  
  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.moveToFront(node);
    } else {
      if (this.map.size >= this.capacity) {
        const tail = this.head.prev;
        this.removeNode(tail);
        this.map.delete(tail.key);
      }
      const newNode = new Node(key, value);
      this.addToFront(newNode);
      this.map.set(key, newNode);
    }
  }
  
  state() {
    const result = [];
    if (this.head === null) {
      return result;
    }
    let current = this.head;
    do {
      result.push({ key: current.key, value: current.value });
      current = current.next;
    } while (current !== this.head);
    return result;
  }
}


let cache = null;


window.initCache = () => {
  const cap = Number(document.getElementById("capacity").value);
  if (cap > 0) {
    cache = new LRUCache(cap);
    document.getElementById("cacheOps").classList.remove("hidden");
    document.getElementById("result").textContent = `Cache initialized with capacity ${cap}.`;
    updateDisplay();
  } else {
    alert("Invalid capacity. Please enter a number greater than 0.");
  }
};

window.setCache = () => {
  const key = document.getElementById("keyInput").value;
  const value = document.getElementById("valueInput").value;
  if (key && value) {
    cache.put(key, value);
    document.getElementById("result").textContent = `Set ${key} to ${value}.`;
    updateDisplay();
  } else {
    alert("Enter both key and value.");
  }
};

window.getCache = () => {
  const key = document.getElementById("keyInput").value;
  if (key) {
    const res = cache.get(key);
    document.getElementById("result").textContent =
      res === -1 ? `Key "${key}" not found.` : `Got ${key} = ${res}.`;
    updateDisplay();
  } else {
    alert("Enter a key.");
  }
};


const updateDisplay = () => {
  const stateData = cache.state();
  const container = document.getElementById("cacheState");
  container.innerHTML = ""; // Clear previous content
  
  if (stateData.length === 0) {
    container.textContent = "Cache is empty.";
    return;
  }
  
 
  const frag = document.createDocumentFragment();
  
  stateData.forEach((item, index) => {
    // Create a badge for each cache item.
    const badge = document.createElement("span");
    badge.className = "cache-item";
    badge.textContent = `${item.key}:${item.value}`;
    frag.appendChild(badge);
    
   
    if (index < stateData.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      frag.appendChild(arrow);
    }
  });
  
  container.appendChild(frag);
};
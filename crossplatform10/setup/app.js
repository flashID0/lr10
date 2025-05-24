
const form = document.querySelector('.grocery-form');
const input = document.getElementById('grocery');
const list = document.querySelector('.grocery-list');
const alert = document.querySelector('.alert');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

function addItem(e) {
  e.preventDefault();
  const value = input.value.trim();
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    showAlert("Додано продукт", "success");
    container.classList.add('show-container');
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.textContent = value;
    showAlert("Продукт оновлено", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    showAlert("Введіть назву продукту", "danger");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  element.setAttribute("data-id", id);
  element.innerHTML = `
    <p class='title'>${value}</p>
    <div class='btn-container'>
      <button type="button" class='edit-btn'><i class='fas fa-edit'></i></button>
      <button type="button" class='delete-btn'><i class='fas fa-trash'></i></button>
    </div>
  `;

  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');

  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);

  list.append(element);
}

function showAlert(text, type) {
  alert.textContent = text;
  alert.classList.add(`alert-${type}`);
  setTimeout(() => {
    alert.textContent = '';
    alert.className = 'alert';
  }, 1500);
}

function deleteItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  const id = element.dataset.id;
  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  showAlert("Продукт видалено", "danger");
  removeFromLocalStorage(id);
  setBackToDefault();
}

function editItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  editElement = element.querySelector(".title");
  input.value = editElement.textContent;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Редагувати";
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(item => list.removeChild(item));
  }

  container.classList.remove("show-container");
  showAlert("Список очищено", "danger");
  localStorage.removeItem("list");
  setBackToDefault();
}

function setBackToDefault() {
  input.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Додати";
}

function addToLocalStorage(id, value) {
  const item = { id, value };
  const items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(item => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, newValue) {
  const items = getLocalStorage();
  const updatedItems = items.map(item => {
    if (item.id === id) {
      item.value = newValue;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(updatedItems));
}

function setupItems() {
  const items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(item => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

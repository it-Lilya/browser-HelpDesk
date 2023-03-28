import { NewLi } from './NewLi';
import { Ticket } from './Ticket';

const addedTicket = document.querySelector('.added');
const form = document.querySelector('.form');
const main = document.querySelector('.main');
const newElement = new Ticket();
const cancel = document.querySelector('.cancel');
const containerBtns = form.querySelector('.container-btns');

let data;

// запрос списка
const loadList = () => {
  document.querySelector('ul').innerHTML = '';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:4040/allTickets');
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        data = JSON.parse(xhr.responseText);
        data.forEach((el) => new NewLi().created(el));
      } catch (e) {
      // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  });
};

window.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  loadList();
});

// отмена
const cancelFunc = () => {
  main.classList.remove('hide');
  form.classList.remove('active');
  form.name.value = '';
  form.created.value = '';
  loadList();
};

// ок
const sendFunc = () => {
  if (form.name.value === '' || form.created.value === '') {
    main.classList.remove('hide');
    form.classList.remove('active');

    loadList();
    return;
  }

  const xhr2 = new XMLHttpRequest();
  newElement.addNewTicket(form.name.value, form.created.value);
  xhr2.open('POST', 'http://localhost:4040/createTicket');
  xhr2.send(JSON.stringify(newElement));

  main.classList.remove('hide');
  form.classList.remove('active');
  form.name.value = '';
  form.created.value = '';

  cancelFunc();
};

// кнопка добавления тикета
addedTicket.addEventListener('click', () => {
  const btnAdded = document.createElement('button');
  btnAdded.textContent = 'OK';
  btnAdded.className = 'send btns';
  if (containerBtns.querySelector('.send')) return;
  containerBtns.append(btnAdded);
  form.classList.add('active');
  main.classList.add('hide');

  if (containerBtns.querySelector('.editing')) {
    const editing = containerBtns.querySelector('.editing');
    containerBtns.removeChild(editing);
  }

  // кнопка ок добавления
  btnAdded.addEventListener('click', () => {
    sendFunc();
    containerBtns.removeChild(btnAdded);
  });

  //   // кнопка отмена
  cancel.addEventListener('click', cancelFunc);
});

// клик по кнопкам
document.addEventListener('click', (e) => {
  // кнопка статуса
  if (e.target.classList.contains('status')) {
    if (e.target.textContent !== '') {
      e.target.innerHTML = '';
      newElement.status = false;
    } else {
      e.target.innerHTML = '&#x2713;';
      newElement.status = true;
    }
  }

  // полное описание тикет
  if (e.target.classList.contains('li')) {
    e.target.classList.toggle('added-descripiton');
    // eslint-disable-next-line array-callback-return, consistent-return
    const current = data.find((el) => {
      if (el.id === Number(e.target.id)) {
        return el;
      }
    });
    if (e.target.classList.contains('added-descripiton')) {
      const newDescription = document.createElement('p');
      newDescription.classList = 'new-description';
      newDescription.textContent = `${current.description}`;
      e.target.append(newDescription);
    } else {
      e.target.removeChild(e.target.querySelector('.new-description'));
    }
  }

  // редактирование записи
  if (e.target.classList.contains('edit')) {
    // кнопка отправки отредактированной записи
    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'OK';
    btnEdit.className = 'editing btns';
    if (containerBtns.querySelector('.editing')) return;
    containerBtns.append(btnEdit);

    if (containerBtns.querySelector('.send')) {
      const send = containerBtns.querySelector('.send');
      containerBtns.removeChild(send);
    }

    form.classList.add('active');
    main.classList.add('hide');

    const parentLi = e.target.parentElement.parentElement;

    const current = data.find((el) => el.id === +parentLi.id);
    form.name.value = `${current.name}`;
    form.created.value = `${current.description}`;

    const currentId = +parentLi.id;

    btnEdit.addEventListener('click', (event) => {
      event.preventDefault();
      const newObj = { name: `${form.name.value}`, description: `${form.created.value}` };
      const url = `http://localhost:4040/ticketById&${currentId}`;
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, false);
      xhr.send(JSON.stringify(newObj));
      containerBtns.removeChild(btnEdit);
      cancelFunc();
    });
    cancel.addEventListener('click', cancelFunc);
  }

  // удаление
  if (e.target.classList.contains('removal')) {
    document.querySelector('.new-window').classList.add('open');
    main.classList.add('hide');

    document.querySelector('.no-delete').addEventListener('click', () => {
      cancelFunc();
      document.querySelector('.new-window').classList.remove('open');
      main.classList.remove('hide');
    });

    document.querySelector('.delete').addEventListener('click', () => {
      // eslint-disable-next-line array-callback-return, consistent-return
      const current = data.find((el) => {
        if (el.id === Number(e.target.parentElement.parentElement.id)) {
          return el;
        }
      });

      const url = `http://localhost:4040/ticketById&${current.id}`;
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', url, false);
      xhr.send();

      document.querySelector('.new-window').classList.remove('open');
      main.classList.remove('hide');
      loadList();
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    });
  }
});

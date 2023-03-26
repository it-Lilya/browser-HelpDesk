import { NewLi } from './NewLi';
import { Ticket } from './Ticket';

const addedTicket = document.querySelector('.added');
const form = document.querySelector('.form');
const main = document.querySelector('.main');
const newElement = new Ticket();
const cancel = document.querySelector('.cancel');

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
  form.classList.add('active');
  main.classList.add('hide');

  // кнопка ок
  form.querySelector('.send').addEventListener('click', sendFunc);

  // кнопка отмена
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
    form.classList.add('active');
    main.classList.add('hide');

    const parentLi = e.target.parentElement.parentElement;

    const current = data.find((el) => el.id === +parentLi.id);
    form.name.value = `${current.name}`;
    form.created.value = `${current.description}`;

    const currentId = +parentLi.id;

    // form.name.addEventListener('input', (e) => {
    //   if (e.target.value !== '') {
    //     form.querySelector('.send').addEventListener('click', () => {
    //       setTimeout(() => {
    //         const newObj = { name: `${form.name.value}`, description: `${form.created.value}` };

    //         const url = `http://localhost:4040/ticketById&${currentId}`;
    //         const xhr = new XMLHttpRequest();
    //         xhr.open('PUT', url, false);
    //         xhr.send(JSON.stringify(newObj));

    //         // eslint-disable-next-line no-restricted-globals
    //         location.reload();
    //         cancelFunc();
    //         console.log(newObj)
    //       }, 10);
    //     });
    //   }
    // });

    console.log('lo')
    form.querySelector('.send').addEventListener('click', () => {
      if (form.name.value !== '' && form.created.value !== '') {
        const newObj = { name: `${form.name.value}`, description: `${form.created.value}` };

        const url = `http://localhost:4040/ticketById&${currentId}`;
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, false);
        xhr.send(JSON.stringify(newObj));

        // eslint-disable-next-line no-restricted-globals
        location.reload();
        cancelFunc();
      }
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

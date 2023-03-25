export class NewLi {
  // eslint-disable-next-line class-methods-use-this
  contructor() {}

  // eslint-disable-next-line class-methods-use-this
  created(element) {
    const newLi = document.createElement('li');
    newLi.classList.add('li');
    newLi.id = `${element.id}`;
    newLi.innerHTML = `
            <button class="status btnsLi" type="button" name="stat"></button>
            <p class="text-li">${element.name}</p>
            <p class="data-li">${element.created}</p>
    `;

    const btnsContainer = document.createElement('div');
    btnsContainer.className = 'btns-container';
    btnsContainer.innerHTML = `
    <button class="edit btnsLi">&#x270E;</button>
    <button class="removal btnsLi">&#x2613;</button>
    `;

    newLi.appendChild(btnsContainer);

    document.querySelector('.list').appendChild(newLi);
  }
}

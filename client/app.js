'use strict';

const socket = io();
socket.on('message', ({author, content}) => addMessage(author, content));

const references = {
  loginForm: document.getElementById('welcome-form'),
  messagesSection: document.getElementById('messages-section'),
  messagesList: document.getElementById('messages-list'),
  addMessageForm: document.getElementById('add-messages-form'),
  userNameInput: document.getElementById('username'),
  messageContentInput: document.getElementById('message-content')
};

let userName;

const login = function(event) {
  event.preventDefault();
  if(references.userNameInput.value) {
    userName = references.userNameInput.value;
    references.messagesSection.classList.add('show');
    references.loginForm.classList.remove('show');
  } else window.alert('Write your login!');
};

references.loginForm.addEventListener('submit', login);

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  references.messagesList.appendChild(message);
}

const sendMessage = function(event) {
  event.preventDefault();
  if(references.messageContentInput.value) {
    addMessage(userName, references.messageContentInput.value);
    socket.emit('message', { author: userName, content: references.messageContentInput.value });
    references.messageContentInput.value = '';
  } else window.alert('You have to type your message');
}

references.loginForm.addEventListener('submit', login);
references.addMessageForm.addEventListener('submit', sendMessage);
import { getDatabase, ref, push, get, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

const chatbot = (function () {
  const db = getDatabase();
  const chatsRef = ref(db, 'chats');

  function sendChatMessage(e) {
    const input = document.querySelector('#chat-input');
    const chat = input.value;
    const username = document.querySelector('#username').value;

    if (e) e.preventDefault();

    if (!chat || !username) return;

    push(chatsRef, { message: chat, username });
    input.value = '';
  }

  function streamMessages() {
    const chat_wrapper = document.querySelector('.chatbox');
    const loading_el = document.querySelector('.loading');



    onChildAdded(chatsRef, snap => {
      const chat = snap.val();
      const p = document.createElement('p');

      if (loading_el) loading_el.remove();

      p.innerHTML = `<span class="name-display">${chat.username}</span><span class="chat-text">${chat.message}</span>`;
      chat_wrapper.appendChild(p);
      p.scrollIntoView();
    });
  }

  function init() {
    const form = document.querySelector('form');
    const text_box = document.querySelector('#chat-input');

    streamMessages();

    form.addEventListener('submit', sendChatMessage);
    text_box.addEventListener('keyup', e => {
      if (e.keyCode === 13) sendChatMessage();
    });
  }

  return { init }
})();

chatbot.init();


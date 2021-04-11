const socket = io();

const user = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", user, (error) => console.log(error));

const $messages = document.querySelector("#msgs");
const $msgTemplate = document.querySelector("#msg-template");
const $urlTemplate = document.querySelector("#url-template");

const autoscroll = () => {
  // Get new message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible Height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far down are we scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight + 10;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log("Got a message request");
  const output = { ...user, ...message };
  console.log(output);
  const html = Mustache.render($msgTemplate.innerHTML, output);
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("location", (location) => {
  const output = { ...user, ...location };
  const html = Mustache.render($urlTemplate.innerHTML, output);
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

const $sidebarTemplate = document.querySelector("#sidebar-template");

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate.innerHTML, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

const $messageForm = document.querySelector("#sendMessage");
const $messageInput = $messageForm.querySelector("input");
const $messageButton = $messageForm.querySelector("button");

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageButton.setAttribute("disabled", "disabled");
  if ($messageInput.value !== "") {
    const output = { ...user, message: $messageInput.value };
    socket.emit("message", output, (error) => {
      if (error) {
        $messageButton.removeAttribute("disabled");
        $messageInput.focus();
        $messageInput.value = error;
      } else {
        $messageButton.removeAttribute("disabled");
        $messageInput.focus();
        $messageInput.value = "";
      }
    });
  } else {
    $messageButton.removeAttribute("disabled");
    $messageInput.focus();
  }
});

const $sendLocationButton = document.querySelector("#send-location");

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation");
  }
  $sendLocationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    const location = `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
    const output = { ...user, url: location };
    socket.emit("sendLocation", output, () => {
      console.log("Location shared!");
      $sendLocationButton.removeAttribute("disabled");
    });
  });
});

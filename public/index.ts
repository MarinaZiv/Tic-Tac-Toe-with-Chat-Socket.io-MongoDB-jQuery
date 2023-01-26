let io;
let axios;
const clientUrl = window.location.origin;
let socket = io(clientUrl);
const gameRoomInput: any = document.querySelector("#gameRoomInput");
const chatInput = document.querySelector("#chatMessageInput") as HTMLInputElement;
const chatRoomInput = document.querySelector("#chatRoomInput") as HTMLInputElement;

let _id = "";
let myMove = true;
let symbol;
let lost = 0;
let score = 0;
let sec = 0;
let min = 0;

async function handleLoad() {
  try {
    getPlayerByCookie();
  } catch (error) {
    console.error(error);
  }
}

function loadStatistic() {
  try {
    handleLoad();
    handleWinScoreUpdate();
    handleLostUpdate();
  } catch (error) {
    console.error(error);
  }
}


socket.on("connect", () => {
  try {
    displayChatMessage(`You connected with id: ${socket.id}`);
    showTime();
    $("#timer").css("display", "none");
  } catch (error) {
    console.error(error.message);
  }
});

socket.on("recieve-message", (message) => {
  try {
    displayChatMessage(message);
  } catch (error) {
    console.error(error.message);
  }
});

$<HTMLElement>("#chatForm").submit(function (e: any) {
  try {
    e.preventDefault();
    const message = chatInput.value;
    const room = chatRoomInput.value;

    if (message === "") return;
    displayChatMessage(message);

    socket.emit("send-message", message, room);
    chatInput.value = "";
  } catch (error) {
    console.error(error.message);
  }
});

$<HTMLElement>("#chatRoomBtn").click(function () {
  try {
    const room = chatRoomInput.value;
    socket.emit("join-room", room, (message) => {
      displayChatMessage(message);
    });
  } catch (error) {
    console.error(error.message);
  }
});

function displayChatMessage(message) {
  try {
    const div = document.createElement("div");
    div.textContent = message;
    $("#chat-container").append(div);
  } catch (error) {
    console.error(error.message);
  }
}

function getBoardState() {
  try {
    let obj = {};

    $(".container__game__board__cell").each(function () {
      obj[$(this).attr("id")] = $(this).text() || "";
    });

    return obj;
  } catch (error) {
    console.error(error.message);
  }
}

socket.on("game-begin", (data) => {
  try {
    symbol = data.symbol;
    myMove = symbol === "X";
    timer();

    $("#clock").css("display", "none");
    $("#timer").css("display", "block");
    renderTurnMessage();

    $("#playingSymbol").html(
      `<span style="color: #0f0f82b6; font-size: 1.5em;font-weight: 600; font-family: 'Monoton';">${data.symbol} </span> is playing`
    );
  } catch (error) {
    console.error(error.message);
  }
});

socket.on;

function makeMove() {
  try {
    if (!myMove) {
      return;
    }

    if ($(this).text().length) {
      return;
    }

    socket.emit("make-move", {
      symbol: symbol,
      position: $(this).attr("id"),
    });
  } catch (error) {
    console.error(error.message);
  }
}

socket.on("move-made", (data) => {
  try {
    $("#" + data.position).text(data.symbol);
    myMove = data.symbol !== symbol;

    if (!myMove) {
      $("#" + data.position)
        .text(data.symbol)
        .css("color", "#ee272ac8");
    } else {
      $("#" + data.position)
        .text(data.symbol)
        .css("color", "#1e1eedae");
    }

    if (!isGameOver()) {
      renderTurnMessage();
    } else {
      $("#clock").css("display", "block");
      $("#timer").css("display", "none");

      if (myMove) {
        $(".nav__message")
          .text("Ups..You lost =(")
          .css("font-family", "Monoton")
          .css("color", "#202941c4")
          .css("letter-spacing", "2px");

        $("#playingSymbol").css("display", "none");
        handleLostUpdate();
        console.log("Lost is:", lost);
      } else {
        $(".nav__message")
          .text("Congrats! You Win!")
          .css("font-family", "Monoton")
          .css("color", "#085861")
          .css("letter-spacing", "2px");

        $("#playingSymbol").css("display", "none");
        // @ts-ignore
        $(".container__game__board__cell").attr("disabled", true);
        handleWinScoreUpdate();
        console.log("score:", score);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
});

socket.on("opponent-left", () => {
  try {
    $(".nav__message")
      .text("Your opponent has left the game")
      .css("letter-spacing", "2px");
    // @ts-ignore
    $(".container__game__board__cell").attr("disabled", true);
    $("#clock").css("display", "block");
    $("#timer").css("display", "none");
  } catch (error) {
    console.error(error.message);
  }
  showTime();
});

function isGameOver() {
  try {
    let winCombination = getBoardState();
    let matches = ["XXX", "OOO"];

    let rows = [
      // @ts-ignore
      winCombination.cell0 + winCombination.cell1 + winCombination.cell2,
      // @ts-ignore
      winCombination.cell3 + winCombination.cell4 + winCombination.cell5,
      // @ts-ignore
      winCombination.cell6 + winCombination.cell7 + winCombination.cell8,
      // @ts-ignore
      winCombination.cell0 + winCombination.cell3 + winCombination.cell6,
      // @ts-ignore
      winCombination.cell1 + winCombination.cell4 + winCombination.cell7,
      // @ts-ignore
      winCombination.cell2 + winCombination.ce5l5 + winCombination.cell8,
      // @ts-ignore
      winCombination.cell0 + winCombination.cell4 + winCombination.cell8,
      // @ts-ignore
      winCombination.cell2 + winCombination.cell4 + winCombination.cell6,
    ];

    for (let i = 0; i < rows.length; i++) {
      if (rows[i] === matches[0] || rows[i] === matches[1]) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(error.message);
  }
}

$(function () {
  try {
    // @ts-ignore
    $(".container__game__board__cell").attr("disabled", true);
    $(".container__game__board__cell").on("click", makeMove);
  } catch (error) {
    console.error(error.message);
  }
});

function renderTurnMessage() {
  try {
    if (!myMove) {
      $(".nav__message")
        .text("Turn of your opponent")
        .css("letter-spacing", "2px");
      // @ts-ignore
      $(".container__game__board__cell").attr("disabled", true);
    } else {
      $(".nav__message").text("Make a move").css("letter-spacing", "2px");
      $(".container__game__board__cell").removeAttr("disabled");
    }
  } catch (error) {
    console.error(error.message);
  }
}

function handleJoinGameRoom(e) {
  try {
    const room = gameRoomInput.value;
    console.log(room);
    socket.emit("join-game-room", room, (message) => {
      $("#joinedGameRoom").text("Privet room is empty").css("display", "none");
      displayJoinedRoomMessage(message);
      $("#joinedGameRoom").text(`${message}`).css("display", "block");
      // @ts-ignore
      $(".container__game__board__cell").attr("disabled", true);
    });
  } catch (error) {
    console.error(error);
  }
}

function displayJoinedRoomMessage(message) {
  try {
    const div = document.createElement("div");
    div.textContent = message;
    $("#joinedGameRoom").append(div);
    console.log(message);
  } catch (error) {
    console.error(error);
  }
}

function displayGameMessage(message) {
  try {
    const div = document.createElement("span");
    div.textContent = message;
    $(".nav__message").append(div);
  } catch (error) {
    console.error(error);
  }
}

function handleBackToGame() {
  try {
    window.location.href = "./game.html";
  } catch (error) {
    console.error(error);
  }
}

function handleGoToStats() {
  try {
    window.location.href = "./statistic.html";
  } catch (error) {
    console.error(error);
  }
}

async function handleRegister(e) {
  try {
    e.preventDefault();
    let { name, email, password } = e.target.elements;
    name = name.value;
    email = email.value;
    password = password.value;
    const { data } = await axios.post("/players/register", {
      name,
      email,
      password,
    });
    const { error, player } = data;
    console.log(player);
    if (error) {
      alert("Couldn`t register player");
    } else {
      window.location.href = "./game.html";
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function handleLogin(e) {
  try {
    e.preventDefault();
    let { email, password } = e.target.elements;
    email = email.value;
    password = password.value;
    const { data } = await axios.post("/players/login", { email, password });
    const { error, player, entrances } = data;

    console.log("This is the player from handleLogin:", player);
    console.log("This is the Data from handleLogin:", data);

    if (!player) {
      alert("Username or password is incorrect");
    } else {
      window.location.href = "./game.html";
    }
    if (error && error.includes("E11000"))
      alert("This email is already in use");
  } catch (error) {
    console.error(error.message);
  }
}

async function getPlayerByCookie() {
  try {
    const { data } = await axios.get("/players/player-by-cookie");
    const { player1, player2 } = data;
    const { name } = player1;

    if (!player1) throw new Error("player not found");
    if (!player2) throw new Error("player not found");

    _id = player1.playerId;
    let id = player2.playerId;

    console.log(`test: ${player1.name} and id: ${_id}`);
    console.log(`test: ${player2.name} and id: ${id}`);

    lost = player1.lost;
    score = player1.score;
    let lost2 = player2.lost;
    let score2 = player2.score;

    const div = document.createElement("div");
    div.innerHTML = `Name: <span style="color: #8c0b0df1;">${player1.name}</span>&nbsp;&nbsp;  &#10044;  &nbsp;&nbsp;Score is:  <span style="color: #8c0b0df1;">${score}</span>&nbsp;&nbsp;  &#10044;  &nbsp;&nbsp;Losts:  <span style="color: #8c0b0df1;">${lost}</span>`;
    div.innerHTML = `Name:  <span style="color: #8c0b0df1;">${player2.name}</span>&nbsp;&nbsp;  &#10044;  &nbsp;&nbsp;Score is:  <span style="color: #8c0b0df1;">${score2}</span>&nbsp;&nbsp;  &#10044;  &nbsp;&nbsp;Losts:  <span style="color: #8c0b0df1;">${lost2}</span>`;
    $("#scoreTable-container").append(div);

    console.log("This player1 from getPlayerByCookie:", player1);
    console.log("This player2 from getPlayerByCookie:", player2);
    console.log("name is:", name);
    console.log("Data from getPlayerByCookie 406: ", data);

    const greetingFunc = timeOfDay();
    $("#greeting").html(`<h2>Good ${greetingFunc}, ${name}!</h2>`);

    $("#opponentName").html(`
    <div class="container__currentStatistic__gemerIcons">
      <div>
         <span class="material-icons">person</span>
         <p>${player1.name}</p>
      </div>
    <div>VS</div>
      <div>
         <span class="material-icons">perm_identity</span>
        <p>${player2.name}</p>
      </div>
    </div>
    `);
  } catch (error) {
    console.error(error.message);
  }
}

async function handleWinScoreUpdate() {
  score++;
  console.log("New score:", score);
  const { data } = await axios.patch("/players/update-score", { _id, score });
}

async function handleLostUpdate() {
  lost++;
  console.log("New lost:", lost);
  const { data } = await axios.patch("/players/update-lost", { _id, lost });
  console.log("The Data from handleLostUpdate:", data);
}

function deleteCookies() {
  let allCookies = document.cookie.split(";");

  for (let i = 0; i < allCookies.length; i++)
    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
}

function timeOfDay() {
  let realtoday = new Date();
  let realtime = realtoday.getHours();

  if ((realtime >= 0 && realtime <= 5) || (realtime >= 22 && realtime <= 24)) {
    return "night";
  }
  if (realtime >= 6 && realtime <= 11) {
    return "morning";
  }
  if (realtime >= 12 && realtime <= 17) {
    return "afternoon";
  }
  if (realtime >= 18 && realtime <= 21) {
    return "evening";
  }
}

function timer(): void {
  sec = 0;
  min = 0;

  if (min < 10) {
    // @ts-ignore
    min = `0${min}`;
  }
  setInterval(() => {
    sec++;

    if (sec < 10) {
      // @ts-ignore
      sec = `0${sec}`;
    }

    if (sec === 60) {
      min++;
      if (min < 10) {
        // @ts-ignore
        min = `0${min}`;
      }
      sec = 0;
    }

    $("#timer").html(
      `Timer &nbsp;&nbsp;<span style="color: #811618ad;">${min}</span> : <span style="color: #811618ad;">${sec}</span>`
    );
  }, 1000);
}

function showTime() {
  let date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  // @ts-ignore
  hour = hour < 10 ? "0" + hour : hour;
  // @ts-ignore
  min = min < 10 ? "0" + min : min;
  // @ts-ignore
  sec = sec < 10 ? "0" + sec : sec;

  $("#clock").html(
    `Time &nbsp;&nbsp; <span style="color: rgba(15, 15, 130, 0.715);">${hour}</span> : <span style="color: rgba(15, 15, 130, 0.715);">${min}</span> : <span style="color: rgba(15, 15, 130, 0.715);">${sec}</span>`
  );
  setTimeout(showTime, 1000);
}

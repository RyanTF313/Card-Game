const start = document.getElementById("start");
const restart = document.getElementById("restart");
restart.style.display = "none";
const user = document.querySelector("#user");
const comp = document.querySelector("#comp");
const reveal = document.getElementById("reveal");
const gameModeOptions = document.querySelectorAll(".game-type");
let game;

class HighLow {
  constructor() {
    this.userCard = {};
    this.compCard = {};
    this.winner = "";
    this.gameOver = "";
    this.gameId = "";
    this.gameType = "";
    this.message = "";
    this.rounds = [];
  }

  startGame = () => {
    return fetch(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    )
      .then((res) => res.json())
      .then((data) => {
        const { deck_id } = data;
        this.gameId = deck_id;
        return data;
      });
  };

  dealCards = () => {
    return fetch(
      `https://www.deckofcardsapi.com/api/deck/${this.gameId}/draw/?count=2`
    )
      .then((res) => res.json())
      .then((data) => {
        const { cards } = data;
        this.userCard = cards[0];
        this.compCard = cards[1];
        user.innerHTML =
          "<img src='https://www.deckofcardsapi.com/static/img/back.png' />";
        comp.innerHTML =
          "<img src='https://www.deckofcardsapi.com/static/img/back.png' />";
        return data;
      });
  };

  revealCards = () => {
    user.innerHTML = `<img src="${this.userCard.image}" />`;
    comp.innerHTML = `<img src="${this.compCard.image}" />`;
    this.checkWin();
  };

  checkWin = () => {
    const winLogic = {
      high: this.checkHigh,
      low: this.checkLow,
    };

    winLogic[this.gameType]();
    this.message =
      this.winner +
      " won round " +
      (this.rounds.length + 1) +
      "! Please press Quit/Re-Deal to keep playing.";

    this.rounds.push(this.winner);
    if (this.rounds.length >= 3) {
      let count = 0;
      let compCount = 0;
      let tieCount = 0;
      this.rounds.forEach((winner) => {
        if (winner === "You") {
          count++;
        } else if (winner === "Tie") {
          tieCount++;
        } else {
          compCount++;
        }
      });

      if (count > compCount && count > tieCount) {
        this.winner = "You";
        this.gameOver = true;
        this.message = " You won the series!";
      } else if (count < compCount && compCount > tieCount) {
        this.winner = "Computer";
        this.gameOver = true;
        this.message = " Computer won the series!";
      } else if (compCount < tieCount && count < tieCount) {
        this.winner = "Tie";
        this.gameOver = true;
        this.message = " There are mostly Ties. No one won the series!";
      }
    }
    document.getElementById("message").innerText = this.message;
  };

  checkHigh = () => {
    if (this.userCard.value === this.compCard.value) {
      this.winner = "Tie";
    } else if (this.userCard.value > this.compCard.value) {
      this.winner = "You";
    } else {
      this.winner = "Computer";
    }
    return this.userCard.value > this.compCard.value;
  };
  checkLow = () => {
    if (this.userCard.value === this.compCard.value) {
      this.winner = "Tie";
    } else if (this.userCard.value < this.compCard.value) {
      this.winner = "You";
    } else {
      this.winner = "Computer";
    }
  };
}

start.addEventListener("click", (e) => {
  e.preventDefault();
  if (game.gameOver) return;
  if (!game.gameType) return;
  e.target.style.display = "none";
  restart.style.display = "flex";
  game.dealCards();
});

restart.addEventListener("click", (e) => {
  e.preventDefault();
  if (!game.gameType) return;
  game.winner = "";
  game.message = "";
  game.userCard = {};
  game.compCard = {};
  user.innerHTML =
    "<img src='https://www.deckofcardsapi.com/static/img/back.png' />";
  comp.innerHTML =
    "<img src='https://www.deckofcardsapi.com/static/img/back.png' />";
  game.dealCards();
});

reveal.addEventListener("click", (e) => {
  e.preventDefault();
  if (this.gameOver) return;
  game.revealCards();
});

gameModeOptions.forEach((option) =>
  option.addEventListener("click", (e) => {
    e.preventDefault();
    if (this.gameOver) return;
    if (
      Array.from(gameModeOptions).find((option) =>
        option.classList.contains("active")
      )
    ) {
      Array.from(gameModeOptions)
        .find((option) => option.classList.contains("active"))
        .classList.remove("active");
    }
    game = new HighLow();
    game.startGame();
    e.target.classList.add("active");
    game.gameType = e.target.innerText.toLowerCase();
  })
);

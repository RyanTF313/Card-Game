const message = document.getElementById("message");
const start = document.getElementById("start");
const gameIdHeading = document.getElementById("game-id");
// const place = ["start", "draw", "discard", "next"];
const over = false;
let deck_id; // 'c4d2sumxr5xq' // get deck id from data fetch
// const deal = `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player}/add/?cards=${hand}`
// const draw = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`;
// const discard = `https://deckofcardsapi.com/api/deck/${deck_id}/pile/discard/add/?cards=${card}`
const userHand = [];
const compHand = [];
let userCards = [];
let compCards = [];
const user = document.querySelector("#user-hand ul");
const comp = document.querySelector("#comp-hand ul");
const deck = document.getElementById("deck");
const turn = true;

start.addEventListener("click", (e) => {
  e.preventDefault();
  // get a deck from api
  startGame();
  message.innerText = "Let the games begin! User it's your turn";
  deck.innerHTML =
    "<img id='backOfDeckImg' src='./card-back-black.png' alt='deck' />";
});

let startGame = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      deck_id = data.deck_id;
      return data;
    })
    .then((data) => {
      // draw a card to send to discard pile
      // drawCard(data)
      const { deck_id } = data;
      gameIdHeading.innerText += " " + deck_id;
      createhands(deck_id);
    });
};

let createhands = (deck) => {
  fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=10`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      // start discard pile
      //   startDiscard(data.deck_id, data.cards[0].code);
      const { cards } = data;
      cards.forEach((card, i) => {
        if (i % 2 === 0 || i === 0) {
          userHand.push(card);
        } else {
          compHand.push(card);
        }
      });
      user.innerHTML += userHand
        .map(
          (card) => `<li class="card">
      <img src=${card.image} />
      <input type="hidden" data-card-value="${card.value}" data-card-suit="${card.suit}" data-card-code="${card.code}"/>
      </li>`
        )
        .join("");
      comp.innerHTML += [...Array(5)]
        .map(
          () => `<li class="card">
      <img src="./card-back-black.png" />
      </li>`
        )
        .join("");
      document
        .querySelectorAll("#user-hand li")
        .forEach((card) => card.addEventListener("click", selectCard));
    });
};
let shuffleDeck = (deck) => {
  fetch(`https://deckofcardsapi.com/api/deck/${deck}/shuffle/`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
    });
};

let drawOneCard = () => {
  fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      // start discard pile
    //   startDiscard(data.deck_id, data.cards[0].code);
    console.log(data)
    });
};
// let startDiscard = (deck, cards) => {
//   fetch(
//     `https://deckofcardsapi.com/api/deck/${deck}/pile/discard/add/?cards=${cards}`,
//     {
//       method: "get",
//       headers: { "Content-Type": "application/json" },
//     }
//   )
//     .then((response) => {
//       if (response.ok) return response.json();
//     })
//     .then((data) => {
//       getLastDiscard(data.deck_id);
//     });
// };
// let getLastDiscard = (deck) => {
//   fetch(`https://deckofcardsapi.com/api/deck/${deck}/pile/discard/list/`, {
//     method: "get",
//     headers: { "Content-Type": "application/json" },
//   })
//     .then((response) => {
//       if (response.ok) return response.json();
//     })
//     .then((data) => {
//       // console.log(data);
//       let cards = data.piles.discard.cards;
//       document.getElementById("discard").src = cards[cards.length - 1].image;
//       start.style.display = "none";
//       // createHand(data.deck_id)
//     });
// };

// let createHand = (deck, cards, player) => {
//   fetch(
//     `https://deckofcardsapi.com/api/deck/${deck}/pile/${player}/add/?cards=${cards}`,
//     {
//       method: "get",
//       headers: { "Content-Type": "application/json" },
//     }
//   )
//     .then((response) => {
//       if (response.ok) return response.json();
//     })
//     .then((data) => {
//       // console.log(data);
//       // let cards = data.piles.discard.cards
//       // document.getElementById('discard').src = cards[cards.length - 1].image
//       // createHand(data.deck_id)
//     });
// };

const selectCard = (e) => {
  const img = e.target;
  const dataFrmInput = e.target.parentNode.childNodes[3].dataset;

  if (img.style.border === "") {
    img.style.border = "3px solid blue";
    userCards.push(dataFrmInput);
  } else {
    img.style.border = "";
    userCards = [
      ...userCards.filter(
        (card) => card.cardCode !== dataFrmInput.cardCode
      ),
    ];
  }
  console.log(img, dataFrmInput, userCards);
};

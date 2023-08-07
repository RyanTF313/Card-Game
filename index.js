// const user = document.getElementById('username').value;
const message = document.getElementById('message');
const start = document.getElementById('start');
const place = ['start','draw', 'discard', 'next'];
const over = false;
let deck_id; // 'c4d2sumxr5xq' // get deck id from data fetch 
// const deal = `https://deckofcardsapi.com/api/deck/${deck_id}/pile/${player}/add/?cards=${hand}`
const draw = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
// const discard = `https://deckofcardsapi.com/api/deck/${deck_id}/pile/discard/add/?cards=${card}`

start.addEventListener('click', (e)=>{
    e.preventDefault()
    // get a deck from api
    startGame()
    // message.innerHTML += `<h3> ${user} </h3>`    
})


let startGame = ()=>{
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            deck_id = data.deck_id
            return deck_id
        }).then( data => {
            // draw a card to send to discard pile
            drawCard(data)
        })
}
let shuffleDeck = (deck) => {
    // console.log(deck_id);
    
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/shuffle/`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            console.log(data)
        
        })
}
let drawCard = (deck) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            // start discard pile
            startDiscard(data.deck_id, data.cards[0].code)
        })
}
let startDiscard = (deck, cards) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/pile/discard/add/?cards=${cards}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            getLastDiscard(data.deck_id)
        })
}
let getLastDiscard = (deck)=>{
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/pile/discard/list/`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            // console.log(data);
            let cards = data.piles.discard.cards
            document.getElementById('discard').src = cards[cards.length - 1].image
            start.style.display = 'none'
            // createHand(data.deck_id)
        })
}

let createHand = (deck, cards, player) => {
    fetch(`https://deckofcardsapi.com/api/deck/${deck}/pile/${player}/add/?cards=${cards}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(data => {
            // console.log(data);
            // let cards = data.piles.discard.cards
            // document.getElementById('discard').src = cards[cards.length - 1].image
            // createHand(data.deck_id)
        })
}
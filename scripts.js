var item_elos = [];
var card1 = "";
var card2 = "";


function getElos() {
    return item_elos
        .map(item => ({
            name: item.name,
            elo: parseFloat(item.elo)
        }))
        .sort((a, b) => b.elo - a.elo);
}

function initElos(inp) {
    item_elos = [];
    inp.split('\n').forEach(line => {
        const parts = line.split('\t');
        const name = parts[0].trim();
        const elo = parseFloat(parts[parts.length - 1]) || 1000;
        item_elos.push({
            name: name,
            elo: elo
        });
    });
    console.log(getElos());
    updateCards();
}

function resetElos() {
    item_elos.forEach(item => {
        item.elo = 1000;
    });
    updateCards();
}

function updateCards() {
    const card1_idx = Math.floor(Math.random() * item_elos.length);
    let card2_idx = Math.floor(Math.random() * item_elos.length);
    while (card2_idx === card1_idx) {
        card2_idx = Math.floor(Math.random() * item_elos.length);
    }
    card1 = item_elos[card1_idx].name;
    card2 = item_elos[card2_idx].name;
    document.getElementById('cardTitle1').innerText = card1;
    document.getElementById('cardTitle2').innerText = card2;
    $('#CardDiv').removeClass('hidden').addClass('animate');
    $('#GetStarted').addClass('hidden');
    console.log(card1, card2);
}

function cardClick(winning_card_idx) {
    const winning_card = winning_card_idx === 0 ? card1 : card2;
    const losing_card = winning_card_idx === 0 ? card2 : card1;
    const winning_card_elo = item_elos.find(item => item.name === winning_card).elo;
    const losing_card_elo = item_elos.find(item => item.name === losing_card).elo;
    const new_elo = getNewRating(winning_card_elo, losing_card_elo, 1);
    item_elos.find(item => item.name === winning_card).elo = new_elo;
    item_elos.find(item => item.name === losing_card).elo = getNewRating(losing_card_elo, winning_card_elo, 0);
    console.log(getElos());
    updateCards();
}

// https://github.com/moroshko/elo.js/tree/master
function getRatingDelta(myRating, opponentRating, myGameResult) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
        return null;
    }

    var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(100 * (myGameResult - myChanceToWin));
}

function getNewRating(myRating, opponentRating, myGameResult) {
    return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
}


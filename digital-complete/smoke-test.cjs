const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const path = require("node:path");
const root = path.resolve(__dirname, "..");

class Element {
  constructor(id = "") {
    Object.assign(this, { id, innerHTML: "", textContent: "", value: "", listeners: {}, dataset: {} });
    this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } };
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  setAttribute() {}
  replaceChildren() {}
  showModal() { this.open = true; }
  close() { this.open = false; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
}

const ids = ["app", "toast", "newGameBtn", "choiceDialog", "choiceTitle", "choiceText", "choiceOptions", "manualDialog", "manualTitle", "manualRule", "manualHelp", "manualTips", "manualAppeal", "manualSP", "manualDone", "playerCount", "modeSelect", "playerChoices", "soloChoices", "countWrap", "difficulty", "houseQueen", "personality", "stageRules", "startGame", "pname0", "pname1", "pname2", "pname3", "pname4", "pqueen0", "pqueen1", "pqueen2", "pqueen3", "pqueen4", "saveBtn", "newGameBtn2", "specialBtn", "phaseMain", "slayBtn", "passBtn", "duelHouse", "playAgain"];
const elements = Object.fromEntries(ids.map((id) => [id, new Element(id)]));
Object.assign(elements.playerCount, { value: "2" });
const document = {
  querySelector(selector) { return elements[selector.replace(/^#/, "")] || null; },
  querySelectorAll() { return []; },
};
const values = new Map();
const localStorage = {
  getItem(key) { return values.get(key) || null; },
  setItem(key, value) { values.set(key, String(value)); },
  removeItem(key) { values.delete(key); },
};
const context = { window: {}, document, localStorage, Math, Date, JSON, Number, String, Array, Object, Set, RegExp, confirm: () => true, console, setTimeout() {} };
vm.createContext(context);
for (const relativePath of ["digital-playtest/data.js", "digital-complete/rules.js"]) {
  const filePath = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: relativePath });
}
const appSource = fs.readFileSync(path.join(__dirname, "app.js"), "utf8").replace(
  "load(); render();",
  "load(); render(); window.__hh = { get: () => game, startGame, playFromHand, claimStage, passStage, finishTurn, doReveal, buyCard, finishShopping, houseScore };"
);
vm.runInContext(appSource, context, { filename: "digital-complete/app.js" });
const app = context.window.__hh;
const data = context.window.HH_DATA;
const rules = context.window.HH_RULES;

assert.equal(data.cards.length, 240);
assert.equal(data.cards.filter((card) => card.component === "Wardrobe").length, 144);
assert.equal(data.stages.length, 12);
assert.equal(data.automa.length, 18);

app.startGame({ mode: "multi", players: [{ name: "A", queen: "Q-01" }, { name: "B", queen: "Q-02" }], stageRules: "beginner" });
let game = app.get();
assert.equal(game.players.length, 2);
assert.equal(game.players[0].hand.length, 5);
assert.equal(game.rack.filter(Boolean).length, 5);
const playedCard = game.players[0].hand.find((card) => card.name === "Basic Beat");
app.playFromHand(playedCard.instanceId, false);
assert.equal(game.players[0].tips, 1);
assert.equal(elements.manualDialog.open, undefined, "No additional effect does not open manual resolution");
game.players[0].grossSP = 29;
app.claimStage(0);
assert.equal(game.phase, "finished", "30 Gross SP ends the game at Curtain Call");
assert.equal(game.finalScores[0].name, "A");
assert.equal(game.players[1].masters.Face, null);
assert.equal(game.winners[0], "A");

app.startGame({ mode: "multi", players: [{ name: "Hotseat A", queen: "Q-01" }, { name: "Hotseat B", queen: "Q-02" }], stageRules: "full" });
game = app.get();
game.stageDeck = [];
const firstStage = game.activeStage;
app.passStage();
assert.equal(game.currentPlayer, 1, "passing gives the next player their turn on the same Stage");
assert.equal(game.players[0].hand.length, 5, "Cleanup draws a fresh hand");
game.players[1].currentLook = { total: firstStage.target + 1 };
game.players[1].spotlightMet = true;
game.phase = "stage";
app.claimStage(1);
assert.equal(game.phase, "finished", "empty Stage Deck ends the standard circuit");
assert.equal(game.players[1].trophies, 1);
assert.equal(game.players[0].trophies, 0);

app.startGame({ mode: "solo", players: [{ name: "Solo", queen: "Q-01" }], houseQueen: "Q-02", difficulty: "working", stageRules: "beginner", personality: "Treasure From Trash" });
game = app.get();
game.activeStage = { ...game.activeStage, target: 99 };
game.house.current = data.automa.find((card) => card.name === "House Always Wins");
game.house.roundScore = null;
game.phase = "stage";
app.passStage();
assert.equal(game.house.grossSP, 1, "House Always Wins earns SP when neither side Slays");
assert.equal(game.stageRound, 2);
assert.equal(game.players[0].hand.length, 5);

game.activeStage = { ...game.activeStage, target: 99 };
game.house.current = data.automa.find((card) => card.name === "House Always Wins");
game.house.roundScore = null;
game.phase = "stage";
game.stageRound = 4;
const reward = game.activeStage.reward;
app.passStage();
assert.equal(game.house.grossSP, reward + 2, "fourth-round timeout awards Stage SP and House Always Wins SP");
assert.equal(game.stageRound, 1);
assert.ok(game.activeStage);
assert.equal(game.players[0].hand.length, 5);

const testPlayer = rules.makePlayer("Test", data.queens[0], data.cards);
for (const slot of rules.CORE_SLOTS) {
  testPlayer.masters[slot] = rules.cardInstance(data.cards.find((card) => card.component === "Wardrobe" && card.slot === slot && card.tenet === "Yellow"));
}
const look = rules.look(testPlayer, { id: "STG-X" });
assert.equal(look.multiplier, 3);
assert.equal(look.perfect, true);

console.log("Passed: canonical card data, multiplayer pass / cleanup / Stage claim / circuit end, 30-SP end trigger, solo four-round timeout and House bonus, and Perfect Illusion scoring.");

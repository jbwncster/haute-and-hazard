(() => {
  "use strict";
  const DATA = window.HH_DATA;
  const R = window.HH_RULES;
  const $ = (q) => document.querySelector(q);
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  const COLORS = { Pink: "#eb65b8", Blue: "#65b9ea", Purple: "#b28af2", Yellow: "#f3d056", Neutral: "#b5aebb", None: "#b5aebb" };
  const DIFFICULTY = { local: { label: "Local Girl", appeal: -2, ls: -1 }, working: { label: "Working Queen", appeal: 0, ls: 0 }, headliner: { label: "Headliner", appeal: 1, ls: 0 }, legend: { label: "Legend", appeal: 2, ls: 1 } };
  const PHASE_NAMES = { transformation: "Transformation", reveal: "The Reveal", shopping: "Shopping", stage: "Slay / Dragdagulan† / Pass", cleanup: "Cleanup", finished: "Final Judging" };
  const PERSONALITIES = ["Treasure From Trash", "Idol Perfect", "From the Grave", "More Is More", "Toxic Entrance", "Duality", "Perfect Geometry", "Sugar High", "Built to Walk", "Full Spectrum", "Sacrifice", "Final Girl"];
  let game = null;
  let pendingManual = null;

  function log(message, kind = "") { game.log.unshift({ message, kind, time: Date.now() }); game.log = game.log.slice(0, 70); }
  function cardColor(card) { return COLORS[card?.tenet] || COLORS.Neutral; }
  function notify(message) { const el = $("#toast"); if (!el) return; el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 1800); }
  function activePlayer() { return game?.players[game.currentPlayer]; }
  function currentStage() { return game?.activeStage || null; }
  function save() { try { if (game) localStorage.setItem("hhCompleteSave", JSON.stringify(game)); } catch {} }

  function startGame(config) {
    const wardrobeDeck = R.shuffle(DATA.cards.filter((c) => c.component === "Wardrobe").map(R.cardInstance));
    const stageDeck = R.shuffle(DATA.stages);
    const players = config.players.map((p, i) => R.makePlayer(p.name || `Player ${i + 1}`, DATA.queens.find((q) => q.id === p.queen), DATA.cards));
    game = {
      version: "v7.9-complete-1.0", mode: config.mode, difficulty: config.difficulty, stageRules: config.stageRules,
      players, currentPlayer: 0, stageDeck, activeStage: stageDeck.shift(), rack: wardrobeDeck.splice(0, 5), wardrobeDeck,
      thrift: R.shuffle(DATA.cards.filter((c) => c.component === "Thrift").map(R.cardInstance)), penalties: R.shuffle(DATA.cards.filter((c) => c.component === "Penalty").map(R.cardInstance)),
      phase: "transformation", stageRound: 1, purchasesThisTurn: 0, firstPurchaseSurcharge: 0, maxPurchases: 99, house: config.mode === "solo" ? { queen: DATA.queens.find((q) => q.id === config.houseQueen), wardrobe: [], grossSP: 0, trophies: 0, deck: R.shuffle(DATA.automa), discard: [], current: null, removed: null, personality: config.personality || null, malfunctions: 0, chops: 0, matchTokens: 0, bargainTokens: 0, personalityAppeal: 0, personalitySPUsed: false, carriedAppeal: 0, graveUsedThisStage: false } : null,
      log: [], createdAt: Date.now(), finalScores: null,
    };
    if (game.mode === "solo") revealAutoma();
    log(`<strong>${esc(players[0].name)}</strong> opens the circuit as <strong>${esc(players[0].queen.name)}</strong>.`);
    save(); render();
  }

  function revealAutoma() {
    if (!game.house.deck.length) { game.house.deck = R.shuffle(game.house.discard); game.house.discard = []; }
    game.house.current = game.house.deck.shift() || DATA.automa[0];
    game.house.personalityAppeal = game.house.carriedAppeal || 0;
    game.house.carriedAppeal = 0; game.house.toxicTriggered = false; game.house.roundScore = null;
    if (game.house.carriedAutoma) { game.house.discard.push(game.house.carriedAutoma); game.house.carriedAutoma = null; game.house.personalityAppeal++; }
    const choices = game.rack.map((card, i) => card ? { card, i } : null).filter(Boolean);
    const rule = game.house.current.remove;
    const by = (field, desc = true) => [...choices].sort((a, b) => (Number(b.card[field] || 0) - Number(a.card[field] || 0)) * (desc ? 1 : -1) || a.i - b.i)[0];
    let picked = choices[0];
    if (rule === "leftmost") picked = choices[0];
    else if (rule === "rightmost") picked = choices.at(-1);
    else if (rule === "highestCost") picked = by("cost");
    else if (rule === "lowestCost") picked = by("cost", false);
    else if (rule === "highestAppeal") picked = by("appeal");
    else if (rule === "highestTips") picked = by("tips");
    else if (rule === "highestLS") picked = by("ls");
    else if (rule === "lowestLS") picked = by("ls", false);
    else if (rule === "featuredBrand") picked = choices.find((x) => x.card.brand === game.activeStage.brand) || by("cost");
    else if (rule === "signatureTenet") picked = choices.find((x) => x.card.tenet === activePlayer().queen.tenet) || by("cost");
    else if (rule === "missingSlot") { const missing = R.CORE_SLOTS.find((slot) => !game.house.wardrobe.some((c) => c.slot === slot)); picked = choices.find((x) => x.card.slot === missing) || choices[0]; }
    else if (rule === "cost4plusRight") picked = [...choices].reverse().find((x) => x.card.cost >= 4) || choices.at(-1);
    else if (rule === "newestMasterSlot") picked = choices.find((x) => x.card.slot === activePlayer().newestMasterSlot) || choices[0];
    if (picked) { game.house.removed = game.rack[picked.i]; game.rack[picked.i] = null; game.house.wardrobe.push(game.house.removed); }
    else game.house.removed = null;
    applyPersonalityRemoval();
    if (game.house.current.name === "Sample Sale Snatch" && game.house.removed?.cost <= 2) {
      game.house.bargainTokens++;
      if (game.house.bargainTokens >= 2) { houseGainSP(); game.house.bargainTokens = 0; }
    }
    game.maxPurchases = game.house.current.name === "VIP Rope" ? 1 : 99;
    game.firstPurchaseSurcharge = game.house.current.name === "Sold Out" ? 1 : 0;
    if (game.house.personality === "From the Grave" && game.house.carriedAutoma) game.house.personalityAppeal++;
    if (game.house.personality === "Sugar High" && game.house.removed?.tenet === "Pink" && game.house.removed?.slot === "Shoes") {
      if (!game.house.deck.length) { game.house.deck = R.shuffle(game.house.discard); game.house.discard = []; }
      const extra = game.house.deck.shift();
      if (extra) {
        if (extra.appeal > game.house.current.appeal) { game.house.discard.push(game.house.current); game.house.current = extra; }
        else game.house.discard.push(extra);
      }
    }
    refillRack();
    log(`House reveals <b>${esc(game.house.current.name)}</b>${game.house.removed ? ` and removes <b>${esc(game.house.removed.name)}</b> from the Rack` : ""}.`, "house");
  }

  function applyPersonalityRemoval() {
    const h = game.house; const card = h.removed; if (!card || !h.personality) return;
    if (h.personality === "Treasure From Trash" && card.cost <= 2) h.personalityAppeal++;
    if (h.personality === "Idol Perfect" && card.tenet === "Pink") { h.matchTokens++; if (h.matchTokens >= 3) { houseGainSP(); h.matchTokens = 0; } }
    if (h.personality === "Toxic Entrance" && card.tenet === "Blue" && !h.toxicTriggered && activePlayer().hand.length) { activePlayer().archive.push(activePlayer().hand.shift()); h.toxicTriggered = true; }
    if (h.personality === "Duality") {
      const colors = new Set(h.wardrobe.map((c) => c.tenet).filter((t) => t && t !== "Neutral" && t !== "None"));
      h.personalityAppeal += colors.size >= 4 ? 2 : colors.size >= 2 ? 1 : 0;
    }
    if (h.personality === "Built to Walk" && card.slot === "Shoes") h.personalityAppeal++;
    if (h.personality === "Full Spectrum" && !h.personalitySPUsed && R.CORE_SLOTS.every((slot) => h.wardrobe.some((c) => c.slot === slot))) { houseGainSP(); h.personalitySPUsed = true; }
  }

  function refillRack() { for (let i = 0; i < game.rack.length; i++) if (!game.rack[i] && game.wardrobeDeck.length) game.rack[i] = game.wardrobeDeck.shift(); }
  function takePenalty(needle) {
    const i = game.penalties.findIndex((c) => c.name.toLowerCase().includes(needle));
    return i >= 0 ? game.penalties.splice(i, 1)[0] : null;
  }
  function houseGainSP(amount = 1) {
    if (!game.house || amount <= 0) return;
    game.house.grossSP += amount;
    if (game.house.personality === "Perfect Geometry") game.house.carriedAppeal++;
  }
  function playerGainSP(player, amount = 1) {
    player.grossSP += amount;
    if (amount > 0 && player.queen.id === "Q-07") player.tips += amount;
  }
  function pushManual(title, text, context) {
    pendingManual = context;
    $("#manualTitle").textContent = title;
    $("#manualRule").textContent = text;
    $("#manualHelp").textContent = "Resolve the card text using the physical rules. Enter any net resource changes that the app cannot infer; make card moves in the visible zones where possible.";
    $("#manualTips").value = 0; $("#manualAppeal").value = 0; $("#manualSP").value = 0;
    $("#manualDialog").showModal();
  }

  function manualDone(event) {
    event?.preventDefault();
    if (!pendingManual) { $("#manualDialog").close(); return; }
    const p = game.players[pendingManual.playerIndex];
    p.tips = Math.max(0, p.tips + Number($("#manualTips").value || 0));
    const addedAppeal = Number($("#manualAppeal").value || 0);
    p.appeal = Math.max(0, p.appeal + addedAppeal);
    if (p.currentLook && addedAppeal) { p.currentLook.appeal += addedAppeal; p.currentLook.total = p.currentLook.appeal * p.currentLook.multiplier; }
    playerGainSP(p, Number($("#manualSP").value || 0));
    log(`Manual resolution recorded for ${esc(pendingManual.label)}.`, "manual");
    pendingManual = null; $("#manualDialog").close(); save(); render();
  }

  function applySimpleText(player, card, trigger) {
    const text = card.text || "";
    const line = text.split(/\n|(?<=\.)\s+/).find((part) => part.trim().toLowerCase().startsWith(`${trigger.toLowerCase()}:`));
    if (!line) return false;
    if (/\b(archive|trash|discard|choose|look at|put (?:it|one|the)|return up to|opponent|target)\b/i.test(line)) {
      pushManual(card.name, line, { playerIndex: game.currentPlayer, label: card.name });
      return true;
    }
    let used = false;
    for (const match of line.matchAll(/Gain (\d+) (Tips?|Appeal|Gross SP)/gi)) {
      const amount = Number(match[1]); const what = match[2].toLowerCase();
      if (what.startsWith("tip")) player.tips += amount + (amount > 0 && player.queen.id === "Q-04" ? 1 : 0);
      else if (what === "appeal") player.appeal += amount;
      else playerGainSP(player, amount);
      used = true;
    }
    const draw = /draw (\d+) cards?/i.exec(line);
    if (draw) { R.draw(player, Number(draw[1])); used = true; }
    if (/no additional effect/i.test(line)) used = true;
    if (!used && !/^(play|equip):\s*(you may equip|equip this|no additional effect)/i.test(line)) {
      pushManual(card.name, line, { playerIndex: game.currentPlayer, label: card.name });
      used = true;
    }
    return used;
  }

  async function playFromHand(instanceId, equip) {
    if (game.phase !== "transformation") return;
    const p = activePlayer(); const index = p.hand.findIndex((c) => c.instanceId === instanceId); if (index < 0) return;
    const card = p.hand.splice(index, 1)[0];
    const printed = Number(card.tips || 0); p.tips += printed;
    if (printed > 0 && p.queen.id === "Q-04") p.tips++;
    if (equip && card.type === "Fashion" && card.slot && card.slot !== "none") {
      const old = p.masters[card.slot]; if (old) p.archive.push(old);
      p.masters[card.slot] = card; p.newestMasterSlot = card.slot;
      log(`<b>${esc(p.name)}</b> equips ${esc(card.name)} as ${esc(card.slot)} Master; +${printed} Tips.`, "good");
      const handled = p.queen.id === "Q-05" && card.brand === "Necropolis" && card.slot === "Body" ? true : applySimpleText(p, card, "Equip");
      if (!handled && card.text && !/^Equip:\s*(?:You may archive|No additional effect)/i.test(card.text)) pushManual(card.name, card.text, { playerIndex: game.currentPlayer, label: card.name });
      if (p.queen.id === "Q-08" && card.brand === "Sugar Rush" && card.slot === "Shoes") R.draw(p, 1);
      if (p.queen.id === "Q-09" && card.slot === "Shoes") p.tips++;
      if (p.queen.id === "Q-05" && card.brand === "Necropolis" && card.slot === "Body" && game.players.length > 1) {
        const rivals = game.players.map((target, i) => ({ target, i })).filter(({ target }) => target !== p && target.hand.length);
        if (rivals.length) {
          const targetIndex = Number(await choose("Toxic Entrance", "Choose an opponent to discard 1 card.", rivals.map(({ target, i }) => ({ label: target.name, value: i }))));
          const target = game.players[targetIndex];
          const cardId = await choose("Choose the card to discard", `${target.name} reveals their hand.`, target.hand.map((c) => ({ label: c.name, value: c.instanceId })));
          const at = target.hand.findIndex((c) => c.instanceId === cardId); if (at >= 0) target.archive.push(target.hand.splice(at, 1)[0]);
        }
      }
    } else {
      p.played.push(card);
      log(`<b>${esc(p.name)}</b> plays ${esc(card.name)} for ${printed} printed Tips.`, "good");
      const handled = applySimpleText(p, card, "Play");
      if (!handled && card.text && !/^Play:\s*(?:No additional effect|You may equip)/i.test(card.text)) pushManual(card.name, card.text, { playerIndex: game.currentPlayer, label: card.name });
    }
    save(); render();
  }

  function revealStageOptions(p, stage) {
    if (stage.id === "STG-07") {
      const options = [p.masters.Face, p.masters.Wig].filter(Boolean);
      if (options.length) return choose("Opera House", "Choose a Face or Wig Master to gain +2 Appeal this Reveal.", options.map((c) => ({ label: c.name, value: c.instanceId }))).then((id) => ({ selectedMasterId: id }));
    }
    if (stage.id === "STG-03") {
      const options = Object.values(p.masters).filter((c) => c?.tenet === "Blue");
      if (options.length) return choose("Haunted Hotel", "Choose a Blue Master to count as Wild for this Reveal, then assign its Tenet.", options.map((c) => ({ label: `${c.name} — ${c.slot}`, value: c.instanceId }))).then((id) => ({ wildMasterId: id }));
    }
    return Promise.resolve({});
  }

  function choose(title, text, options) {
    return new Promise((resolve) => {
      $("#choiceTitle").textContent = title; $("#choiceText").textContent = text;
      $("#choiceOptions").innerHTML = options.map((o, i) => `<button type="button" class="choice-option" data-choice="${esc(o.value)}">${esc(o.label)}</button>`).join("");
      $("#choiceOptions").querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => { const value = b.dataset.choice; $("#choiceDialog").close(); resolve(value); }));
      $("#choiceDialog").showModal();
    });
  }

  async function doReveal() {
    if (game.phase !== "reveal") return;
    const p = activePlayer(); const stage = currentStage();
    const opts = await revealStageOptions(p, stage);
    if (opts.wildMasterId) {
      const card = Object.values(p.masters).find((c) => c?.instanceId === opts.wildMasterId);
      const tenets = ["Pink", "Blue", "Purple", "Yellow"].filter((t) => t !== card.tenet);
      const chosen = await choose("Assign a Wild Tenet", `${card.name} counts as Wild. Choose its Tenet for this Reveal.`, tenets.map((t) => ({ label: t, value: t })));
      opts.wildTenet = chosen;
    }
    const view = opts.wildMasterId ? { ...p, masters: { ...p.masters } } : p;
    if (opts.wildMasterId && opts.wildTenet) {
      const slot = Object.keys(view.masters).find((key) => view.masters[key]?.instanceId === opts.wildMasterId);
      view.masters[slot] = { ...view.masters[slot], tenet: opts.wildTenet };
    }
    if (stage.id === "STG-09") p.tips += Object.values(p.masters).filter((c) => c?.brand === "Sugar Rush").length;
    p.currentLook = R.look(view, stage, opts);
    p.appeal = p.currentLook.appeal;
    if (p.currentLook.perfect) p.untouchable = true;
    if (game.stageRules === "full") {
      const spotlight = R.spotlightMet(p, stage);
      p.spotlightMet = spotlight;
      if (spotlight === null) pushManual("Spotlight Requirement", stage.spotlight, { playerIndex: game.currentPlayer, label: "Spotlight Requirement" });
    } else p.spotlightMet = true;
    if (p.queen.id === "Q-02" && p.currentLook.matching && !p.oncePerRound.kawaii) { playerGainSP(p); p.oncePerRound.kawaii = true; R.draw(p, 1); }
    if (p.queen.id === "Q-06" && p.currentLook.complete && new Set(p.currentLook.tenets).size >= 2 && !p.oncePerRound.duality) { p.tips += 2; p.oncePerRound.duality = true; }
    if (p.queen.id === "Q-07" && p.masters.Accessory && !p.oncePerRound.hexa) { playerGainSP(p); p.oncePerRound.hexa = true; }
    if (p.queen.id === "Q-10" && p.currentLook.complete && !p.oncePerRound.opal) { playerGainSP(p, 2); p.oncePerRound.opal = true; }
    const revealText = [...Object.values(p.masters).filter(Boolean), ...p.played].filter((card) => /\bReveal:/i.test(card.text || "")).map((card) => `${card.name}: ${(card.text || "").split(/\bReveal:\s*/i)[1] || card.text}`).join("\n");
    if (revealText) pushManual("Reveal card effects", revealText, { playerIndex: game.currentPlayer, label: "Reveal card effects" });
    log(`${esc(p.name)} reveals ${p.currentLook.appeal} Appeal × ${p.currentLook.multiplier} = <b>${p.currentLook.total}</b>${p.currentLook.perfect ? " — PERFECT ILLUSION" : p.currentLook.matching ? " — MATCHING LOOK" : p.currentLook.complete ? " — COMPLETE" : " — INCOMPLETE"}.`);
    game.phase = "shopping"; save(); render();
  }

  function buyCard(instanceId, source = "rack") {
    if (game.phase !== "shopping") return;
    const p = activePlayer(); const list = source === "thrift" ? game.thrift : game.rack;
    const i = list.findIndex((c) => c?.instanceId === instanceId); if (i < 0) return;
    const card = list[i]; const surcharge = game.mode === "solo" && game.purchasesThisTurn === 0 ? game.firstPurchaseSurcharge : 0; const cost = card.cost + surcharge;
    if (game.mode === "solo" && game.purchasesThisTurn >= game.maxPurchases) { notify("VIP Rope allows one purchase this turn."); return; }
    if (p.tips < cost) { notify("Not enough Tips."); return; }
    p.tips -= cost; p.archive.push(card); list[i] = null; game.purchasesThisTurn++;
    log(`${esc(p.name)} buys ${esc(card.name)} for ${cost} Tips.`, "good"); save(); render();
  }

  function finishShopping() { if (game.phase !== "shopping") return; game.phase = "stage"; save(); render(); }

  function canSlay(p, stage) {
    return p.currentLook && p.currentLook.total >= stage.target && p.spotlightMet !== false;
  }

  function claimStage(playerIndex) {
    const p = game.players[playerIndex]; const stage = currentStage();
    playerGainSP(p, stage.reward); p.trophies++;
    if (game.stageRules === "full") {
      playerGainSP(p, Number((/\+(\d+) Gross SP/i.exec(stage.favor) || [])[1] || 0));
      if (R.CORE_SLOTS.every((slot) => p.masters[slot]?.brand === stage.brand)) playerGainSP(p, Number((/\+(\d+) Gross SP/i.exec(stage.ovation) || [])[1] || 0));
    }
    log(`<strong>${esc(p.name)} Slays ${esc(stage.name)}!</strong> +${stage.reward} Stage Gross SP.`, "good");
    game.lastClaimant = playerIndex;
    curtainCall(playerIndex);
  }

  function cleanupPlayer(p, drawFive = true) {
    if (p.masters.Accessory) { p.archive.push(p.masters.Accessory); p.masters.Accessory = null; }
    p.archive.push(...p.played, ...p.hand); p.played = []; p.hand = [];
    p.tips = 0; p.appeal = 0; p.currentLook = null; p.spotlightMet = true; p.oncePerRound = {};
    if (drawFive) R.draw(p, 5);
  }

  function curtainCall(claimant) {
    game.players.forEach((p) => {
      for (const slot of R.CORE_SLOTS) { if (p.masters[slot]) p.archive.push(p.masters[slot]); p.masters[slot] = null; }
      if (p.masters.Accessory) { p.archive.push(p.masters.Accessory); p.masters.Accessory = null; }
      p.untouchable = false;
    });
    cleanupPlayer(game.players[claimant], true);
    if (game.mode === "solo" && game.house.current) game.house.discard.push(game.house.current);
    const reached = game.players.some((p) => p.grossSP >= 30);
    const next = game.stageDeck.shift() || null;
    if (reached || !next) { finishGame(); return; }
    game.activeStage = next; game.stageRound = 1;
    game.purchasesThisTurn = 0;
    if (game.house) { game.house.graveUsedThisStage = false; game.house.personalitySPUsed = false; }
    game.currentPlayer = (claimant + 1) % game.players.length;
    game.players.forEach((p) => { p.oncePerRound = {}; });
    if (game.mode === "solo") revealAutoma();
    game.phase = "transformation";
    log(`Curtain Call. ${esc(game.players[game.currentPlayer].name)} opens ${esc(next.name)}.`);
    save(); render();
  }

  function finishTurn() {
    const p = activePlayer();
    if (game.mode === "solo") {
      const score = houseScore(); const didHouseSlay = score >= currentStage().target; const timeout = game.stageRound >= 4;
      if (!didHouseSlay && !timeout && game.house.current?.name === "House Always Wins") houseGainSP();
      cleanupPlayer(p, true);
      if (game.house.personality === "From the Grave" && !game.house.graveUsedThisStage && !timeout) {
        game.house.carriedAutoma = game.house.current; game.house.graveUsedThisStage = true;
      } else if (game.house.current) game.house.discard.push(game.house.current);
      game.currentPlayer = 0;
      if (timeout) { claimStageHouse(true); return; }
      game.stageRound++; game.phase = "transformation"; game.purchasesThisTurn = 0; revealAutoma();
    } else {
      cleanupPlayer(p, true);
      refillRack();
      game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
      game.phase = "transformation";
      game.players[game.currentPlayer].oncePerRound = {};
    }
    save(); render();
  }

  function houseScore() {
    const h = game.house; const stage = currentStage(); const card = h.current;
    if (h.roundScore !== null) return h.roundScore;
    const penalty = card.name === "Read to Filth" ? 1 : 0;
    let score = R.houseAppeal(stage, card, game.difficulty, { removed: h.removed, wardrobe: h.wardrobe, trophies: h.trophies, round: game.stageRound, penalty }) + Number(h.personalityAppeal || 0);
    if (h.personality === "More Is More" && h.removed && score > Math.max(0, stage.target - 6) + Number(card.appeal || 0) + DIFFICULTY[game.difficulty].appeal) score++;
    if (h.personality === "Sacrifice" && !h.personalitySPUsed && score < stage.target && stage.target - score <= 2) {
      if (!h.deck.length) { h.deck = R.shuffle(h.discard); h.discard = []; }
      if (h.deck.length) { h.discard.push(h.deck.shift()); score += 2; h.personalitySPUsed = true; }
    }
    h.roundScore = Math.max(0, score);
    return h.roundScore;
  }

  function passStage() {
    if (game.mode === "solo") {
      const score = houseScore(); const stage = currentStage();
      log(`House Appeal: ${score} vs target ${stage.target}.`, "house");
      if (score >= stage.target || game.stageRound >= 4) claimStageHouse();
      else finishTurn();
    } else finishTurn();
  }

  function claimStageHouse(alreadyCleaned = false) {
    const stage = currentStage(); const score = houseScore();
    houseGainSP(stage.reward); game.house.trophies++;
    if (game.house.current?.name === "House Always Wins" && score < stage.target) houseGainSP();
    log(`House claims ${esc(stage.name)} for +${stage.reward} Gross SP.`, "house");
    const claimant = 0;
    game.players.forEach((p) => { for (const slot of R.CORE_SLOTS) { if (p.masters[slot]) p.archive.push(p.masters[slot]); p.masters[slot] = null; } if (p.masters.Accessory) { p.archive.push(p.masters.Accessory); p.masters.Accessory = null; } });
    if (!alreadyCleaned) cleanupPlayer(activePlayer(), true);
    if (!alreadyCleaned && game.house.current) game.house.discard.push(game.house.current);
    const next = game.stageDeck.shift() || null;
    if (!next || game.players[0].grossSP >= 30) { finishGame(); return; }
    game.activeStage = next; game.stageRound = 1; game.purchasesThisTurn = 0; game.currentPlayer = claimant;
    game.house.graveUsedThisStage = false; game.house.personalitySPUsed = false;
    revealAutoma(); game.phase = "transformation"; log(`Curtain Call. New Stage: ${esc(next.name)}.`); save(); render();
  }

  function finishGame() {
    game.phase = "finished";
    game.finalScores = game.players.map((p) => ({ name: p.name, queen: p.queen.name, grossSP: p.grossSP, finalSP: R.finalScore(p), trophies: p.trophies, penalties: R.ownCards(p).reduce((n, c) => n + R.penaltyValue(c), 0), tipCost: R.ownCards(p).filter((c) => c.component !== "Penalty").reduce((n, c) => n + Number(c.cost || 0), 0) }));
    if (game.house) game.finalScores.push({ name: "The House", queen: game.house.queen.name, grossSP: game.house.grossSP, finalSP: game.house.grossSP - game.house.malfunctions - game.house.chops, trophies: game.house.trophies, penalties: game.house.malfunctions + game.house.chops, tipCost: 0, house: true });
    game.finalScores.sort((a, b) => b.finalSP - a.finalSP || b.trophies - a.trophies || a.penalties - b.penalties || b.tipCost - a.tipCost);
    const first = game.finalScores[0];
    game.winners = game.finalScores.filter((x) => x.finalSP === first.finalSP && x.trophies === first.trophies && x.penalties === first.penalties && x.tipCost === first.tipCost).map((x) => x.name);
    game.houseTiebreakNeedsReview = Boolean(game.house && game.winners.includes("The House") && game.winners.length > 1);
    save(); render();
  }

  async function beginPhase4() {
    const p = activePlayer(); const stage = currentStage();
    if (canSlay(p, stage)) {
      if (await askYesNo("Slay the Stage?", `Claim ${stage.name} for ${stage.reward} Gross SP?`)) claimStage(game.currentPlayer);
      else { game.phase = "stage"; render(); }
    } else passStage();
  }

  function askYesNo(title, text) {
    return choose(title, text, [{ label: "Yes, Slay", value: "yes" }, { label: "No, continue", value: "no" }]).then((v) => v === "yes");
  }

  async function dragBattle(targetIndex) {
    const player = activePlayer(); const pCards = R.draw(player, 3); let pScore = pCards.reduce((n, c) => n + Number(c.ls || 0), 0);
    if (currentStage().id === "STG-08") pScore += pCards.length;
    if (currentStage().id === "STG-12") pScore += pCards.filter((c) => c.brand === "Hyper-Glitch").length;
    let rivalScore = 0; let rivalName = "";
    if (game.mode === "solo") {
      const h = game.house; rivalName = "The House";
      const pulled = [];
      for (let i = 0; i < 3; i++) { if (!h.deck.length) { h.deck = R.shuffle(h.discard); h.discard = []; } if (h.deck.length) pulled.push(h.deck.shift()); }
      h.discard.push(...pulled); rivalScore = Math.max(0, pulled.reduce((n, c) => n + Number(c.ls || 0), 0) + DIFFICULTY[game.difficulty].ls);
      if (h.current?.name === "Lip Sync Assassin") rivalScore++;
    } else {
      const rival = game.players[targetIndex]; rivalName = rival.name;
      const cards = R.draw(rival, 3); rivalScore = cards.reduce((n, c) => n + Number(c.ls || 0), 0);
      rival.archive.push(...cards);
    }
    player.archive.push(...pCards);
    log(`${esc(player.name)} challenges ${esc(rivalName)}: ${pScore}–${rivalScore}.`, pScore >= rivalScore ? "good" : "house");
    if (pScore > rivalScore) {
      if (game.mode === "solo") {
        const choice = await choose("You win the battle", "Choose a solo winner reward.", [{ label: "Steal 1 House Gross SP", value: "steal" }, { label: "Give House a Wardrobe Malfunction (−1 final SP)", value: "malfunction" }]);
        if (choice === "steal" && game.house.grossSP > 0) game.house.grossSP--;
        else if (game.house.malfunctions < 20) game.house.malfunctions++;
      } else {
        const loser = game.players[targetIndex]; const chop = takePenalty("chop"); if (chop) loser.archive.push(chop);
        const choice = await choose("You win the battle", "Choose your winner reward.", [{ label: "Steal 1 Gross SP", value: "steal" }, { label: "Give a Wardrobe Malfunction", value: "malfunction" }]);
        if (choice === "steal" && loser.grossSP > 0) { loser.grossSP--; playerGainSP(player); }
        else { const malf = takePenalty("malfunction"); if (malf) loser.archive.push(malf); }
      }
      if (player.queen.id === "Q-12") playerGainSP(player, pScore - rivalScore >= 3 ? 2 : 1);
    } else if (rivalScore > pScore) {
      if (game.mode === "solo") {
        if (game.house.personality === "Final Girl") houseGainSP(rivalScore - pScore >= 3 ? 2 : 1);
        if (game.house.current?.name === "She Knows Every Word" && player.grossSP > 0) { player.grossSP--; houseGainSP(); }
        else if (game.house.current?.name === "Death Drop" && rivalScore - pScore >= 3) {
          const penalty = takePenalty("chop");
          if (penalty) player.archive.push(penalty);
          else if (player.grossSP > 0) { player.grossSP--; houseGainSP(); }
        } else if (game.house.current?.name === "Wardrobe Malfunction") {
          const penalty = takePenalty("malfunction");
          if (penalty) player.archive.push(penalty);
          else if (player.grossSP > 0) { player.grossSP--; houseGainSP(); }
        } else if (player.grossSP > 0) { player.grossSP--; houseGainSP(); }
        else if (game.penalties.length) { const penalty = takePenalty("malfunction") || game.penalties.pop(); player.archive.push(penalty); }
      } else {
        const winner = game.players[targetIndex]; const chop = takePenalty("chop"); if (chop) player.archive.push(chop);
        const choice = await choose(`${winner.name} wins the battle`, "Choose a winner reward.", [{ label: "Steal 1 Gross SP", value: "steal" }, { label: "Give a Wardrobe Malfunction", value: "malfunction" }]);
        if (choice === "steal" && player.grossSP > 0) { player.grossSP--; playerGainSP(winner); }
        else { const malf = takePenalty("malfunction"); if (malf) player.archive.push(malf); }
      }
    } else if (game.mode === "solo") { game.house.chops++; const penalty = takePenalty("chop"); if (penalty) player.archive.push(penalty); }
    else { const first = takePenalty("chop"); const second = takePenalty("chop"); if (first) player.archive.push(first); if (second) game.players[targetIndex].archive.push(second); }
    if (game.mode === "solo") passStage(); else finishTurn();
  }

  function renderSetup() {
    const root = $("#app");
      root.innerHTML = `<section class="complete-setup"><div class="setup-copy"><p class="kicker">V7.9 • COMPLETE RULES</p><h2>Build the Look.<br><em>Slay the Stage.</em></h2><p>Play the full Haute &amp; Hazard circuit in hot-seat multiplayer or Solo Circuit. The 240-card Poker pool and current 12-Queen / 12-Stage data load from the canonical project database.</p><div class="pill-row"><span>2–5 PLAYERS</span><span>SOLO CIRCUIT</span><span>PHONE READY</span></div></div><div class="setup-form panel"><h3>Set up your circuit</h3><label>Game mode<select id="modeSelect"><option value="multi">Multiplayer — 2 to 5</option><option value="solo">Solo Circuit — v0.2</option></select></label><label id="countWrap">Players<select id="playerCount"><option>2</option><option>3</option><option>4</option><option>5</option></select></label><div id="playerChoices"></div><div id="soloChoices" class="hidden"><label>House difficulty<select id="difficulty"><option value="local">Local Girl</option><option value="working" selected>Working Queen</option><option value="headliner">Headliner</option><option value="legend">Legend</option></select></label><label>House Queen<select id="houseQueen"></select></label><label>House Personality<select id="personality"><option value="">Generic House Queen</option>${PERSONALITIES.map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join("")}</select></label></div><label>Stage rules<select id="stageRules"><option value="beginner">Beginner Mode — venue + target + reward</option><option value="full">Full Stage Rules — judge, spotlight, favor, ovation</option></select></label><button id="startGame" class="primary-btn wide">Start game</button><p class="setup-foot">Solo Circuit v0.2 is experimental. Complex card text opens guided manual resolution.</p></div></section>`;
    const queenOptions = DATA.queens.map((q) => `<option value="${q.id}">${esc(q.name)} · ${esc(q.tenet)}</option>`).join("");
    const fillPlayers = () => {
      const count = Number($("#playerCount").value || 2);
      $("#playerChoices").innerHTML = Array.from({ length: count }, (_, i) => `<div class="player-config"><label>Player ${i + 1} name<input id="pname${i}" value="Player ${i + 1}" maxlength="18"></label><label>Queen<select id="pqueen${i}">${queenOptions}</select></label></div>`).join("");
      Array.from({ length: count }, (_, i) => { $(`#pqueen${i}`).value = DATA.queens[i % DATA.queens.length].id; });
    };
    const fillHouse = () => { $("#houseQueen").innerHTML = queenOptions; $("#houseQueen").value = DATA.queens[1]?.id || DATA.queens[0].id; };
    fillPlayers(); fillHouse();
    $("#playerCount").addEventListener("change", fillPlayers);
    $("#modeSelect").addEventListener("change", () => { const solo = $("#modeSelect").value === "solo"; $("#soloChoices").classList.toggle("hidden", !solo); $("#countWrap").classList.toggle("hidden", solo); $("#playerChoices").classList.toggle("hidden", solo); });
    $("#startGame").addEventListener("click", () => {
      const mode = $("#modeSelect").value; const count = mode === "solo" ? 1 : Number($("#playerCount").value);
      const configs = Array.from({ length: count }, (_, i) => ({ name: mode === "solo" ? "You" : $(`#pname${i}`).value, queen: $(`#pqueen${i}`).value }));
      if (new Set(configs.map((p) => p.queen)).size !== configs.length) { notify("Choose a different Queen for each player."); return; }
      const houseQueen = $("#houseQueen").value || DATA.queens[1].id;
      if (mode === "solo" && configs[0].queen === houseQueen) { notify("Choose a different Queen for the House."); return; }
      startGame({ mode, players: configs, houseQueen, difficulty: $("#difficulty").value, stageRules: $("#stageRules").value, personality: $("#personality").value });
    });
  }

  function cardMarkup(card, zone) {
    if (!card) return "";
    const face = zone === "rack" || zone === "thrift";
    const isFashion = card.type === "Fashion" && card.slot && card.slot !== "none";
    const cost = card.cost + (game.mode === "solo" && game.purchasesThisTurn === 0 ? game.firstPurchaseSurcharge : 0);
    const actions = zone === "hand" && game.phase === "transformation" ? `<div class="card-actions"><button data-play="${card.instanceId}">Play · +${card.tips} Tips</button>${isFashion ? `<button class="primary" data-equip="${card.instanceId}">Equip</button>` : ""}</div>` : face && game.phase === "shopping" ? `<div class="card-actions"><button class="primary" data-buy="${card.instanceId}" data-source="${zone}" ${activePlayer().tips < cost || (game.mode === "solo" && game.purchasesThisTurn >= game.maxPurchases) ? "disabled" : ""}>Buy · ${cost}</button></div>` : "";
    return `<article class="complete-card" style="--accent:${cardColor(card)}"><div class="card-value">${face ? `COST ${card.cost}` : `TIP ${card.tips}`}</div><div class="card-meta">${esc(card.tenet)} · ${esc(card.slot && card.slot !== "none" ? card.slot : card.type)}${card.brand ? ` · ${esc(card.brand)}` : ""}</div><strong>${esc(card.name)}</strong><div class="card-rules">${esc(card.text || "No additional effect.")}</div><div class="card-stats"><span>AP ${card.appeal}</span><span>LS ${card.ls}</span><span>SP ${card.sp}</span></div>${actions}</article>`;
  }

  function renderGame() {
    const p = activePlayer(); const stage = currentStage();
    if (!p || !stage) return;
    const scoreRows = game.players.map((x, i) => `<div class="score-tile ${i === game.currentPlayer ? "is-active" : ""}"><span>${esc(x.name)} · ${esc(x.queen.name)}</span><strong>${x.grossSP}</strong><small>${x.trophies} STAGES · ${R.finalScore(x)} FINAL</small></div>`).join("");
    const stageInfo = `<div class="stage-title"><span class="kicker">${esc(stage.tenet)} · ${esc(stage.brand)}${game.mode === "solo" ? ` · ${DIFFICULTY[game.difficulty].label} · ROUND ${game.stageRound}/4` : ""}</span><h2>${esc(stage.name)}</h2><p>${esc(stage.subtitle)} · TARGET ${stage.target} · REWARD ${stage.reward} SP</p><p><b>Venue:</b> ${esc(stage.venue)}</p>${game.stageRules === "full" ? `<p><b>Spotlight:</b> ${esc(stage.spotlight)} · <b>Judge:</b> ${esc(stage.judge)} · <b>Favor:</b> ${esc(stage.favor)} · <b>Ovation:</b> ${esc(stage.ovation)}</p>` : ""}</div>`;
    const house = game.house ? `<div class="house-card panel"><small>HOUSE QUEEN · ${esc(game.house.queen.name)} · ${DIFFICULTY[game.difficulty].label}</small><h3>${esc(game.house.current?.name || "House")} <span>+${game.house.current?.appeal || 0} AP · ${game.house.current?.ls || 0} LS</span></h3><p>${esc(game.house.current?.effect || "")}</p><p>House SP <b>${game.house.grossSP}</b> · House Wardrobe ${game.house.wardrobe.length}</p></div>` : "";
    const currentLook = p.currentLook ? `${p.currentLook.appeal} × ${p.currentLook.multiplier} = ${p.currentLook.total} Appeal` : "Not revealed";
    const masterSlots = R.CORE_SLOTS.concat("Accessory").map((slot) => `<div class="master-slot"><small>${slot.toUpperCase()}</small>${p.masters[slot] ? cardMarkup(p.masters[slot], "master") : `<span class="empty-slot">EMPTY</span>`}</div>`).join("");
    let controls = "";
    if (game.phase === "transformation") controls = `<button class="primary-btn" id="phaseMain">Finish Transformation</button>`;
    if (game.phase === "reveal") controls = `<button class="primary-btn" id="phaseMain">Reveal the Look</button>`;
    if (game.phase === "shopping") controls = `<button class="primary-btn" id="phaseMain">Finish Shopping</button><span class="resource-pill">${p.tips} Tips</span>`;
    if (game.phase === "stage") {
      const can = canSlay(p, stage); const rivals = game.mode === "multi" ? game.players.map((x, i) => i !== game.currentPlayer && !x.untouchable ? `<button data-duel="${i}">Challenge ${esc(x.name)}</button>` : "").join("") : `<button id="duelHouse">Challenge the House</button>`;
      controls = `${can ? `<button class="primary-btn" id="slayBtn">Slay the Stage · ${stage.reward} SP</button>` : ""}${rivals}<button class="subtle" id="passBtn">${game.mode === "solo" ? "Pass · House checks the Stage" : "Pass to next player"}</button>`;
    }
    if (game.phase === "cleanup") controls = `<button class="primary-btn" id="phaseMain">Cleanup / Continue</button>`;
    const rack = game.rack.map((c) => c ? cardMarkup(c, "rack") : `<div class="vacant-rack">Refills at Cleanup</div>`).join("");
    const thrift = game.thrift.map((c) => c ? cardMarkup(c, "thrift") : "").join("");
    const feed = game.log.map((x) => `<li class="${x.kind}">${x.message}</li>`).join("");
    const manualQueenAbility = ["Q-01", "Q-03", "Q-11"].includes(p.queen.id) && game.phase === "transformation";
    $("#app").innerHTML = `<div class="complete-game"><aside class="complete-rail panel"><div class="mode-label">${game.mode === "solo" ? "SOLO CIRCUIT v0.2" : `${game.players.length}-PLAYER CIRCUIT`}</div><h2>${esc(p.name)}</h2><p>${esc(p.queen.name)} · ${esc(p.queen.tenet)}</p><p class="queen-ability"><b>${esc(p.queen.abilityName)}</b><br>${esc(p.queen.ability)}</p><div class="score-stack">${scoreRows}${game.house ? `<div class="score-tile house-score"><span>HOUSE · ${esc(game.house.queen.name)}</span><strong>${game.house.grossSP}</strong><small>${game.house.trophies} STAGES</small></div>` : ""}</div><div class="phase-track">${Object.entries(PHASE_NAMES).filter(([id]) => id !== "finished").map(([id, name]) => `<span class="phase-pill ${id === game.phase ? "active" : ""}">${esc(name)}</span>`).join("")}</div>${manualQueenAbility ? `<button id="queenAbilityBtn" class="subtle wide" ${p.oncePerRound.manualAbility ? "disabled" : ""}>Use Signature Ability · ${esc(p.queen.abilityName)}</button>` : ""}<button id="specialBtn" class="subtle wide" ${p.specialUsed ? "disabled" : ""}>Special Appeal · ${esc(p.queen.specialName)}</button><button id="saveBtn" class="subtle wide">Save game</button><button id="newGameBtn2" class="subtle wide">New game</button></aside><main class="complete-table"><section class="opponent-row">${stageInfo}${house}</section><div class="reveal-score panel"><span>REVEAL</span><strong>${esc(currentLook)}</strong><span>ROUND ${game.mode === "solo" ? `${game.stageRound}/4` : "ACTIVE"}</span></div><section class="zone"><h3>Your Coordinate</h3><div class="master-row">${masterSlots}</div></section><section class="zone"><h3>Wardrobe Rack <small>5 cards · refill at Cleanup</small></h3><div class="complete-cards rack-row">${rack}</div></section><section class="zone"><h3>Thrift Store <small>${game.thrift.filter(Boolean).length} available</small></h3><div class="complete-cards thrift-row">${thrift}</div></section><section class="zone"><h3>Hand · ${p.hand.length} cards</h3><div class="complete-cards hand-row">${p.hand.map((c) => cardMarkup(c, "hand")).join("") || `<p class="empty-note">No cards in hand.</p>`}</div></section><section class="complete-controls">${controls}</section><details class="zone"><summary>Game log</summary><ol class="game-log-list">${feed}</ol></details></main></div>`;
    bindGameButtons();
  }

  function bindGameButtons() {
    $("#phaseMain")?.addEventListener("click", async () => {
      if (game.phase === "transformation") {
        if (game.mode === "solo" && game.house.current?.name === "Cover Charge") { activePlayer().tips = Math.max(0, activePlayer().tips - 1); log("Cover Charge removes 1 Tip after Transformation.", "house"); }
        game.phase = "reveal";
      }
      else if (game.phase === "reveal") await doReveal();
      else if (game.phase === "shopping") finishShopping();
      else if (game.phase === "cleanup") finishTurn();
      save(); render();
    });
    $("#slayBtn")?.addEventListener("click", () => claimStage(game.currentPlayer));
    $("#passBtn")?.addEventListener("click", passStage);
    $("#duelHouse")?.addEventListener("click", () => dragBattle(0));
    document.querySelectorAll("[data-duel]").forEach((b) => b.addEventListener("click", () => dragBattle(Number(b.dataset.duel))));
    document.querySelectorAll("[data-play]").forEach((b) => b.addEventListener("click", () => playFromHand(b.dataset.play, false)));
    document.querySelectorAll("[data-equip]").forEach((b) => b.addEventListener("click", () => playFromHand(b.dataset.equip, true)));
    document.querySelectorAll("[data-buy]").forEach((b) => b.addEventListener("click", () => buyCard(b.dataset.buy, b.dataset.source)));
    $("#saveBtn")?.addEventListener("click", () => { save(); notify("Game saved on this device."); });
    $("#newGameBtn2")?.addEventListener("click", () => { if (confirm("Start a new game?")) { game = null; localStorage.removeItem("hhCompleteSave"); renderSetup(); } });
    $("#specialBtn")?.addEventListener("click", () => { const p = activePlayer(); p.specialUsed = true; pushManual(`${p.queen.name}: ${p.queen.specialName}`, p.queen.special, { playerIndex: game.currentPlayer, label: p.queen.specialName }); });
    $("#queenAbilityBtn")?.addEventListener("click", () => { const p = activePlayer(); p.oncePerRound.manualAbility = true; pushManual(`${p.queen.name}: ${p.queen.abilityName}`, p.queen.ability, { playerIndex: game.currentPlayer, label: p.queen.abilityName }); });
  }

  function renderFinished() {
    const rows = (game.finalScores || []).map((x, i) => `<div class="final-row"><b>${i + 1}. ${esc(x.name)} · ${esc(x.queen)}</b><span>${x.finalSP} Final SP (${x.grossSP} Gross − ${x.penalties} Penalties) · ${x.trophies} Stages</span></div>`).join("");
    const title = game.houseTiebreakNeedsReview ? "House tie needs a playtest ruling" : game.winners?.length > 1 ? "Shared victory" : game.finalScores?.[0]?.name === "The House" ? "The House Takes the Crown" : `${esc(game.finalScores?.[0]?.name || "The winner")} Owns the Night`;
    $("#app").innerHTML = `<section class="finished panel"><p class="kicker">CURTAIN CALL · FINAL JUDGING</p><h2>${title}</h2><p>Final score includes explicit bonuses and Penalty values. Ties use Stage trophies, then fewest Penalties, then highest printed Tip cost, then a shared victory. The solo rules leave a House tie-breaker unresolved for playtest.</p><div class="final-score-list">${rows}</div><button id="playAgain" class="primary-btn">Start another game</button></section>`;
    $("#playAgain").addEventListener("click", () => { game = null; localStorage.removeItem("hhCompleteSave"); renderSetup(); });
  }

  function render() { if (!game) renderSetup(); else if (game.phase === "finished") renderFinished(); else renderGame(); }
  function load() { try { const raw = localStorage.getItem("hhCompleteSave"); if (raw) { const saved = JSON.parse(raw); if (saved.version === "v7.9-complete-1.0") game = saved; } } catch {} }

  $("#newGameBtn")?.addEventListener("click", () => { if (confirm("Start a new game?")) { game = null; localStorage.removeItem("hhCompleteSave"); renderSetup(); } });
  $("#manualDone")?.addEventListener("click", manualDone);
  $("#manualDialog")?.querySelector("form")?.addEventListener("submit", manualDone);
  load(); render();
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
})();

/* v7.9 tabletop rules helpers. Keep this file data-first: data.js is canonical. */
(() => {
  "use strict";
  const CORE_SLOTS = ["Face", "Wig", "Body", "Shoes"];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const shuffle = (items) => {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const cardInstance = (card) => ({ ...clone(card), instanceId: `${card.id}_${Math.random().toString(36).slice(2, 9)}` });
  const starterDeck = (cards) => shuffle([
    ...Array.from({ length: 7 }, () => cardInstance(cards.find((c) => c.name === "Basic Beat"))),
    ...Array.from({ length: 3 }, () => cardInstance(cards.find((c) => c.name === "Messy Lip Sync"))),
    ...Array.from({ length: 2 }, () => cardInstance(cards.find((c) => c.name === "Chapstick"))),
  ]);

  function draw(player, count = 1) {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      if (!player.deck.length && player.archive.length) {
        player.deck = shuffle(player.archive);
        player.archive = [];
      }
      if (!player.deck.length) break;
      const card = player.deck.shift();
      player.hand.push(card);
      drawn.push(card);
    }
    return drawn;
  }

  function makePlayer(name, queen, cards) {
    const player = {
      id: `p_${Math.random().toString(36).slice(2, 8)}`, name, queen,
      deck: starterDeck(cards), archive: [], trash: [], hand: [], played: [],
      masters: { Face: null, Wig: null, Body: null, Shoes: null, Accessory: null },
      tips: 0, appeal: 0, grossSP: 0, trophies: 0, specialUsed: false,
      oncePerRound: {}, untouchable: false, newestMasterSlot: null,
    };
    draw(player, 5);
    return player;
  }

  function ownCards(player) {
    return [
      ...player.deck, ...player.archive, ...player.hand, ...player.played,
      ...Object.values(player.masters).filter(Boolean), ...player.trash,
    ];
  }

  function penaltyValue(card) {
    if (!card || card.component !== "Penalty") return 0;
    if (/Extermination/i.test(card.name)) return 2;
    return 1;
  }

  function finalScore(player) {
    return player.grossSP + Number(player.endGameBonus || 0) - ownCards(player).reduce((n, c) => n + penaltyValue(c), 0);
  }

  function look(player, stage, options = {}) {
    const core = CORE_SLOTS.map((slot) => player.masters[slot]);
    const complete = core.every(Boolean);
    const visible = Object.values(player.masters).filter(Boolean);
    let appeal = visible.reduce((sum, card) => sum + Number(card.appeal || 0), 0) + Number(player.appeal || 0);
    const tenets = core.filter(Boolean).map((card) => card.tenet).filter((t) => t && t !== "Neutral" && t !== "None");
    const matching = complete && tenets.length === 4 && tenets.every((t) => t === tenets[0]);
    const perfect = matching && tenets[0] === player.queen.tenet;
    const stageId = stage?.id;
    if (stageId === "STG-01" && player.masters.Accessory) appeal += 1;
    if (stageId === "STG-02" && player.masters.Shoes?.brand === "Hyper-Glitch") appeal += 1;
    if (stageId === "STG-04") appeal += visible.filter((c) => c.tenet === "Yellow").length;
    if (stageId === "STG-05") appeal += visible.filter((c) => c.component === "Thrift" || c.tenet === "Neutral").length;
    if (stageId === "STG-06" && player.masters.Body?.tenet === "Blue") appeal += 2;
    if (stageId === "STG-07" && options.selectedMasterId) {
      const master = visible.find((c) => c.instanceId === options.selectedMasterId);
      if (master && ["Face", "Wig"].includes(master.slot)) appeal += 2;
    }
    if (stageId === "STG-10") appeal += visible.filter((c) => c.brand === "Big Top").length;
    if (stageId === "STG-11") appeal += visible.filter((c) => c.brand === "Gilded Cage").length;
    appeal += Number(options.manualAppeal || 0);
    const multiplier = perfect ? 3 : matching ? 2 : 1;
    const fusion = complete && new Set(tenets).size === 2;
    return { complete, matching, perfect, fusion, multiplier, appeal, total: appeal * multiplier, tenets };
  }

  function spotlightMet(player, stage) {
    const text = stage?.spotlight || "";
    const masters = Object.values(player.masters).filter(Boolean);
    if (/Accessory equipped/i.test(text)) return Boolean(player.masters.Accessory);
    if (/Pink Shoes Master/i.test(text)) return player.masters.Shoes?.tenet === "Pink";
    if (/Blue Body or Wig Master/i.test(text)) return [player.masters.Body, player.masters.Wig].some((c) => c?.tenet === "Blue");
    if (/Swamp Witch Master/i.test(text)) return masters.some((c) => c.brand === "Swamp Witch");
    if (/Thrift Store card equipped/i.test(text)) return masters.some((c) => c.component === "Thrift");
    if (/Blue Body Master/i.test(text)) return player.masters.Body?.tenet === "Blue";
    if (/Velvet Trap Face or Wig Master/i.test(text)) return [player.masters.Face, player.masters.Wig].some((c) => c?.brand === "Velvet Trap");
    if (/at least 2 Slasher Masters/i.test(text)) return masters.filter((c) => c.brand === "Slasher").length >= 2;
    if (/at least 2 Sugar Rush Masters/i.test(text)) return masters.filter((c) => c.brand === "Sugar Rush").length >= 2;
    if (/Big Top Face or Wig Master/i.test(text)) return [player.masters.Face, player.masters.Wig].some((c) => c?.brand === "Big Top");
    if (/all four core slots occupied by non-Neutral Masters/i.test(text)) return CORE_SLOTS.every((slot) => player.masters[slot] && player.masters[slot].tenet !== "Neutral");
    if (/at least 2 Hyper-Glitch Masters/i.test(text)) return masters.filter((c) => c.brand === "Hyper-Glitch").length >= 2;
    return null;
  }

  function houseAppeal(stage, automa, difficulty, houseState = {}) {
    const modifier = { local: -2, working: 0, headliner: 1, legend: 2 }[difficulty] ?? 0;
    let score = Math.max(0, stage.target - 6) + Number(automa.appeal || 0) + modifier;
    const removed = houseState.removed;
    const ownedSlots = new Set((houseState.wardrobe || []).map((c) => c.slot).filter(Boolean));
    if (["Front Row Favorite", "Brand Obsession"].includes(automa.name) && removed?.brand === stage.brand) score++;
    if (automa.name === "Complete the Look" && ownedSlots.size >= 4) score++;
    if (automa.name === "Standing Ovation" && houseState.trophies > 0) score++;
    if (automa.name === "Camera Loves Her" && houseState.round >= 2) score++;
    if (automa.name === "Final Chorus" && houseState.round === 4) score++;
    return Math.max(0, score - Number(houseState.penalty || 0));
  }

  window.HH_RULES = { CORE_SLOTS, shuffle, cardInstance, makePlayer, draw, ownCards, penaltyValue, finalScore, look, spotlightMet, houseAppeal };
})();

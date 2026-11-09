(() => {
  "use strict";
  const DATA = window.HH_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const CORE_SLOTS = ["Face","Wig","Body","Shoes"];
  const ALL_SLOTS = ["Face","Wig","Body","Shoes","Accessory"];
  const TENET_COLORS = {Pink:"#ea58b3",Blue:"#55aaee",Purple:"#ab6ae6",Yellow:"#f2c740",Neutral:"#aaa4ae",None:"#aaa4ae"};
  const DIFFICULTY = {
    local:{label:"Local Girl",appeal:-2,ls:-1},
    working:{label:"Working Queen",appeal:0,ls:0},
    headliner:{label:"Headliner",appeal:1,ls:0},
    legend:{label:"Legend",appeal:2,ls:1}
  };
  const PHASES = ["transformation","reveal","shopping","stage","cleanup"];
  let soundOn = true;
  let state = null;

  function uid(prefix="c"){ return prefix+"_"+Math.random().toString(36).slice(2,9); }
  function cloneCard(card){ return {...card, instanceId:uid(card.id)}; }
  function shuffle(a){ const x=[...a]; for(let i=x.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
  function num(v){ return Number(v||0); }
  function accent(tenet){ return TENET_COLORS[tenet] || TENET_COLORS.Neutral; }
  function esc(s=""){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m])); }

  function tone(freq=440,dur=.08,type="sine"){
    if(!soundOn) return;
    try{
      const Ctx=window.AudioContext||window.webkitAudioContext, ctx=new Ctx();
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.05,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);
      o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur);o.onended=()=>ctx.close();
    }catch{}
  }

  function addLog(text, kind=""){
    state.log.push({text,kind,at:Date.now()});
    if(state.log.length>80) state.log.shift();
  }

  function announce(text,color="var(--gold)"){
    const el=$("#announce"); if(!el) return;
    el.textContent=text; el.style.color=color; el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
  }

  function buildStarterDeck(){
    const find = n => DATA.cards.find(c=>c.name===n);
    return shuffle([
      ...Array.from({length:7},()=>cloneCard(find("Basic Beat"))),
      ...Array.from({length:3},()=>cloneCard(find("Messy Lip Sync"))),
      ...Array.from({length:2},()=>cloneCard(find("Chapstick")))
    ]);
  }

  function buildWardrobeDeck(){
    return shuffle(DATA.cards.filter(c=>c.component==="Wardrobe").map(cloneCard));
  }

  function drawCards(n){
    for(let i=0;i<n;i++){
      if(!state.deck.length){
        if(!state.archive.length) return;
        state.deck=shuffle(state.archive); state.archive=[];
        addLog("Backstage Archive reshuffled into your Deck.","gold");
      }
      state.hand.push(state.deck.shift());
    }
  }

  function refillRack(immediate=false){
    for(let i=0;i<5;i++){
      if(!state.rack[i] && state.wardrobeDeck.length) state.rack[i]=state.wardrobeDeck.shift();
    }
    if(immediate) render();
  }

  function startRun(queenId,difficulty="working",runLength=5){
    const queen=DATA.queens.find(q=>q.id===queenId);
    const housePool=DATA.queens.filter(q=>q.id!==queenId);
    const houseQueen=housePool[Math.floor(Math.random()*housePool.length)];
    const stages=shuffle(DATA.stages).slice(0,runLength);
    state={
      version:"digital-v0.1",queen,houseQueen,difficulty,runLength,
      grossSP:0,houseSP:0,tips:0,tempAppeal:0,revealedAppeal:0,baseAppeal:0,multiplier:1,
      phase:"transformation",deck:buildStarterDeck(),archive:[],hand:[],played:[],
      masters:{Face:null,Wig:null,Body:null,Shoes:null,Accessory:null},newestMasterSlot:null,
      wardrobeDeck:buildWardrobeDeck(),rack:[null,null,null,null,null],
      stages,stageIndex:0,stageRound:1,stageWinner:null,
      automaDeck:shuffle(DATA.automa),automaDiscard:[],currentAutoma:null,houseWardrobe:[],
      purchasesThisTurn:0,maxPurchases:99,firstPurchaseSurcharge:0,appealPenalty:0,
      removedByAutoma:null,log:[],lastBattle:null,startedAt:Date.now()
    };
    drawCards(5); refillRack(); revealAutoma();
    addLog(`<strong>${esc(queen.name)}</strong> enters the Haute Circuit. House rival: <strong>${esc(houseQueen.name)}</strong>.`,"gold");
    saveState(); showGame();
  }

  function currentStage(){ return state.stages[state.stageIndex]; }

  function revealAutoma(){
    if(!state.automaDeck.length){ state.automaDeck=shuffle(state.automaDiscard); state.automaDiscard=[]; }
    state.currentAutoma=state.automaDeck.shift();
    const removed=removeRackForAutoma(state.currentAutoma.remove);
    state.removedByAutoma=removed;
    if(removed){ state.houseWardrobe.push(removed); addLog(`House reveals <strong>${esc(state.currentAutoma.name)}</strong> and snatches <strong>${esc(removed.name)}</strong> from the Rack.`,"bad"); }
    refillRack();
    state.maxPurchases=state.currentAutoma.name==="VIP Rope"?1:99;
    state.firstPurchaseSurcharge=state.currentAutoma.name==="Sold Out"?1:0;
    state.appealPenalty=state.currentAutoma.name==="Read to Filth"?1:0;
  }

  function removeRackForAutoma(rule){
    const choices=state.rack.map((c,i)=>c?{c,i}:null).filter(Boolean);
    if(!choices.length) return null;
    const stage=currentStage();
    const coreMissing=CORE_SLOTS.filter(s=>!state.houseWardrobe.some(c=>c.slot===s));
    const sortPick=(fn,desc=true)=>[...choices].sort((a,b)=>(fn(b.c)-fn(a.c))*(desc?1:-1)||a.i-b.i)[0];
    let pick;
    if(rule==="leftmost") pick=choices[0];
    else if(rule==="rightmost") pick=choices[choices.length-1];
    else if(rule==="highestCost") pick=sortPick(c=>c.cost,true);
    else if(rule==="lowestCost") pick=sortPick(c=>c.cost,false);
    else if(rule==="highestAppeal") pick=sortPick(c=>c.appeal,true);
    else if(rule==="highestTips") pick=sortPick(c=>c.tips,true);
    else if(rule==="highestLS") pick=sortPick(c=>c.ls,true);
    else if(rule==="lowestLS") pick=sortPick(c=>c.ls,false);
    else if(rule==="featuredBrand") pick=choices.find(x=>x.c.brand===stage.brand)||sortPick(c=>c.cost,true);
    else if(rule==="signatureTenet") pick=choices.find(x=>x.c.tenet===state.queen.tenet)||sortPick(c=>c.cost,true);
    else if(rule==="missingSlot") pick=choices.find(x=>coreMissing.includes(x.c.slot))||choices[0];
    else if(rule==="cost4plusRight") pick=[...choices].reverse().find(x=>x.c.cost>=4)||choices[choices.length-1];
    else if(rule==="newestMasterSlot") pick=choices.find(x=>x.c.slot===state.newestMasterSlot)||choices[0];
    else pick=choices[0];
    const removed=state.rack[pick.i]; state.rack[pick.i]=null; return removed;
  }

  function simpleEffect(card, trigger){
    const t=card.text||"";
    const prefix=new RegExp("^"+trigger+":\\s*Gain (\\d+) Appeal","i").exec(t);
    if(prefix){ state.tempAppeal+=Number(prefix[1]); addLog(`${esc(card.name)} adds ${prefix[1]} temporary Appeal.`,"good"); }
    const tip=new RegExp("^"+trigger+":\\s*Gain (\\d+) Tips?","i").exec(t);
    if(tip){ state.tips+=Number(tip[1]); addLog(`${esc(card.name)} adds ${tip[1]} extra Tips.`,"good"); }
  }

  function playCard(instanceId,equip=false){
    if(state.phase!=="transformation") return;
    const idx=state.hand.findIndex(c=>c.instanceId===instanceId); if(idx<0) return;
    const card=state.hand.splice(idx,1)[0];
    state.tips+=card.tips;
    tone(360+card.tips*70,.06,"triangle");
    if(equip && card.type==="Fashion" && card.slot && card.slot!=="none"){
      const old=state.masters[card.slot];
      if(old){ state.archive.push(old); addLog(`${esc(old.name)} leaves the ${esc(card.slot)} slot for ${esc(card.name)}.`); }
      state.masters[card.slot]=card; state.newestMasterSlot=card.slot;
      simpleEffect(card,"Equip");
      addLog(`Equipped <strong>${esc(card.name)}</strong> as ${esc(card.slot)} Master; +${card.tips} printed Tips.`,"good");
    }else{
      state.played.push(card);
      simpleEffect(card,"Play");
      if(card.name==="Messy Lip Sync"){ state.tempAppeal+=1; addLog("Messy Lip Sync adds 1 temporary Appeal.","good"); }
      addLog(`Played <strong>${esc(card.name)}</strong> for ${card.tips} printed Tips.`);
    }
    saveState(); render();
  }

  function endTransformation(){
    if(state.phase!=="transformation") return;
    if(state.currentAutoma?.name==="Cover Charge" && state.tips>0){ state.tips--; addLog("Cover Charge steals 1 Tip after Transformation.","bad"); }
    state.phase="reveal"; tone(520,.1,"sine"); render();
  }

  function stageBonus(stage){
    const m=state.masters;
    const vals=Object.values(m).filter(Boolean);
    switch(stage.id){
      case "STG-01": return m.Accessory?1:0;
      case "STG-02": return m.Shoes?.brand==="Hyper-Glitch"?1:0;
      case "STG-04": return vals.filter(c=>c.tenet==="Yellow").length;
      case "STG-05": return vals.filter(c=>c.component==="Thrift"||c.tenet==="Neutral").length;
      case "STG-06": return m.Body?.tenet==="Blue"?2:0;
      case "STG-07": return (m.Face||m.Wig)?2:0;
      case "STG-10": return vals.filter(c=>c.brand==="Big Top").length;
      case "STG-11": return vals.filter(c=>c.brand==="Gilded Cage").length;
      default:return 0;
    }
  }

  function lookMultiplier(){
    const core=CORE_SLOTS.map(s=>state.masters[s]);
    if(core.some(x=>!x)) return {mult:1,label:"INCOMPLETE"};
    const tenets=core.map(c=>c.tenet);
    const same=tenets.every(t=>t===tenets[0]) && !["Neutral","None",""].includes(tenets[0]);
    if(!same) return {mult:1,label:"COMPLETE"};
    if(tenets[0]===state.queen.tenet) return {mult:3,label:"PERFECT ILLUSION"};
    return {mult:2,label:"MATCHING"};
  }

  function revealLook(){
    if(state.phase!=="reveal") return;
    const raw=Object.values(state.masters).filter(Boolean).reduce((s,c)=>s+c.appeal,0)+state.tempAppeal;
    const bonus=stageBonus(currentStage());
    const penal=Math.min(raw+bonus,state.appealPenalty);
    const base=Math.max(0,raw+bonus-penal);
    const mult=lookMultiplier();
    state.baseAppeal=base; state.multiplier=mult.mult; state.revealedAppeal=base*mult.mult;
    if(bonus) addLog(`${esc(currentStage().name)} adds +${bonus} Stage Appeal.`,"gold");
    if(state.appealPenalty) addLog("Read to Filth reduces this Reveal by 1 Appeal.","bad");
    addLog(`Reveal: ${base} Appeal × ${mult.mult} = <strong>${state.revealedAppeal}</strong> (${mult.label}).`,"good");
    announce(mult.mult>1?`${mult.label}! ×${mult.mult}`:`${state.revealedAppeal} APPEAL`,mult.mult===3?"var(--pink)":"var(--gold)");
    tone(mult.mult===3?880:660,.16,"triangle");
    state.phase="shopping"; saveState(); render();
  }

  function buyCard(instanceId){
    if(state.phase!=="shopping") return;
    if(state.purchasesThisTurn>=state.maxPurchases){ announce("VIP ROPE","var(--danger)"); return; }
    const idx=state.rack.findIndex(c=>c?.instanceId===instanceId); if(idx<0) return;
    const card=state.rack[idx]; const surcharge=state.purchasesThisTurn===0?state.firstPurchaseSurcharge:0;
    const cost=card.cost+surcharge;
    if(state.tips<cost){ announce("NOT ENOUGH TIPS","var(--danger)"); tone(130,.12,"sawtooth"); return; }
    state.tips-=cost; state.archive.push(card); state.rack[idx]=null; state.purchasesThisTurn++;
    addLog(`Bought <strong>${esc(card.name)}</strong> for ${cost} Tips → Backstage Archive.`,"good");
    tone(740,.08,"triangle"); saveState(); render();
  }

  function finishShopping(){
    if(state.phase!=="shopping") return;
    state.phase="stage"; render();
  }

  function houseAppeal(){
    const stage=currentStage(), a=state.currentAutoma;
    let score=Math.max(0,stage.target-6)+a.appeal+DIFFICULTY[state.difficulty].appeal;
    const removed=state.removedByAutoma;
    if(a.name==="Front Row Favorite" && removed?.brand===stage.brand) score++;
    if(a.name==="Brand Obsession" && removed?.brand===stage.brand) score++;
    if(a.name==="Complete the Look" && new Set(state.houseWardrobe.map(c=>c.slot).filter(Boolean)).size>=4) score++;
    if(a.name==="Standing Ovation" && state.houseSP>0) score++;
    if(a.name==="Camera Loves Her" && state.stageRound>=2) score++;
    if(a.name==="Final Chorus" && state.stageRound===4) score++;
    return Math.max(0,score);
  }

  function resolveStage(){
    if(state.phase!=="stage") return;
    const stage=currentStage();
    if(state.revealedAppeal>=stage.target){
      state.grossSP+=stage.reward; state.stageWinner="player";
      addLog(`<strong>SLAY!</strong> You claim ${esc(stage.name)} for +${stage.reward} Gross SP.`,"good");
      announce("SLAY!","var(--pink)"); tone(980,.2,"triangle"); advanceStage();
    }else{
      const hs=houseAppeal();
      addLog(`House Appeal: ${hs} vs target ${stage.target}.`,"bad");
      if(hs>=stage.target || state.stageRound>=4){
        state.houseSP+=stage.reward; state.stageWinner="house";
        if(hs<stage.target && state.currentAutoma?.name==="House Always Wins"){
          state.houseSP++;
          addLog("House Always Wins adds +1 House Gross SP on the Stage timeout.","bad");
        }
        addLog(`The House claims <strong>${esc(stage.name)}</strong> for +${stage.reward} Gross SP.`,"bad");
        announce("HOUSE SLAYS","var(--gold)"); tone(180,.2,"sawtooth"); advanceStage();
      }else{
        if(state.currentAutoma?.name==="House Always Wins"){
          state.houseSP++;
          addLog("House Always Wins adds +1 House Gross SP because neither side Slays.","bad");
        }
        state.stageRound++;
        addLog(`Nobody Slays. Stage timer advances to Round ${state.stageRound}.`);
        state.phase="cleanup";
      }
    }
    saveState(); render();
  }

  function takeBattleCards(count){
    const drawn=[];
    for(let i=0;i<count;i++){
      if(!state.deck.length){ if(!state.archive.length) break; state.deck=shuffle(state.archive); state.archive=[]; }
      if(state.deck.length) drawn.push(state.deck.shift());
    }
    state.archive.push(...drawn);
    return drawn;
  }

  function takeAutomaBattle(count){
    const drawn=[];
    for(let i=0;i<count;i++){
      if(!state.automaDeck.length){ state.automaDeck=shuffle(state.automaDiscard); state.automaDiscard=[]; }
      if(state.automaDeck.length) drawn.push(state.automaDeck.shift());
    }
    state.automaDiscard.push(...drawn);
    return drawn;
  }

  function dragdagulan(){
    if(state.phase!=="stage") return;
    const pc=takeBattleCards(3), hc=takeAutomaBattle(3);
    const ps=pc.reduce((s,c)=>s+c.ls,0), hs=Math.max(0,hc.reduce((s,c)=>s+c.ls,0)+DIFFICULTY[state.difficulty].ls);
    state.lastBattle={pc,hc,ps,hs};
    if(ps>hs){
      if(state.houseSP>0){state.houseSP--;state.grossSP++;}
      addLog(`Dragdagulan†: You win ${ps}–${hs}. ${state.houseSP>=0?"House pressure breaks.":""}`,"good");
      announce(`LIP SYNC WIN ${ps}–${hs}`,"var(--pink)");
    }else if(hs>ps){
      if(state.grossSP>0){state.grossSP--;state.houseSP++;}
      addLog(`Dragdagulan†: House wins ${hs}–${ps}.`,"bad");
      announce(`HOUSE WINS ${hs}–${ps}`,"var(--gold)");
    }else{
      addLog(`Dragdagulan† tie at ${ps}.`);
      announce("DOUBLE CHOP","var(--danger)");
    }
    state.stageRound=Math.min(4,state.stageRound+1);
    state.phase="cleanup"; saveState(); render();
  }

  function advanceStage(){
    state.stageIndex++;
    state.stageRound=1;
    if(state.stageIndex>=state.stages.length){ finishRun(); return; }
    state.phase="cleanup";
  }

  function cleanup(){
    if(state.phase!=="cleanup") return;
    state.archive.push(...state.played,...state.hand); state.played=[]; state.hand=[];
    state.tips=0;state.tempAppeal=0;state.revealedAppeal=0;state.baseAppeal=0;state.multiplier=1;state.purchasesThisTurn=0;
    if(state.currentAutoma) state.automaDiscard.push(state.currentAutoma);
    refillRack(); drawCards(5); revealAutoma(); state.phase="transformation";
    addLog(`Cleanup complete. Fresh hand of ${state.hand.length}.`);
    saveState(); render();
  }

  function finishRun(){
    state.phase="finished";
    renderEndModal();
    saveState();
  }

  function renderEndModal(){
    const won=state.grossSP>state.houseSP, tied=state.grossSP===state.houseSP;
    $("#endModal").classList.remove("hidden");
    $("#endTitle").textContent=tied?"Double crowning?":won?"You own the night.":"The House takes the crown.";
    $("#endSummary").innerHTML=`<div class="end-score"><div><span>Your SP</span><strong style="color:var(--pink)">${state.grossSP}</strong></div><div><span>House SP</span><strong style="color:var(--gold)">${state.houseSP}</strong></div></div><p>${state.stages.length} Stages completed with ${esc(state.queen.name)} against ${esc(state.houseQueen.name)}.</p>`;
  }

  function cardHTML(card,context){
    if(!card) return '<div class="game-card disabled"></div>';
    const a=accent(card.tenet);
    const isFashion=card.type==="Fashion"&&card.slot&&card.slot!=="none";
    const tipOrCost=context==="rack"?card.cost:card.tips;
    const badge=context==="rack"?"COST":"TIP";
    let actions="";
    if(context==="hand"&&state.phase==="transformation"){
      actions=`<div class="card-actions"><button data-play="${card.instanceId}">Play +${card.tips}</button>${isFashion?`<button class="primary" data-equip="${card.instanceId}">Equip</button>`:""}</div>`;
    }else if(context==="rack"&&state.phase==="shopping"){
      const surcharge=state.purchasesThisTurn===0?state.firstPurchaseSurcharge:0, cost=card.cost+surcharge;
      const disabled=state.tips<cost||state.purchasesThisTurn>=state.maxPurchases;
      actions=`<div class="card-actions"><button class="primary" data-buy="${card.instanceId}" ${disabled?"disabled":""}>Buy ${cost}</button></div>`;
    }
    return `<article class="game-card" style="--accent:${a}">
      <div class="cost-or-tip" title="${badge}">${tipOrCost}</div>
      <div class="meta">${esc(card.tenet)} • ${esc(card.slot&&card.slot!=="none"?card.slot:card.type)}${card.brand?` • ${esc(card.brand)}`:""}</div>
      <div class="card-name">${esc(card.name)}</div>
      <div class="mini-art"><div class="silhouette" style="color:${a}"></div></div>
      <div class="card-text">${esc(card.text||"No additional effect.")}</div>
      <div class="card-stats"><span>TIP ${card.tips}</span><span>APPEAL ${card.appeal}</span><span>LS ${card.ls}</span><span>SP ${card.sp}</span></div>
      ${actions}
    </article>`;
  }

  function renderSetup(){
    const tpl=$("#setupTemplate").content.cloneNode(true); $("#app").replaceChildren(tpl);
    $("#queenPicker").innerHTML=DATA.queens.map(q=>`<button class="queen-choice" data-queen="${q.id}" style="--queen-accent:${accent(q.tenet)}">
      <span class="tenet">${esc(q.tenet)} • ${esc(q.brand)}</span>
      <strong>${esc(q.name)}</strong>
      <div class="silhouette" style="color:${accent(q.tenet)}"></div>
      <span class="ability"><b>${esc(q.abilityName)}</b><br>${esc(q.ability)}</span>
    </button>`).join("");
    $$(".queen-choice").forEach(b=>b.addEventListener("click",()=>startRun(b.dataset.queen,$("#difficultySelect").value,Number($("#runLengthSelect").value))));
  }

  function renderGameShell(){
    if(!$(".game-grid")){
      const tpl=$("#gameTemplate").content.cloneNode(true); $("#app").replaceChildren(tpl);
      $("#saveBtn").addEventListener("click",()=>{saveState();announce("RUN SAVED","var(--gold)")});
      $("#resetSaveBtn").addEventListener("click",()=>{localStorage.removeItem("hhDigitalSave");announce("SAVE CLEARED","var(--danger)")});
    }
  }

  function render(){
    if(!state){ renderSetup(); return; }
    renderGameShell();
    if(state.phase==="finished") { renderEndModal(); return; }
    const q=state.queen, stage=currentStage(), auto=state.currentAutoma;
    if(!stage){ return; }
    $("#queenIdentity").innerHTML=`<div class="queen-id-card" style="--queen-accent:${accent(q.tenet)}"><small>${esc(q.tenet)} • ${esc(q.brand)}</small><strong>${esc(q.name)}</strong><p><b>${esc(q.abilityName)}</b><br>${esc(q.ability)}</p></div>`;
    $("#playerSP").textContent=state.grossSP; $("#houseSP").textContent=state.houseSP; $("#tips").textContent=state.tips; $("#appeal").textContent=state.revealedAppeal||state.tempAppeal; $("#round").textContent=`${state.stageRound}/4`;

    $("#phaseTrack").innerHTML=PHASES.map((p,i)=>`<div class="phase-pill ${p===state.phase?"active":PHASES.indexOf(state.phase)>i?"done":""}">${i+1}. ${p}</div>`).join("");
    $("#stagePips").innerHTML=state.stages.map((s,i)=>`<i class="${i<state.stageIndex?"done":i===state.stageIndex?"current":""}"></i>`).join("");

    $("#stageCard").innerHTML=`<article class="stage-card" style="--stage-accent:${accent(stage.tenet)}">
      <div class="stage-art"><div class="big-silhouette" style="color:${accent(stage.tenet)}"></div></div>
      <div class="stage-copy"><small>${esc(stage.tenet)} • ${esc(stage.brand)} • JUDGE ${esc(stage.judge)}</small><h2>${esc(stage.name)}</h2><div class="subtitle">${esc(stage.subtitle)}</div>
      <div class="stage-meta"><b>TARGET ${stage.target}</b><b>REWARD ${stage.reward} SP</b><b>ROUND ${state.stageRound}/4</b></div>
      <p><strong>Venue:</strong> ${esc(stage.venue)}</p><p><strong>Spotlight:</strong> ${esc(stage.spotlight)}</p>
      <div class="stage-rounds">${[1,2,3,4].map(n=>`<i class="${n<=state.stageRound?"on":""}"></i>`).join("")}</div></div></article>`;

    $("#automaCard").innerHTML=`<article class="automa-card"><span class="family">${esc(auto.family)} • ${esc(DIFFICULTY[state.difficulty].label)}</span><h3>${esc(auto.name)}</h3><div class="automa-stats"><b>APPEAL +${auto.appeal}</b><b>LS ${auto.ls}</b></div><p>${esc(auto.effect)}</p><p><strong>House rival:</strong> ${esc(state.houseQueen.name)}</p></article>`;

    $("#baseAppeal").textContent=state.phase==="transformation"?"—":state.baseAppeal||"—";
    $("#multiplier").textContent=state.phase==="transformation"?"—":state.multiplier||"—";
    $("#finalAppeal").textContent=state.revealedAppeal||"—";

    $("#masterSlots").innerHTML=ALL_SLOTS.map(slot=>`<div class="slot ${state.masters[slot]?"":"empty"}"><span class="slot-label">${slot.toUpperCase()}</span>${state.masters[slot]?cardHTML(state.masters[slot],"master"):""}</div>`).join("");
    $("#rack").innerHTML=state.rack.map(c=>cardHTML(c,"rack")).join("");
    $("#hand").innerHTML=state.hand.map(c=>cardHTML(c,"hand")).join("");

    $$("[data-play]").forEach(b=>b.addEventListener("click",()=>playCard(b.dataset.play,false)));
    $$("[data-equip]").forEach(b=>b.addEventListener("click",()=>playCard(b.dataset.equip,true)));
    $$("[data-buy]").forEach(b=>b.addEventListener("click",()=>buyCard(b.dataset.buy)));

    let controls="";
    if(state.phase==="transformation") controls=`<button class="main" id="phaseMain">End Transformation</button>`;
    if(state.phase==="reveal") controls=`<button class="main" id="phaseMain">Reveal the Look</button>`;
    if(state.phase==="shopping") controls=`<button class="main" id="phaseMain">Finish Shopping</button>`;
    if(state.phase==="stage"){
      const canSlay=state.revealedAppeal>=stage.target;
      controls=`<button class="${canSlay?"main":"gold"}" id="phaseMain">${canSlay?"Slay the Stage":"Pass → House Check"}</button><button id="battleBtn">Dragdagulan†</button>`;
    }
    if(state.phase==="cleanup") controls=`<button class="main" id="phaseMain">Cleanup → Next Round</button>`;
    $("#phaseControls").innerHTML=controls;
    if($("#phaseMain")) $("#phaseMain").addEventListener("click",()=>({
      transformation:endTransformation,reveal:revealLook,shopping:finishShopping,stage:resolveStage,cleanup:cleanup
    }[state.phase]()));
    if($("#battleBtn")) $("#battleBtn").addEventListener("click",dragdagulan);

    $("#gameLog").innerHTML=state.log.slice(-30).map(x=>`<div class="log-entry ${x.kind}">${x.text}</div>`).join("");
  }

  function saveState(){
    if(!state) return;
    try{localStorage.setItem("hhDigitalSave",JSON.stringify(state));}catch{}
  }
  function loadState(){
    try{
      const raw=localStorage.getItem("hhDigitalSave"); if(!raw) return false;
      state=JSON.parse(raw);
      if(state?.queen && state.stageIndex>=state.stages.length) state.phase="finished";
      return !!state?.queen;
    }catch{return false;}
  }
  function newRun(){
    if(state && !confirm("Start a new run? Your current unsaved progress on screen will be replaced.")) return;
    state=null; localStorage.removeItem("hhDigitalSave"); $("#endModal").classList.add("hidden"); renderSetup();
  }

  $("#soundBtn").addEventListener("click",e=>{soundOn=!soundOn;e.currentTarget.setAttribute("aria-pressed",soundOn);e.currentTarget.textContent=soundOn?"♪ Sound":"Sound Off";});
  $("#newRunBtn").addEventListener("click",newRun);
  $("#playAgainBtn").addEventListener("click",newRun);
  if(loadState()) showGame(); else renderSetup();

  function showGame(){ render(); }
})();

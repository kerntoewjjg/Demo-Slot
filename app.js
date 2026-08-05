const GAMES = {
  neon: {
    name:"Neon Fruits",
    symbols:["🍒","🍋","🍊","🍉","🍇","⭐","💎","7️⃣"],
    weights:[26,24,20,14,8,5,2,1]
  },
  stars: {
    name:"Lucky Stars",
    symbols:["⭐","🌙","☀️","✨","💫","💎","7️⃣","👑"],
    weights:[25,23,18,14,9,6,3,2]
  },
  gems: {
    name:"Gem Rush",
    symbols:["💎","🔷","🔶","🟢","🟣","💠","👑","7️⃣"],
    weights:[28,22,18,13,9,6,3,1]
  }
};

let state = {
  game:"neon", balance:100000, bet:100, spins:0, wins:0, bestWin:0,
  history:[], busy:false
};

const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("en-US");

function weightedSymbol(game){
  const data=GAMES[game], total=data.weights.reduce((a,b)=>a+b,0);
  let r=Math.random()*total;
  for(let i=0;i<data.symbols.length;i++){r-=data.weights[i];if(r<0)return data.symbols[i]}
  return data.symbols[0];
}
function multiplier(reels){
  if(reels[0]===reels[1] && reels[1]===reels[2]){
    if(reels[0]==="7️⃣") return 50;
    if(reels[0]==="💎" || reels[0]==="👑") return 25;
    if(reels[0]==="⭐") return 15;
    return 10;
  }
  if(reels[0]===reels[1] || reels[1]===reels[2] || reels[0]===reels[2]) return 2;
  return 0;
}
function render(){
  $("#balance").textContent=fmt(state.balance);$("#bet").textContent=fmt(state.bet);
  $("#spins").textContent=fmt(state.spins);$("#wins").textContent=fmt(state.wins);$("#bestWin").textContent=fmt(state.bestWin);
  $("#gameName").textContent=GAMES[state.game].name;
  $("#historyList").innerHTML=state.history.length ? state.history.map(h =>
    `<div class="history-row"><span>${h.time} · ${h.game}</span><span>${h.symbols.join(" ")}</span><b class="${h.win>0?"win-text":""}">${h.win>0?"+"+fmt(h.win):"−"+fmt(h.bet)}</b></div>`
  ).join("") : `<p class="empty">No spins yet.</p>`;
  document.querySelectorAll(".game-tab").forEach(b=>b.classList.toggle("active",b.dataset.game===state.game));
}
function save(){localStorage.setItem("neonReelsState",JSON.stringify(state))}
function load(){try{const x=JSON.parse(localStorage.getItem("neonReelsState"));if(x)state={...state,...x}}catch(e){}}

async function spin(){
  if(state.busy) return;
  if(state.balance < state.bet){$("#result").textContent="Not enough demo coins. Reset to refill.";$("#result").className="result bad";return}
  state.busy=true;$("#spinBtn").disabled=true;state.balance-=state.bet;state.spins++;
  $("#result").textContent="Spinning…";$("#result").className="result";
  const reels=[...document.querySelectorAll(".reel")];
  reels.forEach(r=>{r.classList.remove("win");r.classList.add("spinning")});
  const final=[weightedSymbol(state.game),weightedSymbol(state.game),weightedSymbol(state.game)];
  await new Promise(r=>setTimeout(r,650));
  reels.forEach((r,i)=>{r.querySelector("span").textContent=final[i];r.classList.remove("spinning")});
  const mult=multiplier(final), win=state.bet*mult;
  if(win){state.balance+=win;state.wins++;state.bestWin=Math.max(state.bestWin,win);
    reels.forEach(r=>r.classList.add("win"));$("#result").textContent=`Nice! +${fmt(win)} demo coins (${mult}×)`;$("#result").className="result good";
  }else{$("#result").textContent="No win this spin — try again.";$("#result").className="result"}
  state.history.unshift({time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),game:GAMES[state.game].name,symbols:final,bet:state.bet,win});
  state.history=state.history.slice(0,20);state.busy=false;$("#spinBtn").disabled=false;save();render();
}

$("#spinBtn").addEventListener("click",spin);
$("#betDown").addEventListener("click",()=>{state.bet=Math.max(10,state.bet-10);render();save()});
$("#betUp").addEventListener("click",()=>{state.bet=Math.min(1000,state.bet+10);render();save()});
$("#resetBtn").addEventListener("click",()=>{state.balance=100000;state.bet=100;state.spins=0;state.wins=0;state.bestWin=0;state.history=[];$("#result").textContent="Demo coins reset to 100,000.";$("#result").className="result good";save();render()});
$("#clearHistory").addEventListener("click",()=>{state.history=[];save();render()});
document.querySelectorAll(".game-tab").forEach(b=>b.addEventListener("click",()=>{if(!state.busy){state.game=b.dataset.game;save();render()}}));
document.addEventListener("keydown",e=>{if(e.code==="Space"){e.preventDefault();spin()}});

load();render();

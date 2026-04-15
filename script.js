let level = 0, qIndex = 0, score = 0, lives = 3, time = 0, timer;
let player = "";

// ELEMENTS
const home = document.getElementById("home");
const nameScreen = document.getElementById("nameScreen");
const rules = document.getElementById("rules");
const game = document.getElementById("game");

const playerName = document.getElementById("playerName");
const missionTitle = document.getElementById("missionTitle");
const missionStory = document.getElementById("missionStory");
const question = document.getElementById("question");
const options = document.getElementById("options");
const result = document.getElementById("result");
const hint = document.getElementById("hint");

const livesSpan = document.getElementById("lives");
const scoreSpan = document.getElementById("score");
const timeSpan = document.getElementById("time");
const bar = document.getElementById("bar");

// AUDIO
const introSound = document.getElementById("introSound");
const voice = document.getElementById("voice");
const bg = document.getElementById("bg");
const click = document.getElementById("click");
const correct = document.getElementById("correct");
const wrong = document.getElementById("wrong");

// NAVIGATION
function goToName(){
introSound.play().catch(()=>{});
setTimeout(()=>voice.play().catch(()=>{}),2000);

home.style.display="none";
nameScreen.style.display="flex";
}

function goToRules(){
if(playerName.value===""){
alert("Enter your name!");
return;
}
player = playerName.value;

nameScreen.style.display="none";
rules.style.display="flex";
}

function goToGame(){
rules.style.display="none";
game.style.display="block";

bg.volume = 0.3;
bg.play().catch(()=>{});

startGame(0);
}

// MATRIX (safe)
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.style.position="fixed";
canvas.style.top="0";
canvas.style.left="0";
canvas.style.zIndex="0";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let letters = "01ABCDEF";
let drops = Array(Math.floor(canvas.width/10)).fill(1);

function draw(){
ctx.fillStyle="rgba(0,0,0,0.05)";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="#00ffcc";
ctx.font="12px monospace";

for(let i=0;i<drops.length;i++){
let text = letters[Math.floor(Math.random()*letters.length)];
ctx.fillText(text,i*10,drops[i]*10);

if(drops[i]*10 > canvas.height) drops[i]=0;
drops[i]++;
}
}
setInterval(draw,33);

// TYPING
const lines=[
"Initializing secure system...",
"Loading cyber modules...",
"Connecting to network...",
"Access Granted. Welcome Agent."
];

let i=0,j=0;

function type(){
let el=document.getElementById("typing");
if(!el) return;

if(i<lines.length){
if(j<lines[i].length){
el.innerHTML+=lines[i][j++];
setTimeout(type,30);
}else{
el.innerHTML+="<br>";
i++; j=0;
setTimeout(type,300);
}
}
}

window.onload=type;

// GAME DATA (20 QUESTIONS FIXED)
const levels=[{
title:"Mission 1: Phishing Attack",
story:"Investigate fake bank emails and protect users from scams.",
questions:[
{q:"Bank asks PIN via email",o:["Enter","Verify app","Ignore"],a:1,hint:"Banks never ask PIN"},
{q:"Fake login link",o:["Click","Check URL","Ignore"],a:1,hint:"Check domain"},
{q:"Unexpected OTP",o:["Share","Ignore","Secure"],a:2,hint:"Someone attacking"},
{q:"HTTP site asks password",o:["Enter","Check HTTPS","Ignore"],a:1,hint:"HTTPS safe"},
{q:"Urgent account block msg",o:["Click","Verify app","Ignore"],a:1,hint:"Scam urgency"},
{q:"Unknown SMS permission",o:["Allow","Deny","Ignore"],a:1,hint:"Risky permission"},
{q:"Lottery message",o:["Give","Ignore","Share"],a:1,hint:"Fake lottery"},
{q:"Unknown attachment",o:["Open","Delete","Forward"],a:1,hint:"Malware risk"},
{q:"ATM PIN call",o:["Share","Cut","OTP"],a:1,hint:"Never share PIN"},
{q:"Fake website domain",o:["Use","Check","Ignore"],a:1,hint:"Verify URL"},
{q:"Public WiFi login",o:["Login","Avoid","Use"],a:1,hint:"Unsafe WiFi"},
{q:"QR payment unknown",o:["Scan","Verify","Ignore"],a:1,hint:"QR scams"},
{q:"Virus popup",o:["Click","Close","Install"],a:1,hint:"Fake alert"},
{q:"Urgent money request",o:["Send","Call friend","Ignore"],a:1,hint:"Verify identity"},
{q:"Disable antivirus",o:["Disable","Exit","Ignore"],a:1,hint:"Never disable"},
{q:"Location permission always",o:["Allow","Deny","Ignore"],a:1,hint:"Privacy risk"},
{q:"Aadhaar link email",o:["Share","Verify","Ignore"],a:1,hint:"Sensitive data"},
{q:"Remote support access",o:["Allow","Deny","Ask again"],a:1,hint:"Dangerous"},
{q:"Win iPhone link",o:["Click","Ignore","Share"],a:1,hint:"Scam"},
{q:"Fake job fee",o:["Pay","Verify","Ignore"],a:1,hint:"Job scam"}
]
}];

function startGame(l){
level=l; qIndex=0; score=0; lives=3; time=0;

missionTitle.innerText=levels[level].title;
missionStory.innerText=levels[level].story;

updateUI();
startTimer();
loadQ();
}

function loadQ(){
hint.innerText=""; result.innerText="";
let c=levels[level].questions[qIndex];

question.innerText=c.q;

let arr=[...c.o];
let correctAns=c.o[c.a];
arr.sort(()=>Math.random()-0.5);

let correctIndex=arr.indexOf(correctAns);

options.innerHTML=arr.map((o,i)=>
`<button onclick="check(${i},${correctIndex})">${o}</button>`
).join("");

bar.style.width=((qIndex)/levels[level].questions.length*100)+"%";
}

function check(sel,cor){
click.play();

let btn=document.querySelectorAll("#options button");

btn.forEach((b,i)=>{
b.disabled=true;
b.style.background=i===cor?"green":"red";
});

if(sel===cor){
correct.play();
score+=10;
result.innerText="Correct";
}else{
wrong.play();
lives--;
result.innerText="Wrong";
}

updateUI();

if(lives<=0) endGame();
}

function nextQ(){
qIndex++;
if(qIndex<levels[level].questions.length) loadQ();
else endGame();
}

function showHint(){
hint.innerText=levels[level].questions[qIndex].hint;
}

function startTimer(){
timer=setInterval(()=>{time++;timeSpan.innerText=time;},1000);
}

function updateUI(){
livesSpan.innerText=lives;
scoreSpan.innerText=score;
}

function endGame(){
clearInterval(timer);
game.innerHTML=`
<h2>Mission Completed</h2>
<p>Agent: ${player}</p>
<p>Score: ${score}</p>
<p>Time: ${time}s</p>
<button onclick="location.reload()">Restart</button>
`;
}
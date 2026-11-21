const BOOKS=[
 {id:1,t:"Laskar Pelangi",a:"Andrea Hirata",c:"Novel",h:"#C62E2B"},
 {id:2,t:"Bumi Manusia",a:"Pramoedya Ananta Toer",c:"Sejarah",h:"#8A4B2D"},
 {id:3,t:"Cantik Itu Luka",a:"Eka Kurniawan",c:"Novel",h:"#A8324A"},
 {id:4,t:"Laut Bercerita",a:"Leila S. Chudori",c:"Novel",h:"#2D6A7A"},
 {id:5,t:"Sapiens",a:"Yuval Noah Harari",c:"Sains",h:"#3B7F49"},
 {id:6,t:"Atomic Habits",a:"James Clear",c:"Pengembangan diri",h:"#B8651B"},
 {id:7,t:"Filosofi Teras",a:"Henry Manampiring",c:"Pengembangan diri",h:"#5A7A2D"},
 {id:8,t:"Sejarah Indonesia Modern",a:"M.C. Ricklefs",c:"Sejarah",h:"#6B4A3A"},
 {id:9,t:"Cosmos",a:"Carl Sagan",c:"Sains",h:"#2F4F7F"},
 {id:10,t:"Negeri 5 Menara",a:"Ahmad Fuadi",c:"Novel",h:"#B03A2E"},
 {id:11,t:"Dunia Sophie",a:"Jostein Gaarder",c:"Filsafat",h:"#7A3F7F"},
 {id:12,t:"Pulang",a:"Tere Liye",c:"Novel",h:"#9C2F2F"}
];
const KEY="apel-loans";
let cat="Semua", q="", loans={};
try{loans=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){loans={}}
// Buku yang sudah dipinjam orang lain (data contoh)
const taken=new Set([3,9]);
const $=s=>document.querySelector(s);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(loans))}catch(e){}};
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),2200)}
function due(id){return new Date(loans[id]).toLocaleDateString("id-ID",{day:"numeric",month:"long"})}

function chips(){
  const cats=["Semua",...new Set(BOOKS.map(b=>b.c))];
  $("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c===cat}" data-c="${c}">${c}</button>`).join("");
}
function render(){
  const list=BOOKS.filter(b=>(cat==="Semua"||b.c===cat)&&(b.t+b.a).toLowerCase().includes(q));
  $("#grid").innerHTML=list.length?list.map(b=>{
    const mine=b.id in loans, out=taken.has(b.id)&&!mine;
    return `<article class="book"><div class="cover" style="background:${b.h}"><svg><use href="#ap"/></svg><span>${b.c}</span></div>
    <div class="info"><h3>${b.t}</h3><div class="by">${b.a}</div>
    <div class="row"><span class="tag ${out?'out':''}">${mine?'Kembali '+due(b.id):out?'Sedang dipinjam':'Tersedia'}</span>
    <button class="btn ${mine?'ret':''}" data-id="${b.id}" ${out?'disabled':''}>${mine?'Kembalikan':'Pinjam'}</button></div></div></article>`}).join("")
  :`<div class="empty"><h3>Belum ada buku yang cocok</h3>Coba kata kunci lain atau pilih kategori Semua.</div>`;
  $("#count").textContent=Object.keys(loans).length;
}
function loanList(){
  const ids=Object.keys(loans);
  $("#loanList").innerHTML=ids.length?ids.map(id=>{const b=BOOKS.find(x=>x.id==id);
    return `<li><div><strong>${b.t}</strong><small>Kembali ${due(id)}</small></div><button class="link" data-r="${id}">Kembalikan</button></li>`}).join("")
  :`<li style="justify-content:center">Kamu belum meminjam buku apa pun.</li>`;
}
$("#chips").onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;chips();render()}};
$("#q").oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
$("#grid").onclick=e=>{
  const id=e.target.dataset.id; if(!id)return;
  const b=BOOKS.find(x=>x.id==id);
  if(id in loans){delete loans[id];toast("Dikembalikan: "+b.t)}
  else if(Object.keys(loans).length>=3){toast("Batas pinjam 3 buku. Kembalikan satu dulu.");return}
  else{loans[id]=Date.now()+7*864e5;toast("Dipinjam: "+b.t+". Kembali "+due(id))}
  save();render();
};
$("#openLoans").onclick=()=>{loanList();$("#dlg").showModal()};
$("#closeDlg").onclick=()=>$("#dlg").close();
$("#loanList").onclick=e=>{const id=e.target.dataset.r;if(!id)return;
  const b=BOOKS.find(x=>x.id==id);delete loans[id];save();render();loanList();toast("Dikembalikan: "+b.t)};
chips();render();

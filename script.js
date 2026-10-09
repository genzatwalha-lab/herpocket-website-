const products = [
  {id:1,name:"Pink Romance",type:"floral",price:12,desc:"Soft petals & feminine musk",color:"linear-gradient(135deg,#ffd1e5,#f34791)",tag:"Bestseller"},
  {id:2,name:"Sweet Vanilla",type:"sweet",price:12,desc:"Creamy vanilla & warm sugar",color:"linear-gradient(135deg,#ffe4c1,#efa45a)",tag:"Sweet"},
  {id:3,name:"Coco Glow",type:"fresh",price:14,desc:"Coconut, citrus & clean woods",color:"linear-gradient(135deg,#fff3cb,#f2c46d)",tag:"New"},
  {id:4,name:"Midnight Noir",type:"bold",price:15,desc:"Dark amber & smooth woods",color:"linear-gradient(135deg,#2a222c,#050406)",tag:"Bold"},
  {id:5,name:"Blush Bloom",type:"floral",price:12,desc:"Rose, peony & soft musk",color:"linear-gradient(135deg,#ffc7db,#ef77a7)",tag:"Floral"},
  {id:6,name:"Fresh Muse",type:"fresh",price:11,desc:"Fresh berries & airy florals",color:"linear-gradient(135deg,#d5eaff,#73b7e8)",tag:"Fresh"},
  {id:7,name:"Golden Girl",type:"bold",price:15,desc:"Golden amber, vanilla & spice",color:"linear-gradient(135deg,#ffe68b,#cf8e13)",tag:"Icon"},
  {id:8,name:"Berry Kiss",type:"sweet",price:12,desc:"Juicy berries & pink sugar",color:"linear-gradient(135deg,#ffb8d5,#e52f76)",tag:"Sweet"}
];

let cart = JSON.parse(localStorage.getItem("hps-cart") || "[]");

const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const drawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("drawerBackdrop");

function renderProducts(filter="all"){
  grid.innerHTML = products.filter(p => filter==="all" || p.type===filter).map(p => `
    <article class="product-card">
      <span class="badge">${p.tag}</span>
      <div class="product-visual" style="background:${p.color}">
        <div class="mini-bottle" style="background:${p.color}">
          <span class="mini-label">${p.name.toUpperCase()}</span>
        </div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-row"><span class="price">$${p.price.toFixed(2)}</span>
          <button class="add" aria-label="Add ${p.name}" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart();
  openCart();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
}

function saveCart(){
  localStorage.setItem("hps-cart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  const detailed = cart.map(item=>({...products.find(p=>p.id===item.id),qty:item.qty}));
  cartCount.textContent = detailed.reduce((sum,i)=>sum+i.qty,0);
  cartItems.innerHTML = detailed.length ? detailed.map(i=>`
    <div class="cart-item">
      <div><b>${i.name}</b><br><small>$${i.price.toFixed(2)} × ${i.qty}</small></div>
      <div><b>$${(i.price*i.qty).toFixed(2)}</b><br><button onclick="removeFromCart(${i.id})">Remove</button></div>
    </div>`).join("") : `<p style="color:#756774">Your bag is waiting for a little fragrance magic. ✨</p>`;
  cartTotal.textContent = "$" + detailed.reduce((sum,i)=>sum+i.price*i.qty,0).toFixed(2);
}

function openCart(){drawer.classList.add("open");backdrop.classList.add("show");drawer.setAttribute("aria-hidden","false")}
function closeCart(){drawer.classList.remove("open");backdrop.classList.remove("show");drawer.setAttribute("aria-hidden","true")}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
backdrop.addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){alert("Your bag is empty.");return}
  alert("Demo checkout: connect this button to your payment provider or WhatsApp order flow.");
});
document.querySelector(".menu-toggle").addEventListener("click",()=>{
  document.getElementById("nav").classList.toggle("open");
});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));

document.getElementById("newsletterForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  document.getElementById("formMessage").textContent="Thank you — you're on the list! 💗";
  e.target.reset();
});

renderProducts();
renderCart();

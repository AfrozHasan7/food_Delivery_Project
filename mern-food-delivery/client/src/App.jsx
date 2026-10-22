import React, { useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, MapPin, Clock3, Star, Plus, Minus, Trash2, ArrowRight, Utensils, Menu as MenuIcon, X, UserRound, LogOut, PackageCheck } from "lucide-react";
import { api } from "./api";
import { useStore } from "./store";

const money = (value) => `₹${Number(value).toFixed(0)}`;

function Header() {
  const { cartCount, user, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  return <header className="header"><div className="nav-wrap">
    <Link className="brand" to="/"><span className="brand-mark"><Utensils size={20}/></span>quick<span>bite</span></Link>
    <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
      <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
      <a href="/#menu" onClick={() => setMobileOpen(false)}>Explore menu</a>
      {user && <NavLink to="/orders" onClick={() => setMobileOpen(false)}>My orders</NavLink>}
    </div>
    <div className="nav-actions">
      {user ? <button className="user-chip" onClick={logout} title="Sign out"><UserRound size={16}/><span>{user.name.split(" ")[0]}</span><LogOut size={15}/></button> : <Link className="signin-link" to="/auth">Sign in</Link>}
      <Link to="/cart" className="cart-button"><ShoppingBag size={18}/><span>Cart</span><b>{cartCount}</b></Link>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <MenuIcon/>}</button>
    </div>
  </div></header>;
}

function FoodCard({ food, index }) {
  const { addToCart, cart, changeQuantity } = useStore();
  const item = cart.find((entry) => entry._id === food._id);
  return <article className="food-card" style={{ animationDelay: `${index * 55}ms` }}>
    <div className="food-image-wrap"><img className="food-image" src={food.image} alt={food.name} loading="lazy" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"; }}/>
      <span className="food-rating"><Star size={13} fill="currentColor"/>{food.rating}</span>
      <span className={`veg-dot ${food.vegetarian ? "" : "nonveg"}`} title={food.vegetarian ? "Vegetarian" : "Non-vegetarian"}/></div>
    <div className="food-info"><span className="food-category">{food.category}</span><h3>{food.name}</h3><p>{food.description}</p>
      <div className="food-bottom"><strong>{money(food.price)}</strong>{item ? <div className="quantity-control"><button onClick={() => changeQuantity(food._id, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><b>{item.quantity}</b><button onClick={() => changeQuantity(food._id, 1)} aria-label="Increase quantity"><Plus size={14}/></button></div> : <button className="add-button" onClick={() => addToCart(food)}><Plus size={16}/> Add</button>}</div>
    </div>
  </article>;
}

function Home() {
  const { foods, loadingFoods } = useStore();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const categories = ["All", ...new Set(foods.map((food) => food.category))];
  const filtered = foods.filter((food) => (category === "All" || food.category === category) && `${food.name} ${food.description}`.toLowerCase().includes(search.toLowerCase()));
  return <main>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span/> GOOD FOOD. GOOD MOOD.</div><h1>Your cravings,<br/><em>delivered.</em></h1><p>Freshly made favourites from the best kitchens around you. Order in a few taps and make today delicious.</p>
      <div className="hero-actions"><a className="primary-button" href="#menu">Explore menu <ArrowRight size={18}/></a><div className="delivery-note"><span className="delivery-icon"><Clock3 size={18}/></span><div><b>25–35 min</b><small>Average delivery</small></div></div></div>
      <div className="hero-trust"><div className="avatar-stack"><span>🍕</span><span>🍔</span><span>🥗</span></div><div><div className="trust-stars">★★★★★ <b>4.8/5</b></div><small>Loved by foodies everywhere</small></div></div>
    </div><div className="hero-visual"><div className="hero-blob"/><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000" alt="Fresh colourful meal bowl" onError={(e) => { e.currentTarget.style.display = "none"; }}/><div className="floating-card floating-top"><span>🥑</span><div><b>Fresh ingredients</b><small>Made with care</small></div></div><div className="floating-card floating-bottom"><span className="green-check">✓</span><div><b>Free delivery</b><small>On orders over ₹499</small></div></div></div>
      <div className="hero-decor decor-one">✳</div><div className="hero-decor decor-two">✦</div>
    </section>
    <section className="benefits"><div><span className="benefit-icon orange">♨</span><div><b>Freshly prepared</b><small>Made when you order</small></div></div><div><span className="benefit-icon green">⌁</span><div><b>Fast delivery</b><small>At your doorstep, quick</small></div></div><div><span className="benefit-icon yellow">♡</span><div><b>Made with love</b><small>Good food, happy you</small></div></div></section>
    <section className="menu-section" id="menu"><div className="section-heading"><div><div className="eyebrow">THE GOOD STUFF</div><h2>Find your <em>favourite.</em></h2><p>Something delicious for every kind of craving.</p></div><div className="search-box"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes..." aria-label="Search dishes"/></div></div>
      <div className="category-list">{categories.map((cat) => <button key={cat} className={`category-pill ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>{cat === "All" ? "🍽️" : cat === "Pizza" ? "🍕" : cat === "Burgers" ? "🍔" : cat === "Desserts" ? "🍰" : cat === "Drinks" ? "🥤" : "🥗"} <span>{cat}</span></button>)}</div>
      {loadingFoods ? <div className="empty-state">Loading today's menu…</div> : filtered.length ? <div className="food-grid">{filtered.map((food, index) => <FoodCard key={food._id} food={food} index={index}/>)}</div> : <div className="empty-state">No dishes found. Try another search.</div>}
    </section>
    <section className="bottom-cta"><div><span className="eyebrow">A LITTLE TREAT FOR YOU</span><h2>Good food is always<br/>a good <em>idea.</em></h2><p>Pick your favourites. We'll take care of the rest.</p><a href="#menu" className="primary-button">Order something tasty <ArrowRight size={18}/></a></div><div className="cta-emoji">🍜<span>✨</span></div></section>
    <Footer/>
  </main>;
}

function Footer() { return <footer className="footer"><Link className="brand" to="/"><span className="brand-mark"><Utensils size={18}/></span>quick<span>bite</span></Link><span>Made fresh. Delivered with love. © {new Date().getFullYear()} QuickBite</span><a href="#menu">Back to menu ↑</a></footer>; }

function Cart() {
  const { cart, changeQuantity, subtotal, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const fee = subtotal >= 499 || subtotal === 0 ? 0 : 35;
  async function placeOrder(e) {
    e.preventDefault(); setError("");
    if (!user) { navigate("/auth?next=cart"); return; }
    setPlacing(true);
    try {
      await api("/orders", { method: "POST", body: JSON.stringify({ items: cart.map((item) => ({ foodId: item._id, quantity: item.quantity })), deliveryAddress: address, phone }) });
      clearCart(); navigate("/orders?placed=1");
    } catch (err) { setError(err.message); }
    finally { setPlacing(false); }
  }
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">YOUR SELECTION</span><h1>Your <em>cart.</em></h1><p>One step closer to something delicious.</p></div>
    {!cart.length ? <div className="empty-cart"><span>🛍️</span><h2>Your cart is looking hungry.</h2><p>Add a few favourites from our menu to get started.</p><Link className="primary-button" to="/">Browse menu <ArrowRight size={17}/></Link></div> :
    <div className="checkout-layout"><section className="cart-items"><div className="cart-heading"><h2>Order items <span>{cart.length}</span></h2><button className="text-button" onClick={clearCart}><Trash2 size={15}/> Clear cart</button></div>
      {cart.map((item) => <article className="cart-row" key={item._id}><img src={item.image} alt={item.name}/><div className="cart-row-info"><h3>{item.name}</h3><small>{item.category}</small><b>{money(item.price)}</b></div><div className="quantity-control"><button onClick={() => changeQuantity(item._id, -1)} aria-label="Decrease quantity"><Minus size={14}/></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item._id, 1)} aria-label="Increase quantity"><Plus size={14}/></button></div><strong className="line-total">{money(item.price * item.quantity)}</strong></article>)}
      <Link className="continue-link" to="/">← Continue shopping</Link>
    </section><aside className="summary-card"><h2>Order summary</h2><div className="summary-line"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="summary-line"><span>Delivery fee</span><b>{fee === 0 ? "FREE" : money(fee)}</b></div>{subtotal < 499 && <p className="delivery-hint">Add {money(499 - subtotal)} more for free delivery.</p>}<div className="summary-total"><span>Total</span><strong>{money(subtotal + fee)}</strong></div><form onSubmit={placeOrder} className="checkout-form"><label>Delivery address<textarea required minLength="8" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no., street, area, city" rows="3"/></label><label>Phone number<input required pattern="[0-9+() -]{10,16}" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your contact number"/></label><div className="payment-note"><span>💵</span><div><b>Cash on delivery</b><small>Pay when your order arrives</small></div></div>{error && <p className="error-message">{error}</p>}<button className="primary-button full-button" disabled={placing}>{placing ? "Placing order…" : user ? "Place order" : "Sign in to checkout"} <ArrowRight size={17}/></button></form><small className="secure-note">🔒 Your details are used to fulfil this order.</small></aside></div>}
    <Footer/>
  </main>;
}

function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const data = await api(`/auth/${mode === "login" ? "login" : "register"}`, { method: "POST", body: JSON.stringify({ name, email, password }) });
      localStorage.setItem("quickbite_token", data.token); setUser(data.user); navigate("/");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="auth-page"><div className="auth-art"><div className="auth-art-content"><span className="brand-mark"><Utensils size={22}/></span><h2>Every craving<br/>has a <em>home.</em></h2><p>Fresh flavours and feel-good favourites, just a few taps away.</p><div className="auth-food-art">🍔 🍕 🥗 🍜</div></div></div><section className="auth-panel"><Link to="/" className="back-link">← Back to menu</Link><div className="auth-card"><span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "JOIN THE TABLE"}</span><h1>{mode === "login" ? "Good to see you." : "Let's get started."}</h1><p>{mode === "login" ? "Sign in to continue your delicious journey." : "Create an account to place and track orders."}</p><div className="auth-tabs"><button className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button><button className={mode === "register" ? "selected" : ""} onClick={() => { setMode("register"); setError(""); }}>Create account</button></div><form onSubmit={submit} className="auth-form">{mode === "register" && <label>Full name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name"/></label>}<label>Email address<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label><label>Password<input required type="password" minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode === "login" ? "current-password" : "new-password"}/></label>{error && <p className="error-message">{error}</p>}<button className="primary-button full-button" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={17}/></button></form><small className="auth-footnote">By continuing, you agree to our demo terms of service.</small></div></section></main>;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useStore();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    api("/orders/my").then((data) => setOrders(data.orders)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [user]);
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">THE GOOD TIMES</span><h1>Your <em>orders.</em></h1><p>All your delicious decisions, in one place.</p></div>{loading ? <div className="empty-state">Loading your orders…</div> : error ? <p className="error-message">{error}</p> : !orders.length ? <div className="empty-cart"><span>📦</span><h2>No orders just yet.</h2><p>Your next favourite meal is waiting to be discovered.</p><Link className="primary-button" to="/">Explore menu <ArrowRight size={17}/></Link></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div className="order-card-top"><div><span className="order-id">ORDER #{order._id.slice(-7).toUpperCase()}</span><p>{new Date(order.createdAt).toLocaleString()}</p></div><span className={`status-pill ${order.status.toLowerCase().replaceAll(" ", "-")}`}><PackageCheck size={14}/>{order.status}</span></div><div className="order-foods">{order.items.map((item, i) => <div key={i} className="order-food-row"><span>{item.quantity} × {item.name}</span><b>{money(item.price * item.quantity)}</b></div>)}</div><div className="order-card-bottom"><span>Cash on delivery · {order.deliveryAddress}</span><strong>{money(order.total)}</strong></div></article>)}</div>}<Footer/></main>;
}

export default function App() {
  return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/cart" element={<Cart/>}/><Route path="/auth" element={<Auth/>}/><Route path="/orders" element={<Orders/>}/><Route path="*" element={<Home/>}/></Routes></>;
}

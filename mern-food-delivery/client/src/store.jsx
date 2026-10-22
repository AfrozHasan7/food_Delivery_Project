import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("quickbite_cart") || "[]"));
  const [user, setUser] = useState(null);
  const [loadingFoods, setLoadingFoods] = useState(true);

  useEffect(() => {
    localStorage.setItem("quickbite_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
api("/foods")
.then((data) => {
console.log("FOODS API RESPONSE:", data);
console.log("FOODS ARRAY:", data.foods);
setFoods(data.foods);
})
.catch((error) => console.error("FOODS ERROR:", error))
.finally(() => setLoadingFoods(false));

if (localStorage.getItem("quickbite_token")) {
api("/auth/me")
.then(({ user }) => setUser(user))
.catch(() => {
localStorage.removeItem("quickbite_token");
});
}
}, []);

  const addToCart = (food) => setCart((current) => {
    const found = current.find((item) => item._id === food._id);
    return found
      ? current.map((item) => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...food, quantity: 1 }];
  });
  const changeQuantity = (id, delta) => setCart((current) =>
    current.map((item) => item._id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0)
  );
  const clearCart = () => setCart([]);
  const logout = () => { localStorage.removeItem("quickbite_token"); setUser(null); };

  const value = useMemo(() => ({
    foods, loadingFoods, cart, user, setUser, addToCart, changeQuantity, clearCart, logout,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [foods, loadingFoods, cart, user]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

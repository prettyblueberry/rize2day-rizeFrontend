import { useState, useEffect } from 'react';
import { useSigningClient } from 'app/cosmwasm';
import { MdOutlineShoppingCart, MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { toast } from 'react-toastify';

const CartButton = ({
  className = '',
  nftId
}) => {
  const [isCart, setIsCart] = useState(false);
  const { cartCount, setCartCount }: any = useSigningClient();
  useEffect(() => {
    let cartInfo = JSON.parse(localStorage.getItem('shoppingCart'));
    if (nftId) {
      const found = cartInfo?.filter((item: any) => item === nftId);
      if (!found || (found && found.length === 0)) {
        setIsCart(false);
      } else if (found.length > 0) {
        setIsCart(true);
      }
    }
  }, [nftId, cartCount])

  const handleCart = () => {
    let cartInfo = JSON.parse(localStorage.getItem('shoppingCart'));
    if (!isCart) {
      if (cartInfo && cartInfo.length > 0) {
        const found = cartInfo.filter((item: any) => item === nftId);
        if (found.length === 0) {
          cartInfo.push(nftId);
        }
      } else {
        cartInfo = [];
        cartInfo.push(nftId);
      }
      toast.success("Successfully added to cart");
      localStorage.setItem("shoppingCart", JSON.stringify(cartInfo));
    } else {
      if (cartInfo && cartInfo.length > 0) {
        const index = cartInfo.findIndex((item: any) => item === nftId);
        if (index > -1) {
          cartInfo.splice(index, 1);
          toast.success("Successfully removed from cart");
          localStorage.setItem("shoppingCart", JSON.stringify(cartInfo));
        }
      }
    }
    setCartCount(cartInfo.length);
    setIsCart(!isCart);
  }
  return (
    <button
      className={`pr-3 h-10 flex items-center justify-center rounded-full text-white ${className}`}
      onClick={handleCart}
    >
      {isCart ? (
        <MdOutlineRemoveShoppingCart size={21} />
      ) : (
        <MdOutlineShoppingCart size={21} />
      )}
    </button>
  );
};

export default CartButton;

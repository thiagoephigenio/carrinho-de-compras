import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    return JSON.parse(storagedCart || '[]');
  });

  const addProduct = async (productId: number) => {
    try {
      const { amount: stockedAmount }: Stock = await api.get(
        `stock/${productId}`
      );

      const storagedCart = [...cart];

      const storagedProduct = storagedCart.find(
        product => product.id === productId
      );

      if (storagedProduct) {
        // if ( stockedAmount > storagedProduct.amount ) {
        //   console.log('pode atualizar')
        // }
        console.log('pode atualizar');
      } else {
        const product = await api.get<Product>(`products/${productId}`);
        
        if(product.data.amount){
          const newProduct = { ...product.data, amount: 1 }

          storagedCart.push(newProduct);
          setCart(storagedCart)
          localStorage.setItem('@RocketShoes:cart', JSON.stringify(storagedCart));
        }

      }

      // if (oi.length === 0) {
      //   if (stockedProduct.data.amount > 0) {
      //     let storagedProducts = localStorage.getItem('@RocketShoes:cart');

      //     let teste = JSON.parse(storagedProducts || '[]')

      //     teste.push(response.data)

      //     localStorage.setItem('@RocketShoes:cart', JSON.stringify(teste))

      //   }
      // } else {
      //   updateProductAmount({ productId: productId, amount: response.data.amount });
      // }



    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      let storagedProducts: Product[] = JSON.parse(
        localStorage.getItem('@RocketShoes:cart') || '[]'
      );
      console.log(cart)
      const teste = storagedProducts.filter(
        product => product.id !== productId
      )
      setCart(
        teste
      )
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
      console.log(teste)
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      console.log(productId, amount)
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

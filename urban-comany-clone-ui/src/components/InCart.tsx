import React from 'react';
import {TouchableOpacity, Alert, Text} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {addToCart} from '../store/slices/cartSlice';
import {useAppSelector, useAppDispatch} from '../hooks';
import {ProductType} from '../types';

import {svg} from '../assets/svg';

type Props = {
  item: ProductType;
  containerStyle?: object;
};

const InCart: React.FC<Props> = ({item, containerStyle}): JSX.Element => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cartSlice.list);
  const exist = (item: ProductType) => cart.find((i) => i.id === item.id);

  return (
    <TouchableOpacity
      style={{...containerStyle}}
      onPress={() => {
        if (exist(item)) {
          Alert.alert(
            'Product already in cart',
            'The product already exists in the cart, please remove the product from the cart',
            [{text: 'Ok'}],
          );
        }
        if (!exist(item)) {
          dispatch(addToCart(item));
          showMessage({
            message: 'Success',
            description: `${item.name} added to cart`,
            type: 'success',
            icon: 'success',
          });
        }
      }}
    >
      <svg.PlusSvg />
      {/* <Text>d</Text> */}
    </TouchableOpacity>
  );
};

export default InCart;

import React, {PropsWithChildren} from 'react';
import {View, ViewStyle} from 'react-native';

import {svg} from '../../assets/svg';

type Props = PropsWithChildren<{
  containerStyle?: ViewStyle;
}>;

const NewBadge: React.FC<Props> = ({containerStyle}): JSX.Element => {
  return (
    <View style={{...containerStyle}}>
      <svg.NewSvg />
    </View>
  );
};

export default NewBadge;

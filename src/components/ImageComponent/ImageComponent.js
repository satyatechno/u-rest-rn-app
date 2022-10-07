import React, {useState} from 'react';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Svg, {SvgUri} from 'react-native-svg';

const ImageComponent = ({source, style, resizeMode, ...rest}) => {
  const [loading, setLoading] = useState(false);
  if (source?.uri && source?.uri?.endsWith('.svg'))
    return (
      <Svg height={style?.height} width={style?.width}>
        <SvgUri height={style?.height} width={style?.width} uri={source?.uri} />
      </Svg>
    );
  else
    return (
      <>
        <Image
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          source={source}
          style={[style, loading && {display: 'none'}]}
          resizeMode={resizeMode}
          {...rest}
        />
        {loading && (
          <Image
            source={source}
            style={style}
            resizeMode={resizeMode}
            {...rest}
          />
        )}
      </>
    );
};

export default ImageComponent;

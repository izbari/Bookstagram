import {Platform} from 'react-native';

const Fonts =
  Platform.OS === 'ios'
    ? {
        MetaProBook: 'MetaPro-Book',
        MetaProBlack: 'MetaPro-Black',
        MetaProBold: 'MetaPro-Bold',
        MetaProMedium: 'MetaPro-Medium',
        MetaProMediumItalic: 'MetaPro-MediumItalic',
        MetaProRegular: 'MetaPro-Norm',
      }
    : {
        MetaProBook: 'FFMetaProBook',
        MetaProBlack: 'FFMetaProBlk',
        MetaProBold: 'FFMetaProBold',
        MetaProMedium: 'FFMetaProMedium',
        MetaProMediumItalic: 'FFMetaProMedIt',
        MetaProRegular: 'FFMetaProRegular',
      };

export default Fonts;

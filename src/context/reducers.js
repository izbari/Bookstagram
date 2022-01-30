import {ToastAndroid} from 'react-native';

export default function (state, action,props) {
  function Toast(message) {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
  switch (action.type) {
    case 'SET_CALL_STATUS':
      if(action.payload.callStatus){
        props.navigation.navigate('VideoCallScreen')
      }
      return  {...state,callStatus:action.payload.callStatus}

    case 'SET_ROUTE_NAME':
      console.log("reducer calisti dispacta gelen" ,action.payload.routeName)
      return  {...state,routeName:action.payload.routeName}

    case 'SET_LANG':
      return {...state,lang:action.payload.lang}

    case 'SET_USER':
      return {...state, user: action.payload.user};

    case 'ADD_FAVORITE':
      if (state.favList.some(item => action.payload.favCard.id === item.id)) {
        Toast('You already added this book your wishlist...');
        return state;
      } else {
        Toast('This book add your wishlist successfully');
        const newList = [...state.favList, action.payload.favCard];
        return {...state, favList: newList};
      }

    case 'ADD_CART':
      if (state.cartList.some(item => item.id === action.payload.cartCard)) {
        Toast('This book add your cart multiple');
        return state;
      } else {
        Toast('This book add your cart successfully');
        const newCardList = [...state.cartList, action.payload.cartCard];
        return {...state, cartList: newCardList};
      }

    case 'ADD_TOPIC':
      return {...state, topicIds: action.payload.topicList};

    case 'REMOVE_FAVORITE':
      const newList2 = state.favList.filter(item => {
        return item.id !== action.payload.rmFavBook.id;
      });
      return {...state, favList: newList2};

    case 'REMOVE_CART':
      console.log(action.payload.rmCartBook);
      const newList3 = state.cartList.filter(item => {
        return item.id !== action.payload.rmCartBook.id;
      });
      return {...state, cartList: newList3};

    default:
      return state;
  }
}

import {ToastAndroid} from 'react-native';

export default function (state, action) {
    switch (action.type) {
        case 'ADD_FAVORITE':
           
            const newList = [...state.favList, action.payload.bookCard]
           
           
                ToastAndroid.showWithGravityAndOffset(
                    'This book add your wishlist successfully',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );
        
            return { ...state, favList: newList };


        case 'REMOVE_FAVORITE':
            const newList2 = state.favList.filter(item => { return item.id !== action.payload.item.id });
            return ({ favList: newList2 });

        case 'UPDATE_FAVORITE':
            console.log(action.payload.allItems)
            return ({ favList: action.payload.allItems });

        default:
            return state;

    }


}
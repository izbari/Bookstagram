import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const productApi = createApi({
  reducerPath: 'product',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Product'],
  endpoints: builder => ({
    getProductById: builder.query<any, string>({
      queryFn: async id => {
        try {
          const productRef = firestore().collection('products').doc(id);
          const response = await productRef.get();
          const product = {...(response.data() as any), id: response.id};
          console.warn(product, 'product');
          return {data: product};
        } catch (error) {
          return {error};
        }
      },
      providesTags: (result: any) => {
        console.warn('result',result)
        return [
          {type: 'Product', id: result.id},
          
        ];
      },
    }),
  }),
});
export const { useGetProductByIdQuery} = productApi;

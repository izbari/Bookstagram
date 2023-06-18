import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
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
        console.warn('result', result);
        return [{type: 'Product', id: result.id}];
      },
    }),
    // getProducts: builder.query<any, void>({
    //   queryFn: async () => {
    //     try {
    //       const response = await firestore().collection('products').get();
    //       const products = response.docs.map(doc => {
    //         return {...(doc.data() as any), id: doc.id};
    //       });
    //       return {data: products};
    //     } catch (error) {
    //       return {error};
    //     }
    //   },
    //   providesTags: (result: any) => {
    //     return [
    //       {type: 'Product', id: 'LIST'},
    //       ...result.map(({id}: any) => ({type: 'Product', id})),
    //     ];
    //   },
    // }),

    getProductsByUserId: builder.query<any, string>({
      queryFn: async id => {
        try {
          const user = await database()
            .ref('users/' + id)
            .once('value');
          const productIds =
            Object.values(user.val().products) ?? ([] as string[]);
          const products = await Promise.all(
            productIds.map(async id => {
              const product = await firestore()
                .collection('products')
                .doc(id)
                .get();
              return {...(product.data() as any), id: product.id};
            }),
          );
          return {data: products};
        } catch (error) {
          return {error};
        }
      },
    }),
    getAllProducts: builder.query<any, string>({
      queryFn: async id => {
        try {
          const response = await firestore()
            .collection('products')
            .where('userId', '!=', id)
            .get();
          const products = response.docs.map(doc => {
            return {...(doc.data() as any), id: doc.id};
          });
          return {data: products};
        } catch (error) {
          return {error};
        }
      },
    }),
    getProductsByCategory: builder.query<any, string>({
      queryFn: async category => {
        try {
          const response = await firestore()
            .collection('products')
            .where('category', '==', category)
            .get();
          const products = response.docs.map(doc => {
            return {...(doc.data() as any), id: doc.id};
          });
          return {data: products};
        } catch (error) {
          return {error};
        }
      },
    }),
  }),
});
export const {useGetProductByIdQuery, useGetProductsByUserIdQuery, useGetAllProductsQuery, useGetProductsByCategoryQuery} = productApi;

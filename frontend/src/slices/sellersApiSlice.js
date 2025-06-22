import { SELLERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const sellersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    loginSeller: builder.mutation({
      query: data => ({
        url: `${SELLERS_URL}/login`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),
    logoutSeller: builder.mutation({
      query: () => ({
        url: `${SELLERS_URL}/logout`,
        method: 'POST'
      }),
      invalidatesTags: ['Seller']
    }),
    registerSeller: builder.mutation({
      query: data => ({
        url: `${SELLERS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),
    getSellerProfile: builder.query({
      query: () => ({
        url: `${SELLERS_URL}/profile`
      }),
      providesTags: ['Seller']
    }),
    updateSellerProfile: builder.mutation({
      query: data => ({
        url: `${SELLERS_URL}/profile`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Seller']
    }),
    getSellers: builder.query({
      query: () => ({
        url: SELLERS_URL
      }),
      providesTags: ['Seller']
    }),
    getSellerById: builder.query({
      query: sellerId => ({
        url: `${SELLERS_URL}/${sellerId}`
      }),
      providesTags: ['Seller']
    }),
    deleteSeller: builder.mutation({
      query: sellerId => ({
        url: `${SELLERS_URL}/${sellerId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Seller']
    }),
    updateSeller: builder.mutation({
      query: ({ sellerId, ...sellerData }) => ({
        url: `${SELLERS_URL}/${sellerId}`,
        method: 'PUT',
        body: { ...sellerData }
      }),
      invalidatesTags: ['Seller']
    })
  })
});

export const {
  useLoginSellerMutation,
  useLogoutSellerMutation,
  useRegisterSellerMutation,
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useGetSellersQuery,
  useGetSellerByIdQuery,
  useDeleteSellerMutation,
  useUpdateSellerMutation
} = sellersApiSlice; 
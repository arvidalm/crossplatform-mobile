import { createApi } from '@reduxjs/toolkit/query/react';
import { db } from '../../../firebase-config';
import { addDoc, collection, getDocs } from "firebase/firestore";

const firebasePostsBaseQuery = async ({ url, method, body }) => {
    switch (method) {
      case 'GET':
        const querySnapshot = await getDocs(collection(db, url));
        let posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        return { data: posts };

      case 'POST':
        const docRef = await addDoc(collection(db, url), body);
        return { data: { id: docRef.id, ...body } };

      // Handle other methods like UPDATE, DELETE as needed

      default:
        throw new Error(`Unhandled method ${method}`);
    }
  };

  export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: firebasePostsBaseQuery,
    tagTypes: ['Post'],
    endpoints: (builder) => ({
      getPosts: builder.query({
        query: () => ({
          url: 'posts',
          method: 'GET',
          body: ''
        }),
        providesTags: ['Post'],
      }),
      createPost: builder.mutation({
        query: (newPost) => ({
          url: 'posts',
          method: 'POST',
          body: newPost
        }),
        invalidatesTags: ['Post'],
      }),
      // Define other endpoints like updatePost, deletePost as needed
    }),
  });

  export const { useGetPostsQuery, useCreatePostMutation } = postsApi;

/* eslint-disable no-case-declarations */
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  try {
    switch (method) {
      case "GET":
        const snapshot = await getDocs(collection(db, url));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return { data };

      case "POST":
        const augmentedBody = {
          ...body,
          createdDate: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, url), augmentedBody);
        return { data: { id: docRef.id, ...augmentedBody } };

      case "DELETE":
        console.log(`Deleting post in Firestore with ID: ${body.postId}`);
        await deleteDoc(doc(db, url, body.postId));
        return { data: { id: body.postId } };

      default:
        throw new Error(`Unhandled method ${method}`);
    }
  } catch (error) {
    console.error(`Error processing ${method} request:`, error);
    throw new Error(`Error processing ${method} request: ${error.message}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["posts"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        baseUrl: "",
        url: "posts",
        method: "GET",
        body: "",
      }),
      providesTags: ["posts"],
    }),
    createPost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        baseUrl: "",
        url: "posts",
        method: "DELETE",
        body: { postId },
      }),
      invalidatesTags: ["posts"],
    }),
    // Lägg till ytterligare mutations och queries efter behov
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} = postsApi;

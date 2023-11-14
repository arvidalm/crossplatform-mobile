/* eslint-disable no-case-declarations */
import { createApi } from "@reduxjs/toolkit/query/react";
import { addDoc, collection, getDocs } from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body = {} }) => {
  switch (method) {
    case "GET":
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };

    case "POST":
      const augmentedBody = {
        ...body,
        createdDate: new Date().toISOString(), // Lägg till createdDate
      };
      const docRef = await addDoc(collection(db, url), augmentedBody);
      return { data: { id: docRef.id, ...augmentedBody } };

    default:
      throw new Error(`Unhandled method ${method}`);
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
    // Lägg till ytterligare mutations och queries efter behov
  }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postsApi;

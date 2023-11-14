/* eslint-disable no-case-declarations */
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET":
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data };

    case "POST":
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };

    case "DELETE":
      await deleteDoc(doc(db, url, body));
      return { data: { id: body } };

    case "PUT":
      const { id, ...updateFields } = body;
      await updateDoc(doc(db, url, id), updateFields);
      return { data: { id, ...updateFields } };

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    getUsers: builder.query({
      query: () => ({
        baseUrl: "",
        url: "users",
        method: "GET",
        body: "",
      }),
      providesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "users",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["users"],
    }),
    updateUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi;

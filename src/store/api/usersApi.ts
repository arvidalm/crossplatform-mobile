/* eslint-disable no-case-declarations */
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
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
      if (url === "users") {
        await deleteUsersPosts(body); // Radera alla posts av användaren först
      }
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

// Funktion för att radera alla posts av en specifik användare
// I usersApi
const deleteUsersPosts = async (userId) => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      where("createdBy", "==", userId),
    );
    const snapshot = await getDocs(postsQuery);
    console.log(
      `Found ${snapshot.docs.length} posts to delete for user ${userId}`,
    );

    snapshot.docs.forEach((doc) => {
      console.log(`Attempting to delete post: ${doc.id}`);
    });

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("All posts deleted successfully.");
  } catch (error) {
    console.error("Error deleting user's posts:", error);
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
    // Lägg till ytterligare mutations och queries efter behov
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi;
 
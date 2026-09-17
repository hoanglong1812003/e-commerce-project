import client from "./client";

export const listProducts = (params) => client.get("/products", { params }).then((r) => r.data);
export const getProduct = (id) => client.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (formData) =>
  client
    .post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const updateProduct = (id, formData) =>
  client
    .put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const deleteProduct = (id) => client.delete(`/products/${id}`).then((r) => r.data);

import client from "./client";

export const createOrder = (items) => client.post("/orders", { items }).then((r) => r.data);
export const listMyOrders = () => client.get("/orders/mine").then((r) => r.data);
export const getOrder = (id) => client.get(`/orders/${id}`).then((r) => r.data);
export const listAllOrders = (params) => client.get("/orders", { params }).then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  client.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

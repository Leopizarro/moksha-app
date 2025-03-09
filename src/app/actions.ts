export function uploadProduct(productData: object) {
  console.log(productData);
}

export function getOneProduct(id: string) {
  if (!id) {
    throw new Error("Invalid ID provided");
  }
  const docRef = await;
}

interface ProductInstance {
    productId: number;
    productName: string;
    measuringUnit: string;
    categoryId: number; // foreign key to Categories
  }

  export default ProductInstance
interface ProductInstance {
    productId: string;
    productName: string;
    measuringUnit: string;
    categoryId: string; // foreign key to Categories
  }

  export default ProductInstance
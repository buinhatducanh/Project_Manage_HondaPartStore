import ProductItem from "./ProductItem";
export function ProductList({ products }) {
    return (
      <div className="w-full overflow-x-auto whitespace-nowrap">
        <div className="flex gap-4 p-4 snap-x snap-mandatory">
          {products.map((product, index) => (
            <ProductItem key={index} {...product}/>
          ))}
        </div>
      </div>
    );
  }
  
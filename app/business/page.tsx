import Businesscard from "@/components/BusinessCard";
import { businesses } from "@/data/businesses";

const business = () => {
  return (
    <div className="container mx-auto my-12 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Explore Business</h1>
      <p className="text-lg text-gray-500 text-center mt-2">
        Business digitized with SliceBlaze
      </p>

      <div className="flex flex-wrap justify-center gap-5 mt-10">
        {businesses.map((business) => (
          <Businesscard
            key={business.id}
            username={business.username} // important
            name={business.name}
            location={business.location}
            category={business.category}
            image={business.image || "/sample.svg"}
          />
        ))}
      </div>
    </div>
  );
};

export default business;

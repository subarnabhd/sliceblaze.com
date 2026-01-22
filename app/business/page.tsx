// app/business/page.tsx
import React from "react";
import { businesses } from "@/data/businesses";
import BusinessCard from "@/components/BusinessCard";

const BusinessListPage = () => {
  return (
    <div className="container mx-auto my-12 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">Explore Business</h1>
      <p className="text-lg text-gray-500 text-center mt-2">
        Business digitized with SliceBlaze
      </p>

      <div className="flex flex-wrap justify-center gap-5 mt-10">
        {businesses.map((business) => (
          <BusinessCard
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

export default BusinessListPage;

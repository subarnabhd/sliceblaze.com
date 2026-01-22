
import Businesscard from '@/components/Businesscard';
import { businesses } from '@/data/businesses';
import React from 'react'


const page = () => {
  return (
    <div className="container my-15 flex flex-col m-auto justify-center">
      <h1 className="text-2xl font-bold m-auto">Explore Business</h1>
      <p className="text-lg m-auto text-gray-500">
        Business digitize with sliceblaze
      </p>
      <div className="flex flex-wrap m-auto justify-center gap-5 my-10">
        {businesses.map((business) => (
          <Businesscard
            key={business.id}
            name={business.name}
            location={business.location}
            category={business.category}
            image={business.image || '/sample.svg'}
          />
        ))}
      </div>
    </div>
  );
}

export default page
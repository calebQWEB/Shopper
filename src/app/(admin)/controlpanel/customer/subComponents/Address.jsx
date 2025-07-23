"use client";
import React, { useEffect, useState } from "react";

const Address = () => {
  const [address, setAddress] = useState([]);
  const [addressError, setAddressError] = useState("");
  const [addressLoad, setAddressLoad] = useState(false);

  const fetchAddress = async () => {
    try {
      setAddressLoad(true);
      const res = await fetch("/api/address/get");
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        setAddress(data.address);
        console.log(data.address);
      }
    } catch (error) {
      setAddressError(error);
    } finally {
      setAddressLoad(false);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  if (addressLoad)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-600 text-lg">Please wait...</p>
      </div>
    );

  if (addressError)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">{addressError}</p>
      </div>
    );

  return (
    <div className="font-montserrat">
      {address &&
        address.map((item) => (
          <div key={item.id}>
            <h1 className="border-b border-black text-lg md:text-xl font-bold mb-6">
              {item.isDefault ? "Address 1" : "Address 2"}
            </h1>
            <p className="text-lg border-b py-2">
              {item.state}, <span className="font-bold">{item.country}</span>
            </p>
            <p className="text-lg border-b py-2">{item.street}</p>
            <p className="text-lg border-b py-2">{item.postalCode}</p>
          </div>
        ))}
    </div>
  );
};

export default Address;

import React, { useState } from "react";
import Sidebar from './Sidebar';
import { User, Phone } from 'lucide-react';

const Suppliers = () => {
  const [suppliers] = useState([
    {
      id: 1,
      name: "Raj",
      type: "Grains Supplier",
      phone: "9924192273"
    },
    {
      id: 2,
      name: "Jal",
      type: "Dairy Supplier",
      phone: "8200440797"
    }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab="suppliers" />
      <main className="flex-1 px-10 py-8 ml-72 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Suppliers</h1>
          <p className="text-gray-500">Your trusted supplier contacts.</p>
        </div>

        <div className="space-y-4 max-w-3xl">
          {suppliers.map((supplier) => (
            <div 
              key={supplier.id} 
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">{supplier.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span className="text-base font-medium">{supplier.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Suppliers;

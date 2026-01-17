import React, { useState, useEffect } from "react";
import { restaurantService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';


const RestaurantDetails = () => {
  const { user } = useAuth();
  // Sidebar handles navigation
  const [restaurant, setRestaurant] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    imageUrl: '',
    cuisine: '',
    isOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.email) {
          const data = await restaurantService.getMyRestaurant(user.email);
          if (data) {
            setRestaurant(data);
            setForm({
              name: data.name || '',
              description: data.description || '',
              address: data.address || '',
              phone: data.phone || '',
              imageUrl: data.imageUrl || '',
              cuisine: data.cuisine || '',
              isOpen: data.isOpen !== undefined ? data.isOpen : true,
            });
          } else {
            setRestaurant(null);
            setForm({ name: '', description: '', address: '', phone: '', imageUrl: '', cuisine: '', isOpen: true });
          }
        }
      } catch (err) {
        setError('Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (restaurant) {
        // Update existing
        const updated = await restaurantService.updateRestaurant(form, user.email);
        setRestaurant(updated);
      } else {
        // Create new
        const created = await restaurantService.createRestaurant(form, user.email);
        setRestaurant(created);
      }
      setEdit(false);
    } catch (err) {
      setError('Failed to save restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f9f7f4]">
      <Sidebar activeTab="restaurant-details" />
      <main className="flex-1 px-10 py-10 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#23190f] mb-1">Restaurant Details</h2>
              <p className="text-gray-500">Manage your restaurant profile and info</p>
            </div>
            {restaurant?.imageUrl && (
              <img src={restaurant.imageUrl} alt="Restaurant" className="h-20 w-20 object-cover rounded-xl border border-gray-200 shadow" />
            )}
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="bg-[#f9f7f4] rounded-xl p-6">
            {edit ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <label className="block text-sm font-medium mb-1">Open</label>
                  <input type="checkbox" name="isOpen" checked={form.isOpen} onChange={handleChange} />
                </div>
                <div className="col-span-2 flex gap-3 mt-4">
                  <button type="button" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow" onClick={handleSave}>Save</button>
                  <button type="button" className="bg-gray-200 px-6 py-2 rounded-lg font-semibold" onClick={() => setEdit(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2"><span className="font-medium">Name:</span> {restaurant?.name || '-'}</div>
                  <div className="mb-2"><span className="font-medium">Description:</span> {restaurant?.description || '-'}</div>
                  <div className="mb-2"><span className="font-medium">Address:</span> {restaurant?.address || '-'}</div>
                  <div className="mb-2"><span className="font-medium">Phone:</span> {restaurant?.phone || '-'}</div>
                  <div className="mb-2"><span className="font-medium">Open:</span> {restaurant?.isOpen ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div className="mb-2"><span className="font-medium">Image URL:</span> {restaurant?.imageUrl || '-'}</div>
                  {restaurant?.imageUrl && (
                    <div className="mb-2"><img src={restaurant.imageUrl} alt="Restaurant" className="max-h-32 rounded-xl border border-gray-200 shadow" /></div>
                  )}
                  <div className="mb-2"><span className="font-medium">Rating:</span> {restaurant?.rating !== undefined ? restaurant.rating : '-'}</div>
                  <div className="mb-2"><span className="font-medium">Created At:</span> {restaurant?.createdAt ? new Date(restaurant.createdAt).toLocaleString() : '-'}</div>
                </div>
                <div className="col-span-2 mt-4">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow" onClick={() => setEdit(true)}>
                    {restaurant ? 'Edit' : 'Add Restaurant'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDetails;

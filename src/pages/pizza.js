import React, { useState } from 'react';

const PizzaOrder = () => {
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [selectedPizza, setSelectedPizza] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newPizzaName, setNewPizzaName] = useState('');

  const takeOrder = (pizza) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isAvailable = checkAvailability(pizza);

        if (isAvailable) {
          const updatedCart = [...cart, pizza];
          setCart(updatedCart);
          resolve(pizza);
        } else {
          reject(new Error('Sorry, the pizza is not available.'));
        }
      }, 2000);
    });
  };

  const checkAvailability = (pizza) => {
    const availablePizzas = ['Margherita', 'Pepperoni', 'Vegetarian'];
    return availablePizzas.includes(pizza);
  };

  const processOrder = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cart.length >= 0) {
          resolve(cart);
        } else {
          reject(new Error('Cart is empty. Please add pizzas to your order.'));
        }
      }, 1500);
    });
  };

  const handleOrder = async () => {
    try {
      setOrderStatus('Placing order...');

      const order = await takeOrder(selectedPizza);
      console.log(`Successfully added ${order} to the cart.`);

      const processedOrder = await processOrder();
      console.log('Your order is ready!');
      console.log('Ordered Pizzas:', processedOrder);

      setOrderStatus('Order placed successfully!');
    } catch (error) {
      console.error(error.message);
      setOrderStatus('Failed to place order.');
    }
  };

  const handlePizzaChange = (e) => {
    setSelectedPizza(e.target.value);
  };

  const handleEditOrder = (index) => {
    setEditIndex(index);
    setNewPizzaName(cart[index]);
    setEditModalOpen(true);
  };

  const handleDeleteOrder = (index) => {
    setEditIndex(index);
    setDeleteModalOpen(true);
  };

  const handleConfirmEdit = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedCart = [...cart];
          updatedCart[editIndex] = newPizzaName;
          setCart(updatedCart);
          setEditModalOpen(false);
          setOrderStatus('Order edited successfully!');
          resolve();
        } catch (error) {
          console.error(error.message);
          setOrderStatus('Failed to edit order.');
          reject(error);
        }
      }, 1000);
    });
  };

  const handleConfirmDelete = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const updatedCart = [...cart];
          updatedCart.splice(editIndex, 1);
          setCart(updatedCart);
          setDeleteModalOpen(false);
          setOrderStatus('Order deleted successfully!');
          resolve();
        } catch (error) {
          console.error(error.message);
          setOrderStatus('Failed to delete order.');
          reject(error);
        }
      }, 1000);
    });
  };

  return (
    <div className="container min-h-screen p-4 bg-gray-50 rounded-lg mx-auto">
      <h1 className="text-3xl text-center font-bold mb-12">Pizza Delivery App</h1>
      <div className="mb-12 flex flex-col items-center">
        <label htmlFor="pizza" className="mr-2">
          Select Pizza Order:
        </label>
        <select
          id="pizza"
          className="border w-1/4 px-4 py-2"
          onChange={handlePizzaChange}
          value={selectedPizza}
        >
          <option value="">-- Select Pizza --</option>
          <option value="Margherita">Margherita</option>
          <option value="Pepperoni">Pepperoni</option>
          <option value="Vegetarian">Vegetarian</option>
        </select>
      
        <button
          className="bg-blue-500 mt-6 hover:bg-blue-600 text-white py-2 px-4 w-2/4 rounded"
          onClick={handleOrder}
          disabled={!selectedPizza}
        >
          Place Order
        </button>
      </div>

      <div className='mt-16 flex flex-col items-center my-12'>
        <p className='text-sm font-bold'>Order Status:</p>
        <p className="mt-2 w-2/4 flex justify-center bg-green-200 rounded-xl p-3 text-green-700">{orderStatus}</p>
      </div>

      <table className="w-full border border-gray-500 mt-8">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Order</th>
            <th className="border border-gray-500 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((pizza, index) => (
            <tr key={index}>
              <td className="border border-gray-500 px-4 py-2">{pizza}</td>
              <td className="border border-gray-500 px-4 py-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded mr-2"
                  onClick={() => handleEditOrder(index)}
                  disabled={!selectedPizza}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                  onClick={() => handleDeleteOrder(index)}
                  disabled={!selectedPizza}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded p-4">
            <h2 className="text-xl font-bold mb-4">Edit Order</h2>
            <input
              type="text"
              className="border px-4 py-2 mb-2"
              value={newPizzaName}
              onChange={(e) => setNewPizzaName(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2"
                onClick={handleConfirmEdit}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded p-4">
            <h2 className="text-xl font-bold mb-4">Delete Order</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded mr-2"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PizzaOrder;

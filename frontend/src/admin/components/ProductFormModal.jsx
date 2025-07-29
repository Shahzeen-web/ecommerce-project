import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductFormModal = ({ isOpen, onClose, onSave, editingProduct }) => {
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load categories from API
  useEffect(() => {
    if (isOpen) {
      axios.get("/api/categories").then((res) => setCategories(res.data));
      if (editingProduct) {
        reset(editingProduct); // preload product for editing
      } else {
        reset(); // empty form for new product
      }
    }
  }, [isOpen, editingProduct, reset]);

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(`/api/products/${editingProduct.id}`, data);
      } else {
        // Create new product
        await axios.post("/api/products", data);
      }
      onSave(); // refetch list
      onClose(); // close modal
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            placeholder="Product Name"
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full border p-2"
          />

          <input
            placeholder="Price"
            type="number"
            {...register("price", { required: "Price is required" })}
            className="w-full border p-2"
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}

          <input
            placeholder="Image URL"
            {...register("imageUrl")}
            className="w-full border p-2"
          />

          <select
            {...register("categoryId", { required: "Category is required" })}
            className="w-full border p-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {editingProduct ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;

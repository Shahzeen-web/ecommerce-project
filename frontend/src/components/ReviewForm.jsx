import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReviewForm = ({ user }) => {
  const { id: productId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      setMessage("Rating and comment are required.");
      return;
    }

    try {
      let imageUrl = null;

      // Handle image upload if needed
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      // Submit review
      await axios.post(
        "/api/reviews",
        { rating, comment, imageUrl, productId: parseInt(productId) },
        { withCredentials: true }
      );

      setMessage("Review submitted! Awaiting approval.");
      setRating(0);
      setComment("");
      setImage(null);
    } catch (err) {
      console.error("Review submit error:", err);
      setMessage("Error submitting review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 border p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>

      {message && <p className="mb-2 text-sm text-blue-500">{message}</p>}

      <label className="block mb-2 font-semibold">Rating</label>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`text-2xl ${
              rating >= num ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <label className="block mb-2 font-semibold">Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded p-2 mb-4"
        rows={4}
        required
      />

      <label className="block mb-2 font-semibold">Upload Image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
};
export default ReviewForm;

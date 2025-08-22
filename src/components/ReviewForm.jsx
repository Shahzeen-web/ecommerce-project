// 📁 frontend/src/components/ReviewForm.jsx
import React, { useState, useEffect } from "react";

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // ✅ Generate preview and cleanup memory
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    const newReview = {
      productId,
      rating,
      comment,
      image: previewUrl, // safe preview
      createdAt: new Date().toISOString(),
    };

    onReviewSubmit(newReview);

    setRating(0);
    setComment("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

      {/* Rating stars */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => setRating(star)}
            role="button"
            aria-label={`Rate ${star} star`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment box */}
      <label className="block mb-1 font-medium">Your Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded p-2 mb-3"
        rows="3"
        placeholder="Write your review..."
      />

      {/* Image upload */}
      <label className="block mb-1 font-medium">Upload an Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-3"
      />

      {/* Preview */}
      {previewUrl && (
        <div className="mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!rating || !comment.trim()}
        className={`px-4 py-2 rounded text-white ${
          !rating || !comment.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;

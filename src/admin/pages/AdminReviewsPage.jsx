import { useEffect, useState } from "react";
import axios from "axios";

const AdminReviewsPage = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingReviews = async () => {
    try {
      const res = await axios.get("/api/admin/reviews", {
        withCredentials: true,
      });
      setPendingReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading reviews:", err);
      setLoading(false);
    }
  };

  const handleAction = async (reviewId, isApproved) => {
    try {
      await axios.put(
        `/api/admin/reviews/${reviewId}`,
        { isApproved },
        { withCredentials: true }
      );
      fetchPendingReviews(); // Refresh list
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  if (loading) return <div className="p-6">Loading pending reviews...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Product Reviews</h1>

      {pendingReviews.length === 0 ? (
        <p>No reviews to moderate.</p>
      ) : (
        pendingReviews.map((review) => (
          <div key={review.id} className="border p-4 rounded mb-4 shadow">
            <p>
              <strong>User:</strong> {review.user?.name || "User"}
            </p>
            <p>
              <strong>Product ID:</strong> {review.productId}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
            </p>
            <p>
              <strong>Comment:</strong> {review.comment}
            </p>
            {review.imageUrl && (
              <img
                src={review.imageUrl}
                alt="review"
                className="mt-2 w-32 rounded-md"
              />
            )}

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleAction(review.id, true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(review.id, false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminReviewsPage;

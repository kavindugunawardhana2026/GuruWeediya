"use client";

import React, { useState, useTransition } from "react";
import { Star, MessageSquare } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { submitReview } from "@/app/teachers/actions";
import type { ReviewWithInstitute } from "@/types/database";

interface Props {
  teacherId: string;
  reviews: ReviewWithInstitute[];
  isInstitute: boolean;
}

export default function ReviewSection({ teacherId, reviews, isInstitute }: Props) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !reviewText.trim()) return;

    startTransition(async () => {
      setMessage(null);
      const res = await submitReview(teacherId, rating, reviewText);
      if (res.success) {
        setMessage({ type: "success", text: "Review submitted successfully!" });
        setReviewText("");
        setRating(5);
      } else {
        setMessage({ type: "error", text: res.error || "Failed to submit review." });
      }
    });
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "No ratings yet";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400" />
          Reviews & Ratings
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white text-sm">{averageRating}</span>
            <span className="text-slate-400 text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      {isInstitute && (
        <Card className="bg-slate-900/50 border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Leave a Review</h3>
          {message && (
            <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${
              message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`h-6 w-6 ${rating >= star ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience working with this teacher..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 min-h-[100px] resize-y"
                required
              />
            </div>

            <Button type="submit" disabled={isPending || !reviewText.trim()}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No reviews yet for this teacher.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} padding="sm" className="bg-slate-900 border-slate-800">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                    {review.institute?.institute_name?.charAt(0) || "I"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{review.institute?.institute_name || "Unknown Institute"}</h4>
                    <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-13 ml-13">
                {review.review_text}
              </p>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}

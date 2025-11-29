"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitReview } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ReviewForm() {
  const [state, formAction] = useActionState(submitReview, { message: "", success: false });
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        formRef.current?.reset();
        setRating(5);
      }
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Leave a Review</CardTitle>
            <CardDescription>Share your experience with us and future guests.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Jane Smith" required />
                </div>

                <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <div className="flex items-center gap-2">
                      <input type="hidden" name="rating" value={rating} />
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0 bg-transparent border-none"
                        >
                          <Star
                            className={cn(
                              "w-8 h-8 cursor-pointer transition-colors",
                              (hoverRating || rating) >= star ? "text-accent fill-accent" : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="reviewText">Review</Label>
                    <Textarea id="reviewText" name="reviewText" placeholder="What did you think?" rows={5} required />
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Submit Review</Button>
            </form>
        </CardContent>
    </Card>
  );
}

"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { createFeedback } from "@/services/feedbacks";
import Image from "next/image";
import React, { use, useState } from "react";
import RatingButtons from "@/components/general/RatingButtons";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Feedback({ params }) {
  const { form_identity } = use(params);
  // const router = useRouter();

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const [formData, setFormData] = useState({
    feedback_form: form_identity,
    guest_name: "",
    date: "",
    apartment_no: "",
    arrival_date: "",
    checkout_date: "",
    answers: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionId, value, subQuestionId = null) => {
    setFormData((prev) => {
      const existingAnswerIndex = prev.answers.findIndex(
        (a) => a.question === questionId
      );
      const newAnswers = [...prev.answers];

      if (subQuestionId) {
        const subResponse = { question: subQuestionId, rating: value };
        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = {
            ...newAnswers[existingAnswerIndex],
            sub_responses: {
              ...(newAnswers[existingAnswerIndex].sub_responses || {}),
              [subQuestionId]: subResponse,
            },
          };
        } else {
          newAnswers.push({
            question: questionId,
            rating: value,
            sub_responses: { [subQuestionId]: subResponse },
          });
        }
      } else {
        const answer = {
          question: questionId,
          ...(typeof value === "object" && value !== null
            ? value
            : { rating: value }),
        };
        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = answer;
        } else {
          newAnswers.push(answer);
        }
      }

      return { ...prev, answers: newAnswers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const submissionData = {
      feedback_form: formData.feedback_form,
      guest_name: formData.guest_name,
      answers: formData.answers.map((answer) => {
        const mappedAnswer = { question: answer.question };
        if (answer.rating !== undefined && answer.rating !== null) {
          mappedAnswer.rating = answer.rating;
        }
        if (answer.yes_no !== undefined && answer.yes_no !== null) {
          mappedAnswer.yes_no = answer.yes_no;
        }
        if (answer.text !== undefined && answer.text !== "") {
          mappedAnswer.text = answer.text;
        }
        if (answer.sub_responses) {
          mappedAnswer.sub_responses = answer.sub_responses;
        }
        return mappedAnswer;
      }),
    };

    if (feedbackForm?.is_accomodation) {
      if (
        !formData.apartment_no ||
        !formData.arrival_date ||
        !formData.checkout_date
      ) {
        setError(
          "Apartment No, Arrival Date, and Checkout Date are required for accommodation forms."
        );
        setIsSubmitting(false);
        return;
      }
      submissionData.apartment_no = formData.apartment_no;
      submissionData.arrival_date = formData.arrival_date;
      submissionData.checkout_date = formData.checkout_date;
    }

    try {
      await createFeedback(submissionData);
      // CLEAR THE FORM
      setFormData({
        feedback_form: form_identity,
        guest_name: "",
        date: "",
        apartment_no: "",
        arrival_date: "",
        checkout_date: "",
        answers: [],
      });
      refetchFeedbackForm();
      // Optional: Add a success message or redirect
    } catch (err) {
       // Assuming router is uncommented if needed
      // router.push("/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-br from-[#e54c23]/10 to-[#e20715]/10">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-2">
           <div className="flex justify-center mb-4">
               <Image
                src={`${feedbackForm?.logo || "/logo.png"}`}
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
                />
           </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{feedbackForm?.title}</CardTitle>
          <CardDescription className="text-base text-gray-500 max-w-lg mx-auto">
            {feedbackForm?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
             <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Personal Info Section */}
                 <div className="space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-900">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                             <Label htmlFor="guest_name">Guest Name *</Label>
                             <Input
                                id="guest_name"
                                name="guest_name"
                                value={formData.guest_name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                                className="bg-white"
                             />
                         </div>
                         <div className="space-y-2">
                             <Label htmlFor="date">Date *</Label>
                             <Input
                                id="date"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                className="bg-white"
                             />
                         </div>
                    </div>

                     {feedbackForm?.is_accomodation && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="apartment_no">Apartment No *</Label>
                                <Input
                                    id="apartment_no"
                                    name="apartment_no"
                                    value={formData.apartment_no}
                                    onChange={handleInputChange}
                                    placeholder="Apartment Number"
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="arrival_date">Arrival Date *</Label>
                                    <Input
                                        id="arrival_date"
                                        type="date"
                                        name="arrival_date"
                                        value={formData.arrival_date}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="checkout_date">Checkout Date *</Label>
                                    <Input
                                        id="checkout_date"
                                        type="date"
                                        name="checkout_date"
                                        value={formData.checkout_date}
                                        onChange={handleInputChange}
                                        required
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                 </div>

                 {/* Questions Section */}
                 <div className="space-y-8">
                     {feedbackForm?.questions?.map((question, index) => (
                         <div key={question.reference} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
                             <div className="flex items-start gap-2">
                                 <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                    {index + 1}
                                 </span>
                                 <Label className="text-base text-gray-900 leading-normal pt-0.5">
                                     {question.text}
                                 </Label>
                             </div>
                             
                             <div className="pl-8">
                                 {question.type === "RATING" && (
                                     <RatingButtons
                                        value={
                                            formData.answers.find(
                                            (a) => a.question === question.identity
                                            )?.rating || 0
                                        }
                                        onChange={(rating) =>
                                            handleAnswerChange(question.identity, rating)
                                        }
                                     />
                                 )}
                                 
                                {question.type === "YES_NO" && (
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5">
                                            <input
                                                type="radio"
                                                name={`yesno-${question.identity}`}
                                                value="true"
                                                checked={
                                                    formData.answers.find(
                                                        (a) => a.question === question.identity
                                                    )?.yes_no === true
                                                }
                                                onChange={() =>
                                                    handleAnswerChange(question.identity, {
                                                        yes_no: true,
                                                    })
                                                }
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5">
                                            <input
                                                type="radio"
                                                name={`yesno-${question.identity}`}
                                                value="false"
                                                checked={
                                                    formData.answers.find(
                                                        (a) => a.question === question.identity
                                                    )?.yes_no === false
                                                }
                                                onChange={() =>
                                                    handleAnswerChange(question.identity, {
                                                        yes_no: false,
                                                    })
                                                }
                                                className="w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">No</span>
                                        </label>
                                    </div>
                                )}

                                {question.type === "TEXT" && (
                                    <Textarea
                                        value={
                                            formData.answers.find(
                                            (a) => a.question === question.identity
                                            )?.text || ""
                                        }
                                        onChange={(e) =>
                                            handleAnswerChange(question.identity, {
                                            text: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your comments here..."
                                        className="min-h-[100px] bg-white resize-y"
                                    />
                                )}

                                {question.sub_questions?.length > 0 && (
                                    <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                                        {question.sub_questions.map((subQ) => (
                                            <div key={subQ.reference} className="space-y-2">
                                                <Label className="text-sm text-gray-700 font-medium block">
                                                    {subQ.text}
                                                </Label>
                                                <RatingButtons
                                                    value={
                                                    formData.answers.find(
                                                        (a) => a.question === question.identity
                                                    )?.sub_responses?.[subQ.identity]?.rating || 0
                                                    }
                                                    onChange={(rating) =>
                                                    handleAnswerChange(
                                                        question.identity,
                                                        rating,
                                                        subQ.identity
                                                    )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                         </div>
                     ))}
                 </div>

                 {error && (
                     <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm text-center">
                         {error}
                     </div>
                 )}

                 <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-medium"
                    disabled={isSubmitting}
                 >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                 </Button>
             </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Feedback;

"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateFeedbackForm from "@/forms/feedbackforms/CreateFeedbackForm";
import { useFetchCenter } from "@/hooks/centers/actions";
import Link from "next/link";
import React, { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function CenterDetail({ params }) {
  const { center_identity } = use(params);

  const {
    isLoading: isLoadingCenter,
    data: center,
    refetch: refetchCenter,
  } = useFetchCenter(center_identity);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingCenter) {
    return <LoadingSpinner />;
  }

  return (
    <div
      id="center"
      className="container mx-auto p-6 bg-gray-50/50 min-h-screen"
    >
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {center?.name}
          </h2>
          <p className="text-muted-foreground mt-1">
            Center Overview and Feedback Forms
          </p>
        </div>
      </section>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Feedback Forms</CardTitle>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" /> Create Form
          </Button>
        </CardHeader>
        <CardContent>
          {center?.feedback_forms?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Accommodation</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {center?.feedback_forms?.map((feedbackForm) => (
                    <TableRow key={feedbackForm?.reference}>
                      <TableCell className="font-medium">
                        {feedbackForm?.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {feedbackForm?.description}
                      </TableCell>
                      <TableCell>{feedbackForm?.questions?.length}</TableCell>
                      <TableCell>
                        {feedbackForm?.form_submissions?.length}
                      </TableCell>
                      <TableCell>
                        {feedbackForm?.is_accomodation ? (
                          <Badge variant="default">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/reservations/centers/${center_identity}/${feedbackForm?.form_identity}`}
                            className="flex items-center gap-1"
                          >
                            Manage <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded-md border border-dashed">
              No feedback forms available for this center
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateFeedbackForm
              refetch={refetchCenter}
              closeModal={() => setIsModalOpen(false)}
              center={center}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CenterDetail;

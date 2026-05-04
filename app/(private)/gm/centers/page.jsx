"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchCenters } from "@/hooks/centers/actions";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Centers() {
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingCenters) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Centers Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your {centers?.length || 0} centers
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create Center
        </Button>
      </section>

      <section className="mb-8">
        <Card>
          <CardHeader>
             <CardTitle>Centers List</CardTitle>
          </CardHeader>
          <CardContent>
            {centers?.length > 0 ? (
                <CentersTable centers={centers} role="gm" />
            ) : (
                <div className="p-8 text-center text-muted-foreground bg-muted/50 rounded border border-dashed">
                No centers available
                </div>
            )}
           </CardContent>
        </Card>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 rounded shadow w-full max-w-md overflow-y-auto relative border">
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateCenter
              refetch={refetchCenters}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Centers;

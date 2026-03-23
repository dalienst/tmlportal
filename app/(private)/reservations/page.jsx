"use client";

import CentersTable from "@/components/centers/CentersTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import React, { useState } from "react";
import Modal from "@/components/general/Modal";
import UpdateProfile from "@/forms/accounts/UpdateProfile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, ChevronDown, UserPen, Building2 } from "lucide-react";

function Reservations() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();
  const {
    isLoading: isLoadingFeedbackForms,
    data: feedbackForms,
    refetch: refetchFeedbackForms,
  } = useFetchFeedbackForms();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  if (isLoadingAccount || isLoadingCenters || isLoadingFeedbackForms) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-none">
            {isLoadingAccount ? (
              <Skeleton className="h-9 w-64" />
            ) : (
              `Hello, ${account?.name || "User"}`
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage centers and feedback forms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shadow-lg shadow-primary/20 cursor-pointer group whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                Quick Actions
                <ChevronDown className="ml-2 h-4 w-4 opacity-50 group-data-[state=open]:rotate-180 transition-transform" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 shadow-2xl border-primary/10" align="end" sideOffset={8}>
              <div className="space-y-1">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-bold rounded-xl hover:bg-primary/5 transition-all text-left group"
                  onClick={() => setProfileModal(true)}
                >
                  <UserPen className="mr-3 h-4 w-4 text-primary" />
                  Update Profile
                </button>

                <div className="h-px bg-border my-1 mx-2" />

                <button
                  className="flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-muted transition-colors text-left group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Building2 className="mr-3 h-4 w-4 text-primary opacity-70 group-hover:opacity-100" />
                  Create Center
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section id="summary" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-bold text-black">Information</h4>
            <p className="text-muted-foreground truncate">{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-bold text-2xl text-black">
              {centers?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Total Centers</h4>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md sm:col-span-2 md:col-span-1">
            <p className="font-bold text-2xl text-black">
              {feedbackForms?.length || 0}
            </p>
            <h4 className="text-muted-foreground">Feedback Forms</h4>
          </div>
        </div>
      </section>

      <section className="mb-6 py-4">
        <div className="p-4 rounded-lg shadow-md bg-white border border-border overflow-hidden">
          <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
            <h6 className="text-xl font-semibold text-black">Centers</h6>
            <button
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              Create Center
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            {centers?.length > 0 ? (
              <CentersTable centers={centers} role="reservations" />
            ) : (
              <div className="p-4 text-center text-black bg-muted rounded-md">
                No centers available
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Center"
        className="max-w-md"
      >
        <CreateCenter
          refetch={refetchCenters}
          closeModal={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
        title="Update Profile"
      >
        <UpdateProfile 
          user={account} 
          refetch={refetchAccount} 
          onClose={() => setProfileModal(false)} 
        />
      </Modal>
    </div>
  );
}

export default Reservations;

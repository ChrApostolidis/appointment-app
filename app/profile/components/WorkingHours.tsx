"use client";

import { Edit, Clock } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import { useState } from "react";
import Modal from "./Modal";
import Hours from "./Hours";


export default function WorkingHours() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="pt-6 border-t border-border bg-background">
      <div className="bg-background border border-border rounded-2xl shadow-lg p-2 pt-4 mb-6">
        <div className="bg-background">
          <div className="flex gap-2 justify-center items-center mb-2 lg:justify-start">
            <Clock className="w-6 h-6 text-primary lg:w-9 lg:h-9" />
            <h1 className="lg:text-3xl text-2xl font-bold text-foreground">
              Working Hours
            </h1>
          </div>
        </div>
        <div className="flex-col justify-center items-center lg:flex lg:items-start">
          <div className="flex items-center mb-4 px-4 ">
            <p className="text-foreground text-xl">
              Manage your weekly availability
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <MainButton
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 hover:bg-indigo-700 text-foreground px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Edit Hours
            <Edit className="w-5 h-5" />
          </MainButton>
        </div>
      </div>

      <div className="space-y-2">
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Hours />
        </Modal>
        <Hours />
      </div>
    </div>
  );
}

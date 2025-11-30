import { useState } from "react";
import { workingHoursData } from "../data/hoursData";


export function useHoursForms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workingHours, setWorkingHours] = useState(workingHoursData);
  const [tempHours, setTempHours] = useState(workingHours);
  const [enabled, setEnabled] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const handleEdit = () => {
    setTempHours(workingHours);
  };

//   const toggleDay = (day) => {
//     setTempHours({
//       ...tempHours,
//       [day]: { ...tempHours[day], enabled: !tempHours[day].enabled },
//     });
//   };

  const handleSave = () => {
    setWorkingHours(tempHours);
    setIsEditing(false);
  };

  return {
    // state
    isModalOpen,
    isEditing,
    workingHours,
    enabled,
    setEnabled,

    // temp state
    tempHours,

    // handlers
    handleCloseModal,
    handleOpenModal,
    handleEdit,
    // toggleDay,
    handleSave,
  }
}

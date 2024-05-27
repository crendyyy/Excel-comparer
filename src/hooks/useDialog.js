import { useState } from "react";

const useDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    openDialog: handleDialogOpen,
    closeDialog: handleDialogClose,
  };
};
export default useDialog;

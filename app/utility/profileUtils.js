import { updateUserDetails } from "../services/firebase/userService";

export const checkCompletedProfile = async (userData, setUserData) => {
  const { name, birthday, gender, ibsType, waterGoal } = userData || {};

  // Validate each field and check if all fields are filled
  const isCompleted =
    name &&
    birthday &&
    gender &&
    ibsType &&
    waterGoal &&
    name.trim() !== "" &&
    waterGoal.trim() !== "";

  // Ensure profileCompleted is a Boolean value
  const updatedProfileCompleted = Boolean(isCompleted);

  if (updatedProfileCompleted !== userData.profileCompleted) {
    // Update Firestore with the correct profileCompleted status
    try {
      await updateUserDetails(userData.uid, {
        profileCompleted: updatedProfileCompleted,
      });
      setUserData((prevData) => ({
        ...prevData,
        profileCompleted: updatedProfileCompleted, // Update the local state
      }));
    } catch (error) {
      console.error("Error updating completedProfile:", error);
    }
  }
};

"use client";
import { Eye, EyeOff } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DashboardSettings = ({ orders = [] }) => {
  const [serverError, setServerError] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deleteUserPrompt, setDeleteUserPrompt] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      First_Name: user?.user?.name || "",
      // Last_Name: "",
      Email: user?.user?.email || "",
      Phone: user?.user?.phoneNumber || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    setError,
    formState: { errors: passwordFormError },
  } = useForm({
    defaultValues: {
      Current_Password: "",
      New_Password: "",
      Confirm_Password: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const changePassword = async (data) => {
    setPasswordLoading(true);
    try {
      const response = await fetch("/api/changePassword", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("Current_Password", {
          type: "server",
          message: result.message || "An error occurred",
        });
        return;
      }

      setPasswordError("");
      resetPassword({
        Current_Password: "",
        New_Password: "",
        Confirm_Password: "",
      });

      console.log("Password changed successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const submit = async (data) => {
    const { First_Name, Email, Phone } = data;
    const response = await fetch("/api/editUser", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        First_Name: First_Name || user?.user?.name,
        Email: Email || user?.user?.email,
        Phone: Phone || user?.user?.phoneNumber,
      }),
    });

    if (response.ok) {
      reset({
        First_Name: First_Name || user?.user?.name,
        // Last_Name: "",
        Email: Email || user?.user?.email,
        Phone: Phone || user?.user?.phoneNumber,
      });
      console.log("User updated successfully");
    } else {
      const result = await response.json();
      setServerError(result.message);
      console.log(user.user);
      console.error("Error updating user:", result.message);
    }
  };

  const totalPrice = orders.reduce((total, order) => {
    return total + order.totalPrice;
  }, 0);

  const totalOrder = orders.reduce((total, order) => {
    return total + order.items.length;
  }, 0);

  const handleDeleteUser = () => {
    setDeleteUserPrompt(true);
  };

  const deleteUser = async () => {
    setDeleteLoading(true);
    setDeleteUserPrompt(false);

    try {
      const response = await fetch("/api/deleteUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(user?.user?.id) }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(result.message || "Failed to delete account");
        return;
      }

      console.log("User deleted successfully");
      try {
        await signOut({ callbackUrl: "/" });
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError);
        setDeleteError("Failed to sign out after account deletion.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteError("Unexpected error occurred.");
    } finally {
      setDeleteLoading(false);
      setDeleteUserPrompt(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6">
      {/* Metrics Section */}
      <div className="flex flex-wrap justify-start items-center gap-6">
        {[
          {
            title: "Total Revenue",
            value: `NGN ${totalPrice.toLocaleString()}`,
          },
          { title: "Total Orders", value: totalOrder },
        ].map((item, index) => (
          <div
            key={index}
            className="w-full md:w-auto bg-gradient-to-br from-gray-100 to-gray-300 shadow-xl rounded-lg p-6 min-w-52 text-center hover:scale-105 transition-all duration-300"
          >
            <h1
              className="text-gray-700 text-base md:text-lg font-semibold"
              onClick={() => console.log(user)}
            >
              {item.title}
            </h1>
            <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* User Information */}
      <div className="mt-16 bg-white shadow-lg rounded-lg p-2 md:p-6 font-montserrat">
        <h2 className="text-gray-800 font-bold text-xl md:text-2xl border-b pb-3 text-center md:text-start">
          Your Information
        </h2>
        {serverError && (
          <p className="text-sm md:text-lg text-red">{serverError}</p>
        )}
        <form onSubmit={handleSubmit(submit)} className="mt-6 grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder={user?.user?.name || "First Name"}
              {...register("First_Name", {
                required: "First Name is required",
              })}
              className="text-sm md:text-base w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-sm md:placeholder:text-base"
            />
            {errors.First_Name && (
              <p className="text-sm md:text-lg text-red">
                {errors.First_Name.message}
              </p>
            )}

            <input
              type="text"
              placeholder="Last Name"
              {...register("Last_Name", {
                required: "Last Name is required",
              })}
              className="text-sm md:text-base w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-sm md:placeholder:text-base"
            />
            {errors.Last_Name && (
              <p className="text-sm md:text-lg text-red">
                {errors.Last_Name.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              className="text-sm md:text-base w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-sm md:placeholder:text-base"
              type="email"
              placeholder={user?.user?.email || "Email"}
              {...register("Email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            <input
              type="text"
              placeholder={user?.user?.phoneNumber || "+234 456 7890"}
              {...register("Phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Phone number must contain only digits",
                },
              })}
              className="text-sm md:text-base w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder:text-sm md:placeholder:text-base"
            />
            {errors.Email && (
              <p className="text-sm md:text-lg text-red">
                {errors.Email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 active:scale-95 transition-all self-start text-sm md:text-base"
          >
            Save Changes
          </button>
        </form>

        {/* User  */}
        <div className="mt-16 mx-auto p-2 md:p-6 bg-white rounded-lg shadow-md font-montserrat">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center md:text-start">
            Security Settings
          </h2>
          <p className="text-gray-600 mt-1 text-sm md:text-lg text-center md:text-start">
            Manage your account security and login settings.
          </p>
          {/* Change Password */}
          <div className="mt-6 p-5 border rounded-lg shadow-sm bg-gray-50 grid items-center md:block">
            <h3 className="text-lg font-medium text-gray-800 text-center md:text-start">
              Change Password
            </h3>
            <p className="text-sm text-gray-600 text-center md:text-start">
              Update your password for better security.
            </p>
            <form
              className="mt-4 grid gap-3"
              onSubmit={handlePasswordSubmit(changePassword)}
            >
              {passwordError && (
                <p className="text-sm md:text-lg text-red">{passwordError}</p>
              )}
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  {...registerPassword("Current_Password", {
                    required: "Current Password is required",
                  })}
                  placeholder="Current Password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-sm md:placeholder:text-base text-sm md:text-base"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {passwordFormError.Current_Password && (
                <p className="text-sm md:text-lg text-red">
                  {passwordFormError.Current_Password.message}
                </p>
              )}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...registerPassword("New_Password", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="New Password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-sm md:placeholder:text-base text-sm md:text-base"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {passwordFormError.New_Password && (
                <p className="text-sm md:text-lg text-red">
                  {passwordFormError.New_Password.message}
                </p>
              )}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...registerPassword("Confirm_Password", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === watch("New_Password") ||
                      "Passwords do not match",
                  })}
                  placeholder="Confirm New Password"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-sm md:placeholder:text-base text-sm md:text-base"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {passwordFormError.Confirm_Password && (
                <p className="text-sm md:text-lg text-red">
                  {passwordFormError.Confirm_Password.message}
                </p>
              )}

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:scale-105 transition active:scale-95 text-sm md:text-base"
              >
                {passwordLoading ? "Loading..." : "Change Password"}
              </button>
            </form>
          </div>
          {/* Active Sessions */}
          <div className="mt-6 p-2 md:p-6 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800 text-center md:text-start">
              Active Sessions
            </h3>
            <p className="text-sm text-gray-600 text-center md:text-start">
              Manage devices where you're logged in.
            </p>
            <ul className="mt-4 text-sm text-gray-700 space-y-2">
              <li className="flex justify-between p-2 bg-white shadow-sm rounded-lg">
                <span>Chrome - Windows</span>
                <button className="text-red-500 hover:underline text-sm md:text-base">
                  Log Out
                </button>
              </li>
              <li className="flex justify-between p-2 bg-white shadow-sm rounded-lg">
                <span>Safari - iPhone</span>
                <button className="text-red-500 hover:underline hover:scale-105 transition active:scale-95 text-sm md:text-base">
                  Log Out
                </button>
              </li>
            </ul>
          </div>
          {/* Delete Account */}
          <div className="mt-6 p-5 border rounded-lg shadow-sm bg-red-50 grid items-center md:block">
            <h3 className="text-lg font-medium text-red-600 text-center md:text-start">
              Delete Account
            </h3>
            <p className="text-sm text-gray-600 text-center md:text-start">
              This action is irreversible. Proceed with caution.
            </p>
            <button
              onClick={handleDeleteUser}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition active:scale-95 text-sm md:text-base"
            >
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Prompt */}
      {deleteUserPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 md:p-0">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold font-monsterratat text-gray-800 text-center">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex items-center justify-center mt-4 gap-4">
              <button
                onClick={deleteUser}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition active:scale-95"
              >
                Yes
              </button>
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition active:scale-95">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Error */}
      {deleteError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 md:p-0">
          <div className="bg-white p-6 rounded-lg shadow-lg grid items-center justify-center gap-4">
            <h2 className="text-lg font-semibold font-monsterratat text-red-600 text-center">
              {deleteError}
            </h2>
            <button
              onClick={() => setDeleteError("")}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSettings;

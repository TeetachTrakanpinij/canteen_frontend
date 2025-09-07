import { ChevronLeft, BookOpenText, PencilLine, Mail, Lock, UserRound, Camera } from "lucide-react";
import { useState } from "react";

export default function EditProfile() {
  const [username, setUsername] = useState("mr.hungry");
  const [email, setEmail] = useState("65010234@kmitl.ac.th");
  const [password, setPassword] = useState("KmitlisTheBest12345");
  const [bio, setBio] = useState("I love Kmitl!");

  return (
    <div className="bg-white min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-gray-500 text-sm">Manage your account and change password</p>
          </div>
        </div>

        {/* User Manual Button */}
        <button className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm font-medium">
          <BookOpenText className="w-4 h-4" />
          User manual
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col items-center mt-10">
        <div className="bg-white rounded-2xl shadow p-8 w-[320px] flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1864/1864514.png"
              alt="Profile"
              className="w-28 h-28 object-contain"
            />
            <button className="absolute bottom-0 right-0 bg-gray-200 p-1 rounded-full shadow">
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Bio */}
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-4 px-4 py-2 rounded-full bg-gray-100 text-center text-sm font-medium"
          />

          {/* Username */}
          <div className="flex items-center mt-6 w-full bg-gray-100 px-3 py-2 rounded-lg">
            <UserRound className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 ml-2 bg-transparent outline-none text-sm"
            />
            <PencilLine className="w-4 h-4 text-primary" />
          </div>

          {/* Email */}
          <div className="flex items-center mt-3 w-full bg-gray-100 px-3 py-2 rounded-lg">
            <Mail className="w-4 h-4 text-primary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 ml-2 bg-transparent outline-none text-sm"
            />
            <PencilLine className="w-4 h-4 text-primary" />
          </div>

          {/* Password */}
          <div className="flex items-center mt-3 w-full bg-gray-100 px-3 py-2 rounded-lg">
            <Lock className="w-4 h-4 text-primary" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 ml-2 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-3 mt-8">
        <button className="px-5 py-2 border rounded-lg text-gray-700">Cancel</button>
        <button className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-orange-400 to-orange-500">
          Save
        </button>
      </div>
    </div>
  );
}

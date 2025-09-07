import { ChevronLeft, BookOpenText, PencilLine, Mail, Lock, UserRound } from "lucide-react";

export default function Profile() {
  return (
    <div className="bg-white min-h-screen p-4 sm:p-6">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mt-4">
        
        {/* Left side (Back + Profile Header) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Back button */}
          <button onClick={() => window.history.back()} className="mt-1 sm:mt-0">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="mt-2 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Manage your account and change password
            </p>
          </div>
        </div>

        {/* Right side (User manual + Edit Profile) */}
        <div className="flex flex-col sm:flex-col gap-2 sm:gap-3 items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
          {/* User manual → ตรงกับลูกศร */}
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full sm:w-auto justify-center sm:justify-start">
            <BookOpenText className="w-5 h-5" />
            User manual
          </button>

          {/* Edit Profile → ตรงกับ Profile */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 w-full sm:w-auto justify-center sm:justify-start">
            <PencilLine className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex justify-center mt-8 sm:mt-12">
        <div className="bg-white border rounded-2xl shadow p-6 sm:p-8 w-full max-w-sm text-center">
          
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-500 flex items-center justify-center">
              <UserRound className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">I love Kmitl</h2>

          <hr className="my-4" />

          {/* Info */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <UserRound className="w-5 h-5 text-orange-500" />
              <span>mr.hungry</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" />
              <span>65010234@kmitl.ac.th</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              <span>Kmitlisthebest12345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="flex justify-center mt-6">
        <button className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100 w-full sm:w-auto">
          Log Out
        </button>
      </div>
    </div>
  );
}

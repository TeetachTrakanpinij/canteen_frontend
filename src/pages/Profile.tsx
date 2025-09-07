import { ChevronLeft, BookOpenText, PencilLine, Mail, Lock, UserRound } from "lucide-react";

export default function Profile() {
  return (
    <div className="bg-white h-screen p-6">
      
      {/* Top Section */}
      <div className="flex justify-between items-start mt-4">
        {/* Left side (Back + Profile Header) */}
        <div className="flex items-start gap-4">
          {/* Back button */}
          <button onClick={() => window.history.back()} className="mt-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="mt-5">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-500">Manage your account and change password</p>
          </div>
        </div>

        {/* Right side (User manual + Edit Profile) */}
        <div className="flex flex-col gap-3 items-end">
          {/* User manual → ตรงกับลูกศร */}
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <BookOpenText className="w-5 h-5" />
            User manual
          </button>
          {/* Edit Profile → ตรงกับ Profile */}
          <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:opacity-90">
            <PencilLine className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="flex justify-center mt-12">
        <div className="bg-white border rounded-2xl shadow p-8 w-full max-w-sm text-center">
          
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center">
              <UserRound className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">I love Kmitl</h2>

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
        <button className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100">
          Log Out
        </button>
      </div>
    </div>
  );
}

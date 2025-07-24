import { useRef, useState, useEffect } from "react";
import { Menu, User, LogOut, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export default function Header({ onMenuToggle, isMobile }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleLogout = () => {
    logout();
  };
  const navigate = useNavigate();
  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">AdminPanel</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className=" w-fit relative" ref={profileRef}>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors"
              onClick={() => handleProfileClick()}
            >
              <User size={20} className="text-gray-600" />
            </button>
            {isProfileOpen && (
              <div
                className=" absolute min-w-[250px] w-full  right-0 top-[40px]  bg-white rounded-[10px]  p-4 shadow-[rgba(99,99,99,0.2) 0px 2px 8px 0px] overflow-hidden "
                style={{
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                <div className="w-full">
                  <img
                    src={
                      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                    }
                    alt={"DP Image"}
                    className="w-12 h-12 mx-auto rounded-full object-cover"
                  />
                  <p className="text-[16px] text-gray-600 text-center mt-[8px] truncate">
                    {currentUser?.email}
                  </p>

                  <button
                    onClick={() => {
                      navigate("/dashboard/reset-password");
                    }}
                    className="w-full flex mt-[8px] items-center gap-3 px-4 py-3  text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                    <span className=" font-medium">Change Password</span>
                  </button>
                  <div className="border-t border-gray-200 my-[8px]"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3  text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

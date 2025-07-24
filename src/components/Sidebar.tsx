import React, { useState } from "react";
import {
  FileText,
  Plus,
  Eye,
  ChevronDown,
  ChevronRight,
  X,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  path?: string;
  roles?: string[];
}

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { userData, loading } = useAuth();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (loading) {
    return (
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 flex justify-center items-center text-gray-500">
        Loading menu...
      </aside>
    );
  }

  const role = userData?.role || "normal";

  const menuItems: MenuItem[] = [
    {
      id: "blog",
      label: "Blog",
      icon: <FileText size={18} />,
      children: [
        {
          id: "add-blog",
          label: "Add Blog",
          icon: <Plus size={16} />,
          path: "/dashboard/add-blog",
          roles: ["admin", "superadmin"],
        },
        {
          id: "view-blogs",
          label: "View Blogs",
          icon: <Eye size={16} />,
          path: "/dashboard/blog",
          roles: ["normal", "admin", "superadmin"],
        },
      ],
      roles: ["admin", "superadmin"],
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={18} />,
      children: [
        {
          id: "add-user",
          label: "Add User",
          icon: <Plus size={16} />,
          path: "/dashboard/add-users",
          roles: ["superadmin"],
        },
        {
          id: "view-users",
          label: "View Users",
          icon: <Eye size={16} />,
          path: "/dashboard/users",
          roles: ["superadmin"],
        },
      ],
      roles: ["superadmin"],
    },
  ];

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (item.roles && !item.roles.includes(role)) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            level === 0 ? "hover:bg-gray-100" : "hover:bg-gray-50"
          } ${level > 0 ? "ml-4" : ""}`}
          onClick={() => (hasChildren ? toggleExpanded(item.id) : undefined)}
        >
          {item.path ? (
            <Link to={item.path} className="flex items-center space-x-3">
              <span className="text-gray-600">{item.icon}</span>
              <span className="text-gray-800 font-medium">{item.label}</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">{item.icon}</span>
              <span className="text-gray-800 font-medium">{item.label}</span>
            </div>
          )}
          {hasChildren && (
            <span className="text-gray-500">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
          isMobile
            ? `w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : "w-64 translate-x-0"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <nav className="space-y-2">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
}

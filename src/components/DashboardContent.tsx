import { TrendingUp, Users, FileText, ShoppingCart } from "lucide-react";

export default function DashboardContent() {
  const stats = [
    {
      label: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: <Users className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "Blog Posts",
      value: "342",
      change: "+8%",
      icon: <FileText className="w-8 h-8 text-green-600" />,
      color: "bg-green-50",
    },
    {
      label: "Orders",
      value: "1,254",
      change: "+15%",
      icon: <ShoppingCart className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50",
    },
    {
      label: "Revenue",
      value: "$45,240",
      change: "+23%",
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              "New user registered: john@example.com",
              'Blog post published: "Getting Started with React"',
              "Order #1234 completed",
              "System backup completed successfully",
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-blue-700 font-medium">Add New User</span>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-green-700 font-medium">
                Create Blog Post
              </span>
            </button>
            <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <span className="text-orange-700 font-medium">View Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

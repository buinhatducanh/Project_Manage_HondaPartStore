import { useState, useEffect } from "react";
import { XCircle, CheckCircle, AlertTriangle } from "lucide-react";

const Alert = ({ type = "success", message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const alertStyles = {
    success: "bg-green-100 text-green-700 border-green-400",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-400",
    error: "bg-red-100 text-red-700 border-red-400",
  };

  const iconStyles = {
    success: <CheckCircle className="h-5 w-5 text-green-700" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-700" />,
    error: <XCircle className="h-5 w-5 text-red-700" />,
  };

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 border-l-4 rounded-lg shadow-md flex items-center space-x-3 ${alertStyles[type]}`}
    >
      {iconStyles[type]}
      <span>{message}</span>
      <button className="ml-2 text-gray-600" onClick={() => setVisible(false)}>✖</button>
    </div>
  );
};

export default Alert;

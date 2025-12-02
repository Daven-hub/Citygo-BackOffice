import { useState } from "react";
import { Bell, Mail, Smartphone, AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import dayjs from "dayjs";

const fakeNotifications = [
  {
    id: "1",
    title: "Nouvelle réservation",
    body: "Un passager vient de réserver un trajet.",
    channel: "PUSH",
    read: false,
    deepLink: "/passagers/123",
    createdAt: "2025-01-30T10:20:00Z",
  },
  {
    id: "2",
    title: "Profil mis à jour",
    body: "Votre profil a été mis à jour avec succès.",
    channel: "EMAIL",
    read: true,
    deepLink: "/profile",
    createdAt: "2025-01-29T09:00:00Z",
  },
  {
    id: "3",
    title: "Nouveau conducteur inscrit",
    body: "Un conducteur vient de finaliser son inscription.",
    channel: "PUSH",
    read: false,
    deepLink: "/drivers/44",
    createdAt: "2025-01-28T14:10:00Z",
  },
  {
    id: "4",
    title: "Nouveau conducteur inscrit",
    body: "Un conducteur vient de finaliser son inscription.",
    channel: "PUSH",
    read: false,
    deepLink: "/drivers/44",
    createdAt: "2025-01-28T14:10:00Z",
  },
  {
    id: "5",
    title: "Nouveau conducteur inscrit",
    body: "Un conducteur vient de finaliser son inscription.",
    channel: "PUSH",
    read: false,
    deepLink: "/drivers/44",
    createdAt: "2025-01-28T14:10:00Z",
  },
];

const channelIcon = (type) => {
  switch (type) {
    case "PUSH":
      return <Smartphone className="w-3 h-3 text-blue-600" />;
    case "EMAIL":
      return <Mail className="w-3 h-3 text-emerald-600" />;
    default:
      return <AlertCircle className="w-3 h-3 text-gray-500" />;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(fakeNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className='flex flex-col gap-5 max-md:gap-5'>
      <div className='flex max-md:flex-col gap-2 px-5 py-4 rounded-[10px] bg-white justify-between max-md:items-start items-center'>
        <h1 className='flex items-center leading-[1.3] text-gray-700 md:text-[1.15rem] font-medium gap-1.5'>
          <Bell size={20}/> 
          Notifications{' '}
        </h1>
        <Breadcrumb />
      </div>

      <div className="space-y-1.5 pt-4 border-t">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={`px-5 py-4 relative rounded-[5px] border transition-all cursor-pointer backdrop-blur-xl hover:shadow-sm 
              ${!n.read ? "border-blue-400/50 bg-gradient-to-r from-blue-50 to-white" : "border-gray-200 bg-white"}
            `}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                <h2 className="text-md font-medium text-gray-800">{n.title}</h2>
              </div>
              <span className="text-xs text-primary">
                {dayjs(n.createdAt).format('DD/MM/YYYY à HH:MM')}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{n.body}</p>

            <div className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-3 py-1 text-[.6rem] rounded-full bg-gray-100 text-gray-700">
              {channelIcon(n.channel)}
              {n.channel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
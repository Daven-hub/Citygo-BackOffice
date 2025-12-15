import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import $ from "jquery";
import {
  Bell,
  Calendar,
  Car,
  CarFront,
  CarIcon,
  ChartBar,
  ChevronRight,
  CreditCard,
  Grid,
  Mail,
  Settings,
  ShieldCheck,
  SidebarClose,
  User,
  UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function Sidebar({ setIsSidebarOpen }) {
  $(function () {
    let toggleValue = false;
    $(document).on("click", ".settings-btn", function () {
      toggleValue = !toggleValue;
      const pixel = $(this).siblings().prop("scrollHeight");
      if (toggleValue) {
        $(this).siblings().css("height", `${pixel}px`);
        $(this).children().last().addClass("rotate-[90deg]");
      } else {
        $(this).siblings().css("height", `0px`);
        $(this).children().last().removeClass("rotate-[90deg]");
      }
    });
  });

  const { userConnected } = useAuth();

  const sideLink = [
    {
      group: "",
      alowed: [],
      corps: [
        {
          title: "Tableau de Bord",
          icon: <Grid size={20} />,
          path: "/",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        { title: 'Vehicules', icon: <CarFront size={20} />, path: '/vehicules', children: [], alowed:["ROLE_ADMIN"] },
        {
          title: "Trajets",
          icon: <CarFront size={20} />,
          path: "/trajets",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Reservations",
          icon: <Calendar size={20} />,
          path: "/reservations",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "KYC",
          icon: <ShieldCheck size={20} />,
          path: "/kyc",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Transactions",
          icon: <CreditCard size={20} />,
          path: "/transactions",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        // { title: 'Destination', icon: <MapPin size={18} />, path: '/destinations', children: [], alowed:['admin','super'], },
        {
          title: "Utilisateurs",
          icon: <User size={20} />,
          path: "",
          children: [
            {
              title: "Utilisateurs",
              icon: <CarFront size={20} />,
              path: "/utilisateurs",
              children: [],
              alowed: ["ROLE_ADMIN"],
            },
            {
              title: "Administrations",
              icon: <Bell size={20} />,
              path: "/utilisateurs-admin",
              children: [],
              alowed: ["ROLE_ADMIN"],
            },
          ],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Notifications",
          icon: <Bell size={20} />,
          path: "/notifications",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Messages",
          icon: <Mail size={20} />,
          path: "/messages",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Profile",
          icon: <UserIcon size={20} />,
          path: "/profile",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Rapports",
          icon: <ChartBar size={20} />,
          path: "/rapports",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
        {
          title: "Paramètres",
          icon: <Settings size={20} />,
          path: "/settings",
          children: [],
          alowed: ["ROLE_ADMIN"],
        },
      ],
    },
  ];

  const location = useLocation();

  return (
    <div
      className={`fixed border-r h-[100vh] left-0 side-ccca w-[17.5%] max-md:w-[55%] max-sm:w-[75%] bg-white transform transition-transform duration-500`}
    >
      <div className="flex items-center justify-between border-b py-3.5 md:py-3 px-[7%]">
        <div className="flex items-center justify-start gap-1.5 w-full">
          <img
            src={"/images/FullLogo.png"}
            alt="Logo"
            className="w-auto object-contain max-md:h-11 h-[2.54rem]"
          />
        </div>
        <div className="menu-close hidden cursor-pointer max-md:block">
          <SidebarClose size={25} color="white" />
        </div>
      </div>

      <div className="px-3 relative pb-3 pt-5 flex flex-col gap-8 overflow-y-auto sidebb h-[calc(100vh-69px)]">
        <div className="sidebare-admin text-[1.05rem] md:text-[.95rem] font-medium text-gray-600 flex flex-col gap-2.5">
          {sideLink?.map((x, indexi) => (
            <div key={indexi}>
              <p
                className={`text-[.85rem] font-normal text-gray-400 text-opacity-30 mb-0`}
              >
                {x.group}
              </p>
              <div className="flex flex-col gap-1">
                {x?.corps.map((item, index) => {
                  const childIsActive =
                    item.children?.length > 0
                      ? item.children.some((child) =>
                        location.pathname.startsWith(child.path)
                      )
                      : false;

                  return item.children.length === 0 ? (
                    item.alowed?.some(role => userConnected?.roles?.includes(role)) && (
                      <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 w-full px-3.5 border border-transparent py-2.5 rounded-lg transition-colors duration-200 
                          ${isActive
                            ? "bg-blue-50 !text-blue-600 border-primary/10"
                            : "text-gray-600 hover:bg-gray-50"
                          }`
                        }
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        {item.title}
                      </NavLink>
                    )
                  ) : (
                    <div key={index} className="flex flex-col">
                      <div
                        className={`settings-btn border border-transparent text-blue-600 flex items-center justify-between cursor-pointer px-3.5 py-2.5 w-full rounded-md transition-all
                          ${childIsActive
                            ? "bg-blue-100 border-primary/20"
                            : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="">{item.title}</span>
                        </div>
                        <ChevronRight
                          size={17}
                          className={`transition-all duration-200 ${childIsActive ? "rotate-90" : ""
                            }`}
                        />
                      </div>

                      <ul
                        className={`pl-11 relative overflow-hidden after:content after:absolute after:top-1/2 after:-translate-y-1/2 after:left-6 after:w-[2px] after:h-[95%] after:bg-primary/40 transition-all duration-300 `}
                        style={{ height: 0 }}
                      >
                        {item.children.map((child, i) => (
                          <li key={i} className="">
                            <NavLink
                              to={child.path}
                               onClick={() => setIsSidebarOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center py-1.5 transition-colors
                    ${isActive
                                  ? "!text-blue-500 font-normal"
                                  : "text-gray-700 hover:text-blue-500"
                                }`
                              }
                            >
                              {child.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* <div className='flex absolute bottom-1 py-3 px-0 rounded-[10px] border bg-gray-100'>
          <DotLottieReact
            src="/carpool.json"
            className='w-full'
            loop
            autoplay
          />
        </div> */}
      </div>
    </div>
  );
}

export default Sidebar;

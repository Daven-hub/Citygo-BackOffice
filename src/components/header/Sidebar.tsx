import React from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery'
// import { roleChange } from '../../pages/Admin/Dashboard';
import { ArrowRight, Bell, Calendar, Car, CarFront, CarIcon, ChartBar, ChevronRight, CreditCard, Grid, MapPin, Settings, ShoppingCart, SidebarClose, User, UserIcon, UserRound } from 'lucide-react';
import { useAuth } from '@/context/authContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Sidebar({setIsSidebarOpen}) {

  $(function () {
    let toggleValue = false;
    $(document).on('click', '.settings-btn', function () {
      toggleValue = !toggleValue
      const pixel = $(this).siblings().prop('scrollHeight');
      if (toggleValue) {
        $(this).siblings().css('height', `${pixel}px`);
        $(this).children().last().addClass('rotate-[90deg]');
      } else {
        $(this).siblings().css('height', `0px`);
        $(this).children().last().removeClass('rotate-[90deg]');
      }
    })
  })

  const {userConnected}= useAuth()

  const sideLink = [
      {
        group: '',
        alowed:[],
        corps: [
          { title: 'Tableau de Bord', icon: <Grid size={18} />, path: '/', children: [], alowed:['admin','super']}
        ]
      },
      {
        group: 'Management',
        alowed:[],
        corps: [
          // { title: 'Vehicules', icon: <CarFront size={18} />, path: '/vehicules', children: [], alowed:['admin','super'] },
          { title: 'Trajets', icon: <CarFront size={18} />, path: '/trajets', children: [], alowed:['admin','super'] },
          { title: 'Reservations', icon: <Calendar size={18} />, path: '/reservations', children: [], alowed:['admin','super'], },
          { title: 'Transactions', icon: <CreditCard size={18} />, path: '/transactions', children: [], alowed:['admin','super'], },
          { title: 'Notifications', icon: <Bell size={18} />, path: '/notifications', children: [], alowed:['admin','super'], },
          // { title: 'Destination', icon: <MapPin size={18} />, path: '/destinations', children: [], alowed:['admin','super'], },
          { title: 'Utilisateurs', icon: <User size={18} />, path: '', children: [
            { title: 'Utilisateurs', icon: <CarFront size={18} />, path: '/utilisateurs', children: [], alowed:['admin','super'] },
            { title: 'Administrations', icon: <Bell size={18} />, path: '/utilisateurs-admin', children: [], alowed:['admin','super']}
          ], alowed:['super']},
          { title: 'Profile', icon: <UserIcon size={18} />, path: '/profile', children: [], alowed:['admin','super'] },
          { title: 'Rapports', icon: <ChartBar size={18} />, path: '/rapports', children: [], alowed:['admin','super'] },
          { title: 'Paramètres', icon: <Settings size={18} />, path: '/settings', children: [], alowed:['admin','super'], },
        ]
      },
    ];


  return (
    <div
      className={`fixed border-r h-[100vh] left-0 side-ccca w-[17.5%] max-md:w-[60%] max-sm:w-[80%] bg-white transform transition-transform duration-500`}
    >
      <div className="flex items-center justify-between py-2.5 max-md:py-[.85rem] px-[7%]">
        <div className="flex items-center justify-start gap-1.5 w-full">
          <img src={'/images/FullLogo.png'} alt="Logo" className="w-full object-contain max-md:w-7 max-md:h-7 h-[2.7rem]" />
        </div>
        <div className='menu-close hidden cursor-pointer max-md:block'><SidebarClose size={25} color='white' /></div>
      </div>

      <div className="px-3 pb-3 pt-4 flex flex-col gap-8 overflow-y-auto sidebb h-[calc(100vh-69px)]">
        <div className="sidebare-admin flex flex-col gap-2.5">
          {sideLink?.map((x, indexi) => (
            <div key={indexi}>
              <p className={`text-[.82rem] font-normal text-gray-400 text-opacity-30 mb-1`}>{x.group}</p>
              <div className='flex flex-col gap-0.5'>
                {x?.corps.map((item, index) => (
                  item.children.length <= 0 ?
                    (item.alowed?.includes(userConnected?.role) &&
                    <NavLink
                      key={index}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-[0.88rem] font-normal transition-colors duration-200 
                        ${isActive ? 'bg-blue-50 !text-blue-600' : 'text-gray-900 hover:bg-gray-100'}`
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.title}
                    </NavLink>) :
                    <div
                      key={index}
                      className='flex flex-col'
                    >
                      <NavLink  to={'#'}
                        className={({ isActive }) =>
                          `settings-btn flex items-center justify-between cursor-pointer px-3.5 py-2.5 overflow-hidden w-full text-white text-opacity-60 font-normal rounded-md 
                          ${isActive ? 'bg-blue-50 !text-blue-600' : 'text-gray-900 hover:bg-gray-100 hover:text-gray-900'}`
                        }
                        onClick={() => setIsSidebarOpen()}
                       >
                        <div className='flex items-center gap-3'>
                          {item.icon}
                          <span className="text-[.88rem]">{item.title}</span>
                        </div>
                        <ChevronRight size={17} className='transition-all duration-200' />
                      </NavLink>
                      <ul className='relative overflow-y-hidden after:content after:absolute after:top-1/2 after:-translate-y-1/2 after:left-5 after:w-[2px] after:h-[95%] after:bg-primary/40 transition-all flex flex-col gap-0.5 ps-7 duration-500 text-[1rem]' style={{ height: 0 }}>
                        {item.children.map((y, inde) =>
                          <li key={inde} className='ms-4'>
                            <NavLink
                            className={({ isActive }) =>
                          `flex text-[.85rem] items-center py-1.5 justify-between cursor-pointer overflow-hidden w-full text-white text-opacity-60 font-normal rounded-md 
                          ${isActive ? 'bg-transparent !text-blue-600 font-medium' : 'text-gray-900 hover:text-gray-900'}`
                        }
                          to={y?.path}> {y?.title}</NavLink></li>
                        )}
                      </ul>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='flex py-5 px-0 rounded-[10px] border bg-gray-100'>
          <DotLottieReact
            src="/carpool.json"
            className='w-full'
            loop
            autoplay
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

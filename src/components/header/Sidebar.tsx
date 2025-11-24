import React from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery'
// import { roleChange } from '../../pages/Admin/Dashboard';
import { ArrowRight, Grid, Settings, ShoppingCart, SidebarClose } from 'lucide-react';
import { useAuth } from '@/context/authContext';

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
        alowed:['fournisseur','admin','acheteur'],
        corps: [
          { title: 'Tableau de Bord', icon: <Grid size={18} />, path: '/admin/tableau-de-bord', children: [] },
        ]
      },
      {
        group: 'Paramétre',
        alowed:['admin'],
        corps: [
          // { title: 'Rapport', icon: <FiFileText size={18} />, path: '/admin/rapport', children: [] },
          // { title: 'Profile', icon: <UserIcon size={18} />, path: '/admin/profile', children: [] },
          { title: 'Paramètres', icon: <Settings size={18} />, path: '/admin/parametres/securite', children: [] },
        ]
      },
    ];


  return (
    <div
      className={`fixed h-[100vh] left-0 side-ccca w-[18%] max-md:w-[60%] max-sm:w-[80%] bg-secondary shadow-sm transform transition-transform duration-500`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center bg-white/40 justify-between py-[.95rem] max-md:py-[.85rem] border-b border-white/20 shadow-sm px-[7%]">
        <div className="flex items-center justify-center max-md:justify-start gap-1.5 w-full">
          <img src={'/images/FullLogo.png'} alt="Logo" className="w-full object-contain max-md:w-7 max-md:h-7 h-[2.2rem]" />
          {/* <div className='flex flex-col font-semibold text-[.9rem] max-md:text-[.8rem] text-white leading-[1.1rem]'>
            <span>Chambre de Commerce</span>
            <span>Canada Afrique</span>
          </div> */}
        </div>
        <div className='menu-close hidden cursor-pointer max-md:block'><SidebarClose size={25} color='white' /></div>
      </div>
      {/* Sidebar Menu */}
      <div className="px-3 py-3 overflow-y-auto sidebb h-[calc(100vh-69px)]">
        <div className="sidebare-admin flex flex-col gap-4">
          {sideLink?.map((x, indexi) => (
            x.alowed?.includes(userConnected?.role) &&
            <div key={indexi}>
              <p className={`text-[.85rem] font-medium text-white text-opacity-30 mb-1`}>{x.group}</p>
              <div className='flex flex-col gap-0.5'>
                {x?.corps.map((item, index) => (
                  item.children.length <= 0 ?
                    <NavLink
                      key={index}
                      to={item.path}
                      className={`flex items-center nav-items gap-3 w-full px-4 py-2.5 text-white text-opacity-60 font-medium transition-all duration-200 hover:bg-white hover:text-opacity-100 hover:bg-opacity-20 rounded-md`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-[.91rem]">{item.title}</span>
                    </NavLink> :
                    <div
                      key={index}
                      // to={item.path}
                      className={`flex cursor-pointer flex-col nav-items overflow-hidden w-full text-white text-opacity-60 font-medium rounded-md`}
                      onClick={() => setIsSidebarOpen()}
                    >
                      <div className='settings-btn flex justify-between px-4 hover:text-white hover:bg-white hover:text-opacity-100 hover:bg-opacity-20 py-2.5 items-center'>
                        <div className='flex items-center gap-3'>
                          {item.icon}
                          <span className="text-[.91rem]">{item.title}</span>
                        </div>
                        <ArrowRight size={17} className='transition-all duration-200' />
                      </div>
                      <ul className='overflow-y-hidden transition-all flex flex-col gap-0.5 ps-7 duration-500 text-[1.02rem]' style={{ height: 0 }}>
                        {item.children.map((y, inde) =>
                          <li key={inde} className='py-2'><NavLink className='text-[.9rem] flex hover:text-white hover:text-opacity-100 items-center gap-3' to={y?.path}> {y?.title}</NavLink></li>
                        )}
                      </ul>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';
import * as Avatar from "@radix-ui/react-avatar";
import { BaseUrl } from '@/config';
import { useAuth } from '@/context/authContext';
import { ArrowDown, LayoutDashboard, LogOut, Settings, UserCircle } from 'lucide-react';

function UserMenu({isAdmin,isLight=true}) {
      const [open, setOpen] = useState(false);
      const popoverRef = useRef(null);
      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                        setOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const { userConnected, handleLogout } = useAuth();
      return (
            <div ref={popoverRef} className='flex relative items-center font-bold text-[.75rem] gap-2'>
                  <div onClick={() => setOpen(!open)} className='cursor-pointer flex items-center gap-1.5'>
                        <Avatar.Root className="AvatarRoot inline-flex w-[38px] h-[38px] object-cover object-top rounded-full items-center justify-center overflow-hidden align-middle">
                              <Avatar.Image
                                    className="AvatarImage bg-gray-50 object-cover"
                                    src={BaseUrl + "" + userConnected?.profile}
                                    alt={userConnected?.username? userConnected?.username: userConnected?.nom}
                              />
                              <Avatar.Fallback className="AvatarFallback flex h-full w-full items-center justify-center bg-gray-100 text-sm font-semibold text-gray-800" delayMs={100}>
                                    {userConnected?.username?.charAt(0)?.toUpperCase()}
                              </Avatar.Fallback>
                        </Avatar.Root>
                        <div className='flex flex-col leading-[1.3]'>
                              <span className={`${isAdmin?(isLight?'text-white/85':'text-primary/85'):'text-primary/85'} truncate max-w-[110px] text-[.92rem] capitalize font-semibold`}>{userConnected?.username ?userConnected?.username: userConnected?.prenom+' '+userConnected?.nom}</span>
                              <span className={`${isAdmin?(isLight?'text-white/75':'text-gray-500'):'text-primary/70'} capitalize font-light text-[.7rem]`}>{userConnected?.role}</span>
                        </div>
                        <ArrowDown />
                  </div>
                  {/* Popover */}
                  {open && (
                        <div className="absolute top-full right-0 overflow-hidden mt-2 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              <div className="px-4 space-y-0.5 py-3 border-b">
                                    <p className="text-sm text-primary capitalize font-semibold">{userConnected?.username ?userConnected?.username: userConnected?.prenom+' '+userConnected?.nom}</p>
                                    <p className="text-xs font-normal text-gray-400">{userConnected?.email}</p>
                              </div>
                              <ul className="py-1 text-sm font-medium text-gray-500">
                                    {isAdmin && <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/tableau-de-bord"} className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100">
                                                <LayoutDashboard /> Tableau de bord
                                          </NavLink>
                                    </li>}
                                    <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/parametres/securite"} className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100">
                                                <UserCircle /> Mon profil
                                          </NavLink>
                                    </li>
                                    <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/parametres/securite"} className="w-full flex items-center gap-2.5 text-left px-4 py-2 hover:bg-gray-100">
                                                <Settings /> Paramètres
                                          </NavLink>
                                    </li>
                              </ul>
                              <div className="border-t text-sm font-medium">
                                    <button onClick={() => { handleLogout(); setOpen(false) }} className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-red-600 hover:bg-gray-100">
                                          <LogOut/> Déconnexion
                                    </button>
                              </div>
                        </div>
                  )}
            </div>
      )
}

export default UserMenu
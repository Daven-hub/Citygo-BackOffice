import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom';
import * as Avatar from "@radix-ui/react-avatar";
import { ChevronDown, LayoutDashboard, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/use-auth';

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
                  <div onClick={() => setOpen(!open)} className='cursor-pointer flex items-center gap-2.5'>
                        {/* <div className='flex max-md:hidden text-end flex-col gap-0.5 leading-[1.3]'>
                              <span className={`${isAdmin?(isLight?'text-white/85':'text-secondary/90'):'text-secondary/90'} truncate max-w-[110px] text-[.85rem] capitalize font-medium`}>{userConnected?.displayName}</span>
                              <span className={`${isAdmin?(isLight?'text-white/75':'text-gray-500'):'text-gray-700/70'} capitalize font-normal text-[.65rem]`}>{'Administrateur'}</span>
                        </div> */}
                        <div className='flex items-center gap-0.5'>
                              <Avatar.Root className="AvatarRoot inline-flex w-[37px] h-[37px] object-cover object-top rounded-full items-center justify-center overflow-hidden align-middle">
                                    <Avatar.Image
                                          className="AvatarImage bg-gray-50 object-cover"
                                          src={userConnected?.avatarUrl}
                                          alt={userConnected?.displayName}
                                    />
                                    <Avatar.Fallback className="AvatarFallback flex h-full w-full uppercase items-center justify-center bg-primary/10 text-sm font-semibold text-primary" delayMs={100}>
                                          {userConnected?.displayName?.split(" ").slice(0, 2).map(n => n[0]).join("")}
                                    </Avatar.Fallback>
                              </Avatar.Root>
                              <ChevronDown size={18} strokeWidth={2} className='text-gray-500'/>
                        </div>
                  </div>
                  {/* Popover */}
                  {open && (
                        <div className="absolute top-full right-0 overflow-hidden mt-2 w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                              <div className="px-4 space-y-0.5 py-3 border-b">
                                    <p className="text-sm text-secondary capitalize font-medium">{userConnected?.displayName}</p>
                                    <p className="text-xs font-normal text-gray-400">{userConnected?.email}</p>
                              </div>
                              <ul className="py-1 text-[.8rem] font-normal text-gray-500">
                                    {isAdmin && <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/tableau-de-bord"} className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100">
                                                <LayoutDashboard strokeWidth={1.5} size={21}/> Tableau de bord
                                          </NavLink>
                                    </li>}
                                    <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/parametres/securite"} className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-gray-100">
                                                <UserCircle strokeWidth={1.5} size={21}/> Mon profil
                                          </NavLink>
                                    </li>
                                    <li>
                                          <NavLink onClick={() => setOpen(false)} to={"/admin/parametres/securite"} className="w-full flex items-center gap-2.5 text-left px-4 py-2 hover:bg-gray-100">
                                                <Settings strokeWidth={1.5} size={21}/> Paramètres
                                          </NavLink>
                                    </li>
                              </ul>
                              <div className="border-t text-sm font-normal">
                                    <button onClick={() => { handleLogout(); setOpen(false) }} className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-red-600 hover:bg-gray-100">
                                          <LogOut strokeWidth={1.5} size={21}/> Déconnexion
                                    </button>
                              </div>
                        </div>
                  )}
            </div>
      )
}

export default UserMenu
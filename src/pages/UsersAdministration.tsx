import React, { useEffect, useMemo, useState } from 'react'

import {
  ChevronDown,
  Edit,
  Trash2,
  DownloadCloud,
  Plus,
  User,
  Eye
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { useToast } from '@/hook/use-toast'
import { deleteuser, getAllUsers, updateUser } from '@/store/slices/user.slice'
import LoaderUltra from '@/components/ui/loaderUltra'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BaseUrl } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import dayjs from "dayjs";
import Breadcrumb from '@/components/Breadcrumb'
import UserModal from '@/components/modal/UserModal'
// import useDeviceInfo from '@/hook/useDeviceInfo'
import { useNavigate } from 'react-router-dom'
import { Switch } from '@/components/ui/switch'

// export function ClientStats ({ data }) {
//   const formatted = data.map(item => {
//     const diff = item.nbre - item.previousNbre
//     const percent = ((diff / item.previousNbre) * 100).toFixed(1)
//     const nbreFormatted = String(item.nbre).padStart(2, '0')
//     const previousFormatted = String(item.previousNbre).padStart(2, '0')

//     return {
//       ...item,
//       nbre: nbreFormatted,
//       previousNbre: previousFormatted,
//       evolution: `${percent > 0 ? '+' : ''}${percent}%`,
//       isUp: percent >= 0
//     }
//   })

//   return (
//     <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
//       {formatted.map((item, index) => (
//         <div
//           key={index}
//           className={`${item.color} text-white rounded-[6px] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300`}
//         >
//           <div className='flex justify-between items-center mb-4'>
//             <div className='bg-white/20 p-2 rounded-lg'>
//               <item.icon size={40} />
//             </div>
//             <div
//               animate={{ y: item.isUp ? [0, -4, 0] : [0, 4, 0] }}
//               transition={{
//                 repeat: Infinity,
//                 repeatType: 'mirror',
//                 duration: 1.5
//               }}
//               className={`flex items-center gap-1 text-sm font-semibold ${
//                 item.isUp ? 'text-green-100' : 'text-red-100'
//               }`}
//             >
//               {item.isUp ? (
//                 <ArrowUpRight size={18} />
//               ) : (
//                 <ArrowDownRight size={18} />
//               )}
//               <span>{item.evolution}</span>
//             </div>
//           </div>

//           <div>
//             <p className='text-4xl font-bold'>{item.nbre}</p>
//             <p className='text-sm opacity-90'>{item.title}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

function UsersAdministration () {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector(state => state.users)
  const [isLoading, setIsLoading] = useState(true)
  const [loadTime, setLoadTime] = useState(0)
  const [search, setSearch] = useState('')
  const [open, setOpen]=useState(false)
  const { toast } = useToast()
  const navigate= useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const start = performance.now()
      try {
        await Promise.all([dispatch(getAllUsers()).unwrap()])
        const end = performance.now()
        const duration = end - start
        setLoadTime(parseInt(duration.toFixed(0)))
      } catch (error) {
        console.error('Erreur lors du chargement :', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dispatch])

  const filterClient = useMemo(() => {
      const lowerSearch = search?.toLowerCase()
      return users.filter(cat =>
        cat?.nom?.toLowerCase()?.includes(lowerSearch) ||
        cat?.prenom?.toLowerCase()?.includes(lowerSearch) ||
        cat?.email?.toLowerCase()?.includes(lowerSearch) ||
        cat?.adresse?.toLowerCase()?.includes(lowerSearch) ||
        cat?.username?.toLowerCase()?.includes(lowerSearch)
      )
    }, [users, search])


  const handleUpdateStatus = async (id, x) => {
    try {
      const datas = { status: x }
      await dispatch(updateUser({ id, datas })).unwrap()
      toast({
        title: 'Modification',
        description: `status ${x === 1 ? 'activé' : 'désactivé'} avec succes`
      })
    } catch (error) {
      toast({
        title: error?.toString(),
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteuser(id)).unwrap()
      toast({
        title: 'Supprimer',
        description: `Utilisateur supprimé`
      })
    } catch (error) {
      toast({
        title: error?.toString(),
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <LoaderUltra loading={isLoading} duration={loadTime} />
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex max-md:flex-col gap-2 px-5 py-4 rounded-[10px] bg-white justify-between max-md:items-start items-center'>
        <h1 className='flex items-center leading-[1.3] text-gray-700 md:text-[1.25rem] font-medium gap-1.5'>
          <User size={22}/> 
          Administrateurs{' '}
        </h1>
        <Breadcrumb />
      </div>

      <div className='flex flex-col gap-4 rounded-[6px] py-0.5'>
        <div className='pb-2 border-b'></div>
        <div className='flex justify-between items-center gap-4'>
          <div className='flex w-[30%] items-center gap-3'>
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='border bg-white text-[.87rem] py-2.5 rounded-[7px] outline-0 px-5 w-full md:w-[100%]'
              type='text'
              placeholder='Recherchez ...'
            />
          </div>
          <div className='flex items-center gap-3'>
            <button className='py-2 px-4 flex items-center gap-1.5 text-[.85rem] rounded-[7px] border border-red-600 bg-white font-semibold text-red-600'>
                <DownloadCloud size={16}/> pdf
            </button>
            <button onClick={()=>setOpen(true)} className='py-2 px-4 flex items-center gap-1.5 text-[.85rem] rounded-[7px] border border-gray-600 bg-white font-semibold text-gray-600'>
                <Plus size={16}/> Nouveau
            </button>
            <UserModal toast={toast} dispatch={dispatch} open={open} setOpen={()=>setOpen(false)} />
          </div>
        </div>
        <div className='rounded-[5px] overflow-hidden bg-white border'>
          <Table>
            <TableHeader className='text-black border-b'>
              <TableRow>
                <TableHead>UUID</TableHead>
                <TableHead>Noms</TableHead>
                <TableHead>email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créer le</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterClient.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center py-7'>
                   Pas de resultat
                  </TableCell>
                </TableRow>
              ) : (
                filterClient.map((species, index) => (
                  <TableRow
                    className='hover:bg-primary/5 cursor-pointer'
                    key={index}
                  >
                    <TableCell className=''>{index + 1}</TableCell>
                    <TableCell className='flex items-center space-x-3'>
                      <Avatar>
                        {species?.profile && (
                          <AvatarImage
                            className='object-contain border w-[80px] overflow-hidden'
                            src={BaseUrl + '' + species?.profile}
                          />
                        )}
                        <AvatarFallback>
                          {species?.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                        <p className='text-sm capitalize'>
                          {species?.prenom + ' ' + species?.nom}
                        </p>
                    </TableCell>
                    <TableCell className=''>
                      {species?.email}
                    </TableCell>
                    <TableCell className=''>
                         <Switch
                          checked={parseInt(species?.status)===1}
                          onCheckedChange={(checked) => handleUpdateStatus(species?.id,checked ? 1 : 0)}
                          className={`
                            transition duration-300
                            ${parseInt(species?.status) === 1 
                              ? "data-[state=checked]:bg-green-500" 
                              : "data-[state=unchecked]:bg-red-500"}
                          `}
                        />
                    </TableCell>
                    <TableCell className=''>
                      {dayjs(species?.created_at).format('YYYY-MM-DD')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <button type='button' onClick={()=>handleDelete(species?.id)} className='px-3 rounded-md bg-red-100 py-2'><Trash2 className='h-4 w-4 text-red-500' /></button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default UsersAdministration

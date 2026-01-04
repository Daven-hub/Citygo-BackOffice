import Breadcrumb from '@/components/Breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import LoaderUltra from '@/components/ui/loaderUltra'
import { useAuth } from '@/context/authContext'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getUserById } from '@/store/slices/user.slice'
import { Edit, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

function Profile() {
    const { userConnected } = useAuth()
    const dispatch = useAppDispatch()
    const { usersId } = useAppSelector(state => state.users)
    const [isLoading, setIsLoading] = useState(true)
    const [loadTime, setLoadTime] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const start = performance.now()
            try {
                await Promise.all([dispatch(getUserById(userConnected?.id)).unwrap()])
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
    }, [dispatch,userConnected?.id])

    const datas = [
        {
            champ: 'Nom',
            value: usersId?.nom
        },
        {
            champ: 'Prenom',
            value: usersId?.prenom
        },
        {
            champ: 'Date de naissance',
            value: usersId?.birthday
        },
        {
            champ: 'Adresse email',
            value: usersId?.email
        },
        {
            champ: 'Telephone',
            value: usersId?.tel
        },
        {
            champ: 'Role',
            value: usersId?.role==='super'?'super admin':usersId?.role
        }
    ]

    if (isLoading) {
        return <LoaderUltra loading={isLoading} duration={loadTime} />
    }

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex px-5 py-4 rounded-[10px] bg-white justify-between items-center'>
                <h1 className='flex leading-[1.3] items-center text-gray-600 md:text-[1.1rem] font-medium gap-1.5'>
                    <UserIcon size={22} />
                    Mon Profile{' '}
                </h1>
                <Breadcrumb />
            </div>
            <div className='flex flex-col gap-4'>
                <div className='rounded-[6px] flex items-center gap-5 px-7 py-4 bg-white'>
                    <Avatar className='inline-flex w-[75px] h-[75px] border-2 p-1 object-cover object-top rounded-full items-center justify-center overflow-hidden align-middle'>
                        <AvatarImage
                            className="AvatarImage bg-gray-50 object-cover"
                            // src={BaseUrl + userConnected?.profile}
                            alt={userConnected?.username ? userConnected?.username : userConnected?.nom}
                        />
                        <AvatarFallback className="AvatarFallback flex h-full w-full items-center justify-center bg-gray-100 text-sm font-semibold text-gray-800" delayMs={100}>
                            {userConnected?.username?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-[0.1rem]'>
                        <h3 className='text-terciary/70 flex items-center gap-1 text-[1rem] font-medium capitalize'>{usersId?.prenom + ' ' + usersId?.nom}&nbsp;.{usersId?.role!=='super'&&<span className={`py-0 mt-1 text-[0.65rem] px-2 w-fit font-ormal border flex text-center justify-center items-center rounded-full ${usersId?.status === 1 ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-600 bg-red-50'}`}>{usersId?.status === 1 ? 'Active' : 'Suspendu'}</span>}</h3>
                        <span className='text-[.82rem] text-gray-500 capitalize'>{usersId?.role === 'super' ? 'super admin' : usersId?.role}</span>
                        <span className='text-[.82rem] text-blue-400'>@{usersId?.username}</span>
                    </div>
                </div>

                <div className='rounded-[6px] flex flex-col gap-4 px-7 py-5 bg-white'>
                    <div className='flex pb-3 border-b border-opacity-20 justify-between items-center'>
                        <h3 className='text-[1.2rem] text-black/70 font-medium'>Information personnel</h3>
                        <Button size='sm' className='bg-transparent bg-primary text-white'><Edit /> </Button>
                    </div>
                    <div className='grid grid-cols-3 gap-5'>
                        {datas?.map((x, index) =>
                            <div key={index} className='flex flex-col gap-1'>
                                <h2 className='text-gray-400 text-[.8rem] font-normal'>{x?.champ}</h2>
                                <span className='text-[.9rem] text-black/80 font-medium'>{x?.value}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className='rounded-[6px] flex flex-col gap-4 px-7 py-5 bg-white'>
                    <div className='flex pb-3 border-b border-opacity-20 justify-between items-center'>
                        <h3 className='text-[1.1rem] text-black/70 font-medium'>Bio</h3>
                        <Button size='sm' className='bg-transparent py-2 bg-primary text-white'><Edit /> </Button>
                    </div>
                    <textarea className='text-sm p-4 rounded-sm' rows={4} disabled value={usersId?.bio}></textarea>
                </div>
            </div>
        </div>
    )
}

export default Profile
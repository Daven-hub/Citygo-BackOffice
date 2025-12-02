import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '@/components/Breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import LoaderUltra from '@/components/ui/loaderUltra'
import { BaseUrl } from '@/config'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getAllUsers } from '@/store/slices/user.slice'
import { UserIcon, CarIcon, WalletIcon, ShieldCheck, FlagTriangleRight, Activity, BookUser } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

function DriverDetail() {
  const { driverId } = useParams()
  const dispatch = useAppDispatch()
  const { users } = useAppSelector(state => state.users)

  const [isLoading, setIsLoading] = useState(true)
  const [loadTime, setLoadTime] = useState(0)

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

  const detail = useMemo(() => {
    return users?.find(x => x?.id === parseInt(driverId)) || {}
  }, [users, driverId])

  if (isLoading) return <LoaderUltra loading={isLoading} duration={loadTime} />

  return (
    <div className='flex flex-col gap-6'>

      {/* HEADER */}
      <div className='flex px-5 py-2 rounded-xl bg-white justify-between items-center'>
        <h1 className='flex items-center text-gray-800 text-lg font-medium gap-2'>
          <UserIcon size={22} className='' /> Détail du compte
        </h1>
        <Breadcrumb />
      </div>

      {/* USER CARD */}
      <div className='w-full relative flex flex-col rounded-xl border bg-white overflow-hidden'>
        <div className='h-[7rem] bg-gradient-to-r from-primary to-blue-500 relative'>
          <div className='absolute p-1.5 border bg-white shadow-lg rounded-full w-[110px] top-16 left-10 h-[110px]'>
            <Avatar className='w-full h-full rounded-full'>
              <AvatarImage src={BaseUrl + detail?.profile} className='w-full h-full object-cover' />
              <AvatarFallback />
            </Avatar>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className='absolute flex items-center gap-3 right-4 top-4 text-xs'>
          <Button className='text-[.75rem] bg-red-50 text-red-600 border border-red-200'>Suspendre</Button>
          <Button className='text-[.75rem] bg-orange-50 text-orange-500 border border-orange-200'>Bloquer</Button>
          <Button className='text-[.75rem] bg-gray-900 text-white border border-gray-700'>Supprimer</Button>
        </div>

        <div className='flex flex-col gap-1 py-4 pr-6 pl-[12rem]'>
          <h2 className='text-lg capitalize font-medium text-gray-800'>{detail?.prenom+' '+detail?.nom}</h2>
          <p className='text-gray-500 text-sm'>{detail?.email}</p>
          <p className='text-gray-500 text-sm'>{detail?.tel}</p>
        </div>
      </div>

      <div className='w-full bg-white border rounded-xl p-6'>
        <Tabs defaultValue='overview'>
          <TabsList className='grid grid-cols-6 w-full mb-6 bg-gray-100 p-1 rounded-lg'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='vehicule'>Véhicules</TabsTrigger>
            <TabsTrigger value='trajets'>Trajets</TabsTrigger>
            <TabsTrigger value='paiements'>Paiements</TabsTrigger>
            <TabsTrigger value='securite'>Sécurité</TabsTrigger>
            <TabsTrigger value='signalements'>Signalements</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value='overview'>
            <div className='grid md:grid-cols-2 gap-6'>

              <div className='p-5 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition-all'>
                <h3 className='font-semibold mb-3 text-gray-800 flex gap-2 items-center'><BookUser className='text-primary' /> Informations personnelles</h3>
                <div className='space-y-1 text-sm'>
                  <p><strong>Nom :</strong> {detail.fullname}</p>
                  <p><strong>Email :</strong> {detail.email}</p>
                  <p><strong>Téléphone :</strong> {detail.phone}</p>
                  <p><strong>Adresse :</strong> {detail.address || 'Non renseignée'}</p>
                  <p><strong>Rôle :</strong> {detail.role}</p>
                </div>
              </div>

              <div className='p-5 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition-all'>
                <h3 className='font-semibold mb-3 text-gray-800 flex gap-2 items-center'><Activity className='text-green-600' /> Statistiques</h3>
                <div className='space-y-1 text-sm'>
                  <p><strong>Trajets effectués :</strong> 12</p>
                  <p><strong>Conducteur :</strong> 5</p>
                  <p><strong>Passager :</strong> 7</p>
                  <p><strong>Taux de présence :</strong> 98%</p>
                  <p><strong>Note moyenne :</strong> 4.8 / 5</p>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* VEHICULE */}
          <TabsContent value='vehicule'>
            <div className='border p-5 rounded-xl shadow-sm bg-gray-50'>
              <h3 className='font-semibold mb-3 flex gap-2 text-gray-800'><CarIcon className='text-blue-600' /> Véhicules enregistrés</h3>
              <div className='grid gap-4'>
                <div className='border p-4 rounded-lg bg-white shadow-sm'>
                  <p><strong>Marque :</strong> Toyota</p>
                  <p><strong>Modèle :</strong> Corolla</p>
                  <p><strong>Année :</strong> 2020</p>
                  <p><strong>Immatriculation :</strong> ABC-123</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TRAJETS */}
          <TabsContent value='trajets'>
            <h3 className='font-semibold mb-4 flex gap-2 text-gray-800'><Activity className='text-purple-600' /> Historique des trajets</h3>
            <div className='rounded-xl border shadow-sm overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='p-3 text-left'>Date</th>
                    <th className='p-3 text-left'>Départ</th>
                    <th className='p-3 text-left'>Arrivée</th>
                    <th className='p-3 text-left'>Rôle</th>
                    <th className='p-3 text-left'>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b bg-white'>
                    <td className='p-3'>12 Jan 2025</td>
                    <td className='p-3'>Paris</td>
                    <td className='p-3'>Lyon</td>
                    <td className='p-3'>Conducteur</td>
                    <td className='p-3 text-green-600 font-semibold'>Terminé</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* PAIEMENTS */}
          <TabsContent value='paiements'>
            <h3 className='font-semibold mb-4 flex gap-2 text-gray-800'><WalletIcon className='text-yellow-600' /> Paiements & Portefeuille</h3>
            <div className='grid md:grid-cols-2 gap-4'>
              <div className='border p-5 rounded-xl bg-gray-50 shadow-sm'><p><strong>Solde disponible :</strong> 45€</p><p><strong>Total gagné :</strong> 210€</p><p><strong>Total dépensé :</strong> 165€</p></div>
            </div>
          </TabsContent>

          {/* SECURITE */}
          <TabsContent value='securite'>
            <h3 className='font-semibold mb-4 flex gap-2 text-gray-800'><ShieldCheck className='text-emerald-600' /> Sécurité du compte</h3>
            <div className='border p-5 rounded-xl bg-gray-50 shadow-sm'>
              <p><strong>2FA :</strong> Désactivée</p>
              <p><strong>IP récente :</strong> 192.168.1.24</p>
              <p><strong>Appareils actifs :</strong> Chrome - Windows</p>
            </div>
          </TabsContent>

          {/* SIGNALEMENTS */}
          <TabsContent value='signalements'>
            <h3 className='font-semibold mb-4 flex gap-2 text-gray-800'><FlagTriangleRight className='text-red-500' /> Signalements reçus</h3>
            <div className='rounded-xl border shadow-sm overflow-hidden'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-100 text-gray-700'>
                  <tr>
                    <th className='p-3 text-left'>Date</th>
                    <th className='p-3 text-left'>Type</th>
                    <th className='p-3 text-left'>Description</th>
                    <th className='p-3 text-left'>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b bg-white'><td className='p-3'>05 Feb 2025</td><td className='p-3'>Comportement</td><td className='p-3'>Retard</td><td className='p-3 text-green-600 font-semibold'>Résolu</td></tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

export default DriverDetail

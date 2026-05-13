import { useEffect, useState } from 'react'
import fond from './assets/fond.jpg'
import hero from './assets/hero.png'
import event1 from './assets/event1.jpg'
import EventModal from './components/EventModal'
import { db } from './lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'

export default function App() {

  const EVENT_WEBHOOK = 'https://discord.com/api/webhooks/1501915058815504485/7k7562xwZUBJNXAXlvKLD1iXlpNgyXiMXrvg5Z7K67MwfJoJ2e8D0hbScpW9eQBuZ-hS'
  // =========================
  // POSTS STOCKÉS EN LOCAL
  // =========================
const [posts, setPosts] = useState([])
const [menuImages, setMenuImages] = useState([])
const [eventsImages, setEventsImages] = useState([])
const [newMenuImage, setNewMenuImage] = useState('')
const [newEventImage, setNewEventImage] = useState('')
  // =========================
  // STATES
  // =========================
  const [loaded, setLoaded] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePostId, setDeletePostId] = useState('')
  const [selectedMenuImage, setSelectedMenuImage] = useState(null)
  useEffect(() => {
  loadNews()
  loadMenu()
  loadEvents()
  }, [])

const loadMenu = async () => {
  const querySnapshot = await getDocs(
    collection(db, 'pacific_menu')
  )

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  setMenuImages(data)
}
const loadEvents = async () => {
  const querySnapshot = await getDocs(
    collection(db, 'pacific_events')
  )

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  setEventsImages(data)
}

const loadNews = async () => {
  const querySnapshot = await getDocs(
    collection(db, 'pacific_news')
  )

  const newsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  setPosts(newsData)
}
  // =========================
  // ADD POST MODAL
  // =========================
  const [addModalOpen, setAddModalOpen] = useState(false)

  // =========================
  // ADMIN LOGIN MODAL
  // =========================
  const [adminLoginOpen, setAdminLoginOpen] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminAction, setAdminAction] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: '',
    video: '',
  })

  // =========================
  // FORMULAIRE RÉSERVATION
  // =========================
  const [eventModalOpen, setEventModalOpen] = useState(false)

  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    hour: '',
    description: '',
    image: '',
  })

  const [reservationData, setReservationData] = useState({
    fullname: '',
    date: '',
    hour: '',
    people: '',
    comment: '',
  })

  // =========================
  // SAVE POSTS
  // =========================
  useEffect(() => {
    localStorage.setItem('pacific-posts', JSON.stringify(posts))
  }, [posts])

  // =========================
  // INTRO CINEMATIC
  // =========================
useEffect(() => {
  const timer = setTimeout(() => {
    setLoaded(true)
  }, 1800)

  return () => {
    clearTimeout(timer)
  }
}, [])
  // =========================
  // AJOUTER UN POST
  // =========================
const addPost = async () => {

  const { title, description, image, video } = newPost

  if (!title || !description) {
    alert('Veuillez remplir les champs requis')
    return
  }

  await addDoc(collection(db, 'pacific_news'), {
    title,
    description,
    image,
    video,
    category: 'NEWS',
    createdAt: Date.now(),
  })

  await loadNews()

  setNewPost({
    title: '',
    description: '',
    image: '',
    video: '',
  })

  setAddModalOpen(false)
}

const addEventImage = async () => {

  if (!newEventImage) return

  await addDoc(collection(db, 'pacific_events'), {
    image: newEventImage,
  })

  setNewEventImage('')

  loadEvents()
}

const deleteMenuImage = async (id) => {

  await deleteDoc(doc(db, 'pacific_menu', id))

  loadMenu()
}
const addMenuImage = async () => {

  if (!newMenuImage) return

  await addDoc(collection(db, 'pacific_menu'), {
    image: newMenuImage,
  })

  setNewMenuImage('')

  loadMenu()
}
const deleteEventImage = async (id) => {

  await deleteDoc(doc(db, 'pacific_events', id))

  loadEvents()
}


  // =========================
  // SUPPRIMER UN POST
  // =========================
const deletePost = async (id) => {
  await deleteDoc(doc(db, 'pacific_news', id))

  await loadNews()
}

  // =========================
  // WEBHOOK DISCORD
  // =========================
  const createEvent = async (e) => {
    if (e) e.preventDefault()
    console.log('CREATE EVENT OK')
    const { title, date, hour, description, image } = eventData

    if (!title || !date || !hour || !description) {
      alert('Veuillez remplir les champs requis')
      return
    }

    setPosts([
      {
        title,
        description,
        image,
        category: 'EVENT',
        video: '',
      },
      ...posts,
    ])

    try {
      const response = await fetch('http://localhost:3001/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Pacific Events',
          embeds: [
            {
              title: `🎉 ${title}`,
              description: description,
              color: 15844367,
              image: {
                url: image,
              },
              fields: [
                {
                  name: '📅 Date',
                  value: date,
                  inline: true,
                },
                {
                  name: '🕒 Heure',
                  value: hour,
                  inline: true,
                },
              ],
              footer: {
                text: 'Pacific Club • Los Santos',
              },
            },
          ],
        }),
      })

      console.log('Discord response', response.status)

      if (response.ok) {
        alert('Événement envoyé sur Discord ✅')
      } else {
        alert('Erreur Discord ❌')
      }
    } catch (error) {
      console.error(error)
      alert('Erreur connexion Discord ❌')
    }

    setEventData({
      title: '',
      date: '',
      hour: '',
      description: '',
      image: '',
    })

    setEventModalOpen(false)
  }

  const reserveClub = async () => {
    const { fullname, date, hour, people, comment } = reservationData

    if (!fullname || !date || !hour || !people) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
      await fetch('http://localhost:3001/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'Pacific Club',
            embeds: [
              {
                title: 'Nouvelle Réservation VIP',
                color: 15844367,
                fields: [
                  {
                    name: 'Nom / Prénom',
                    value: fullname,
                  },
                  {
                    name: 'Date',
                    value: date,
                    inline: true,
                  },
                  {
                    name: 'Heure',
                    value: hour,
                    inline: true,
                  },
                  {
                    name: 'Personnes',
                    value: people,
                    inline: true,
                  },
                  {
                    name: 'Commentaire',
                    value: comment || 'Aucun commentaire',
                    inline: false,
                  },
                ],
              },
            ],
          }),
        }
      )

      alert('Réservation envoyée avec succès')

      setReservationData({
        fullname: '',
        date: '',
        hour: '',
        people: '',
        comment: '',
      })

      setReservationOpen(false)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de l’envoi')
    }
  }

  // =========================
  // INTRO
  // =========================
  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.12),transparent_60%)] animate-pulse"></div>

        <div className="text-center z-10 px-6 animate-pulse">
          <p className="text-yellow-500 tracking-[10px] uppercase text-sm mb-6">
            Los Santos Nightlife
          </p>

          <h1 className="text-7xl md:text-[12rem] font-black text-white tracking-[20px] drop-shadow-[0_0_40px_rgba(255,215,0,0.5)]">
            PACIFIC
          </h1>

          <p className="text-white/40 tracking-[8px] uppercase mt-8 text-sm">
            Welcome To The Experience
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-serif">
        
      
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-black">

        {/* BACKGROUND */}
        <img
          src={hero || fond}
          className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105"
        />

        <div className="absolute inset-0 bg-black/80"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.10),transparent_40%)]"></div>

        {/* NAVBAR */}
        <div className="relative z-20 max-w-7xl mx-auto px-10 pt-10 flex items-center justify-center">

         

          <div className="hidden md:flex items-center gap-10 uppercase tracking-[4px] text-sm text-white/80">
            <a href="#" className="hover:text-yellow-400 transition-all">Accueil</a>
            <button
  onClick={() =>
    document
      .getElementById('news-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  className="hover:text-yellow-400 transition-all"
>
  NEWS
</button>
            <a href="#" className="hover:text-yellow-400 transition-all">Hôtel</a>
            <button
  onClick={() =>
    document
      .getElementById('events-section')
      ?.scrollIntoView({ behavior: 'smooth' })
  }
  className="hover:text-yellow-400 transition-all"
>
  EVENEMENTS
</button>
            <button
              onClick={() =>
                document
                  .getElementById('menu-section')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hover:text-yellow-400 transition-all"
            >
              MENU
            </button>
            <a href="#" className="hover:text-yellow-400 transition-all">Contact</a>
          </div>

   

        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32">

          {/* BADGE */}
        

          {/* TITLE */}
          <h1
            style={{ fontFamily: 'Cinzel, serif' }}
            className="mt-10 text-[90px] md:text-[180px] tracking-[-10px] text-white leading-none font-light"
          >
         
          </h1>

          {/* SUBTITLE */}
          <div className="mt-10 flex items-center gap-6">

            <div className="w-40 h-px bg-yellow-500/30"></div>

       <img
  src="/logo.png"
  alt="Pacific Club"
  className="h-100 w-auto object-contain -mt-30"
/>

            <div className="w-40 h-px bg-yellow-500/30"></div>

          </div>

          {/* DESCRIPTION */}
          <p className="mt-16 max-w-5xl mx-auto text-white/55 text-2xl leading-[60px] font-light">
          </p>

          {/* BUTTON */}
<button
  onClick={() => setReservationOpen(true)}
  className="mt-20 border border-yellow-500/30 px-14 py-6 rounded-full text-yellow-300 tracking-[5px] uppercase text-sm bg-black/40 backdrop-blur-xl hover:bg-yellow-500/10 transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.12)]"
>
  Réserver
</button>

          {/* SCROLL */}
          <div className="mt-24 flex flex-col items-center text-yellow-400/70">
            <div className="w-px h-16 bg-yellow-500/40"></div>

            <p className="mt-5 tracking-[6px] uppercase text-xs">
              Scroll
            </p>
          </div>

          {/* FEATURES */}
          <div className="mt-24 w-full border-t border-yellow-500/10 grid grid-cols-1 md:grid-cols-4">

            <div className="py-12 border-r border-yellow-500/10 text-center">
              <h3 className="text-yellow-400 text-4xl">✦</h3>
              <p className="mt-5 text-white tracking-[5px] uppercase">Luxe</p>
              <p className="mt-3 text-white/50">Un service exceptionnel</p>
            </div>

            <div className="py-12 border-r border-yellow-500/10 text-center">
              <h3 className="text-yellow-400 text-4xl">♛</h3>
              <p className="mt-5 text-white tracking-[5px] uppercase">Exclusivité</p>
              <p className="mt-3 text-white/50">Accès réservé</p>
            </div>

            <div className="py-12 border-r border-yellow-500/10 text-center">
              <h3 className="text-yellow-400 text-4xl">✧</h3>
              <p className="mt-5 text-white tracking-[5px] uppercase">Expérience</p>
              <p className="mt-3 text-white/50">Des moments uniques</p>
            </div>

            <div className="py-12 text-center">
              <h3 className="text-yellow-400 text-4xl">◈</h3>
              <p className="mt-5 text-white tracking-[5px] uppercase">Élégance</p>
              <p className="mt-3 text-white/50">Dans chaque détail</p>
            </div>

          </div>

        </div>

      </section>

{/* NEWS */}
     <section id="news-section" className="py-28 px-6 border-t border-yellow-700/20 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-5 mb-16">
            <div>
              <p className="text-yellow-500 uppercase tracking-[5px]">
                News & Events
              </p>

              <h2 className="text-5xl md:text-6xl text-white mt-4">
                Actualités du Club
              </h2>
            </div>

            <div className="flex gap-4 items-center">
              

              <div className="relative group">
  <button
    className="border border-yellow-500/20 bg-black/40 backdrop-blur-md text-yellow-400 px-7 py-4 rounded-2xl hover:border-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.06)] uppercase tracking-[5px] text-sm font-light"
  >
    ⚜ Panel Admin
  </button>

  <div className="absolute right-0 mt-4 w-80 bg-black/95 border border-yellow-500/20 rounded-[30px] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-[0_0_35px_rgba(255,215,0,0.08)] z-50 backdrop-blur-xl">

    <div className="px-6 py-5 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent">
      <p className="text-yellow-400 uppercase tracking-[5px] text-xs">
        Pacific Administration
      </p>

      <h3 className="text-white text-2xl mt-3 font-light">
        Dashboard
      </h3>
    </div>

    <div className="p-4 space-y-3">

      <button
        onClick={() => {
          setAdminAction('add')
          setAdminLoginOpen(true)
        }}
        className="w-full rounded-2xl border border-yellow-500/10 bg-zinc-900/80 px-5 py-5 text-left hover:border-yellow-400 hover:bg-yellow-500/10 transition-all"
      >
        <p className="text-yellow-400 uppercase tracking-[4px] text-xs">
          Publication
        </p>

        <h4 className="text-white text-lg mt-2">
          ➕ Ajouter un post
        </h4>

        <p className="text-white/40 text-sm mt-2">
          Créer une annonce, vidéo ou événement.
        </p>
      </button>

      <button
        onClick={() => {
          setAdminAction('delete')
          setAdminLoginOpen(true)
        }}
        className="w-full rounded-2xl border border-red-500/10 bg-zinc-900/80 px-5 py-5 text-left hover:border-red-400 hover:bg-red-500/10 transition-all"
      >
        <p className="text-red-400 uppercase tracking-[4px] text-xs">
          Moderation
        </p>

        <h4 className="text-white text-lg mt-2">
          🗑 Supprimer un post
        </h4>

        <p className="text-white/40 text-sm mt-2">
          Retirer une publication du site.
        </p>
      </button>

      <div className="rounded-2xl border border-yellow-500/10 bg-zinc-900/80 px-5 py-5">
        <p className="text-yellow-400 uppercase tracking-[4px] text-xs">
          Statistiques
        </p>

        <h4 className="text-white text-lg mt-2">
          📊 Activité du site
        </h4>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-black/50 rounded-xl p-4 border border-yellow-500/10 text-center">
            <p className="text-yellow-400 text-2xl font-bold">
              {posts.length}
            </p>

            <p className="text-white/40 text-xs mt-2 uppercase tracking-[3px]">
              Posts
            </p>
          </div>

          <div className="bg-black/50 rounded-xl p-4 border border-green-500/10 text-center">
            <p className="text-green-400 text-2xl font-bold">
              ON
            </p>

            <p className="text-white/40 text-xs mt-2 uppercase tracking-[3px]">
              Système
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-yellow-500/10 bg-zinc-900/80 px-5 py-5">
        <p className="text-yellow-400 uppercase tracking-[4px] text-xs">
          Logs
        </p>

        <div className="mt-4 space-y-3 text-sm text-white/50">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span>Dernier démarrage</span>
            <span className="text-green-400">✔ OK</span>
          </div>

          <div className="flex justify-between border-b border-white/5 pb-2">
            <span>Webhook Discord</span>
            <span className="text-green-400">✔ Connecté</span>
          </div>

          <div className="flex justify-between">
            <span>Base locale</span>
            <span className="text-yellow-400">Actif</span>
          </div>
        </div>
      </div>
    </div>
  </div>



            </div>
          </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <div
                key={index}
                className="relative bg-black border border-yellow-700/20 rounded-[35px] overflow-hidden hover:border-yellow-500 transition-all"
              >
                {post.video ? (
                  <iframe
                    className="w-full h-72"
                    src={post.video.replace('watch?v=', 'embed/')}
                    title={post.title}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={post.image}
                    className="w-full h-auto object-contain"
                  />
                )}

                <div className="p-8">
                  <p className="text-yellow-500 uppercase tracking-[4px] text-sm">
                    {post.category}
                  </p>

                  <h3 className="text-3xl text-yellow-400 mt-5">
                    {post.title}
                  </h3>

                  <p className="text-white/60 mt-5 leading-relaxed">
                    {post.content}
                  </p>
<button
  onClick={() => deletePost(post.id)}
  className="mt-6 border border-red-500/30 px-5 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
>
  Supprimer
</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL RÉSERVATION */}
      {reservationOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-yellow-500/30 rounded-[35px] max-w-xl w-full p-10 relative shadow-2xl">
            <button
              onClick={() => setReservationOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            <p className="text-yellow-500 uppercase tracking-[5px]">
              Pacific Reservation
            </p>

            <h2 className="text-5xl text-white mt-6">
              Réserver une table
            </h2>

            <div className="mt-10 space-y-6">
              <input
                type="text"
                placeholder="Nom et prénom"
                value={reservationData.fullname}
                onChange={(e) =>
                  setReservationData({
                    ...reservationData,
                    fullname: e.target.value,
                  })
                }
                className="w-full bg-black border border-yellow-700/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-500"
              />

              <input
                type="date"
                value={reservationData.date}
                onChange={(e) =>
                  setReservationData({
                    ...reservationData,
                    date: e.target.value,
                  })
                }
                className="w-full bg-black border border-yellow-700/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-500"
              />

              <input
                type="time"
                value={reservationData.hour}
                onChange={(e) =>
                  setReservationData({
                    ...reservationData,
                    hour: e.target.value,
                  })
                }
                className="w-full bg-black border border-yellow-700/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-500"
              />

              <input
                type="number"
                placeholder="Nombre de personnes"
                value={reservationData.people}
                onChange={(e) =>
                  setReservationData({
                    ...reservationData,
                    people: e.target.value,
                  })
                }
                className="w-full bg-black border border-yellow-700/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-500"
              />

              <textarea
                placeholder="Commentaire / demande spéciale"
                value={reservationData.comment}
                onChange={(e) =>
                  setReservationData({
                    ...reservationData,
                    comment: e.target.value,
                  })
                }
                className="w-full bg-black border border-yellow-700/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-500 min-h-[120px] resize-none"
              />

              <button
                onClick={reserveClub}
                className="w-full bg-yellow-500 text-black py-5 rounded-2xl text-lg font-bold hover:bg-yellow-400 hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(255,215,0,0.4)]"
              >
                Confirmer la réservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN MODAL */}
      {adminLoginOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-yellow-500/20 rounded-[35px] w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.08)]">

            <div className="p-8 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent">
              <p className="text-yellow-400 uppercase tracking-[5px] text-xs">
                Pacific Security
              </p>

              <h3 className="text-white text-4xl mt-4 font-extralight">
                Authentification
              </h3>
            </div>

            <div className="p-8">
              <p className="text-white/50 leading-relaxed">
                Entrez le mot de passe administrateur.
              </p>

              <input
                type="password"
                placeholder="Mot de passe admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full mt-8 bg-black border border-yellow-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400"
              />

              {accessDenied && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400 text-sm">
                  Accès refusé • Mot de passe incorrect
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                        setAdminAction('event')
                        setAdminLoginOpen(true)
                      }}
                  className="flex-1 bg-purple-500/90 text-white py-4 rounded-2xl hover:bg-purple-400 transition-all"
                >
                  Event
                </button>

                <button
                  onClick={() => {
                    setAdminLoginOpen(false)
                    setAdminPassword('')
                    setAccessDenied(false)
                  }}
                  className="flex-1 bg-zinc-900 border border-white/10 text-white py-4 rounded-2xl hover:bg-zinc-800 transition-all"
                >
                  Annuler
                </button>

                <button
                  onClick={() => {
                    if (adminPassword !== 'Silence') {
                      setAccessDenied(true)
                      return
                    }

                    setAdminLoginOpen(false)
                    setAdminPassword('')
                    setAccessDenied(false)

                    if (adminAction === 'add') {
                      setAddModalOpen(true)
                    }

                    if (adminAction === 'event') {
      setEventModalOpen(true)
    }

    if (adminAction === 'delete') {
                      setDeleteModalOpen(true)
                    }
                  }}
                  className="flex-1 bg-yellow-500 text-black py-4 rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_0_25px_rgba(255,215,0,0.25)] font-medium"
                >
                  Connexion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD POST MODAL */}
{addModalOpen && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
    <div className="bg-zinc-950 border border-yellow-500/20 rounded-[35px] w-full max-w-2xl overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.08)]">

      <div className="p-8 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent">
        <p className="text-yellow-400 uppercase tracking-[5px] text-xs">
          Publication
        </p>

        <h3 className="text-white text-4xl mt-4 font-extralight">
          Ajouter un post
        </h3>
      </div>

      <div className="p-8 space-y-6">

        <input
          type="text"
          placeholder="Titre du post"
          value={newPost.title}
          onChange={(e) =>
            setNewPost({ ...newPost, title: e.target.value })
          }
          className="w-full bg-black border border-yellow-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400"
        />

        <textarea
          placeholder="Description du post"
          value={newPost.description}
          onChange={(e) =>
            setNewPost({
              ...newPost,
              description: e.target.value,
            })
          }
          className="w-full bg-black border border-yellow-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400 min-h-[140px] resize-none"
        />

        <input
          type="text"
          placeholder="Lien image"
          value={newPost.image}
          onChange={(e) =>
            setNewPost({ ...newPost, image: e.target.value })
          }
          className="w-full bg-black border border-yellow-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400"
        />

        <input
          type="text"
          placeholder="Lien vidéo YouTube (optionnel)"
          value={newPost.video}
          onChange={(e) =>
            setNewPost({ ...newPost, video: e.target.value })
          }
          className="w-full bg-black border border-yellow-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-yellow-400"
        />

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => setAddModalOpen(false)}
            className="flex-1 bg-zinc-900 border border-white/10 text-white py-4 rounded-2xl hover:bg-zinc-800 transition-all"
          >
            Annuler
          </button>

          <button
            onClick={addPost}
            className="flex-1 bg-yellow-500 text-black py-4 rounded-2xl hover:bg-yellow-400 transition-all shadow-[0_0_25px_rgba(255,215,0,0.25)] font-medium"
          >
            Publier le post
          </button>
        </div>

        <div className="mt-10 border-t border-yellow-500/10 pt-10">

          <h3 className="text-yellow-400 text-2xl mb-6">
            Ajouter image MENU
          </h3>

          <input
            type="text"
            placeholder="URL image menu"
            value={newMenuImage}
            onChange={(e) => setNewMenuImage(e.target.value)}
            className="w-full bg-black border border-yellow-500/20 rounded-2xl px-5 py-4 text-white"
          />

          <button
            onClick={addMenuImage}
            className="mt-5 border border-yellow-500/30 px-6 py-3 rounded-2xl text-yellow-400 hover:bg-yellow-500/10 transition-all"
          >
            Ajouter MENU
          </button>

        </div>

        <div className="mt-10 border-t border-yellow-500/10 pt-10">

          <h3 className="text-yellow-400 text-2xl mb-6">
            Ajouter image EVENEMENT
          </h3>

          <input
            type="text"
            placeholder="URL image événement"
            value={newEventImage}
            onChange={(e) => setNewEventImage(e.target.value)}
            className="w-full bg-black border border-yellow-500/20 rounded-2xl px-5 py-4 text-white"
          />

          <button
            onClick={addEventImage}
            className="mt-5 border border-yellow-500/30 px-6 py-3 rounded-2xl text-yellow-400 hover:bg-yellow-500/10 transition-all"
          >
            Ajouter EVENEMENT
          </button>

        </div>

      </div>
    </div>
  </div>
)}

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-red-500/20 rounded-[35px] w-full max-w-lg overflow-hidden shadow-[0_0_40px_rgba(255,0,0,0.08)]">

            <div className="p-8 border-b border-red-500/10 bg-gradient-to-r from-red-500/5 to-transparent">
              <p className="text-red-400 uppercase tracking-[5px] text-xs">
                Moderation
              </p>

              <h3 className="text-white text-4xl mt-4 font-extralight">
                Supprimer un post
              </h3>
            </div>

            <div className="p-8">
              <p className="text-white/50 leading-relaxed">
                Choisissez le numéro du post à supprimer.
              </p>

              <input
                type="number"
                placeholder={`1 à ${posts.length}`}
                value={deletePostId}
                onChange={(e) => setDeletePostId(e.target.value)}
                className="w-full mt-8 bg-black border border-red-500/20 rounded-2xl px-6 py-5 text-white outline-none focus:border-red-400"
              />

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 bg-zinc-900 border border-white/10 text-white py-4 rounded-2xl hover:bg-zinc-800 transition-all"
                >
                  Annuler
                </button>

                <button
                  onClick={() => {
                    if (!deletePostId) return

                    deletePost(Number(deletePostId) - 1)
                    setDeleteModalOpen(false)
                    setDeletePostId('')
                  }}
                  className="flex-1 bg-red-500/90 text-white py-4 rounded-2xl hover:bg-red-400 transition-all shadow-[0_0_25px_rgba(255,0,0,0.2)]"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                        setAdminAction('event')
                        setAdminLoginOpen(true)
                      }}
                  className="flex-1 bg-purple-500/90 text-white py-4 rounded-2xl hover:bg-purple-400 transition-all shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                >
                  Créer un événement
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {eventModalOpen && <EventModal />}

{/* MENU SECTION */}
  {selectedMenuImage && (
  <div
    onClick={() => setSelectedMenuImage(null)}
    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-10"
  >
    <img
      src={selectedMenuImage}
      className="max-w-full max-h-full rounded-[30px]"
    />
  </div>
)}    
       
{/* EVENTS SECTION */}
<section
  id="events-section"
  className="py-32 px-6 bg-zinc-950 border-t border-yellow-500/10"
>
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-20">

      <p className="text-yellow-400 uppercase tracking-[6px] text-sm">
        Pacific Club
      </p>

      <h2
        style={{ fontFamily: 'Cinzel, serif' }}
        className="mt-6 text-6xl text-white font-light"
      >
        ÉVÉNEMENTS
      </h2>

      <div className="w-32 h-px bg-yellow-500/30 mx-auto mt-8"></div>

    </div>

    <div className="flex justify-center gap-10 flex-wrap">

      {eventsImages.map((item) => (
        <div key={item.id} className="relative">

          <img
            src={item.image}
            onClick={() =>
              setSelectedMenuImage(item.image)
            }
            className="rounded-[30px] border border-yellow-500/10 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          />

          <button
            onClick={() => deleteEventImage(item.id)}
            className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            X
          </button>

        </div>
      ))}

    </div>

  </div>
</section>


{/* FOOTER */}

    <footer className="py-16 flex justify-center bg-black border-t border-yellow-700/20">

  <img
    src="/logo.png"
    alt="Pacific Club"
    className="h-48 w-auto object-contain opacity-90"
  />

</footer>

</div>
)
}

import { useEffect, useState } from 'react'
import fond from './assets/fond.jpg'
import hero from './assets/hero.png'
import event1 from './assets/event1.jpg'
import EventModal from './components/EventModal'
import {
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore'

import { db } from './firebase'

export default function App() {

  const EVENT_WEBHOOK = 'https://discord.com/api/webhooks/1501915058815504485/7k7562xwZUBJNXAXlvKLD1iXlpNgyXiMXrvg5Z7K67MwfJoJ2e8D0hbScpW9eQBuZ-hS'
  // =========================
  // POSTS STOCKÉS EN LOCAL
  // =========================
 const [posts, setPosts] = useState([])
  // =========================
  // STATES
  // =========================
  const [loaded, setLoaded] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePostId, setDeletePostId] = useState('')
  const [selectedMenuImage, setSelectedMenuImage] = useState(null)
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
 

const [menuImages, setMenuImages] = useState([])
const [eventImages, setEventImages] = useState([])
const [eventPosterOpen, setEventPosterOpen] = useState(false)

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


  const loadPosts = async () => {

    try {

      const querySnapshot = await getDocs(
        collection(db, 'posts')
      )

      const firebasePosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPosts(firebasePosts)

      console.log(firebasePosts)

       } catch (error) {

      console.error(error)

    }
  }

  loadPosts()

}, [])
  useEffect(() => {

  const loadMenuImages = async () => {

    try {

      const querySnapshot = await getDocs(
        collection(db, 'menuImages')
      )

      const images = querySnapshot.docs.map(
        (doc) => doc.data().image
      )

      setMenuImages(images)

      console.log('MENU LOADED')

    } catch (error) {

      console.error(error)

    }
  }

  loadMenuImages()

}, [])

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

useEffect(() => {

  const loadPosts = async () => {

    try {

      const snapshot = await getDocs(collection(db, 'posts'))

      const firebasePosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setPosts(firebasePosts)

    } catch (error) {

      console.error(error)

    }
  }

  loadPosts()

}, [])
  // =========================
  // AJOUTER UN POST
  // =========================
 const addPost = async () => {

 if (posts.filter((p) => p.category === 'NEWS').length >= 6) {
  alert('Maximum 6 posts')
  return
}

  const { title, description, image, video } = newPost

  if (!title || !description) {
    alert('Veuillez remplir les champs requis')
    return
  }

  try {

    await addDoc(collection(db, 'posts'), {
      title,
      description,
      image,
      video,
      category: 'NEWS',
      createdAt: Date.now(),
    })

    setPosts((prev) => [
      {
        title,
        description,
        image,
        video,
        category: 'NEWS',
      },
      ...prev,
    ])

    setNewPost({
      title: '',
      description: '',
      image: '',
      video: '',
    })

    setAddModalOpen(false)

    console.log('POST SAVED')

  } catch (error) {

    console.error(error)
    alert('Erreur Firebase')

  }
}

// =========================
// SUPPRIMER UN POST
// =========================
const deletePost = (indexToDelete) => {
  const updatedPosts = posts.filter(
    (_, index) => index !== indexToDelete
  )

  setPosts(updatedPosts)
}

// =========================
// SUPPRIMER IMAGE MENU
// =========================
const deleteMenuImage = (indexToDelete) => {
  setMenuImages((prev) =>
    prev.filter((_, index) => index !== indexToDelete)
  )
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
    
await addDoc(collection(db, 'posts'), {
  title,
  description,
  image,
  category: 'event',
  video: '',
  createdAt: Date.now(),
})
    setPosts([
      {
        title,
        description,
        image,
        category: 'event',
        video: '',
      },
      ...posts,
    ])

    try {
      const response = await fetch(EVENT_WEBHOOK, {
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
const postEventPoster = async () => {

  const { title, description, image } = eventData

  if (!title || !description || !image) {
    alert('Champs manquants')
    return
  }

  try {

    await addDoc(collection(db, 'posts'), {
      title,
      description,
      image,
      category: 'event',
      video: '',
      createdAt: Date.now(),
    })

    setPosts((prev) => [
      {
        title,
        description,
        image,
        category: 'event',
        video: '',
      },
      ...prev,
    ])

    setEventPosterOpen(false)

    alert('Affiche publiée')

  } catch (error) {

    console.error(error)

  }
}
  const reserveClub = async () => {
    const { fullname, date, hour, people, comment } = reservationData

    if (!fullname || !date || !hour || !people) {
      alert('Veuillez remplir tous les champs')
      return
    }

   try {
  const response = await fetch(EVENT_WEBHOOK, {
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
  })

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
const addMenuImage = async () => {

  const imageUrl = prompt('Lien image')

  if (!imageUrl) return

  try {

    await addDoc(collection(db, 'menuImages'), {
      image: imageUrl,
    })

    setMenuImages((prev) => [
      ...prev,
      imageUrl,
    ])

    console.log('IMAGE SAVED')

  } catch (error) {

    console.error(error)

  }
}
// =========================
// INTRO
// =========================


if (!loaded) {
  return (
    
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.12),transparent_60%)] animate-pulse"></div>

      <div className="flex flex-col items-center justify-center">
        <img
          src="/logo2.png"
          alt="Pacific Club"
          className="w-[520px] max-w-[90%] drop-shadow-[0_0_40px_rgba(255,215,0,0.5)] animate-pulse"
        />

        <button
          onClick={() => setReservationOpen(true)}
          className="mt-16 px-14 py-4 border border-yellow-500/40 text-yellow-400 uppercase tracking-[6px] text-lg rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(255,215,0,0.25)]"
        >
          Réserver
        </button>
      </div>
    </div>
  )
}

return (
    <div className="bg-black text-white min-h-screen w-screen overflow-x-hidden font-serif">
        
      
      <section id="hero" className="relative w-screen min-h-screen overflow-hidden bg-black flex items-center justify-center">

  {/* BACKGROUND */}
  <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover opacity-40"
>
  <source src="/hero.mp4" type="video/mp4" />
</video>
    
  
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/70"></div>

  {/* MENU TOP */}
  <div className="absolute top-10 left-0 w-full flex justify-center gap-16 uppercase tracking-[6px] text-sm text-white z-50 px-10">
    <a href="#hero">Accueil</a>
    <a href="#news">News</a>
    <a href="#">Hotel</a>
    <a href="#events">Événements</a>
    <a href="#menu">Menu</a>
    <a href="#">Contact</a>
  </div>

  {/* HERO CONTENT */}

  <div className="relative z-20 flex flex-col items-center justify-center text-center px-6">

    <img
      src="/logo2.png"
      alt="Pacific Club"
      className="w-[550px] max-w-[65%] object-contain drop-shadow-[0_0_35px_rgba(255,215,0,0.45)]"
    />

    <button
      onClick={() => setReservationOpen(true)}
      className="mt-16 border border-yellow-500/30 px-14 py-5 rounded-full uppercase tracking-[6px] text-white hover:bg-yellow-500 hover:text-black transition-all duration-300"
    >
      Réserver
    </button>
  </div>

</section>

{/* NEWS */}
<section id="news" className="py-28 px-6 border-t border-yellow-700/20 bg-zinc-950">
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
    </div>

    <div className="grid lg:grid-cols-3 gap-10">
      {posts
  .filter((post) => post.category === 'NEWS')
  .map((post, index) => (
        <div
          key={index}
          className="relative bg-black border border-yellow-700/20 rounded-[35px] overflow-hidden"
        >
          {post.video ? (
            <iframe
              className="w-full h-72"
              src={post.video.replace('watch?v=', 'embed/')}
              title={post.title}
              allowFullScreen
            />
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
              {post.description}
            </p>
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
                    if (adminPassword !== 'pacificvip') {
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

      {eventModalOpen && (
  <EventModal
    createEvent={createEvent}
    eventData={eventData}
    setEventData={setEventData}
    setEventModalOpen={setEventModalOpen}
  />
)}

     {/* MENU SECTION */}
<section
  id="menu"
  className="w-full py-32 px-12 bg-black border-t border-yellow-500/10"
>

  <div className="w-full">

    <div className="text-center mb-20">

      <p className="text-yellow-400 uppercase tracking-[6px] text-sm">
        Pacific Club
      </p>

      <h2
        style={{ fontFamily: 'Cinzel, serif' }}
        className="mt-6 text-6xl text-white font-light"
      >
        MENU
      </h2>

      <div className="w-32 h-px bg-yellow-500/30  mt-8"></div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full">

{menuImages.map((image, index) => (
  <div key={index} className="relative group">

    <img
      src={image}
      onClick={() => setSelectedMenuImage(image)}
      className="rounded-[30px] border border-yellow-500/10 cursor-pointer hover:scale-[1.02] transition-all duration-300"
    />


  </div>
  
))}
{selectedMenuImage && (

  <div
    onClick={() => setSelectedMenuImage(null)}
    className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-10"
  >

    <img
      src={selectedMenuImage}
      className="max-w-full max-h-full rounded-[30px] shadow-2xl"
    />

  </div>

)}
    </div>

  </div>

</section>

{/* EVENTS */}
<section id="events" className="w-full py-28 px-6 bg-black border-t border-yellow-700/20">

  <div className="max-w-7xl mx-auto">

    <div className="mb-16 text-center">

      <p className="text-yellow-500 uppercase tracking-[5px]">
        Pacific Club
      </p>

      <h2 className="text-5xl md:text-6xl text-white mt-4">
        Événements
      </h2>

    </div>

    <div className="flex justify-center">

      {posts
  .filter((post) => 
    post.category === 'event' ||
    post.category === 'EVENT'
  )
  .map((post, index) => (

          <div
            key={index}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/20 rounded-[35px] overflow-hidden"
          >

            {post.image && (
              <img
                src={post.image}
                className="w-full h-auto object-cover"
              />
            )}

            <div className="p-8">

              <p className="text-white uppercase tracking-[4px] text-sm">
                EVENT
              </p>

              <h3 className="text-3xl text-yellow-400 mt-5">
                {post.title}
              </h3>

              <p className="text-white/60 mt-5 leading-relaxed">
                {post.description}
              </p>

            </div>

          </div>

      ))}

    </div>

  </div>

</section>
<div className="w-full flex justify-center mt-20 mb-10">

  <div className="relative group">

    <button
      className="border border-yellow-500/20 bg-black/40 backdrop-blur-md text-yellow-400 px-7 py-4 rounded-2xl hover:border-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 uppercase tracking-[5px] text-sm"
    >
      ⚜ Panel Admin
    </button>

    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[420px] bg-black/95 border border-yellow-500/20 rounded-[35px] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">

      <div className="p-5 space-y-4">

        <button
          onClick={() => {
            const password = prompt('Mot de passe admin')

            if (password !== 'LH') {
              alert('Accès refusé')
              return
            }

            setAddModalOpen(true)
          }}
          className="w-full rounded-3xl border border-yellow-500/10 bg-zinc-900/80 px-6 py-6 text-left hover:border-yellow-400 hover:bg-yellow-500/10 transition-all"
        >
          ➕ Ajouter un post
        </button>

        <button
          onClick={() => {
            const password = prompt('Mot de passe admin')

            if (password !== 'LH') {
              alert('Accès refusé')
              return
            }

            setEventModalOpen(true)
          }}
          className="w-full rounded-3xl border border-purple-500/10 bg-zinc-900/80 px-6 py-6 text-left hover:border-purple-400 hover:bg-purple-500/10 transition-all"
        >
          🎉 Créer un événement
        </button>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="w-full rounded-3xl border border-red-500/10 bg-zinc-900/80 px-6 py-6 text-left hover:border-red-400 hover:bg-red-500/10 transition-all"
        >
          🗑 Supprimer un post
        </button>

        <button
          onClick={addMenuImage}
          className="w-full rounded-3xl border border-yellow-500/10 bg-zinc-900/80 px-6 py-6 text-left hover:border-yellow-400 hover:bg-yellow-500/10 transition-all"
        >
          🍸 Ajouter image menu
        </button>
        <button
          onClick={() => setEventPosterOpen(true)}
          className="w-full rounded-3xl border border-pink-500/10 bg-zinc-900/80 px-6 py-6 text-left hover:border-pink-400 hover:bg-pink-500/10 transition-all"
           >
          🖼 Poster une affiche événement
        </button>
      </div>

    </div>

  </div>

</div>
{/* EVENTS */}

       {/* FOOTER */}
<footer className="py-16 text-center bg-black border-t border-yellow-700/20">

  <img
    src="/logo2.png"
    alt="Pacific Club"
    className="w-[340px] mx-auto object-contain opacity-90"
  />
{eventPosterOpen && (

  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">

    <div className="bg-zinc-950 border border-pink-500/20 rounded-[35px] p-10 w-full max-w-2xl">

      <h2 className="text-4xl text-white mb-10">
        Poster une affiche
      </h2>

      <div className="space-y-5">

        <input
          type="text"
          placeholder="Titre"
          value={eventData.title}
          onChange={(e) =>
            setEventData({
              ...eventData,
              title: e.target.value,
            })
          }
          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white"
        />

        <textarea
          placeholder="Description"
          value={eventData.description}
          onChange={(e) =>
            setEventData({
              ...eventData,
              description: e.target.value,
            })
          }
          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white h-40"
        />

        <input
          type="text"
          placeholder="Lien image"
          value={eventData.image}
          onChange={(e) =>
            setEventData({
              ...eventData,
              image: e.target.value,
            })
          }
          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white"
        />

        <button
          onClick={postEventPoster}
          className="w-full py-5 rounded-2xl bg-pink-500 text-white"
        >
          Publier l'affiche
        </button>

      </div>

    </div>

  </div>

)}
</footer>
</div>

)

}
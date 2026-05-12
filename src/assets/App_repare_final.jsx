import { useEffect, useState } from 'react'
import fond from './assets/fond.jpg'
import hero from './assets/hero.png'

export default function App() {
  // =========================
  // POSTS STOCKÉS EN LOCAL
  // =========================
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('pacific-posts')

    return savedPosts
      ? JSON.parse(savedPosts)
      : [
          {
            title: 'Black Diamond Night',
            description:
              'DJ internationaux, ambiance premium et accès VIP.',
            image:
              'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop',
            category: 'EVENT',
            video: '',
          },
        ]
  })

  // =========================
  // STATES
  // =========================
  const [loaded, setLoaded] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePostId, setDeletePostId] = useState('')

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

  // =========================
  // MUSIC PLAYER
  // =========================
  const [muted, setMuted] = useState(false)

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: '',
    video: '',
  })

  // =========================
  // FORMULAIRE RÉSERVATION
  // =========================
  const [reservationData, setReservationData] = useState({
    fullname: '',
    date: '',
    hour: '',
    people: '',
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

   return () => clearTimeout(timer)
  }, [])

  // =========================
  // AJOUTER UN POST
  // =========================
  const addPost = () => {
    if (posts.length >= 6) {
      alert('Maximum 6 posts')
      return
    }

    const { title, description, image, video } = newPost

    if (!title || !description) {
      alert('Veuillez remplir les champs requis')
      return
    }

    setPosts([
      {
        title,
        description,
        image,
        video,
        category: 'NEWS',
      },
      ...posts,
    ])

    setNewPost({
      title: '',
      description: '',
      image: '',
      video: '',
    })

    setAddModalOpen(false)
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
  // WEBHOOK DISCORD
  // =========================
  const reserveClub = async () => {
    const { fullname, date, hour, people } = reservationData

    if (!fullname || !date || !hour || !people) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
      await fetch(
        'https://discord.com/api/webhooks/1501690357279358976/oH-jgdlHM_IQuO_JEzfFpqFMaotIj2f5wJrIVsYDTQFh1vgcdMiDjgJwfvQVIX21wHs2',
        {
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

  return (
    <>
      {/* BACKGROUND MUSIC */}
      <audio
        autoPlay
        loop
        muted={muted}
        src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b7d2d1f.mp3?filename=luxury-lounge-124340.mp3"
      />

      {/* MUTE BUTTON */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed top-6 right-6 z-[9999] bg-black/70 backdrop-blur-md border border-yellow-500/20 hover:border-yellow-400 text-yellow-400 px-5 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.08)]"
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="bg-black text-white min-h-screen overflow-x-hidden font-serif">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

  {/* IMAGE FOND */}
  <img
    src={hero || fond}
    className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
  />

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* GLOW */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_60%)]"></div>

  {/* CONTENU */}
  <div className="relative z-10 text-center px-6 max-w-5xl">

    {/* BADGE */}
    <div className="mb-10">
      <span className="border border-yellow-500/40 text-yellow-400 px-7 py-3 rounded-full uppercase tracking-[7px] text-xs bg-black/30 backdrop-blur-md font-light">
        Pacific Club
      </span>
    </div>

    {/* TITRE */}
    <h1 className="text-7xl md:text-[10rem] font-extralight tracking-[24px] uppercase text-white leading-none">
      PACIFIC
    </h1>

    {/* SOUS TITRE */}
    <h2 className="mt-10 text-yellow-400 uppercase tracking-[14px] text-lg md:text-2xl font-extralight">
      Club • Hôtel • Nightlife
    </h2>

    {/* DESCRIPTION */}
    <p className="max-w-3xl mx-auto mt-14 text-white/65 text-lg md:text-2xl leading-[2] font-extralight">
      Le symbole du luxe nocturne à Los Santos.
      Suites privées, événements exclusifs et expérience immersive haut de gamme.
    </p>

    {/* BOUTON */}
    <div className="flex justify-center mt-20">
      <button
        onClick={() => setReservationOpen(true)}
        className="bg-yellow-500/95 text-black px-10 py-5 rounded-2xl text-lg font-medium tracking-[2px] uppercase hover:scale-105 hover:bg-yellow-400 transition-all duration-300 shadow-[0_0_35px_rgba(255,215,0,0.35)]"
      >
        Réserver maintenant
      </button>
    </div>

  </div>
</section>

      {/* STATS */}
      <section className="py-10 border-t border-yellow-700/20 bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-6">
          {[
            ['25K+', 'Clients VIP'],
            ['24/7', 'Nightclub'],
            ['120+', 'Événements'],
            ['5★', 'Expérience'],
          ].map((item, index) => (
            <div
              key={index}
              className="bg-zinc-950 border border-yellow-700/20 rounded-3xl p-8 text-center"
            >
              <h3 className="text-4xl text-yellow-400 font-black">
                {item[0]}
              </h3>

              <p className="text-white/50 mt-3 tracking-[3px] uppercase text-sm">
                {item[1]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section className="py-28 px-6 bg-zinc-950 border-t border-yellow-700/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-yellow-500 uppercase tracking-[5px]">
              Signature Menu
            </p>

            <h2 className="text-5xl md:text-6xl text-white mt-4">
              Cocktails & Champagne
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              [
                'Black Gold',
                '$18K',
                'Cocktail signature premium',
                'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1974&auto=format&fit=crop',
              ],
              [
                'Diamond VIP',
                '$30K',
                'Champagne et service privé',
                'https://images.unsplash.com/photo-1563223771-375783ee91ad?q=80&w=1974&auto=format&fit=crop',
              ],
              [
                'Pacific Royale',
                '$50K',
                'Expérience luxe complète',
                'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1974&auto=format&fit=crop',
              ],
            ].map((drink, index) => (
              <div
                key={index}
                className="group bg-black rounded-[35px] border border-yellow-700/20 overflow-hidden hover:border-yellow-500 hover:-translate-y-2 transition-all duration-300 shadow-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={drink[3]}
                    className="h-72 w-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                <div className="p-10 text-center flex flex-col h-[420px]">
                  <h3 className="text-4xl text-yellow-400">
                    {drink[0]}
                  </h3>

                  <p className="text-5xl mt-8 font-black text-white">
                    {drink[1]}
                  </p>

                  <p className="text-white/50 mt-6 flex-1">
                    {drink[2]}
                  </p>

                  <button className="mt-auto bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                    Commander
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-28 px-6 border-t border-yellow-700/20 bg-zinc-950">
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
                    className="w-full h-72 object-cover"
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

      {/* ADD POST MODAL */}}
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

      {/* DELETE MODAL */}}
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}}
      <footer className="py-16 text-center bg-black border-t border-yellow-700/20">
        <h2 className="text-5xl text-yellow-400 tracking-[10px]">
          PACIFIC
        </h2>

        <p className="mt-5 text-white/50">
          Los Santos • Luxury • Nightlife
        </p>
      </footer>
    </div>
  )
}





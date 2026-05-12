import { useEffect, useState } from 'react'
import fond from './assets/fond.jpg'
import hero from './assets/hero.png'

export default function App() {
  const [posts, setPosts] = useState([
    {
      title: 'Black Diamond Night',
      description:
        'DJ internationaux, ambiance premium et accès carré VIP toute la nuit.',
      image:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop',
      category: 'EVENT',
      video: '',
    },
  ])

  const [loaded, setLoaded] = useState(false)
  const [vipOpen, setVipOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  const addPost = () => {
    const title = prompt('Titre du post')
    const description = prompt('Description')
    const image = prompt('Lien image (optionnel)')
    const video = prompt('Lien YouTube (optionnel)')

    if (!title || !description) return

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
  }

  const reserveClub = async () => {
  const name = prompt('Votre nom')
  const prenom = prompt('Prenom')
  const details = prompt('Informations réservation')

  if (!name || !discord) return

  await fetch(
    'https://discord.com/api/webhooks/1501690357279358976/oH-jgdlHM_IQuO_JEzfFpqFMaotIj2f5wJrIVsYDTQFh1vgcdMiDjgJwfvQVIX21wHs2',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Pacific Club',
        avatar_url:
          'https://cdn-icons-png.flaticon.com/512/5968/5968756.png',
        embeds: [
          {
            title: 'Nouvelle Réservation VIP',
            color: 15844367,
            fields: [
              {
                name: 'Nom',
                value: name,
                inline: true,
              },
              {
                name: 'Discord',
                value: discord,
                inline: true,
              },
              {
                name: 'Informations',
                value: details || 'Aucune',
              },
            ],
            footer: {
              text: 'Pacific Club • Los Santos',
            },
          },
        ],
      }),
    }
  )

  alert('Réservation envoyée au Pacific Club.')
}
  const openDiscord = () => {
    window.open('https://discord.gg/7BBhM8dKyX', '_blank')
  }

  if (!loaded) {
    return (
      <div className="h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center animate-pulse">
          <h1 className="text-7xl md:text-9xl text-yellow-400 tracking-[15px] font-black">
            PACIFIC
          </h1>

          <p className="text-white/50 tracking-[8px] uppercase mt-6">
            Loading Experience
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-serif scroll-smooth">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={hero || fond}
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
        />

        <div className="absolute inset-0 bg-black/45"></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.08),transparent_60%)]"></div>

        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="mb-8">
            <span className="border border-yellow-500/60 text-yellow-400 px-6 py-2 rounded-full uppercase tracking-[5px] text-sm bg-black/30 backdrop-blur-sm">
              Pacific Club
            </span>
          </div>

         
         
         
          <h2 className="mt-6 text-yellow-400 uppercase tracking-[10px] text-2xl md:text-3xl">
            Club • Hôtel • Nightlife
          </h2>

          <p className="max-w-3xl mx-auto mt-10 text-white/60 text-lg md:text-xl leading-relaxed">
            Une expérience premium au cœur de Los Santos.
            Suites privées, soirées exclusives et ambiance VIP.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-14">
            <button
              onClick={() => setVipOpen(true)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-5 rounded-2xl text-lg hover:bg-white hover:text-black transition-all"
            >
              Accès VIP
            </button>
            <button
              onClick={reserveClub}
              className="bg-yellow-500 text-black px-10 py-5 rounded-2xl text-lg font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            >
              Réserver maintenant
            </button>

            <button
              onClick={openDiscord}
              className="border border-yellow-500 text-yellow-400 px-10 py-5 rounded-2xl text-lg hover:bg-yellow-500 hover:text-black hover:scale-105 transition-all backdrop-blur-sm"
            >
              Rejoindre Discord
            </button>
          </div>
        </div>
      </section>

      {/* STAFF */}
      <section className="py-28 px-6 bg-zinc-950 border-t border-yellow-700/20">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">
            <p className="text-yellow-500 uppercase tracking-[5px]">
              Pacific Staff
            </p>

            <h2 className="text-5xl md:text-6xl text-white mt-4">
              Direction & Sécurité
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              ['👑', 'Direction', 'Gestion privée du Pacific Club.'],
              ['🛡️', 'Sécurité', 'Protection VIP et contrôle privé.'],
              ['🎧', 'Événementiel', 'Organisation des soirées et événements.'],
            ].map((staff, index) => (
              <div
                key={index}
                className="bg-black border border-yellow-700/20 rounded-[35px] p-10 text-center hover:border-yellow-500 transition-all"
              >
                <div className="text-6xl mb-8">{staff[0]}</div>

                <h3 className="text-3xl text-yellow-400">
                  {staff[1]}
                </h3>

                <p className="mt-6 text-white/60 leading-relaxed">
                  {staff[2]}
                </p>
              </div>
            ))}

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

      {/* SERVICES */}
      <section className="py-28 px-6 border-t border-yellow-700/20 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-yellow-500 uppercase tracking-[5px]">
              Pacific Experience
            </p>

            <h2 className="text-5xl md:text-6xl text-white mt-4">
              Luxe & Expérience
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['🏨', 'Hôtel Premium', 'Suites privées et service haut de gamme.'],
              ['🌃', 'Nightclub', 'DJ sets exclusifs et ambiance immersive.'],
              ['🍸', 'Restaurant', 'Cocktails signature et restauration raffinée.'],
            ].map((service, index) => (
              <div
                key={index}
                className="bg-zinc-950 border border-yellow-700/20 rounded-[35px] p-10 hover:border-yellow-500 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-6xl mb-8">{service[0]}</div>

                <h3 className="text-3xl text-yellow-400">
                  {service[1]}
                </h3>

                <p className="mt-6 text-white/60 leading-relaxed">
                  {service[2]}
                </p>
              </div>
            ))}
          </div>
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
              ['Black Gold', '$180$', 'Cocktail signature premium'],
              ['Diamond VIP', '$300$', 'Champagne et service privé'],
              ['Pacific Royale', '$500$', 'Expérience luxe complète'],
            ].map((drink, index) => (
              <div
                key={index}
                className="bg-black rounded-[35px] border border-yellow-700/20 p-10 text-center hover:border-yellow-500 transition-all"
              >
                <h3 className="text-4xl text-yellow-400">
                  {drink[0]}
                </h3>

                <p className="text-5xl mt-8 font-black text-white">
                  {drink[1]}
                </p>

                <p className="text-white/50 mt-6">
                  {drink[2]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP */}
      <section className="py-28 px-6 bg-black border-t border-yellow-700/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-yellow-500 uppercase tracking-[5px]">
              VIP EXPERIENCE
            </p>

            <h2 className="text-5xl md:text-6xl text-white mt-6 leading-tight">
              Une atmosphère
              <span className="text-yellow-400"> exclusive.</span>
            </h2>

            <p className="mt-10 text-white/60 text-lg leading-relaxed">
              Pacific Club transforme chaque soirée en expérience premium.
              Événements privés, sécurité discrète et service VIP.
            </p>

            <div className="flex gap-5 mt-12 flex-wrap">
              <button
                onClick={reserveClub}
                className="bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-all"
              >
                Réserver une table
              </button>

              <button
                onClick={openDiscord}
                className="border border-yellow-500 text-yellow-400 px-8 py-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all"
              >
                Accès Discord
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[40px] border border-yellow-700/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-[700px] object-cover opacity-80"
            />

            <div className="absolute inset-0 bg-black/40"></div>
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

            <button
              onClick={addPost}
              className="border border-yellow-500 text-yellow-400 px-8 py-4 rounded-2xl hover:bg-yellow-500 hover:text-black transition-all"
            >
              Ajouter un post
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-black border border-yellow-700/20 rounded-[35px] overflow-hidden hover:border-yellow-500 transition-all"
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
                    src={
                      post.image ||
                      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop'
                    }
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

      {/* FOOTER */}
      {/* VIP MODAL */}
      {vipOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-950 border border-yellow-500/30 rounded-[35px] max-w-2xl w-full p-10 relative">
            <button
              onClick={() => setVipOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white text-2xl"
            >
              ✕
            </button>

            <p className="text-yellow-500 uppercase tracking-[5px]">
              VIP ACCESS
            </p>

            <h2 className="text-5xl text-white mt-6">
              Pacific Black Card
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="bg-black rounded-3xl border border-yellow-700/20 p-6">
                <h3 className="text-yellow-400 text-2xl">
                  VIP Bronze
                </h3>

                <p className="text-white/60 mt-4 leading-relaxed">
                  Accès prioritaire et réservations privées.
                </p>
              </div>

              <div className="bg-black rounded-3xl border border-yellow-700/20 p-6">
                <h3 className="text-yellow-400 text-2xl">
                  VIP Diamond
                </h3>

                <p className="text-white/60 mt-4 leading-relaxed">
                  Service premium, carré privé et sécurité dédiée.
                </p>
              </div>
            </div>

            <button
              onClick={openDiscord}
              className="mt-10 w-full bg-yellow-500 text-black py-5 rounded-2xl text-lg font-bold hover:bg-yellow-400 transition-all"
            >
              Rejoindre le Discord VIP
            </button>
          </div>
        </div>
      )}

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

import { useState } from 'react'

export default function EventModal() {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    image: '',
    date: '',
    hour: '',
  })

  const createEvent = async () => {
    const { title, description, image, date, hour } = eventData

    if (!title || !description || !image || !date || !hour) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
  const response = await fetch('https://pacificclub.onrender.com/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'Pacific Events',
      embeds: [
        {
          title: 'EVENT • ' + title,
          description,
          color: 15844367,
          image: {
            url: image,
          },
          fields: [
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
          ],
        },
      ],
    }),
  })

  console.log(response)

  if (response.ok) {
    alert('Événement envoyé sur Discord')
  } else {
    alert('Erreur serveur')
  }

} catch (error) {
  console.error(error)
}
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-purple-500/20 rounded-[35px] w-full max-w-2xl p-8 space-y-4">
        <h3 className="text-white text-4xl mb-6">
          Créer un événement
        </h3>

        <input
          type="text"
          placeholder="Titre événement"
          value={eventData.title}
          onChange={(e) =>
            setEventData({
              ...eventData,
              title: e.target.value,
            })
          }
          className="w-full bg-black border border-purple-500/20 rounded-2xl px-6 py-5 text-white"
        />

        <textarea
          placeholder="Description événement"
          value={eventData.description}
          onChange={(e) =>
            setEventData({
              ...eventData,
              description: e.target.value,
            })
          }
          className="w-full bg-black border border-purple-500/20 rounded-2xl px-6 py-5 text-white min-h-[140px]"
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
          className="w-full bg-black border border-purple-500/20 rounded-2xl px-6 py-5 text-white"
        />

        <input
          type="date"
          value={eventData.date}
          onChange={(e) =>
            setEventData({
              ...eventData,
              date: e.target.value,
            })
          }
          className="w-full bg-black border border-purple-500/20 rounded-2xl px-6 py-5 text-white"
        />

        <input
          type="time"
          value={eventData.hour}
          onChange={(e) =>
            setEventData({
              ...eventData,
              hour: e.target.value,
            })
          }
          className="w-full bg-black border border-purple-500/20 rounded-2xl px-6 py-5 text-white"
        />

        <div className="flex gap-4 pt-4">
        <button
  onClick={() => window.location.reload()}
  className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl"
>
  Annuler
</button>

          <button
            onClick={createEvent}
            className="flex-1 bg-purple-500 text-white py-4 rounded-2xl"
          >
            Publier
          </button>
        </div>
      </div>
    </div>
  )
}

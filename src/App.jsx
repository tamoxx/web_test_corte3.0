import { useMemo, useState } from 'react'
import afterBeforeImage from './assets/antes-e-depois-corte.jpg'
import barberOneImage from './assets/barbeiro-retrato-1.jpg'
import barberTwoImage from './assets/barbeiro-retrato-2.jpg'
import barberThreeImage from './assets/barbeiro-retrato-3.jpg'
import barberFourImage from './assets/barbeiro-retrato-4.jpg'
import heroImage from './assets/black-barber-hero.jpg'
import lowFadeImage from './assets/corte-low-fade.jpg'
import teamImage from './assets/equipe-black-barber.jpg'
import frontImage from './assets/barbearia-frente.jpg'
import './App.css'

const cuts = [
  { id: 1, name: 'Mid Fade', price: 'R$ 55', accent: '#d9a64e', image: lowFadeImage },
  { id: 2, name: 'Low Fade + Barba', price: 'R$ 65', accent: '#e3b863', image: afterBeforeImage },
  { id: 3, name: 'High Fade', price: 'R$ 58', accent: '#d4962f', image: lowFadeImage },
  { id: 4, name: 'Buzz Cut', price: 'R$ 45', accent: '#f0c56a', image: afterBeforeImage },
]

const services = [
  { name: 'Corte', price: 'R$ 45', duration: '40 min' },
  { name: 'Barba', price: 'R$ 35', duration: '25 min' },
  { name: 'Combo', price: 'R$ 70', duration: '60 min' },
  { name: 'Sobrancelha', price: 'R$ 20', duration: '15 min' },
]

const barbers = [
  { name: 'Mateus', role: 'Especialista em fades', instagram: '@mateus.barb', initials: 'M' },
  { name: 'Caio', role: 'Cortes clássicos', instagram: '@caio.clip', initials: 'C' },
  { name: 'Rafael', role: 'Barba e acabamento', instagram: '@raf.cut', initials: 'R' },
  { name: 'Nicolas', role: 'Estilo moderno', instagram: '@nicolas.studio', initials: 'N' },
]

const reviews = [
  { name: 'Lucas B.', text: 'Atendimento impecável e o corte ficou exatamente no estilo que eu queria.', stars: 5 },
  { name: 'João P.', text: 'Ambiente premium, barbearia muito elegante e o serviço é impecável.', stars: 5 },
  { name: 'Pedro M.', text: 'A melhor barbearia da região. Achei o visual e o acabamento sofisticados.', stars: 5 },
]

const faqs = [
  'Aceitamos agendamentos por WhatsApp e online?',
  'Vocês fazem barba e corte no mesmo atendimento?',
  'É possível alterar ou cancelar o horário?',
  'O atendimento é individual ou em grupo?',
]

const location = {
  name: 'Unidade Jardins',
  address: 'Alameda Santos, 1180 · Jardins, São Paulo - SP',
  phone: '(11) 3062-2026',
  hours: 'Seg a sex: 09h às 20h · Sáb: 09h às 18h',
}

const schedule = ['09:00', '10:00', '11:30', '13:00', '15:30', '17:00', '18:30']
const ADMIN_PASSWORD = 'blackbarber2026'

function buildDateOptions() {
  const result = []
  const today = new Date()

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const value = date.toISOString().slice(0, 10)
    result.push({
      value,
      label: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }),
    })
  }

  return result
}

function getStoredBookings() {
  const fallback = [
    {
      id: 1,
      customer: 'Carlos M.',
      phone: '(11) 98888-1010',
      service: 'Combo',
      barber: 'Mateus',
      date: buildDateOptions()[1].value,
      time: '15:30',
      status: 'confirmado',
      notes: 'Corte + barba',
    },
    {
      id: 2,
      customer: 'Ruan T.',
      phone: '(11) 97777-3030',
      service: 'Corte',
      barber: 'Rafael',
      date: buildDateOptions()[2].value,
      time: '17:00',
      status: 'pendente',
      notes: 'Estilo moderno',
    },
  ]

  try {
    const saved = localStorage.getItem('blackbarber-bookings')
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function formatBookingDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function App() {
  const dateOptions = useMemo(() => buildDateOptions(), [])
  const [selectedCut, setSelectedCut] = useState(cuts[0])
  const [slider, setSlider] = useState(52)
  const [bookings, setBookings] = useState(() => getStoredBookings())
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminLogged, setAdminLogged] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [adminFilter, setAdminFilter] = useState('Todos')
  const [formMessage, setFormMessage] = useState('')
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    service: 'Corte',
    barber: 'Mateus',
    date: dateOptions[0]?.value || '',
    time: '09:00',
    notes: '',
  })

  const availableTimes = useMemo(() => {
    return schedule.filter((slot) => {
      return !bookings.some(
        (item) =>
          item.status !== 'cancelado' &&
          item.barber === bookingForm.barber &&
          item.date === bookingForm.date &&
          item.time === slot,
      )
    })
  }, [bookingForm.barber, bookingForm.date, bookings])

  const filteredBookings = useMemo(() => {
    return adminFilter === 'Todos'
      ? bookings
      : bookings.filter((item) => item.status === adminFilter)
  }, [adminFilter, bookings])

  const bookingStats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((item) => item.status === 'pendente').length,
    confirmed: bookings.filter((item) => item.status === 'confirmado').length,
  }), [bookings])

  const updateBookingForm = (field, value) => {
    setFormMessage('')
    setBookingForm((prev) => {
      const next = { ...prev, [field]: value }

      if (field === 'barber' || field === 'date') {
        const nextTimes = schedule.filter((slot) => {
          return !bookings.some(
            (item) =>
              item.status !== 'cancelado' &&
              item.barber === (field === 'barber' ? value : next.barber) &&
              item.date === (field === 'date' ? value : next.date) &&
              item.time === slot,
          )
        })

        if (!nextTimes.includes(next.time) && nextTimes[0]) {
          next.time = nextTimes[0]
        }
      }

      return next
    })
  }

  const submitBooking = (event) => {
    event.preventDefault()

    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      setFormMessage('Preencha nome e telefone para continuar.')
      return
    }

    if (!availableTimes.includes(bookingForm.time)) {
      setFormMessage('Esse horário já foi escolhido para esse barbeiro. Selecione outro.')
      return
    }

    const newBooking = {
      id: Date.now(),
      customer: bookingForm.name.trim(),
      phone: bookingForm.phone.trim(),
      service: bookingForm.service,
      barber: bookingForm.barber,
      date: bookingForm.date,
      time: bookingForm.time,
      notes: bookingForm.notes.trim(),
      status: 'pendente',
    }

    const nextBookings = [newBooking, ...bookings]
    setBookings(nextBookings)
    localStorage.setItem('blackbarber-bookings', JSON.stringify(nextBookings))
    setFormMessage('Agendamento enviado com sucesso. Em breve entraremos em contato.')
    setBookingForm({
      name: '',
      phone: '',
      service: 'Corte',
      barber: 'Mateus',
      date: dateOptions[0]?.value || '',
      time: '09:00',
      notes: '',
    })
  }

  const handleAdminLogin = (event) => {
    event.preventDefault()

    if (adminPassword === ADMIN_PASSWORD) {
      setAdminLogged(true)
      setAdminModalOpen(false)
      setAdminPassword('')
      return
    }

    setAdminPassword('')
    alert('Senha incorreta. Use a senha do painel admin.')
  }

  const updateBookingStatus = (bookingId, nextStatus) => {
    const nextBookings = bookings.map((item) =>
      item.id === bookingId ? { ...item, status: nextStatus } : item,
    )

    setBookings(nextBookings)
    localStorage.setItem('blackbarber-bookings', JSON.stringify(nextBookings))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">BB</div>
          <div>
            <span className="brand-name">BLACK BARBER</span>
            <small>barbearia premium</small>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#inicio">Início</a>
          <a href="#cortes">Cortes</a>
          <a href="#experiencia">Experiência</a>
          <a href="#servicos">Serviços</a>
          <a href="#barbeiros">Barbeiros</a>
        </nav>

        <div className="topbar-actions">
          <button type="button" className="secondary small" onClick={() => setAdminModalOpen(true)}>
            Admin
          </button>
          <button type="button" className="cta small">Reservar</button>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">ESTILO. PRECISÃO. PRESENÇA.</p>
            <h1>Black Barber.</h1>
            <p className="subtitle">
              Corte moderno, acabamento impecável e um ambiente refinado para quem valoriza presença, técnica e elegância.
            </p>

            <div className="hero-actions">
              <a href="#agendamento" className="cta">Reservar horário</a>
              <a href="#cortes" className="secondary">Ver cortes</a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>8k+</strong>
                <span>Clientes atendidos</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Média de avaliações</span>
              </div>
              <div>
                <strong>20 min</strong>
                <span>Tempo médio</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-card">
              <img className="hero-photo" src={heroImage} alt="Barbeiro atendendo um cliente na Black Barber" />
              <div className="portrait-glow" />
              <div className="floating-badge">
                <span>Top barber</span>
                <strong>Mateus</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <div><span>Fades</span><strong>Detalhes perfeitos</strong></div>
          <div><span>Barba</span><strong>Acabamento premium</strong></div>
          <div><span>Ambiente</span><strong>Luxo discreto</strong></div>
          <div><span>Horários</span><strong>Agendamento rápido</strong></div>
        </section>

        <section id="experiencia" className="story-section">
          <div className="story-image" style={{ backgroundImage: `url(${teamImage})` }}>
            <span>BLACK BARBER / EST. 2026</span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">A EXPERIÊNCIA</p>
            <h2>Mais que um corte. Um ritual de presença.</h2>
            <p>
              Técnica precisa, conversa boa e um ambiente feito para desacelerar. Na Black Barber, cada atendimento começa antes da cadeira e termina quando o seu estilo está alinhado.
            </p>
            <div className="story-details">
              <div><strong>01</strong><span>Diagnóstico de estilo</span></div>
              <div><strong>02</strong><span>Execução personalizada</span></div>
              <div><strong>03</strong><span>Finalização e cuidado</span></div>
            </div>
          </div>
        </section>

        <section id="cortes" className="cuts-section">
          <div className="section-heading">
            <p className="eyebrow">POPULAR CUTS</p>
            <h2>Cortes que fazem a diferença.</h2>
          </div>

          <div className="cuts-grid">
            {cuts.map((cut) => (
              <button
                key={cut.id}
                type="button"
                className={`cut-card ${selectedCut.id === cut.id ? 'active' : ''}`}
                onClick={() => setSelectedCut(cut)}
              >
                <span className="tag">{cut.price}</span>
                <div
                  className="mini-portrait"
                  style={{
                    '--cut-accent': cut.accent,
                    backgroundImage: `url(${cut.image})`,
                    backgroundPosition: 'center',
                  }}
                >
                  <span className="mini-hair" />
                </div>
                <strong>{cut.name}</strong>
              </button>
            ))}
          </div>

          <div className="comparison-panel">
            <div className="comparison-copy">
              <p className="eyebrow">BEFORE / AFTER</p>
              <h3>{selectedCut.name}</h3>
              <p>
                Visual limpo, contorno definido e acabamento premium para um resultado mais moderno e sofisticado.
              </p>
              <ul>
                <li>Mesma linha de cabelo e estrutura</li>
                <li>Transição suave e elegante</li>
                <li>Acabamento em estilo premium</li>
              </ul>
            </div>

            <div className="comparison-slider" style={{ '--cut-accent': selectedCut.accent }}>
              <div
                className="before-panel"
                style={{
                  backgroundImage: `url(${afterBeforeImage})`,
                  backgroundPosition: 'center',
                }}
              >
                <span>Antes</span>
              </div>
              <div
                className="after-panel"
                style={{
                  width: `${slider}%`,
                  backgroundImage: `url(${afterBeforeImage})`,
                  backgroundPosition: 'center',
                }}
              >
                <span>Depois</span>
              </div>
              <div className="slider-handle" style={{ left: `${slider}%` }}>
                <span className="handle-knife" aria-hidden="true">↔</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={slider}
                onChange={(event) => setSlider(Number(event.target.value))}
                aria-label="Antes e depois"
              />
            </div>
          </div>
        </section>

        <section id="servicos" className="pricing-section">
          <div className="section-heading">
            <p className="eyebrow">SERVIÇOS</p>
            <h2>Tratamentos pensados para o seu estilo.</h2>
          </div>

          <div className="pricing-grid">
            {services.map((service) => (
              <article key={service.name} className="price-card">
                <span>{service.name}</span>
                <strong>{service.price}</strong>
                <small>{service.duration}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="barbeiros" className="barbers-section">
          <div className="section-heading">
            <p className="eyebrow">OUR TEAM</p>
            <h2>Barbeiros com estilo e técnica.</h2>
          </div>

          <div className="barbers-grid">
            {barbers.map((barber) => (
              <article key={barber.name} className="barber-card">
                <div
                  className="barber-avatar"
                  style={{
                    backgroundImage: `url(${[barberOneImage, barberTwoImage, barberThreeImage, barberFourImage][barbers.indexOf(barber)]})`,
                  }}
                >
                  <span>{barber.initials}</span>
                </div>
                <h3>{barber.name}</h3>
                <p>{barber.role}</p>
                <span>{barber.instagram}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="unidade" className="location-section">
          <div className="location-copy">
            <p className="eyebrow">ONDE ESTAMOS</p>
            <h2>Um endereço à altura do seu ritual.</h2>
            <p>
              Um espaço reservado para cuidar do visual com calma, precisão e atendimento próximo. Chegue alguns minutos antes e aproveite a experiência completa.
            </p>
            <a href="#agendamento" className="cta">Agendar na unidade</a>
          </div>
          <div className="location-card">
            <div className="location-gallery">
              <div className="location-photo" style={{ backgroundImage: `url(${frontImage})` }} />
              <div className="location-photo" style={{ backgroundImage: `url(${interiorImage})` }} />
            </div>
            <div className="location-details">
              <strong>{location.name}</strong>
              <span>{location.address}</span>
              <span>{location.phone}</span>
              <span>{location.hours}</span>
            </div>
          </div>
        </section>

        <section id="avaliacoes" className="reviews-section">
          <div className="section-heading">
            <p className="eyebrow">FEEDBACK</p>
            <h2>Clientes que voltam por excelência.</h2>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <article key={review.name} className="review-card">
                <div className="stars">{'★'.repeat(review.stars)}</div>
                <p>“{review.text}”</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="agendamento" className="booking-section">
          <div className="booking-copy">
            <p className="eyebrow">AGENDAMENTO</p>
            <h2>Reserve seu horário com facilidade.</h2>
            <p>
              A escolha é rápida: serviço, profissional, data e horário disponível. Tudo pensado para você economizar tempo.
            </p>
          </div>

          <form className="booking-card" onSubmit={submitBooking}>
            <div className="field-row">
              <label>
                Nome
                <input
                  type="text"
                  value={bookingForm.name}
                  onChange={(event) => updateBookingForm('name', event.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label>
                WhatsApp
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(event) => updateBookingForm('phone', event.target.value)}
                  placeholder="(11) 99999-0000"
                />
              </label>
            </div>

            <div className="field-row">
              <label>
                Serviço
                <select value={bookingForm.service} onChange={(event) => updateBookingForm('service', event.target.value)}>
                  <option>Corte</option>
                  <option>Barba</option>
                  <option>Combo</option>
                  <option>Sobrancelha</option>
                </select>
              </label>

              <label>
                Barbeiro
                <select value={bookingForm.barber} onChange={(event) => updateBookingForm('barber', event.target.value)}>
                  {barbers.map((barber) => (
                    <option key={barber.name}>{barber.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="field-row">
              <label>
                Data
                <select value={bookingForm.date} onChange={(event) => updateBookingForm('date', event.target.value)}>
                  {dateOptions.map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Horário
                <select value={bookingForm.time} onChange={(event) => updateBookingForm('time', event.target.value)}>
                  {schedule.map((slot) => (
                    <option key={slot} value={slot} disabled={!availableTimes.includes(slot)}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="notes-label">
              Observações
              <textarea
                rows="3"
                value={bookingForm.notes}
                onChange={(event) => updateBookingForm('notes', event.target.value)}
                placeholder="Deseja algo específico?"
              />
            </label>

            <div className="booking-summary">
              <div>
                <span>Serviço</span>
                <strong>{bookingForm.service}</strong>
              </div>
              <div>
                <span>Barbeiro</span>
                <strong>{bookingForm.barber}</strong>
              </div>
              <div>
                <span>Horário</span>
                <strong>{formatBookingDate(bookingForm.date)} · {bookingForm.time}</strong>
              </div>
            </div>

            {formMessage ? <p className="form-message">{formMessage}</p> : null}

            <button type="submit" className="cta full">Confirmar agendamento</button>
          </form>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Perguntas frequentes.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item, index) => (
              <div key={item} className="faq-item">
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {adminLogged ? (
          <section className="admin-panel">
            <div className="admin-header">
              <div>
                <p className="eyebrow">PAINEL ADMIN</p>
                <h3>Reservas e agendamentos</h3>
              </div>

              <div className="admin-controls">
                <select value={adminFilter} onChange={(event) => setAdminFilter(event.target.value)}>
                  <option>Todos</option>
                  <option>pendente</option>
                  <option>confirmado</option>
                  <option>cancelado</option>
                </select>

                <button type="button" className="secondary small" onClick={() => setAdminLogged(false)}>
                  Sair
                </button>
              </div>
            </div>

            <div className="admin-stats">
              <div><span>Total</span><strong>{bookingStats.total}</strong></div>
              <div><span>Pendentes</span><strong>{bookingStats.pending}</strong></div>
              <div><span>Confirmadas</span><strong>{bookingStats.confirmed}</strong></div>
            </div>

            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Barbeiro</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <strong>{booking.customer}</strong>
                        <small>{booking.phone}</small>
                      </td>
                      <td>{booking.service}</td>
                      <td>{booking.barber}</td>
                      <td>{new Date(`${booking.date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{booking.time}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {booking.status !== 'confirmado' ? (
                            <button type="button" onClick={() => updateBookingStatus(booking.id, 'confirmado')}>Confirmar</button>
                          ) : null}
                          {booking.status !== 'cancelado' ? (
                            <button type="button" onClick={() => updateBookingStatus(booking.id, 'cancelado')}>Cancelar</button>
                          ) : (
                            <button type="button" onClick={() => updateBookingStatus(booking.id, 'pendente')}>Reabrir</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="footer">
        <div>
          <span className="brand-name">BLACK BARBER</span>
        </div>
        <div className="footer-links">
          <a href="#inicio">Instagram</a>
          <a href="#unidade">Unidade</a>
          <a href="#agendamento">WhatsApp</a>
          <a href="#agendamento">Contato</a>
        </div>
      </footer>

      {adminModalOpen ? (
        <div className="modal-backdrop" onClick={() => setAdminModalOpen(false)}>
          <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Painel admin</h3>
              <button type="button" className="close-button" onClick={() => setAdminModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAdminLogin} className="admin-login-form">
              <label>
                Senha
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Digite a senha"
                />
              </label>

              <button type="submit" className="cta full">Entrar</button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App

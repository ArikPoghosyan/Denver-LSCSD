<template>
  <div class="home">

    <!-- ═══ HERO ═══════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero__grid" aria-hidden="true"></div>
      <div class="hero__spotlight" aria-hidden="true"></div>

      <div class="hero__inner">
        <div class="hero__badge-col">
          <div class="hero__badge-ring">
            <img src="/src/assets/lssd-logo.png" alt="LSSD" class="hero__logo" />
          </div>
        </div>

        <div class="hero__copy">
          <p class="hero__eyebrow">
            <span class="hero__line"></span>
            Los Santos County · Desert Division
            <span class="hero__line"></span>
          </p>
          <h1 class="hero__title">
            <span class="hero__title-top">Sheriff's</span>
            <span class="hero__title-bottom">Department</span>
          </h1>
          <p class="hero__sub">Lex et Ordo — Защита и Порядок</p>

          <div class="hero__actions">
            <router-link to="/public-registry" class="btn btn--primary">
  <span>Реестр Пропусков</span>
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
</router-link>
            <button class="btn btn--ghost" @click="scrollToDepts">
              Отделы
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M2 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Realistic status bar -->
      <div class="hero__status">
        <div class="hero__status-item" v-for="s in statusFields" :key="s.label">
          <span class="hero__status-label">{{ s.label }}</span>
          <span class="hero__status-value" :class="`hero__status-value--${s.type}`">
            <span class="hero__status-dot"></span>{{ s.value }}
          </span>
        </div>
      </div>
    </section>

    <!-- ═══ LIVE STATS ══════════════════════════════════════════ -->
    <section class="stats">
      <div class="stat" v-for="s in stats" :key="s.label">
        <span class="stat__value">{{ s.value }}</span>
        <span class="stat__label">{{ s.label }}</span>
        <div class="stat__bar"><div class="stat__bar-fill" :style="{ '--pct': s.pct }"></div></div>
      </div>
    </section>

    <!-- ═══ QUICK ACCESS ════════════════════════════════════════ -->
<section class="section">
  <div class="section__header">
    <span class="section__tag">01</span>
    <h2 class="section__title">Быстрый Доступ</h2>
    <div class="section__rule"></div>
  </div>
  <div class="cards">
    <component
      v-for="c in cards"
      :key="c.title"
      :is="c.action === 'route' ? 'router-link' : (c.action === 'external' ? 'a' : 'button')"
      :to="c.action === 'route' ? c.to : undefined"
      :href="c.action === 'external' ? c.to : undefined"
      :target="c.action === 'external' ? '_blank' : undefined"
      :rel="c.action === 'external' ? 'noopener noreferrer' : undefined"
      @click="c.action === 'scroll' ? scrollToDepts() : null"
      class="card"
      :style="{ '--accent': c.accent }"
    >
      <div class="card__corner card__corner--tl"></div>
      <div class="card__corner card__corner--br"></div>
      <div class="card__icon-wrap">
        <svg class="card__icon-svg" viewBox="0 0 24 24" fill="none" v-html="c.svg"></svg>
      </div>
      <h3 class="card__title">{{ c.title }}</h3>
      <p class="card__desc">{{ c.desc }}</p>
      <div class="card__arrow">→</div>
    </component>
  </div>
</section>

    <!-- ═══ DEPARTMENTS (REDESIGNED) ════════════════════════════════════════ -->
        <!-- ═══ DEPARTMENTS (REDESIGNED) ════════════════════════════════════════ -->
    <section class="section" id="departments" ref="deptsSection">
      <div class="section__header">
        <span class="section__tag">02</span>
        <h2 class="section__title">Подразделения Департамента</h2>
        <div class="section__rule"></div>
      </div>
      <p class="section__intro">
        Los Santos County Sheriff's Department состоит из десяти специализированных подразделений, 
        каждое из которых выполняет строго определённые оперативные и административные функции. 
        Структура обеспечивает полное покрытие задач по охране порядка — от начальной подготовки 
        личного состава до проведения специальных операций федерального уровня.
      </p>

      <!-- Tier Navigation -->
      <div class="dept-nav">
        <button 
          v-for="tier in tiers" 
          :key="tier.id"
          class="dept-nav__btn"
          :class="{ 'dept-nav__btn--active': activeTier === tier.id }"
          @click="activeTier = tier.id"
          :style="{ '--tier-color': tier.color }"
        >
          {{ tier.label }}
        </button>
      </div>

      <!-- Departments Grid -->
      <div class="depts-grid">
        <div 
          v-for="d in filteredDepartments" 
          :key="d.abbr"
          class="dept-card"
          :style="{ '--dept-color': d.color }"
        >
          <!-- Header with tactical style -->
          <div class="dept-card__header">
            <div class="dept-card__badge">
              <span class="dept-card__abbr">{{ d.abbr }}</span>
              <span class="dept-card__tier">{{ d.tierLabel }}</span>
            </div>
            <h3 class="dept-card__name">{{ d.name }}</h3>
          </div>

          <!-- Content -->
          <div class="dept-card__content">
            <p class="dept-card__desc">{{ d.desc }}</p>
            
            <!-- Stats / Tags -->
            <div class="dept-card__tags">
              <span v-for="tag in d.tags" :key="tag" class="dept-card__tag">
                {{ tag }}
              </span>
            </div>

            <!-- Tactical indicator -->
            <div class="dept-card__footer">
              <span class="dept-card__status" :class="`dept-card__status--${d.tier}`">
                <span class="dept-card__pulse"></span>
                {{ d.status || 'ACTIVE' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const deptsSection = ref(null)
const activeTier = ref('all')

const scrollToDepts = () => {
  deptsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const statusFields = [
  { label: 'ДЕЖУРНАЯ СМЕНА',  value: 'АКТИВНА',        type: 'green' },
  { label: 'ОПЕРАТИВНЫЙ КОД', value: 'CODE 4 — NORMA',  type: 'muted' },
  { label: 'РАДИОКАНАЛ',      value: 'CH-1 ОТКРЫТ',     type: 'green' },
  { label: 'ЮРИСДИКЦИЯ',      value: 'Blaine County',     type: 'gold'  },
  { label: 'ШТАБ LSCSD',      value: 'Paleto-Bay',    type: 'gold' },
]

const stats = [
  { value: '10',  label: 'Подразделений',     pct: '100%' },
  { value: '74',  label: 'Активных офицеров', pct: '78%'  },
  { value: '23',  label: 'Патрульных единиц', pct: '55%'  },
  { value: '99%', label: 'Процент раскрытия', pct: '99%'  },
]

const cards = [
  {
    title: 'Реестр Пропусков',
    desc: 'Проверка подлинности и статуса официальных удостоверений сотрудников департамента.',
    to: '/public-registry',
    action: 'route', 
    accent: '#c6a756',
    svg: `<rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    title: 'Устав',
    desc: 'Нормативно-правовая база, внутренние регламенты и кодекс поведения офицера.',
    to: 'https://forum.majestic-rp.ru/threads/ustav-los-santos-county-sheriffs-department.2981524/',
    action: 'external',
    accent: '#8fff87',
    svg: `<path d="M12 3L4 7v6c0 4 4 7 8 8 4-1 8-4 8-8V7l-8-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    title: 'Отделы',
    desc: 'Организационная структура, цепочка командования и зоны оперативной ответственности.',
    to: '#departments',
    action: 'scroll',
    accent: '#bf87ff',
    svg: `<rect x="3" y="11" width="5" height="9" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="9.5" y="7" width="5" height="13" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="16" y="3" width="5" height="17" rx="1" stroke="currentColor" stroke-width="1.5"/>`,
  },
]

// Tier colors
const tierColors = {
  entry: '#6ee89a',
  core: '#c6a756',
  tactical: '#4a9eff',
  admin: '#bf87ff',
  intel: '#f5a843',
  elite: '#e04f4f'
}

const tiers = [
  { id: 'all', label: 'ВСЕ ПОДРАЗДЕЛЕНИЯ', color: '#c6a756' },
  { id: 'entry', label: 'ПОДГОТОВКА', color: tierColors.entry },
  { id: 'core', label: 'ОСНОВНЫЕ', color: tierColors.core },
  { id: 'tactical', label: 'ТАКТИЧЕСКИЕ', color: tierColors.tactical },
  { id: 'admin', label: 'АДМИНИСТРАЦИЯ', color: tierColors.admin },
  { id: 'intel', label: 'СЛЕДСТВИЕ', color: tierColors.intel },
  { id: 'elite', label: 'ЭЛИТНЫЕ', color: tierColors.elite }
]

const departments = [
  {
    abbr: 'SA',
    name: 'Sheriff Academy',
    desc: 'Стартовое подразделение для всех новобранцев. Сотрудники, прошедшие проверку и подписавшие контракт, автоматически зачисляются в Академию. Программа охватывает изучение внутренних памяток департамента, посещение лекций и обязательное присутствие на территории объекта в рабочее время.',
    tier: 'entry',
    tierLabel: 'ПОДГОТОВКА',
    color: tierColors.entry,
    status: 'TRAINING',
    tags: ['Новобранцы', 'Обучение', 'Памятки', 'Лекции'],
  },
  {
    abbr: 'SPD',
    name: 'Special Patrol Division',
    desc: 'Основное оперативное подразделение LSCSD. Отвечает за защиту жизни, здоровья и свобод граждан, противодействие преступности, охрану общественного порядка и собственности.',
    tier: 'core',
    tierLabel: 'ОСНОВНОЙ',
    color: tierColors.core,
    status: 'PATROL',
    tags: ['Патруль', 'Охрана порядка', 'Тюрьма', 'Граждане'],
  },
  {
    abbr: 'SEB',
    name: 'Special Enforcement Bureau',
    desc: 'Тактическое подразделение, специализирующееся на использовании наземной техники. Реагирует на ограбления, террористические акты и вооружённые конфликты.',
    tier: 'tactical',
    tierLabel: 'ТАКТИКА',
    color: tierColors.tactical,
    status: 'TACTICAL',
    tags: ['Техника', 'Ограбления', 'Теракты', 'Спецсредства'],
  },
  {
    abbr: 'SAI',
    name: 'Sheriff Academy Instructors',
    desc: 'Административно-обучающий отдел, ответственный за проведение собеседований и приём на службу, выдачу гражданских лицензий, восстановление и перевод сотрудников.',
    tier: 'admin',
    tierLabel: 'ОБУЧЕНИЕ',
    color: tierColors.admin,
    status: 'ADMIN',
    tags: ['Собеседования', 'Лицензии', 'Аттестация', 'Переводы'],
  },
  {
    abbr: 'IAD',
    name: 'Internal Affairs Division',
    desc: 'Подразделение внутреннего контроля. Ведёт прямое наблюдение за работой офицеров, обрабатывает жалобы от населения, проводит профилактические беседы.',
    tier: 'admin',
    tierLabel: 'ВД',
    color: tierColors.admin,
    status: 'INTERNAL',
    tags: ['Контроль', 'Жалобы', 'Расследования', 'Профилактика'],
  },
  {
    abbr: 'DB',
    name: 'Detective Bureau',
    desc: 'Отдел по особо тяжким преступлениям. Специализируется на расследованиях, связанных с организованной преступностью, тюремными и мотоциклетными бандами.',
    tier: 'intel',
    tierLabel: 'СЛЕДСТВИЕ',
    color: tierColors.intel,
    status: 'INVESTIGATION',
    tags: ['ОПГ', 'Терроризм', 'Беглецы', 'Здравоохранение'],
  },
  {
    abbr: 'K-9',
    name: 'Canine Division',
    desc: 'Кинологическое подразделение, ориентированное на пресечение наркотрафика. Осуществляет патрулирование на территории фермы и острова Кайо-Перико.',
    tier: 'core',
    tierLabel: 'КИНОЛОГИЯ',
    color: tierColors.core,
    status: 'K9 ACTIVE',
    tags: ['Наркотики', 'Кайо-Перико', 'Кинологи', 'Задержание'],
  },
  {
    abbr: 'MOU',
    name: 'Maritime Operations Unit',
    desc: 'Специализированное подразделение водной юрисдикции департамента. Обеспечивает правопорядок на акваториях округа.',
    tier: 'tactical',
    tierLabel: 'МОРСКОЙ',
    color: tierColors.tactical,
    status: 'MARITIME',
    tags: ['Акватория', 'SAR', 'Побережье', 'Реки'],
  },
  {
    abbr: 'ED',
    name: 'Elite Division',
    desc: 'Штурмовой элитный отдел первого контакта и быстрого реагирования. Создан для выполнения задач повышенной сложности по всему штату.',
    tier: 'elite',
    tierLabel: 'ЭЛИТА',
    color: tierColors.elite,
    status: 'SPECIAL OPS',
    tags: ['Спецоперации', 'Быстрое реагирование', 'Поддержка', 'Весь штат'],
  },
  {
    abbr: 'TRS',
    name: 'Tactical Response Squad',
    desc: 'Специальное тактическое подразделение для реагирования на критические инциденты. Привлекается для силового разрешения ситуаций.',
    tier: 'elite',
    tierLabel: 'СПЕЦНАЗ',
    color: tierColors.elite,
    status: 'STANDING BY',
    tags: ['Критические инциденты', 'Оружие', 'SEB', 'Тактика'],
  },
]

const filteredDepartments = computed(() => {
  if (activeTier.value === 'all') return departments
  return departments.filter(d => d.tier === activeTier.value)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

/* ─── Variables ──────────────────────────────────── */
.home {
  --gold:       #c6a756;
  --gold-light: #f0cc7a;
  --gold-dim:   #6b5828;
  --navy:       #080f16;
  --navy-mid:   #0e1a24;
  --navy-light: #152130;
  --navy-card:  #111d28;
  --white:      #f0ede8;
  --muted:      rgba(240,237,232,0.5);
  --border:     rgba(198,167,86,0.15);

  font-family: 'Rajdhani', sans-serif;
  background: var(--navy);
  color: var(--white);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 120px;
}

/* ─── Hero ───────────────────────────────────────── */
.hero {
  position: relative;
  margin: 60px 0 80px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--navy-mid);
  border: 1px solid var(--border);
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(198,167,86,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(198,167,86,0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: gridShift 20s linear infinite;
}

@keyframes gridShift {
  from { background-position: 0 0; }
  to   { background-position: 48px 48px; }
}

.hero__spotlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 70% at 50% 50%, rgba(198,167,86,0.06) 0%, transparent 70%);
  pointer-events: none;
}

.hero__inner {
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 70px 70px 80px;
  flex: 1;
  position: relative;
  z-index: 1;
}

.hero__badge-ring {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 1px solid var(--gold-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  animation: pulseBadge 4s ease-in-out infinite;
}

@keyframes pulseBadge {
  0%, 100% { box-shadow: 0 0 0 8px rgba(198,167,86,0.04); }
  50%       { box-shadow: 0 0 0 14px rgba(198,167,86,0.09); }
}

.hero__badge-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(198,167,86,0.08);
}

.hero__logo {
  height: 110px;
  filter: drop-shadow(0 0 20px rgba(198,167,86,0.35));
  transition: filter 0.3s;
}

.hero__badge-ring:hover .hero__logo {
  filter: drop-shadow(0 0 30px rgba(198,167,86,0.6));
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.72rem;
  letter-spacing: 3px;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 12px;
  animation: fadeUp 0.6s 0.1s ease both;
}

.hero__line {
  flex: 1;
  max-width: 40px;
  height: 1px;
  background: var(--gold-dim);
}

.hero__title {
  font-family: 'Bebas Neue', sans-serif;
  line-height: 0.92;
  margin: 0 0 16px;
  animation: fadeUp 0.6s 0.2s ease both;
}

.hero__title-top    { display: block; font-size: 5rem; color: var(--white); letter-spacing: 4px; }
.hero__title-bottom { display: block; font-size: 5rem; color: var(--gold);  letter-spacing: 4px; }

.hero__sub {
  font-style: italic;
  color: var(--muted);
  font-size: 1rem;
  letter-spacing: 1.5px;
  margin-bottom: 36px;
  animation: fadeUp 0.6s 0.3s ease both;
}

.hero__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeUp 0.6s 0.4s ease both;
}

/* ─── Status Bar ─────────────────────────────────── */
.hero__status {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid var(--border);
}

.hero__status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 20px;
  border-right: 1px solid var(--border);
}

.hero__status-item:last-child { border-right: none; }

.hero__status-label {
  font-size: 0.58rem;
  letter-spacing: 2px;
  color: var(--muted);
  text-transform: uppercase;
}

.hero__status-value {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.hero__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hero__status-value--green { color: #6ee89a; }
.hero__status-value--green .hero__status-dot {
  background: #4fcc6e;
  box-shadow: 0 0 6px #4fcc6e;
  animation: blinkDot 2.4s ease-in-out infinite;
}

.hero__status-value--gold  { color: var(--gold); }
.hero__status-value--gold .hero__status-dot { background: var(--gold); }

.hero__status-value--muted { color: var(--muted); }
.hero__status-value--muted .hero__status-dot { background: rgba(240,237,232,0.25); }

@keyframes blinkDot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ─── Buttons ────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 11px 24px;
  border-radius: 2px;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.btn--primary {
  background: linear-gradient(135deg, var(--gold), #a8883e);
  color: var(--navy);
  box-shadow: 0 4px 20px rgba(198,167,86,0.25);
  position: relative;
  overflow: hidden;
}

.btn--primary::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.4s ease;
}

.btn--primary:hover::before { left: 100%; }
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(198,167,86,0.4);
}

.btn--ghost {
  background: transparent;
  color: var(--white);
  border: 1px solid var(--border);
}

.btn--ghost:hover {
  border-color: var(--gold-dim);
  color: var(--gold);
  background: rgba(198,167,86,0.05);
}

/* ─── Stats ──────────────────────────────────────── */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 90px;
  overflow: hidden;
}

.stat {
  background: var(--navy-card);
  padding: 28px 32px;
  position: relative;
}

.stat::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.stat__value {
  display: block;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.8rem;
  color: var(--gold);
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 6px;
}

.stat__label {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 1.8px;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 14px;
}

.stat__bar {
  height: 2px;
  background: rgba(198,167,86,0.1);
  border-radius: 1px;
  overflow: hidden;
}

.stat__bar-fill {
  height: 100%;
  width: var(--pct);
  background: linear-gradient(90deg, var(--gold-dim), var(--gold));
  animation: growBar 1.2s ease both;
}

@keyframes growBar {
  from { width: 0; }
  to   { width: var(--pct); }
}

/* ─── Section Layout ─────────────────────────────── */
.section { margin-bottom: 80px; }

.section__header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.section__tag {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 2px;
  color: var(--gold);
  background: rgba(198,167,86,0.08);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 2px;
}

.section__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 3px;
  color: var(--white);
  margin: 0;
}

.section__rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
}

.section__intro {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.75;
  max-width: 860px;
  margin-bottom: 36px;
  letter-spacing: 0.3px;
}

/* ─── Quick Access Cards ─────────────────────────── */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  position: relative;
  background: var(--navy-card);
  border: 1px solid rgba(198,167,86,0.1);
  border-radius: 2px;
  padding: 32px 28px;
  text-decoration: none;
  color: var(--white);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover {
  border-color: var(--accent, var(--gold));
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}

.card:hover::before { opacity: 1; }

.card__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  opacity: 0;
  transition: opacity 0.25s;
}

.card:hover .card__corner { opacity: 1; }

.card__corner--tl { top: 8px; left: 8px; border-top: 1px solid var(--accent, var(--gold)); border-left: 1px solid var(--accent, var(--gold)); }
.card__corner--br { bottom: 8px; right: 8px; border-bottom: 1px solid var(--accent, var(--gold)); border-right: 1px solid var(--accent, var(--gold)); }

.card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 2px;
  background: rgba(198,167,86,0.06);
  border: 1px solid rgba(198,167,86,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: background 0.25s, border-color 0.25s;
}

.card:hover .card__icon-wrap {
  background: rgba(198,167,86,0.12);
  border-color: rgba(198,167,86,0.3);
}

.card__icon-svg { width: 20px; height: 20px; color: var(--accent, var(--gold)); }

.card__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.25rem;
  letter-spacing: 2px;
  color: var(--white);
  margin: 0 0 10px;
  position: relative;
  z-index: 1;
}

.card__desc {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.6;
  flex: 1;
  position: relative;
  z-index: 1;
}

.card__arrow {
  margin-top: 24px;
  color: var(--accent, var(--gold));
  font-size: 1.1rem;
  transition: transform 0.25s;
}

.card:hover .card__arrow { transform: translateX(5px); }

/* ===== NEW DEPARTMENTS CARD DESIGN ===== */
.dept-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.dept-nav__btn {
  background: transparent;
  border: 1px solid rgba(198,167,86,0.2);
  color: var(--muted);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  padding: 8px 16px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.dept-nav__btn:hover {
  border-color: var(--tier-color, var(--gold));
  color: var(--white);
  background: rgba(198,167,86,0.05);
}

.dept-nav__btn--active {
  background: color-mix(in srgb, var(--tier-color) 10%, transparent);
  border-color: var(--tier-color);
  color: var(--white);
  box-shadow: 0 0 15px color-mix(in srgb, var(--tier-color) 20%, transparent);
}

.depts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.dept-card {
  background: linear-gradient(145deg, #0c141f 0%, #0a1019 100%);
  border: 1px solid rgba(198,167,86,0.15);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dept-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--dept-color), transparent);
  opacity: 0.5;
  transition: opacity 0.3s;
}

.dept-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--dept-color) 5%, transparent), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.dept-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--dept-color) 50%, transparent);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5),
              0 0 0 1px color-mix(in srgb, var(--dept-color) 20%, transparent);
}

.dept-card:hover::after {
  opacity: 1;
}

.dept-card:hover::before {
  opacity: 1;
}

.dept-card__header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(198,167,86,0.1);
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.dept-card__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.dept-card__abbr {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
  color: var(--dept-color);
  background: color-mix(in srgb, var(--dept-color) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--dept-color) 25%, transparent);
  padding: 6px 12px;
  border-radius: 3px;
  min-width: 65px;
  text-align: center;
  line-height: 1;
  text-shadow: 0 0 10px color-mix(in srgb, var(--dept-color) 30%, transparent);
}

.dept-card__tier {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--dept-color);
  background: color-mix(in srgb, var(--dept-color) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--dept-color) 15%, transparent);
  padding: 2px 8px;
  border-radius: 2px;
  white-space: nowrap;
  text-transform: uppercase;
}

.dept-card__name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
  color: var(--white);
  margin: 0;
  flex: 1;
  line-height: 1.2;
}

.dept-card__content {
  padding: 20px 24px;
}

.dept-card__desc {
  font-size: 0.9rem;
  color: rgba(240,237,232,0.7);
  line-height: 1.7;
  margin: 0 0 20px 0;
  position: relative;
  padding-left: 12px;
  border-left: 1px solid color-mix(in srgb, var(--dept-color) 30%, transparent);
}

.dept-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.dept-card__tag {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--muted);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 4px 10px;
  border-radius: 2px;
  text-transform: uppercase;
  transition: all 0.2s;
}

.dept-card:hover .dept-card__tag {
  border-color: color-mix(in srgb, var(--dept-color) 20%, transparent);
  color: var(--white);
}

.dept-card__footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(198,167,86,0.1);
  padding-top: 16px;
}

.dept-card__status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--dept-color);
  text-transform: uppercase;
  padding: 4px 12px;
  background: color-mix(in srgb, var(--dept-color) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--dept-color) 15%, transparent);
  border-radius: 2px;
}

.dept-card__pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dept-color);
  box-shadow: 0 0 8px var(--dept-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Tier-specific status animations */
.dept-card__status--entry .dept-card__pulse { background: #6ee89a; }
.dept-card__status--core .dept-card__pulse { background: #c6a756; }
.dept-card__status--tactical .dept-card__pulse { background: #4a9eff; }
.dept-card__status--admin .dept-card__pulse { background: #bf87ff; }
.dept-card__status--intel .dept-card__pulse { background: #f5a843; }
.dept-card__status--elite .dept-card__pulse { background: #e04f4f; }

/* Responsive */
@media (max-width: 768px) {
  .dept {
    flex-direction: column;
  }
  
  .dept__left {
    width: 100%;
    padding: 12px 0;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .dept__abbr-container {
    flex-direction: row;
    gap: 16px;
  }
  
  .dept__abbr {
    font-size: 1.5rem;
  }
}

/* ─── Animations ─────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 1100px) {
  .depts-grid { grid-template-columns: 1fr; }
}

@media (max-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .dept-nav { justify-content: center; }
}

@media (max-width: 768px) {
  .home { padding: 0 20px 60px; }
  .hero__inner { flex-direction: column; gap: 30px; padding: 50px 30px 60px; text-align: center; }
  .hero__eyebrow { justify-content: center; }
  .hero__badge-ring { width: 120px; height: 120px; }
  .hero__logo { height: 80px; }
  .hero__title-top, .hero__title-bottom { font-size: 3.5rem; }
  .hero__actions { justify-content: center; }
  .hero__status { grid-template-columns: repeat(2, 1fr); }
  .hero__status-item:nth-child(2n) { border-right: none; }
  .cards { grid-template-columns: 1fr; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .depts-grid { grid-template-columns: 1fr; }
  .dept-card__header { flex-direction: column; align-items: flex-start; }
  .dept-nav { overflow-x: auto; padding-bottom: 8px; }
  .dept-nav__btn { white-space: nowrap; }
}

@media (max-width: 480px) {
  .stats { grid-template-columns: 1fr; }
  .hero__status { grid-template-columns: 1fr 1fr; }
  .dept-card__content { padding: 16px; }
}
</style>

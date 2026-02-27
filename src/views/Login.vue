<template>
  <div class="login">
    <div class="login__grid" aria-hidden="true"></div>
    
    <div class="login__container">
      <!-- Left side - Badge/Info -->
      <div class="login__info">
        <div class="login__badge">
          <img src="/src/assets/lssd-logo.png" alt="LSSD" class="login__logo" />
          <div class="login__badge-glow"></div>
        </div>
        <h1 class="login__title">Доступ к системе</h1>
        <p class="login__subtitle">Los Santos County Sheriff's Department</p>
        
        <div class="login__features">
          <div class="login__feature">
            <span class="login__feature-icon">⬢</span>
            <span>Реестр пропусков</span>
          </div>
          <div class="login__feature">
            <span class="login__feature-icon">⬢</span>
            <span>Управление отделом</span>
          </div>
          <div class="login__feature">
            <span class="login__feature-icon">⬢</span>
            <span>Генерация кодов доступа</span>
          </div>
        </div>
      </div>

      <!-- Right side - Login Form -->
      <div class="login__form-container">
        <div class="login__form-header">
          <h2 class="login__form-title">Вход в систему</h2>
          <p class="login__form-subtitle">Введите ваш код доступа</p>
        </div>

        <form @submit.prevent="handleLogin" class="login__form">
          <!-- Табы: Код доступа / Логин+пароль -->
          <div class="login__tabs">
            <button 
              type="button"
              class="login__tab" 
              :class="{ 'login__tab--active': loginMode === 'code' }"
              @click="loginMode = 'code'"
            >
              Код доступа
            </button>
            <button 
              type="button"
              class="login__tab" 
              :class="{ 'login__tab--active': loginMode === 'credentials' }"
              @click="loginMode = 'credentials'"
            >
              Логин / Пароль
            </button>
          </div>

          <!-- Форма для кода доступа -->
          <div v-if="loginMode === 'code'" class="login__field-group">
            <label class="login__label">
              <span class="login__label-text">Код доступа</span>
              <input 
                type="text" 
                v-model="accessCode"
                class="login__input"
                placeholder="XXXX-XXXX"
                maxlength="9"
                @input="formatAccessCode"
              />
            </label>
            <p class="login__hint">
              Код доступа выдается лидером департамента
            </p>
          </div>

          <!-- Форма для логина/пароля -->
          <div v-else class="login__field-group">
            <label class="login__label">
              <span class="login__label-text">Логин</span>
              <input 
                type="text" 
                v-model="username"
                class="login__input"
                placeholder="Ваш логин"
              />
            </label>
            <label class="login__label">
              <span class="login__label-text">Пароль</span>
              <input 
                type="password" 
                v-model="password"
                class="login__input"
                placeholder="••••••••"
              />
            </label>
          </div>

          <!-- Ошибка -->
          <div v-if="error" class="login__error">
            <span class="login__error-icon">⚠</span>
            {{ error }}
          </div>

          <!-- Кнопка входа -->
          <button type="submit" class="login__submit" :disabled="isLoading">
            <span v-if="!isLoading">Войти в систему</span>
            <span v-else class="login__loader"></span>
          </button>
        </form>

        <!-- Для лидеров -->
        <div class="login__leader-note">
          <span class="login__leader-icon">⬢</span>
          <span>Логин/пароль для входа в админ-панель предназначен для Лидера</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginMode = ref('code')
const accessCode = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// Лидерские учетные данные
const LEADER_CREDENTIALS = {
  username: 'Samo-6098',
  password: 'DENVER-AP1624'
}

// Проверяем, если уже авторизован - редирект
onMounted(() => {
  const auth = localStorage.getItem('lssd_auth')
  if (auth) {
    const user = JSON.parse(auth)
    if (user.isLeader) {
      router.push('/admin')
    } else {
      router.push('/registry')
    }
  }
})

// Форматирование кода доступа (XXXX-XXXX)
const formatAccessCode = () => {
  let value = accessCode.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  
  // Ограничиваем длину до 8 символов (XXXX-XXXX = 8 символов без дефиса)
  if (value.length > 8) {
    value = value.slice(0, 8)
  }
  
  // Добавляем дефис после каждых 4 символов
  if (value.length > 4) {
    value = value.slice(0, 4) + '-' + value.slice(4)
  }
  
  accessCode.value = value
}

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    if (loginMode.value === 'credentials') {
      // Проверка логина/пароля лидера
      if (username.value === LEADER_CREDENTIALS.username && 
          password.value === LEADER_CREDENTIALS.password) {
        
        localStorage.setItem('lssd_auth', JSON.stringify({
          isLeader: true,
          username: username.value,
          timestamp: Date.now()
        }))
        
        window.dispatchEvent(new Event('storage'))
        await router.push('/admin')
      } else {
        error.value = 'Неверный логин или пароль'
      }
    } else {
      // Проверка кода доступа
      const savedKeys = localStorage.getItem('lssd_keys')
      const keys = savedKeys ? JSON.parse(savedKeys) : []
      
      const cleanInputCode = accessCode.value.replace(/-/g, '').toUpperCase()
      
      // Ищем активный ключ
      const validKey = keys.find(k => {
        const cleanKeyCode = k.code.replace(/-/g, '').toUpperCase()
        return cleanKeyCode === cleanInputCode && k.active === true
      })
      
      if (validKey) {
        // Обновляем статистику использования ключа
        validKey.uses = (validKey.uses || 0) + 1
        validKey.lastUsed = new Date().toISOString()
        
        // Добавляем запись в историю (опционально)
        if (!validKey.history) validKey.history = []
        validKey.history.push({
          timestamp: new Date().toISOString(),
          action: 'login'
        })
        
        localStorage.setItem('lssd_keys', JSON.stringify(keys))
        
        localStorage.setItem('lssd_auth', JSON.stringify({
          isLeader: false,
          accessCode: accessCode.value,
          timestamp: Date.now()
        }))
        
        window.dispatchEvent(new Event('storage'))
        await router.push('/registry')
      } else {
        error.value = 'Неверный или неактивный код доступа'
      }
    }
  } catch (err) {
    error.value = 'Ошибка при входе в систему'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

.login {
  min-height: calc(100vh - 120px);
  background: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(198,167,86,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(198,167,86,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: gridShift 20s linear infinite;
}

@keyframes gridShift {
  from { background-position: 0 0; }
  to { background-position: 48px 48px; }
}

.login__container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(17, 29, 40, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

/* Left side */
.login__info {
  background: linear-gradient(145deg, #0a1019, #0c141f);
  padding: 60px 40px;
  border-right: 1px solid rgba(198,167,86,0.15);
  display: flex;
  flex-direction: column;
}

.login__badge {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login__logo {
  width: 100px;
  filter: drop-shadow(0 0 20px rgba(198,167,86,0.3));
  position: relative;
  z-index: 1;
}

.login__badge-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(198,167,86,0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 3s infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.login__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3rem;
  color: var(--white);
  margin: 0 0 10px 0;
  letter-spacing: 3px;
  line-height: 1;
}

.login__subtitle {
  color: var(--gold);
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.login__features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login__feature {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.95rem;
  letter-spacing: 1px;
}

.login__feature-icon {
  color: var(--gold);
  font-size: 1rem;
}

/* Right side */
.login__form-container {
  padding: 60px 40px;
}

.login__form-header {
  margin-bottom: 40px;
}

.login__form-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  color: var(--white);
  margin: 0 0 5px 0;
  letter-spacing: 2px;
}

.login__form-subtitle {
  color: var(--muted);
  font-size: 0.9rem;
}

.login__tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(198,167,86,0.15);
  padding-bottom: 10px;
}

.login__tab {
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.login__tab--active {
  color: var(--gold);
}

.login__tab--active::after {
  content: '';
  position: absolute;
  bottom: -11px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.login__field-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.login__label {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login__label-text {
  color: var(--white);
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.7;
}

.login__input {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  padding: 14px 16px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login__input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(198,167,86,0.1);
}

.login__hint {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  margin: 5px 0 0 0;
}

.login__error {
  background: rgba(224, 79, 79, 0.1);
  border: 1px solid rgba(224, 79, 79, 0.3);
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #e04f4f;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.login__error-icon {
  font-size: 1.1rem;
}

.login__submit {
  width: 100%;
  background: linear-gradient(135deg, var(--gold), #a8883e);
  border: none;
  border-radius: 4px;
  padding: 16px;
  color: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login__submit:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(198,167,86,0.3);
}

.login__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login__submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.4s ease;
}

.login__submit:not(:disabled):hover::before {
  left: 100%;
}

.login__loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--navy);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login__leader-note {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(198,167,86,0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 0.8rem;
}

.login__leader-icon {
  color: var(--gold);
  font-size: 0.7rem;
}

/* Responsive */
@media (max-width: 900px) {
  .login__container {
    grid-template-columns: 1fr;
  }
  
  .login__info {
    border-right: none;
    border-bottom: 1px solid rgba(198,167,86,0.15);
    padding: 40px 30px;
  }
  
  .login__form-container {
    padding: 40px 30px;
  }
  
  .login__title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .login__info {
    padding: 30px 20px;
  }
  
  .login__form-container {
    padding: 30px 20px;
  }
  
  .login__tabs {
    flex-direction: column;
  }
  
  .login__tab--active::after {
    bottom: -2px;
  }
}
</style>
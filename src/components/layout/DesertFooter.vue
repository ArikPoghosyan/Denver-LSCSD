<template>
  <footer class="desert-footer">
    <div class="footer-pattern"></div>
    
    <div class="container">
      <div class="footer-top">
        <div class="footer-info">
          <div class="footer-logo">
            <span class="star">★</span>
            <span>LSSD DESERT DIVISION</span>
          </div>
          <p class="footer-address">
            123 DESERT HIGHWAY • SANDY SHORES • SAN ANDREAS
          </p>
          <p class="footer-contact">
            ☎️ DESERT-911 • 📻 CHANNEL 7
          </p>
        </div>

        <div class="footer-links">
          <div class="links-column">
            <h4>ОТДЕЛЫ</h4>
            <router-link to="/departments/patrol">Патруль</router-link>
            <router-link to="/departments/tactical">Тактика</router-link>
            <router-link to="/departments/desert">Пустынный</router-link>
          </div>
          
          <div class="links-column">
            <h4>ДОКУМЕНТЫ</h4>
            <router-link to="/charter/general">Устав</router-link>
            <router-link to="/registry">Реестр</router-link>
            <router-link to="/forms">Формы</router-link>
          </div>
          
          <div class="links-column">
            <h4>КОНТАКТЫ</h4>
            <a href="#">Штаб</a>
            <a href="#">Диспетчер</a>
            <a href="#">Поддержка</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <span>© 2026 LOS SANTOS COUNTY SHERIFF'S DEPARTMENT</span>
          <span>DESERT DIVISION • ALL RIGHTS RESERVED</span>
        </div>
        
        <div class="footer-motto">
          <span class="motto-text">TO PROTECT AND TO SERVE</span>
          <span class="motto-star">★</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.desert-footer {
  background: var(--sand-dark);
  border-top: 3px solid var(--gold-faded);
  position: relative;
  margin-top: auto;
}

.footer-pattern {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 20px,
    var(--gold-faded) 20px,
    var(--gold-faded) 40px
  );
  opacity: 0.3;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--leather-dark);
  margin-bottom: 15px;
}

.footer-logo .star {
  color: var(--gold-faded);
  font-size: 1.5rem;
}

.footer-address, .footer-contact {
  color: var(--leather);
  font-size: 0.9rem;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.links-column h4 {
  color: var(--leather-dark);
  font-size: 0.9rem;
  margin-bottom: 15px;
  letter-spacing: 2px;
  border-bottom: 1px solid var(--gold-faded);
  padding-bottom: 5px;
}

.links-column a {
  display: block;
  color: var(--leather);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.links-column a:hover {
  color: var(--gold-dust);
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid rgba(212, 182, 138, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.footer-legal {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--leather);
}

.footer-motto {
  display: flex;
  align-items: center;
  gap: 10px;
}

.motto-text {
  color: var(--gold-faded);
  letter-spacing: 2px;
  font-style: italic;
}

.motto-star {
  color: var(--gold-dust);
  font-size: 1.2rem;
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>
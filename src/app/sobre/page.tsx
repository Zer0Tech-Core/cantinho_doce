// src/app/sobre/page.tsx
'use client'

import { 
  Heart, 
  Award, 
  Users, 
  Clock, 
  Mail, 
  MapPin, 
  Phone, 
  Target, 
  Eye, 
  HeartHandshake,
  BadgeCheck,
  Gift,
  Sparkles,
  TrendingUp,
  Rocket,
  Flame,
  MessageCircle,
  Cookie
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import UnifiedHeader from '@/components/Layout/UnifiedHeader'
import Footer from '@/components/Layout/Footer'
import styles from './sobre.module.css'

export default function SobrePage() {
  const valores = [
    {
      icone: <Heart size={28} />,
      titulo: 'Feito com Amor',
      descricao: 'Cada receita é preparada com dedicação e ingredientes selecionados.'
    },
    {
      icone: <Award size={28} />,
      titulo: 'Qualidade Artesanal',
      descricao: 'Produzimos em pequena escala para garantir frescor e qualidade.'
    },
    {
      icone: <Users size={28} />,
      titulo: 'Atendimento Pessoal',
      descricao: 'Valorizamos cada cliente com atenção e cuidado especial.'
    },
    {
      icone: <Clock size={28} />,
      titulo: 'Frescor Garantido',
      descricao: 'Produtos feitos sob encomenda, sempre fresquinhos.'
    }
  ]

  const timeline = [
    {
      data: 'Set 2025',
      titulo: 'O Sonho Começou',
      descricao: 'A ideia de compartilhar receitas caseiras que faziam sucesso.',
      icone: <Sparkles size={20} />
    },
    {
      data: 'Dez 2025',
      titulo: 'Primeiros Pedidos',
      descricao: 'Amigos e vizinhos começaram a encomendar. O boca a boca funcionou!',
      icone: <MessageCircle size={20} />
    },
    {
      data: 'Mar 2026',
      titulo: 'Novos Sabores',
      descricao: 'Expandimos com compotas, amendoins especiais e doces caseiros.',
      icone: <TrendingUp size={20} />
    },
    {
      data: 'Jun 2026',
      titulo: 'Onde Estamos Hoje',
      descricao: '30+ clientes confiam no Cantinho Doce. Um sonho que cresce!',
      icone: <Rocket size={20} />
    }
  ]

  return (
    <main>
      <UnifiedHeader showCategories={false} />

      {/* ========== BANNER ========== */}
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerBadge}>
            <Flame size={16} /> Novinho em folha
          </span>
          <h1 className={styles.bannerTitle}>Cantinho Doce</h1>
          <p className={styles.bannerSubtitle}>
            Um sonho que começou na cozinha e está conquistando corações
          </p>
          <div className={styles.bannerStats}>
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatNumber}>9</span>
              <span className={styles.bannerStatLabel}>meses</span>
            </div>
            <div className={styles.bannerStatDivider} />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatNumber}>30+</span>
              <span className={styles.bannerStatLabel}>clientes</span>
            </div>
            <div className={styles.bannerStatDivider} />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatNumber}>50+</span>
              <span className={styles.bannerStatLabel}>produtos</span>
            </div>
          </div>
        </div>
        <div className={styles.bannerDecoration}>
          {/*<Cookie size={160} className={styles.bannerCookie} />*/}
          <Image 
            src='/imagens/sobre/Flork.webp' 
            alt='Cantinho Doce' 
            width={220} 
            height={220} 
            className={styles.bannerCake}
            priority
          />
        </div>
      </section>

      {/* ========== SOBRE - 2 COLUNAS ========== */}
      <section className={styles.sobre}>
        <div className={styles.sobreContent}>
          
          {/* Coluna Esquerda - Poema */}
          <div className={styles.sobrePoema}>
            <span className={styles.sectionTag}>🍪 Minha História</span>
            <h2 className={styles.sectionTitle}>
              Um sonho que nasceu <span className={styles.titleHighlight}>de algo simples</span>
            </h2>
            
            <div className={styles.poemaGrid}>
              <div className={styles.poemaColuna}>
                <div className={styles.verso}>
                  <span className={styles.versoDestaque}>Meu sonho nasceu</span>
                  <span className={styles.versoDestaque}>de algo simples:</span>
                  <span className={styles.versoGrande}>eu sempre gostei</span>
                  <span className={styles.versoGrande}>de comer biscoito.</span>
                </div>
                
                <div className={styles.verso}>
                  <span className={styles.versoPequeno}>Não tinha receita mirabolante,</span>
                  <span className={styles.versoPequeno}>nem segredo de família.</span>
                  <span className={styles.versoPequeno}>Só o amor por um bom biscoito</span>
                  <span className={styles.versoPequeno}>e a vontade de compartilhar.</span>
                </div>
              </div>
              
              <div className={styles.poemaColuna}>
                <div className={styles.verso}>
                  <span className={styles.versoDestaque}>Foi dessa paixão</span>
                  <span className={styles.versoDestaque}>que surgiu o desejo</span>
                  <span className={styles.versoGrande}>de compartilhar</span>
                  <span className={styles.versoGrande}>o que eu mais amo:</span>
                </div>
                
                <div className={styles.versoDestaqueBox}>
                  <span>biscoitos deliciosos,</span>
                  <span>feitos com carinho e</span>
                  <span>selecionados com todo cuidado para você!</span>
                </div>
              </div>
            </div>

            <div className={styles.versoFinal}>
              <span>Seja bem-vindo ao meu sonho,</span>
              <span>que agora também é nosso! 🍪✨</span>
            </div>

            <div className={styles.sobreNumeros}>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>9</span>
                <span className={styles.numeroLabel}>meses</span>
              </div>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>30+</span>
                <span className={styles.numeroLabel}>clientes</span>
              </div>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>50+</span>
                <span className={styles.numeroLabel}>produtos</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Imagem/Logo */}
          <div className={styles.sobreImagem}>
            <div className={styles.imageWrapper}>
              <Image 
                src="/logo.webp"
                alt="Cantinho Doce"
                width={400}
                height={400}
                className={styles.imageWrapperImg}
                priority
              />
              <div className={styles.imageLabel}>
                "Feito com amor, comido com prazer" 🤤
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========== VALORES ========== */}
      <section className={styles.valores}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Nossos Valores</span>
          <h2 className={styles.sectionTitle}>
            O que nos <span className={styles.titleHighlight}>move</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Pequenos gestos que fazem toda a diferença
          </p>
          
          <div className={styles.valoresGrid}>
            {valores.map((item, index) => (
              <div key={index} className={styles.valorCard}>
                <div className={styles.valorIcon}>{item.icone}</div>
                <h3>{item.titulo}</h3>
                <p>{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TIMELINE ========== */}
      <section className={styles.timeline}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Nossa Jornada</span>
          <h2 className={styles.sectionTitle}>
            Uma história que está <span className={styles.titleHighlight}>começando</span>
          </h2>
          
          <div className={styles.timelineGrid}>
            {timeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineIconWrapper}>
                  <div className={styles.timelineIcon}>{item.icone}</div>
                  <span className={styles.timelineData}>{item.data}</span>
                </div>
                <div className={styles.timelineCard}>
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
                {index < timeline.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MISSÃO ========== */}
      <section className={styles.missao}>
        <div className={styles.container}>
          <span className={`${styles.sectionTag} ${styles.sectionTagWhite}`}>
            Propósito
          </span>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleWhite}`}>
            Missão, Visão e <span className={styles.titleHighlight}>Valores</span>
          </h2>
          
          <div className={styles.missaoGrid}>
            <div className={styles.missaoItem}>
              <div className={styles.missaoIcon}>
                <Target size={40} />
              </div>
              <h3>Missão</h3>
              <p>Levar sabor caseiro e qualidade artesanal para a mesa dos nossos clientes.</p>
            </div>
            <div className={styles.missaoItem}>
              <div className={styles.missaoIcon}>
                <Eye size={40} />
              </div>
              <h3>Visão</h3>
              <p>Ser referência em produtos artesanais em Campo Grande, mantendo a essência caseira.</p>
            </div>
            <div className={styles.missaoItem}>
              <div className={styles.missaoIcon}>
                <HeartHandshake size={40} />
              </div>
              <h3>Valores</h3>
              <p>Amor, qualidade, atendimento próximo e respeito às receitas tradicionais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DIFERENCIAIS ========== */}
      <section className={styles.diferenciais}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Diferenciais</span>
          <h2 className={styles.sectionTitle}>
            Por que escolher o <span className={styles.titleHighlight}>Cantinho Doce</span>
          </h2>
          
          <div className={styles.diferenciaisGrid}>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}><BadgeCheck size={32} /></div>
              <div>
                <h4>Ingredientes Naturais</h4>
                <p>Selecionados com cuidado para o melhor sabor</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}><Gift size={32} /></div>
              <div>
                <h4>Receitas Caseiras</h4>
                <p>Sabores que lembram os doces da infância</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}><MessageCircle size={32} /></div>
              <div>
                <h4>Atendimento Personalizado</h4>
                <p>Cada cliente é único e especial</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}><Heart size={32} /></div>
              <div>
                <h4>Produção Sob Encomenda</h4>
                <p>Feito especialmente para você, sempre fresquinho</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <section className={styles.contato}>
        <div className={styles.container}>
          <span className={styles.sectionTag}>Contato</span>
          <h2 className={styles.sectionTitle}>
            Fale <span className={styles.titleHighlight}>Conosco</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Adoramos ouvir nossos clientes!
          </p>
          
          <div className={styles.contatoGrid}>
            <div className={styles.contatoCard}>
              <MapPin size={24} />
              <h4>Localização</h4>
              <p>Campo Grande - RJ</p>
            </div>
            <div className={styles.contatoCard}>
              <Phone size={24} />
              <h4>WhatsApp</h4>
              <p>(21) 97227-9173</p>
            </div>
            <div className={styles.contatoCard}>
              <Mail size={24} />
              <h4>Email</h4>
              <p>contato@cantinhodoce.com.br</p>
            </div>
          </div>
          
          <div className={styles.contatoWhatsapp}>
            <Link 
              href="https://wa.me/5521972279173?text=Olá!%20Visitei%20o%20site%20do%20Cantinho%20Doce%20e%20me%20interessei%20pelos%20produtos%20artesanais.%20Gostaria%20de%20saber%20mais%20informações!"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <MessageCircle size={20} />
              Fale conosco pelo WhatsApp
            </Link>
            <p className={styles.whatsappHint}>Respondemos em até 5 minutos ⏱️</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
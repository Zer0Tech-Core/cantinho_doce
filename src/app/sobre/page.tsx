// src/app/sobre/page.tsx
'use client'

import { 
  Heart, 
  Award, 
  Users, 
  Clock, 
  Coffee, 
  Cookie, 
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
  Star,
  CheckCircle,
  Flame,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './sobre.module.css'

export default function SobrePage() {
  const valores = [
    {
      icone: <Heart size={28} />,
      titulo: 'Feito com Amor',
      descricao: 'Cada receita é preparada com dedicação e ingredientes selecionados, levando sabor e carinho para sua mesa.'
    },
    {
      icone: <Award size={28} />,
      titulo: 'Qualidade Artesanal',
      descricao: 'Produzimos em pequena escala para garantir frescor e qualidade em cada produto que chega até você.'
    },
    {
      icone: <Users size={28} />,
      titulo: 'Atendimento Pessoal',
      descricao: 'Valorizamos cada cliente. Atendemos com atenção e cuidado, como se fosse da nossa própria família.'
    },
    {
      icone: <Clock size={28} />,
      titulo: 'Frescor Garantido',
      descricao: 'Nossos produtos são feitos sob encomenda, garantindo que você receba sempre o mais fresco possível.'
    }
  ]

  const timeline = [
    {
      data: 'Set 2025',
      titulo: 'O Sonho Começou',
      descricao: 'Nasceu a ideia de compartilhar receitas caseiras que faziam sucesso entre amigos e familiares.',
      icone: <Sparkles size={20} />
    },
    {
      data: 'Dez 2025',
      titulo: 'Primeiros Pedidos',
      descricao: 'Começamos a receber os primeiros pedidos de amigos e vizinhos. O boca a boca começou a funcionar!',
      icone: <MessageCircle size={20} />
    },
    {
      data: 'Mar 2026',
      titulo: 'Novos Sabores',
      descricao: 'Expandimos nosso cardápio com novas linhas: compotas, amendoins especiais e doces caseiros.',
      icone: <TrendingUp size={20} />
    },
    {
      data: 'Jun 2026',
      titulo: 'Onde Estamos Hoje',
      descricao: 'Mais de 30 clientes confiam no Cantinho Doce. Um sonho que cresce a cada dia! 🚀',
      icone: <Rocket size={20} />
    }
  ]

  return (
    <main>
      <Header />

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
          {/*<Bolinho size={120} className={styles.bannerCookie} /> */}
          <Image 
                src="/imagens/sobre/bolinho.webp"
                alt="Cantinho Doce - Nossa história"
                width={400}
                height={400}
                className={styles.imageWrapperImg}
                priority
                />
        </div>
      </section>

      {/* ========== SOBRE NÓS ========== */}
      <section className={styles.sobre}>
        <div className={styles.sobreContent}>
          <div className={styles.sobreTexto}>
            <span className={styles.sectionTag}>Nossa História</span>
            <h2 className={styles.sectionTitle}>
              Um sonho que <span className={styles.titleHighlight}>nasceu na cozinha</span>
            </h2>
            <p>
              O <strong>Cantinho Doce</strong> começou com uma paixão: fazer doces e 
              biscoitos que lembrassem os sabores da infância. O que era um hobby 
              entre amigos e familiares, se transformou em um sonho de empreender.
            </p>
            <p>
              Com receitas que foram aperfeiçoadas ao longo do tempo, decidimos 
              compartilhar nosso cantinho doce com mais pessoas. Cada produto é 
              feito com ingredientes selecionados e muito carinho.
            </p>
            <p>
              Hoje, com <strong>9 meses de história</strong> e mais de 
              <strong> 30 clientes</strong> que confiam no nosso trabalho, 
              seguimos firmes no propósito de levar sabor e alegria para sua mesa.
            </p>
            
            <div className={styles.sobreNumeros}>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>9</span>
                <span className={styles.numeroLabel}>meses de história</span>
              </div>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>30+</span>
                <span className={styles.numeroLabel}>clientes fiéis</span>
              </div>
              <div className={styles.numeroItem}>
                <span className={styles.numero}>50+</span>
                <span className={styles.numeroLabel}>produtos artesanais</span>
              </div>
            </div>
          </div>
          
        <div className={styles.sobreImagem}>
            <div className={styles.imageWrapper}>
                <Image 
                src="/logo.webp"
                alt="Cantinho Doce - Nossa história"
                width={400}
                height={400}
                className={styles.imageWrapperImg}
                priority
                />
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
              <p>
                Levar sabor caseiro e qualidade artesanal para a mesa dos nossos 
                clientes, com produtos feitos com ingredientes selecionados e muito amor.
              </p>
            </div>
            <div className={styles.missaoItem}>
              <div className={styles.missaoIcon}>
                <Eye size={40} />
              </div>
              <h3>Visão</h3>
              <p>
                Ser reconhecida em Campo Grande como referência em produtos 
                artesanais de qualidade, crescendo com consistência e mantendo 
                a essência caseira.
              </p>
            </div>
            <div className={styles.missaoItem}>
              <div className={styles.missaoIcon}>
                <HeartHandshake size={40} />
              </div>
              <h3>Valores</h3>
              <p>
                Amor pelo que fazemos, qualidade em cada detalhe, atendimento 
                próximo e respeito aos ingredientes e receitas tradicionais.
              </p>
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
              <div className={styles.diferencialIcon}>
                <BadgeCheck size={32} />
              </div>
              <div>
                <h4>Feito com Ingredientes Naturais</h4>
                <p>Selecionamos cuidadosamente cada ingrediente para garantir o melhor sabor</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}>
                <Gift size={32} />
              </div>
              <div>
                <h4>Receitas Caseiras</h4>
                <p>Sabores que lembram os doces da infância, feitos com todo carinho</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}>
                <MessageCircle size={32} />
              </div>
              <div>
                <h4>Atendimento Personalizado</h4>
                <p>Valorizamos cada cliente com atenção e cuidado especial</p>
              </div>
            </div>
            <div className={styles.diferencialItem}>
              <div className={styles.diferencialIcon}>
                <Heart size={32} />
              </div>
              <div>
                <h4>Produção Sob Encomenda</h4>
                <p>Produtos feitos especialmente para você, sempre fresquinhos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTATO ========== */}
      <section className={styles.contato}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Fale <span className={styles.titleHighlight}>Conosco</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Adoramos ouvir nossos clientes! Entre em contato conosco.
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
              href="https://wa.me/5521972279173" 
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              Faça seu pedido pelo WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
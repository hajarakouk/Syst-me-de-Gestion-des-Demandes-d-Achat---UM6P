import React, { useState, useRef, useEffect } from 'react';
import './HomePage.css';




  // Déclaration des refs et states utilisés dans les useEffect
  const sliderSectionRef = useRef();
  const [sliderVisible, setSliderVisible] = useState(false);
  const [start, setStart] = useState(0);
  const visible = 4;
  const canPrev = start > 0;
  const canNext = start + visible < schools.length;
  const handlePrev = () => canPrev && setStart(start - 1);
  const handleNext = () => canNext && setStart(start + 1);

  const [userInteracted, setUserInteracted] = useState(false);
  const autoSlideRef = useRef();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef();

  
  return (
    <div>
      {/* 1. Hero Image + Texte */}
      <section id="about" data-aos="fade-up" style={{display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '60px 40px', margin: '40px auto', maxWidth: 1200, gap: 60}}>
        <div style={{flex: 1}}>
          <img src={campusImg} alt="Campus UM6P" style={{width: '100%', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)'}} />
        </div>
        <div style={{flex: 1}}>
          <div style={{color: '#e6501e', fontWeight: 600, fontSize: 16, marginBottom: 12}}>À propos de l'UM6P</div>
          <h1 style={{fontSize: 36, fontWeight: 700, marginBottom: 20, color: '#002147'}}>L'Excellence Universitaire au Cœur de l'Afrique</h1>
          <p style={{color: '#666', fontSize: 18, lineHeight: 1.6, marginBottom: 30}}>
            L'Université Mohammed VI Polytechnique est une institution d'excellence qui forme les leaders de demain. Notre campus moderne et nos programmes innovants vous préparent aux défis du 21ème siècle.
          </p>
          <div style={{display: 'flex', gap: 20}}>
            <button style={{background: '#e6501e', color: '#fff', border: 'none', borderRadius: 25, padding: '12px 30px', fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>Découvrir nos programmes</button>
            <button style={{background: 'transparent', color: '#e6501e', border: '2px solid #e6501e', borderRadius: 25, padding: '12px 30px', fontWeight: 600, fontSize: 16, cursor: 'pointer'}}>Visiter le campus</button>
          </div>
        </div>
      </section>

      {/* 6. Diplômes & Programmes UM6P */}
      <section style={{background: '#faf8fc', padding: '60px 0', borderRadius: 24, margin: '40px auto', maxWidth: 1600}}>
        <div style={{display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'flex-start', maxWidth: 1200, margin: '0 auto'}}>
          {/* Bloc orange UM6P à gauche */}
          <div data-aos="fade-right" className="animated-gradient-bg" style={{borderRadius: 18, boxShadow: '0 8px 32px rgba(230,80,30,0.10)', color: '#fff', padding: '40px 32px', minWidth: 320, maxWidth: 340, flex: '0 0 340px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{fontWeight: 700, fontSize: 22, marginBottom: 32, letterSpacing: 1, color: '#fff !important'}}>Diplômes UM6P</div>
            <div style={{marginBottom: 26}}>
              <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>Licence</div>
              <div style={{fontSize: 14, opacity: 0.90, color: '#fff'}}>Formations scientifiques, techniques et de gestion, adaptées aux enjeux africains et mondiaux.</div>
            </div>
            <div style={{marginBottom: 26}}>
              <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>Master</div>
              <div style={{fontSize: 14, opacity: 0.90, color: '#fff'}}>Programmes d’excellence en ingénierie, management, data science, éducation, etc.</div>
            </div>
            <div style={{marginBottom: 26}}>
              <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>Doctorat</div>
              <div style={{fontSize: 14, opacity: 0.90, color: '#fff'}}>Recherche et innovation dans les domaines stratégiques pour l’Afrique et le monde.</div>
            </div>
            <div style={{marginBottom: 26}}>
              <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>Certification</div>
              <div style={{fontSize: 14, opacity: 0.90, color: '#fff'}}>Certificats UM6P pour renforcer vos compétences professionnelles et techniques.</div>
            </div>
            <div>
              <div style={{fontWeight: 600, fontSize: 17, color: '#fff'}}>Mineur</div>
              <div style={{fontSize: 14, opacity: 0.90, color: '#fff'}}>Parcours complémentaires pour enrichir votre profil académique à l’UM6P.</div>
            </div>
          </div>
          
          {/* Programmes UM6P à droite */}
          <div data-aos="fade-left" style={{flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 4px 16px rgba(0,33,71,0.06)', padding: '36px 32px 32px 32px', minHeight: 420}}>
            <div style={{fontWeight: 700, fontSize: 28, color: '#002147', marginBottom: 6, letterSpacing: 0.5}}>Filières & Instituts UM6P</div>
            <div style={{width: 48, height: 4, background: '#e6501e', borderRadius: 2, marginBottom: 22}}></div>
            <div style={{color: '#444', fontSize: 16, marginBottom: 32, maxWidth: 600}}>
              UM6P propose une offre académique unique,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           axée sur l’innovation, la recherche et l’impact en Afrique et dans le monde.
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32}}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-microchip icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>Institut des Sciences et Technologies Digitales (IADT)</div>
                  <div style={{fontSize: 14, color: '#444'}}>Intelligence artificielle, data science, cybersécurité, transformation digitale.</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-users icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>FGSES</div>
                  <div style={{fontSize: 14, color: '#444'}}>Sciences économiques, sociales, politiques et de gestion.</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-flask icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>Sciences & Ingénierie</div>
                  <div style={{fontSize: 14, color: '#444'}}>Chimie, biologie, mathématiques, génie civil, industriel, électrique, etc.</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-brain icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>School of Collective Intelligence</div>
                  <div style={{fontSize: 14, color: '#444'}}>Intelligence collective, innovation, sciences cognitives et sociales.</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-scale-balanced icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>Droit & Gouvernance</div>
                  <div style={{fontSize: 14, color: '#444'}}>Droit des affaires, droit international, gouvernance publique et privée.</div>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <i className="fa-solid fa-seedling icon-gradient-animated" style={{fontSize: 22, marginTop: 2}}></i>
                <div>
                  <div style={{fontWeight: 600, fontSize: 17, color: '#002147'}}>Sciences Agronomiques & Environnement</div>
                  <div style={{fontSize: 14, color: '#444'}}>Agroécologie, environnement, développement durable, innovation agricole.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Chiffres Clés moderne */}
      <section className="stats-modern-section" data-aos="fade-up">
        <div className="stats-modern-container">
          <div className="stats-modern-left">
            <h2 className="stats-modern-title">Chiffres Clés</h2>
            <p className="stats-modern-desc">Chiffres Clés</p>
          </div>
          <div className="stats-modern-list">
            <div className="stats-modern-item gradient-animated">
              <div className="stats-modern-number">
                <i className="fa-solid fa-user-graduate" style={{color: '#e6501e', marginRight: 8}}></i>
                <CountUp end={7229} duration={2.5} />
              </div>
              <div className="stats-modern-label">Etudiants</div>
            </div>
            <div className="stats-modern-item gradient-animated">
              <div className="stats-modern-number">
                <i className="fa-solid fa-book" style={{color: '#e6501e', marginRight: 8}}></i>
                <CountUp end={42} duration={2.5} />
              </div>
              <div className="stats-modern-label">Programmes</div>
            </div>
            <div className="stats-modern-item gradient-animated">
              <div className="stats-modern-number">
                <i className="fa-solid fa-user-tie" style={{color: '#e6501e', marginRight: 8}}></i>
                <CountUp end={995} duration={2.5} />
              </div>
              <div className="stats-modern-label">Doctorants</div>
            </div>
            <div className="stats-modern-item gradient-animated">
              <div className="stats-modern-number">
                <i className="fa-solid fa-exchange-alt" style={{color: '#e6501e', marginRight: 8}}></i>
                <CountUp end={130} duration={2.5} />
              </div>
              <div className="stats-modern-label">Etudiants en échange</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );


export default About;
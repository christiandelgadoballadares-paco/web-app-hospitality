import { useState, useEffect, useRef } from 'react';
import { translations, scenarios, getLevelXP, type Lang, type ProfileId, type LevelId, type FeedbackData } from './data';
import { ALL_BADGES, checkNewBadges, type BadgeState } from './badges';
import './index.css';

type Screen = 'register' | 'profile' | 'level' | 'mission' | 'feedback';

interface Participant { nombre: string; correo: string; bp: string; }

const PILLAR_KEYS = ['anticipacion', 'autenticidad', 'sorpresa'] as const;
const PILLAR_COLORS = {
  anticipacion: { fill:'linear-gradient(90deg,#005f73,#00b4d8)', text:'#00b4d8', bg:'rgba(0,180,216,0.08)', border:'rgba(0,180,216,0.25)' },
  autenticidad: { fill:'linear-gradient(90deg,#7a6030,#c9a84c)', text:'#c9a84c', bg:'rgba(201,168,76,0.08)', border:'rgba(201,168,76,0.25)' },
  sorpresa:     { fill:'linear-gradient(90deg,#6d28d9,#a78bfa)', text:'#a78bfa', bg:'rgba(167,139,250,0.08)', border:'rgba(167,139,250,0.25)' },
};

const REG_TEXT = {
  es: { welcome:'Bienvenido a', subtitle:'Ingresa tus datos para comenzar', nombre:'Nombre completo', correo:'Correo corporativo', bp:'BP (código numérico)', nombrePh:'Ej: María González', correoPh:'Ej: maria.gonzalez@latam.com', bpPh:'Ej: 1234567', btnStart:'Comenzar entrenamiento ✦', errNombre:'Ingresa tu nombre completo', errCorreo:'Ingresa un correo corporativo válido', errBp:'El BP debe contener solo números', greeting:'Hola,', badgesTitle:'Mis Insignias', badgesEmpty:'Completa misiones para desbloquear insignias', badgesBtn:'Ver Insignias', closeBtn:'Cerrar', newBadge:'¡Nueva insignia desbloqueada!', catPerfil:'Perfil', catCalidad:'Calidad', catProgresion:'Progresión', locked:'Bloqueada' },
  pt: { welcome:'Bem-vindo ao', subtitle:'Insira seus dados para começar', nombre:'Nome completo', correo:'E-mail corporativo', bp:'BP (código numérico)', nombrePh:'Ex: Maria González', correoPh:'Ex: maria.gonzalez@latam.com', bpPh:'Ex: 1234567', btnStart:'Iniciar treinamento ✦', errNombre:'Insira seu nome completo', errCorreo:'Insira um e-mail corporativo válido', errBp:'O BP deve conter apenas números', greeting:'Olá,', badgesTitle:'Minhas Insígnias', badgesEmpty:'Conclua missões para desbloquear insígnias', badgesBtn:'Ver Insígnias', closeBtn:'Fechar', newBadge:'Nova insígnia desbloqueada!', catPerfil:'Perfil', catCalidad:'Qualidade', catProgresion:'Progressão', locked:'Bloqueada' },
};

function initBadgeState(): BadgeState {
  return { earned: new Set(), missionsByProfile: { cabin:0, airport:0, contact:0 }, bestStreak:0, totalXP:0, perfectMissions:0 };
}

function BgLayer() {
  return (
    <>
      <div style={{position:'fixed',inset:0,zIndex:0,background:'radial-gradient(ellipse at 20% 50%, #112240 0%, #0a1628 60%, #060e1a 100%)'}}/>
      <div style={{position:'fixed',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#c9a84c,transparent)',opacity:0.35,zIndex:1}}/>
    </>
  );
}

function InputField({ label, placeholder, value, onChange, type='text', error }: { label:string; placeholder:string; value:string; onChange:(v:string)=>void; type?:string; error?:string; }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{marginBottom:18}}>
      <label style={{display:'block',fontSize:11,color:'#8899aa',letterSpacing:1.5,textTransform:'uppercase' as const,fontWeight:600,marginBottom:8}}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        style={{width:'100%',background:'rgba(10,22,40,0.7)',border:`1px solid ${error?'#ef4444':focused?'#c9a84c':'rgba(201,168,76,0.22)'}`,borderRadius:12,padding:'13px 16px',color:'#f0f4f8',fontFamily:'DM Sans,sans-serif',fontSize:14,outline:'none',transition:'border-color 0.2s'}}/>
      {error && <p style={{fontSize:12,color:'#ef4444',marginTop:5}}>⚠ {error}</p>}
    </div>
  );
}

// Badge toast notification
function BadgeToast({ badgeIds, lang, onDone }: { badgeIds: string[]; lang: Lang; onDone: ()=>void }) {
  const [visible, setVisible] = useState(true);
  const [idx, setIdx] = useState(0);
  const rtx = REG_TEXT[lang];
  const badge = ALL_BADGES.find(b => b.id === badgeIds[idx]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (idx < badgeIds.length - 1) { setIdx(i => i+1); }
      else { setVisible(false); onDone(); }
    }, 2800);
    return () => clearTimeout(t);
  }, [idx, visible]);

  if (!visible || !badge) return null;
  return (
    <div style={{position:'fixed',top:24,left:'50%',transform:'translateX(-50%)',zIndex:1000,animation:'fadeInUp 0.4s ease',maxWidth:340,width:'90%'}}>
      <div style={{background:'rgba(17,34,64,0.97)',border:`1px solid ${badge.color}`,borderRadius:16,padding:'16px 20px',backdropFilter:'blur(20px)',boxShadow:`0 0 30px ${badge.color}40`}}>
        <div style={{fontSize:11,color:badge.color,letterSpacing:1.5,textTransform:'uppercase' as const,fontWeight:600,marginBottom:6}}>✦ {rtx.newBadge}</div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{fontSize:32,width:48,height:48,borderRadius:12,background:`${badge.color}18`,border:`1px solid ${badge.color}44`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{badge.icon}</div>
          <div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,marginBottom:3}}>{badge.name[lang]}</div>
            <div style={{fontSize:12,color:'#8899aa'}}>{badge.desc[lang]}</div>
          </div>
        </div>
        {badgeIds.length > 1 && <div style={{fontSize:11,color:'#8899aa',marginTop:10,textAlign:'center' as const}}>{idx+1} / {badgeIds.length}</div>}
      </div>
    </div>
  );
}

// Badge panel modal
function BadgePanel({ lang, badgeState, onClose }: { lang: Lang; badgeState: BadgeState; onClose: ()=>void }) {
  const rtx = REG_TEXT[lang];
  const categories = [
    { key:'perfil', label:rtx.catPerfil, badges: ALL_BADGES.filter(b=>b.category==='perfil') },
    { key:'calidad', label:rtx.catCalidad, badges: ALL_BADGES.filter(b=>b.category==='calidad') },
    { key:'progresion', label:rtx.catProgresion, badges: ALL_BADGES.filter(b=>b.category==='progresion') },
  ];
  return (
    <div style={{position:'fixed',inset:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{position:'absolute',inset:0,background:'rgba(6,14,26,0.85)',backdropFilter:'blur(8px)'}}/>
      <div style={{position:'relative',zIndex:1,background:'rgba(17,34,64,0.97)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:24,padding:'28px 24px',width:'100%',maxWidth:560,maxHeight:'80vh',overflowY:'auto' as const,animation:'fadeInUp 0.3s ease'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:18,fontWeight:800}}>✦ {rtx.badgesTitle}</div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#8899aa',fontSize:20,cursor:'pointer',padding:0,lineHeight:1}}>×</button>
        </div>
        {categories.map(cat => (
          <div key={cat.key} style={{marginBottom:24}}>
            <div style={{fontSize:11,color:'#8899aa',letterSpacing:1.5,textTransform:'uppercase' as const,fontWeight:600,marginBottom:12}}>{cat.label}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {cat.badges.map(badge => {
                const earned = badgeState.earned.has(badge.id);
                return (
                  <div key={badge.id} style={{background:earned?`${badge.color}12`:'rgba(10,22,40,0.5)',border:`1px solid ${earned?badge.color:'rgba(136,153,170,0.15)'}`,borderRadius:14,padding:'14px 10px',textAlign:'center' as const,transition:'all 0.2s',opacity:earned?1:0.45}}>
                    <div style={{fontSize:28,marginBottom:8,filter:earned?'none':'grayscale(1)'}}>{badge.icon}</div>
                    <div style={{fontFamily:'Syne,sans-serif',fontSize:11,fontWeight:700,lineHeight:1.3,color:earned?badge.color:'#8899aa',marginBottom:4}}>{badge.name[lang]}</div>
                    <div style={{fontSize:10,color:'#8899aa',lineHeight:1.4}}>{earned ? badge.desc[lang] : rtx.locked}</div>
                    {earned && <div style={{width:8,height:8,borderRadius:'50%',background:badge.color,margin:'8px auto 0',boxShadow:`0 0 6px ${badge.color}`}}/>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [screen, setScreen] = useState<Screen>('register');
  const [participant, setParticipant] = useState<Participant>({nombre:'',correo:'',bp:''});
  const [regErrors, setRegErrors] = useState<Partial<Record<keyof Participant,string>>>({});
  const [profile, setProfile] = useState<ProfileId|null>(null);
  const [level, setLevel] = useState<LevelId|null>(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData|null>(null);
  const [animateBars, setAnimateBars] = useState(false);
  const [xpDelta, setXpDelta] = useState(0);
  const [badgeState, setBadgeState] = useState<BadgeState>(initBadgeState);
  const [toastBadges, setToastBadges] = useState<string[]>([]);
  const [showBadgePanel, setShowBadgePanel] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const tx = translations[lang];
  const rtx = REG_TEXT[lang];

  useEffect(() => {
    if (screen==='mission') { setResponse(''); setAnimateBars(false); }
    if (screen==='feedback') { setTimeout(()=>setAnimateBars(true), 200); }
  }, [screen, scenarioIdx]);

  const xpPct = Math.min((xp/1000)*100, 100);
  const currentScenario = profile && level ? scenarios[lang][profile][level][scenarioIdx % scenarios[lang][profile][level].length] : null;
  const earnedCount = badgeState.earned.size;

  function validateAndStart() {
    const errs: Partial<Record<keyof Participant,string>> = {};
    if (!participant.nombre.trim() || participant.nombre.trim().length<3) errs.nombre=rtx.errNombre;
    if (!participant.correo.trim() || !participant.correo.includes('@') || !participant.correo.toLowerCase().includes('latam')) errs.correo=rtx.errCorreo;
    if (!participant.bp.trim() || !/^\d+$/.test(participant.bp.trim())) errs.bp=rtx.errBp;
    setRegErrors(errs);
    if (Object.keys(errs).length===0) setScreen('profile');
  }

  async function submitResponse() {
    if (!response.trim() || response.trim().length<10 || !profile || !level || !currentScenario) return;
    setLoading(true);
    const profileName = tx.profiles.find(p=>p.id===profile)?.name||profile;
    const levelName = tx.levels.find(l=>l.id===level)?.name||level;
    const systemPrompt = `Eres evaluador experto en hospitalidad de LATAM Airlines. Los tres pilares son:
1. Anticipación: prever necesidades antes de que el pasajero las exprese
2. Autenticidad: respuesta humana, empática, genuina
3. Sorpresa: superar expectativas de manera inesperada y positiva
Evalúa al colaborador "${participant.nombre}" en el rol "${profileName}" (nivel ${levelName}).
Responde ÚNICAMENTE con JSON válido, sin texto adicional ni backticks:
{"scores":{"anticipacion":[0-100],"autenticidad":[0-100],"sorpresa":[0-100]},"comments":{"anticipacion":"frase breve","autenticidad":"frase breve","sorpresa":"frase breve"},"mejora":"sugerencia concreta 2-3 líneas"}
Idioma: ${lang==='es'?'español':'português brasileiro'}. NUNCA uses la palabra incorrecto.`;
    try {
      const res = await fetch('/api/evaluate', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ system: systemPrompt, userMessage: `Escenario: ${currentScenario.situation}\n\nRespuesta del colaborador: ${response}` })
      });
      const data = await res.json();
      const raw = data.content[0].text.replace(/```json|```/g,'').trim();
      const fb: FeedbackData = JSON.parse(raw);
      const gained = getLevelXP(level);
      const avg = (fb.scores.anticipacion+fb.scores.autenticidad+fb.scores.sorpresa)/3;
      const newStreak = avg>=60 ? streak+1 : 0;
      const newXP = xp+gained;

      // Update badge state
      const nextState: BadgeState = {
        earned: new Set(badgeState.earned),
        missionsByProfile: { ...badgeState.missionsByProfile, [profile]: (badgeState.missionsByProfile[profile]||0)+1 },
        bestStreak: Math.max(badgeState.bestStreak, newStreak),
        totalXP: newXP,
        perfectMissions: badgeState.perfectMissions + (fb.scores.anticipacion>=80&&fb.scores.autenticidad>=80&&fb.scores.sorpresa>=80?1:0),
      };
      const newBadges = checkNewBadges(badgeState, nextState, profile, fb.scores, newStreak, newXP);

      setFeedback(fb); setXp(newXP); setXpDelta(gained); setStreak(newStreak);
      setBadgeState(nextState);
      if (newBadges.length>0) setToastBadges(newBadges);
      setScreen('feedback');
    } catch(e) { alert(tx.errorMsg); }
    finally { setLoading(false); }
  }

  const cardStyle = { background:'rgba(17,34,64,0.85)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:20, backdropFilter:'blur(12px)' as const };

  return (
    <div style={{minHeight:'100vh',position:'relative'}}>
      <BgLayer/>
      {toastBadges.length>0 && <BadgeToast badgeIds={toastBadges} lang={lang} onDone={()=>setToastBadges([])}/>}
      {showBadgePanel && <BadgePanel lang={lang} badgeState={badgeState} onClose={()=>setShowBadgePanel(false)}/>}

      <div style={{position:'relative',zIndex:2,maxWidth:840,margin:'0 auto',padding:'0 20px 80px'}}>

        {/* HEADER */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 0 20px',borderBottom:'1px solid rgba(201,168,76,0.18)',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:42,height:42,background:'linear-gradient(135deg,#c9a84c,#7a6030)',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>✦</div>
            <div>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:20,fontWeight:800,letterSpacing:-0.5}}>Protocolo <span style={{color:'#c9a84c'}}>H</span></div>
              <div style={{fontSize:11,color:'#8899aa',letterSpacing:2,textTransform:'uppercase' as const}}>LATAM Experience Lab</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {screen!=='register' && (
              <button onClick={()=>setShowBadgePanel(true)} style={{display:'flex',alignItems:'center',gap:6,background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:9,padding:'6px 12px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,color:'#c9a84c',fontWeight:600,transition:'all 0.2s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.18)'}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.1)'}>
                🏅 {rtx.badgesBtn} {earnedCount>0 && <span style={{background:'#c9a84c',color:'#0a1628',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800}}>{earnedCount}</span>}
              </button>
            )}
            <div style={{display:'flex',gap:4,background:'rgba(17,34,64,0.9)',borderRadius:9,padding:4}}>
              {(['es','pt'] as Lang[]).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{padding:'6px 14px',border:'none',borderRadius:6,cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:12,fontWeight:600,transition:'all 0.2s',background:lang===l?'#c9a84c':'transparent',color:lang===l?'#0a1628':'#8899aa'}}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>

        {/* XP BAR */}
        {screen!=='register' && (
          <div style={{...cardStyle,borderRadius:16,padding:'14px 22px',display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
            <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#1a3a5c,#005f73)',border:'1px solid rgba(0,180,216,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#f0f4f8'}}>{participant.nombre.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:'#f0f4f8',lineHeight:1}}>{participant.nombre.split(' ')[0]}</div>
                <div style={{fontSize:10,color:'#8899aa',marginTop:2}}>BP {participant.bp}</div>
              </div>
            </div>
            <div style={{width:1,height:28,background:'rgba(201,168,76,0.15)',flexShrink:0}}/>
            <div style={{fontSize:11,color:'#8899aa',textTransform:'uppercase' as const,letterSpacing:1.5,whiteSpace:'nowrap' as const}}>{tx.reputacion}</div>
            <div style={{flex:1,height:6,background:'rgba(26,58,92,0.8)',borderRadius:99,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:99,background:'linear-gradient(90deg,#7a6030,#c9a84c)',width:`${xpPct}%`,transition:'width 0.9s cubic-bezier(0.34,1.56,0.64,1)'}}/>
            </div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#c9a84c',whiteSpace:'nowrap' as const}}>{xp} XP</div>
            {streak>0 && <div style={{display:'flex',alignItems:'center',gap:5,background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:20,padding:'3px 10px',fontSize:12,color:'#c9a84c',whiteSpace:'nowrap' as const}}>🔥 {streak}</div>}
          </div>
        )}

        {/* REGISTER */}
        {screen==='register' && (
          <div className="animate-in" style={{maxWidth:480,margin:'0 auto'}}>
            <div style={{textAlign:'center' as const,marginBottom:36}}>
              <div style={{fontSize:48,marginBottom:16}}>✦</div>
              <h1 style={{fontFamily:'Syne,sans-serif',fontSize:26,fontWeight:800,lineHeight:1.2,marginBottom:8}}>{rtx.welcome} <span style={{color:'#c9a84c'}}>Protocolo H</span></h1>
              <p style={{color:'#8899aa',fontSize:14}}>{rtx.subtitle}</p>
            </div>
            <div style={{...cardStyle,padding:'32px 28px'}}>
              <InputField label={rtx.nombre} placeholder={rtx.nombrePh} value={participant.nombre} onChange={v=>setParticipant(p=>({...p,nombre:v}))} error={regErrors.nombre}/>
              <InputField label={rtx.correo} placeholder={rtx.correoPh} value={participant.correo} onChange={v=>setParticipant(p=>({...p,correo:v}))} type="email" error={regErrors.correo}/>
              <InputField label={rtx.bp} placeholder={rtx.bpPh} value={participant.bp} onChange={v=>setParticipant(p=>({...p,bp:v.replace(/\D/g,'')}))} error={regErrors.bp}/>
              <button onClick={validateAndStart} style={{width:'100%',padding:15,border:'none',borderRadius:14,background:'linear-gradient(135deg,#7a6030,#c9a84c)',color:'#0a1628',fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,cursor:'pointer',transition:'all 0.25s',marginTop:8}}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLButtonElement).style.boxShadow='0 8px 24px rgba(201,168,76,0.3)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';(e.currentTarget as HTMLButtonElement).style.boxShadow='none';}}>
                {rtx.btnStart}
              </button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen==='profile' && (
          <div className="animate-in">
            <div style={{marginBottom:24}}><span style={{fontSize:14,color:'#8899aa'}}>{rtx.greeting} </span><span style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700}}>{participant.nombre.split(' ')[0]}</span></div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,lineHeight:1.2,marginBottom:6}}>{tx.selectProfile[0]} <span style={{color:'#c9a84c'}}>{tx.selectProfile[1]}</span></h1>
            <p style={{color:'#8899aa',fontSize:14,marginBottom:28}}>{tx.profileSub}</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {tx.profiles.map(p=>(
                <button key={p.id} onClick={()=>{setProfile(p.id);setScreen('level');}} style={{...cardStyle,padding:'28px 18px',textAlign:'center' as const,cursor:'pointer',transition:'all 0.25s',color:'inherit',fontFamily:'inherit',display:'block',width:'100%',position:'relative' as const}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#c9a84c';(e.currentTarget as HTMLButtonElement).style.transform='translateY(-4px)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,168,76,0.18)';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';}}>
                  {badgeState.missionsByProfile[p.id]>0 && (
                    <div style={{position:'absolute' as const,top:12,right:12,background:'rgba(201,168,76,0.15)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:20,padding:'2px 8px',fontSize:10,color:'#c9a84c',fontWeight:600}}>{badgeState.missionsByProfile[p.id]}✓</div>
                  )}
                  <div style={{fontSize:40,marginBottom:14}}>{p.icon}</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:14,fontWeight:700,marginBottom:6}}>{p.name}</div>
                  <div style={{fontSize:12,color:'#8899aa',lineHeight:1.4}}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL */}
        {screen==='level' && (
          <div className="animate-in">
            <button onClick={()=>setScreen('profile')} style={{background:'none',border:'none',color:'#8899aa',fontSize:13,cursor:'pointer',padding:0,fontFamily:'DM Sans,sans-serif',marginBottom:20,display:'block'}}>{tx.changeProfile}</button>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,lineHeight:1.2,marginBottom:6}}>{tx.selectLevel[0]} <span style={{color:'#c9a84c'}}>{tx.selectLevel[1]}</span></h1>
            <p style={{color:'#8899aa',fontSize:14,marginBottom:28}}>{tx.levelSub}</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {tx.levels.map(l=>(
                <button key={l.id} onClick={()=>{setLevel(l.id);setScenarioIdx(Math.floor(Math.random()*99));setScreen('mission');}} style={{...cardStyle,borderRadius:18,padding:'22px 16px',textAlign:'center' as const,cursor:'pointer',transition:'all 0.25s',color:'inherit',fontFamily:'inherit',display:'block',width:'100%'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=l.color;(e.currentTarget as HTMLButtonElement).style.transform='translateY(-3px)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='rgba(201,168,76,0.18)';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:l.color,margin:'0 auto 14px'}}/>
                  <div style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700,marginBottom:8}}>{l.name}</div>
                  <div style={{fontSize:12,color:'#8899aa',lineHeight:1.5,marginBottom:10}}>{l.desc}</div>
                  <div style={{fontSize:11,color:'#00b4d8',fontWeight:600,marginBottom:4}}>{l.xpLabel}</div>
                  <div style={{fontSize:10,color:'#8899aa',background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'3px 8px',display:'inline-block'}}>{l.courseTag}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MISSION */}
        {screen==='mission' && currentScenario && profile && level && (
          <div className="animate-in">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <button onClick={()=>setScreen('level')} style={{background:'none',border:'none',color:'#8899aa',fontSize:13,cursor:'pointer',padding:0,fontFamily:'DM Sans,sans-serif'}}>{tx.backToLevels}</button>
              <div style={{display:'flex',gap:8}}>
                <span style={{background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:8,padding:'4px 12px',fontSize:11,color:'#c9a84c',letterSpacing:1.5,textTransform:'uppercase' as const,fontWeight:600}}>{tx.missionTitle}</span>
                <span style={{background:'rgba(0,180,216,0.08)',border:'1px solid rgba(0,180,216,0.25)',borderRadius:8,padding:'4px 12px',fontSize:11,color:'#00b4d8',fontWeight:600}}>{tx.levels.find(l2=>l2.id===level)?.name}</span>
              </div>
            </div>
            <div style={{...cardStyle,padding:28,marginBottom:18,position:'relative' as const,overflow:'hidden'}}>
              <div style={{position:'absolute' as const,top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#c9a84c,#00b4d8)'}}/>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:46,height:46,borderRadius:'50%',flexShrink:0,background:'linear-gradient(135deg,#1a3a5c,#005f73)',border:'2px solid rgba(0,180,216,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{currentScenario.emoji}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>{currentScenario.pax}</div>
                  <span style={{fontSize:11,padding:'2px 9px',borderRadius:20,background:'rgba(245,158,11,0.12)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.25)',fontWeight:500}}>⚡ {currentScenario.emotion}</span>
                </div>
              </div>
              <div style={{fontSize:15,lineHeight:1.75,color:'#c8d8e8',borderLeft:'3px solid rgba(201,168,76,0.4)',paddingLeft:16,fontStyle:'italic' as const}}>{currentScenario.situation}</div>
              <div style={{display:'flex',gap:8,marginTop:18,flexWrap:'wrap' as const}}>
                {PILLAR_KEYS.map((p,i)=>(
                  <span key={p} style={{fontSize:11,padding:'4px 10px',borderRadius:20,border:`1px solid ${PILLAR_COLORS[p].border}`,color:PILLAR_COLORS[p].text,background:PILLAR_COLORS[p].bg,fontWeight:500}}>✦ {tx.pilares[i]}</span>
                ))}
              </div>
            </div>
            <div style={{...cardStyle,borderRadius:18,padding:22,marginBottom:14}}>
              <div style={{fontSize:11,color:'#8899aa',letterSpacing:1.5,textTransform:'uppercase' as const,marginBottom:12,fontWeight:600}}>{tx.yourResponse}</div>
              <textarea ref={textRef} value={response} onChange={e=>setResponse(e.target.value)} placeholder={tx.responsePlaceholder} rows={5}
                style={{width:'100%',background:'rgba(10,22,40,0.7)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:12,padding:16,color:'#f0f4f8',fontFamily:'DM Sans,sans-serif',fontSize:14,lineHeight:1.65,resize:'none' as const,outline:'none',transition:'border-color 0.2s'}}
                onFocus={e=>e.target.style.borderColor='#c9a84c'} onBlur={e=>e.target.style.borderColor='rgba(201,168,76,0.2)'}/>
            </div>
            <button onClick={submitResponse} disabled={loading||response.trim().length<10}
              style={{width:'100%',padding:16,border:'none',borderRadius:14,background:loading||response.trim().length<10?'rgba(201,168,76,0.3)':'linear-gradient(135deg,#7a6030,#c9a84c)',color:loading||response.trim().length<10?'#8899aa':'#0a1628',fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,cursor:loading||response.trim().length<10?'not-allowed':'pointer',transition:'all 0.25s',letterSpacing:0.5}}
              onMouseEnter={e=>{if(!loading&&response.trim().length>=10)(e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';}}>
              {loading?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}><span className="spinner" style={{width:18,height:18,border:'2px solid rgba(10,22,40,0.3)',borderTopColor:'#0a1628',borderRadius:'50%',display:'inline-block'}}/>{tx.evaluating}</span>:tx.submitBtn}
            </button>
          </div>
        )}

        {/* FEEDBACK */}
        {screen==='feedback' && feedback && level && (
          <div className="animate-in">
            <div style={{background:'rgba(34,197,94,0.07)',border:'1px solid rgba(34,197,94,0.22)',borderRadius:14,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
              <span style={{fontSize:13,color:'#22c55e',fontWeight:500}}>✦ {tx.xpGained}</span>
              <span style={{fontFamily:'Syne,sans-serif',fontSize:24,fontWeight:800,color:'#22c55e'}}>+{xpDelta} XP</span>
            </div>
            <div style={{...cardStyle,padding:28,marginBottom:16}}>
              <div style={{fontFamily:'Syne,sans-serif',fontSize:16,fontWeight:700,marginBottom:22}}>✦ {tx.feedbackTitle}</div>
              {PILLAR_KEYS.map((p,i)=>{
                const score=feedback.scores[p]; const comment=feedback.comments[p]; const col=PILLAR_COLORS[p];
                const scoreColor=score>=70?'#22c55e':score>=40?'#f59e0b':'#ef4444';
                return (
                  <div key={p} style={{marginBottom:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                      <span style={{fontSize:12,fontWeight:600,letterSpacing:1,textTransform:'uppercase' as const,color:col.text}}>{['🔵','⭐','✨'][i]} {tx.pilares[i]}</span>
                      <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:scoreColor}}>{score}%</span>
                    </div>
                    <div style={{height:8,background:'rgba(240,244,248,0.07)',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:99,background:col.fill,transition:'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',width:animateBars?`${score}%`:'0%'}}/>
                    </div>
                    {comment&&<p style={{fontSize:13,color:'#a0b4c8',marginTop:6,lineHeight:1.55}}>{comment}</p>}
                  </div>
                );
              })}
              {feedback.mejora&&(
                <div style={{background:'rgba(0,180,216,0.05)',border:'1px solid rgba(0,180,216,0.18)',borderRadius:14,padding:18,marginTop:8}}>
                  <div style={{fontSize:11,color:'#00b4d8',letterSpacing:1.5,textTransform:'uppercase' as const,fontWeight:600,marginBottom:8}}>💡 {tx.mejoraLabel}</div>
                  <p style={{fontSize:13,color:'#c8d8e8',lineHeight:1.65}}>{feedback.mejora}</p>
                </div>
              )}
            </div>
            {/* Badges earned in this mission preview */}
            {earnedCount>0&&(
              <button onClick={()=>setShowBadgePanel(true)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:12,padding:'12px 16px',cursor:'pointer',fontFamily:'DM Sans,sans-serif',fontSize:13,color:'#c9a84c',marginBottom:14,transition:'all 0.2s'}}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.12)'}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.06)'}>
                🏅 {rtx.badgesBtn} · <strong>{earnedCount}</strong> {lang==='es'?'desbloqueada'+(earnedCount!==1?'s':''):'desbloqueada'+(earnedCount!==1?'s':'')}
              </button>
            )}
            <button onClick={()=>{setScenarioIdx(i=>i+1);setFeedback(null);setScreen('mission');}} style={{width:'100%',padding:16,border:'1px solid rgba(201,168,76,0.4)',borderRadius:14,background:'transparent',color:'#c9a84c',fontFamily:'Syne,sans-serif',fontSize:15,fontWeight:700,cursor:'pointer',transition:'all 0.25s',marginBottom:12}}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='rgba(201,168,76,0.08)';(e.currentTarget as HTMLButtonElement).style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.transform='translateY(0)';}}>
              {tx.nextMission}
            </button>
            <button onClick={()=>{setScreen('profile');setFeedback(null);}} style={{background:'none',border:'none',color:'#8899aa',fontSize:13,cursor:'pointer',padding:0,fontFamily:'DM Sans,sans-serif',display:'block',margin:'0 auto'}}>{tx.backToMenu}</button>
          </div>
        )}
      </div>
    </div>
  );
}

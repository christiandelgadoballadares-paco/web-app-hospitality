import type { ProfileId, LevelId } from './data';

export interface Badge {
  id: string;
  icon: string;
  name: { es: string; pt: string };
  desc: { es: string; pt: string };
  category: 'perfil' | 'calidad' | 'progresion';
  tier?: 'bronce' | 'plata';
  color: string;
}

export interface BadgeState {
  earned: Set<string>;
  missionsByProfile: Record<ProfileId, number>;
  bestStreak: number;
  totalXP: number;
  perfectMissions: number; // missions with all 3 pillars >= 80
}

export const ALL_BADGES: Badge[] = [
  // ── PERFIL: CABINA ──
  {
    id: 'cabin_bronze', icon: '✈️', category: 'perfil', tier: 'bronce', color: '#cd7f32',
    name: { es: 'Alas de Cabina — Bronce', pt: 'Asas de Cabine — Bronze' },
    desc: { es: '3 misiones de Tripulante completadas', pt: '3 missões de Tripulante concluídas' }
  },
  {
    id: 'cabin_silver', icon: '✈️', category: 'perfil', tier: 'plata', color: '#c0c0c0',
    name: { es: 'Alas de Cabina — Plata', pt: 'Asas de Cabine — Prata' },
    desc: { es: '10 misiones de Tripulante completadas', pt: '10 missões de Tripulante concluídas' }
  },
  // ── PERFIL: AEROPUERTO ──
  {
    id: 'airport_bronze', icon: '🏢', category: 'perfil', tier: 'bronce', color: '#cd7f32',
    name: { es: 'Torre de Aeropuerto — Bronce', pt: 'Torre do Aeroporto — Bronze' },
    desc: { es: '3 misiones de Agente Aeropuerto completadas', pt: '3 missões de Agente Aeroporto concluídas' }
  },
  {
    id: 'airport_silver', icon: '🏢', category: 'perfil', tier: 'plata', color: '#c0c0c0',
    name: { es: 'Torre de Aeropuerto — Plata', pt: 'Torre do Aeroporto — Prata' },
    desc: { es: '10 misiones de Agente Aeropuerto completadas', pt: '10 missões de Agente Aeroporto concluídas' }
  },
  // ── PERFIL: CONTACT CENTER ──
  {
    id: 'contact_bronze', icon: '🎧', category: 'perfil', tier: 'bronce', color: '#cd7f32',
    name: { es: 'Auricular Contact — Bronce', pt: 'Fone Contact — Bronze' },
    desc: { es: '3 misiones de Contact Center completadas', pt: '3 missões de Contact Center concluídas' }
  },
  {
    id: 'contact_silver', icon: '🎧', category: 'perfil', tier: 'plata', color: '#c0c0c0',
    name: { es: 'Auricular Contact — Plata', pt: 'Fone Contact — Prata' },
    desc: { es: '10 misiones de Contact Center completadas', pt: '10 missões de Contact Center concluídas' }
  },
  // ── CALIDAD: RACHA ──
  {
    id: 'zona_h', icon: '🔥', category: 'calidad', color: '#f59e0b',
    name: { es: 'Zona Hospitalaria', pt: 'Zona Hospitality' },
    desc: { es: 'Racha de 3 respuestas con promedio ≥ 60%', pt: 'Sequência de 3 respostas com média ≥ 60%' }
  },
  {
    id: 'embajador_h', icon: '⭐', category: 'calidad', color: '#c9a84c',
    name: { es: 'Embajador H', pt: 'Embaixador H' },
    desc: { es: 'Racha de 5 respuestas con promedio ≥ 70%', pt: 'Sequência de 5 respostas com média ≥ 70%' }
  },
  {
    id: 'maestro_pilares', icon: '✦', category: 'calidad', color: '#a78bfa',
    name: { es: 'Maestro de Pilares', pt: 'Mestre dos Pilares' },
    desc: { es: 'Los 3 pilares ≥ 80% en una misma misión', pt: 'Os 3 pilares ≥ 80% na mesma missão' }
  },
  // ── PROGRESIÓN: XP ──
  {
    id: 'explorador_h', icon: '🌟', category: 'progresion', color: '#22c55e',
    name: { es: 'Explorador H', pt: 'Explorador H' },
    desc: { es: '200 XP acumulados', pt: '200 XP acumulados' }
  },
  {
    id: 'colaborador_h', icon: '💫', category: 'progresion', color: '#00b4d8',
    name: { es: 'Colaborador H', pt: 'Colaborador H' },
    desc: { es: '500 XP acumulados', pt: '500 XP acumulados' }
  },
  {
    id: 'lider_h', icon: '👑', category: 'progresion', color: '#c9a84c',
    name: { es: 'Líder H', pt: 'Líder H' },
    desc: { es: '1000 XP acumulados', pt: '1000 XP acumulados' }
  },
];

export function checkNewBadges(
  prev: BadgeState,
  next: BadgeState,
  profile: ProfileId,
  scores: { anticipacion: number; autenticidad: number; sorpresa: number },
  streak: number,
  xp: number
): string[] {
  const newlyEarned: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !prev.earned.has(id) && !next.earned.has(id)) {
      next.earned.add(id);
      newlyEarned.push(id);
    }
  };

  const missions = next.missionsByProfile;
  check('cabin_bronze',   missions.cabin >= 3);
  check('cabin_silver',   missions.cabin >= 10);
  check('airport_bronze', missions.airport >= 3);
  check('airport_silver', missions.airport >= 10);
  check('contact_bronze', missions.contact >= 3);
  check('contact_silver', missions.contact >= 10);

  const avg = (scores.anticipacion + scores.autenticidad + scores.sorpresa) / 3;
  const allHigh = scores.anticipacion >= 80 && scores.autenticidad >= 80 && scores.sorpresa >= 80;

  check('maestro_pilares', allHigh);
  check('zona_h',          streak >= 3);
  check('embajador_h',     streak >= 5);

  check('explorador_h',  xp >= 200);
  check('colaborador_h', xp >= 500);
  check('lider_h',       xp >= 1000);

  return newlyEarned;
}

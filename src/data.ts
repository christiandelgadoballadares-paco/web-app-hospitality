export type Lang = 'es' | 'pt';
export type ProfileId = 'cabin' | 'airport' | 'contact';
export type LevelId = 'basico' | 'intermedio' | 'avanzado';

export interface Scenario {
  pax: string;
  emoji: string;
  emotion: string;
  situation: string;
}

export interface PilarScores {
  anticipacion: number;
  autenticidad: number;
  sorpresa: number;
}

export interface FeedbackData {
  scores: PilarScores;
  comments: PilarScores & { [k: string]: string };
  mejora: string;
}

export const translations = {
  es: {
    selectProfile: ['Elige tu', 'perfil'],
    profileSub: 'Cada misión está adaptada a tu rol en LATAM Airlines',
    selectLevel: ['Selecciona el', 'nivel'],
    levelSub: 'Elige según el momento de tu formación',
    missionTitle: 'MISIÓN ACTIVA',
    yourResponse: 'Tu respuesta',
    responsePlaceholder: 'Escribe aquí cómo responderías a este pasajero...',
    submitBtn: 'Evaluar mi respuesta ✦',
    evaluating: 'Evaluando tu respuesta...',
    feedbackTitle: 'Radiografía de Hospitalidad',
    mejoraLabel: 'Propuesta de mejora',
    nextMission: 'Siguiente misión →',
    backToMenu: '← Volver al inicio',
    backToLevels: '← Cambiar nivel',
    xpGained: 'XP ganados esta misión',
    streak: 'Racha',
    reputacion: 'Reputación',
    pilares: ['Anticipación', 'Autenticidad', 'Sorpresa'],
    profiles: [
      { id: 'cabin' as ProfileId, icon: '✈️', name: 'Tripulante de Cabina', desc: 'Escenarios a bordo de aeronaves LATAM' },
      { id: 'airport' as ProfileId, icon: '🏢', name: 'Agente de Aeropuerto', desc: 'Situaciones en check-in, puertas y sala de espera' },
      { id: 'contact' as ProfileId, icon: '🎧', name: 'Agente Contact Center', desc: 'Interacciones por teléfono y canales digitales' }
    ],
    levels: [
      {
        id: 'basico' as LevelId, name: 'Básico', color: '#22c55e',
        desc: 'Situación clara, una necesidad explícita del pasajero',
        xpLabel: '+50 XP por misión',
        courseTag: 'Cursos de ingreso'
      },
      {
        id: 'intermedio' as LevelId, name: 'Intermedio', color: '#f59e0b',
        desc: 'Emoción implícita + necesidad mixta del pasajero',
        xpLabel: '+100 XP por misión',
        courseTag: 'Cursos de continuidad'
      },
      {
        id: 'avanzado' as LevelId, name: 'Avanzado', color: '#ef4444',
        desc: 'Situación compleja: dominio técnico y emocional simultáneos en tensión',
        xpLabel: '+200 XP por misión',
        courseTag: 'Cursos de ascenso'
      }
    ],
    errorMsg: 'Error al evaluar. Intenta nuevamente.',
    changeProfile: '← Cambiar perfil',
    missionCount: 'Misión',
  },
  pt: {
    selectProfile: ['Escolha seu', 'perfil'],
    profileSub: 'Cada missão é adaptada ao seu papel na LATAM Airlines',
    selectLevel: ['Selecione o', 'nível'],
    levelSub: 'Escolha de acordo com o momento da sua formação',
    missionTitle: 'MISSÃO ATIVA',
    yourResponse: 'Sua resposta',
    responsePlaceholder: 'Escreva aqui como você responderia a este passageiro...',
    submitBtn: 'Avaliar minha resposta ✦',
    evaluating: 'Avaliando sua resposta...',
    feedbackTitle: 'Radiografia de Hospitalidade',
    mejoraLabel: 'Proposta de melhoria',
    nextMission: 'Próxima missão →',
    backToMenu: '← Voltar ao início',
    backToLevels: '← Mudar nível',
    xpGained: 'XP ganhos nesta missão',
    streak: 'Sequência',
    reputacion: 'Reputação',
    pilares: ['Antecipação', 'Autenticidade', 'Surpresa'],
    profiles: [
      { id: 'cabin' as ProfileId, icon: '✈️', name: 'Tripulante de Cabine', desc: 'Cenários a bordo de aeronaves LATAM' },
      { id: 'airport' as ProfileId, icon: '🏢', name: 'Agente de Aeroporto', desc: 'Situações em check-in, portões e sala de espera' },
      { id: 'contact' as ProfileId, icon: '🎧', name: 'Agente Contact Center', desc: 'Interações por telefone e canais digitais' }
    ],
    levels: [
      {
        id: 'basico' as LevelId, name: 'Básico', color: '#22c55e',
        desc: 'Situação clara, uma necessidade explícita do passageiro',
        xpLabel: '+50 XP por missão',
        courseTag: 'Cursos de ingresso'
      },
      {
        id: 'intermedio' as LevelId, name: 'Intermediário', color: '#f59e0b',
        desc: 'Emoção implícita + necessidade mista do passageiro',
        xpLabel: '+100 XP por missão',
        courseTag: 'Cursos de continuidade'
      },
      {
        id: 'avanzado' as LevelId, name: 'Avançado', color: '#ef4444',
        desc: 'Situação complexa: domínio técnico e emocional simultâneos em tensão',
        xpLabel: '+200 XP por missão',
        courseTag: 'Cursos de promoção'
      }
    ],
    errorMsg: 'Erro ao avaliar. Tente novamente.',
    changeProfile: '← Mudar perfil',
    missionCount: 'Missão',
  }
};

export const scenarios: Record<Lang, Record<ProfileId, Record<LevelId, Scenario[]>>> = {
  es: {
    cabin: {
      basico: [
        { pax: 'Sr. Vargas', emoji: '😐', emotion: 'Tranquilo', situation: 'El pasajero solicita una manta adicional durante el vuelo y menciona que tiene frío. Es el único que lo pide en este momento de la cabina.' },
        { pax: 'Sra. Lima', emoji: '😊', emotion: 'Amable', situation: 'Una pasajera te pregunta a qué hora aproximada aterrizaremos y si el aeropuerto de destino tiene servicio de taxi disponible.' },
        { pax: 'Sr. Díaz', emoji: '😊', emotion: 'Curioso', situation: 'Un pasajero pide un vaso de agua extra y pregunta si puede reclinarse su asiento durante el servicio de comida.' },
      ],
      intermedio: [
        { pax: 'Sr. Morales', emoji: '😟', emotion: 'Ansioso', situation: 'El pasajero lleva 20 minutos esperando su meal especial vegetariano y no ha recibido nada. Te dice: "Pregunté al embarcar y me dijeron que estaba confirmado." Su tono es preocupado pero contenido.' },
        { pax: 'Sra. Chen', emoji: '😔', emotion: 'Triste', situation: 'Una pasajera viaja sola por primera vez en mucho tiempo. Sin pedirlo directamente, comenta que está nerviosa y que echa de menos a su familia en el destino.' },
        { pax: 'Sr. Ibáñez', emoji: '😣', emotion: 'Incómodo', situation: 'El pasajero tiene una lesión en la rodilla y te pide si puede moverse a otro asiento con más espacio. La cabina está casi llena.' },
      ],
      avanzado: [
        { pax: 'Sr. Andrade', emoji: '😤', emotion: 'Frustrado', situation: 'El pasajero tiene una conexión en 55 minutos. Acaba de enterarse de que el vuelo lleva 30 minutos de retraso. Está visiblemente agitado y te dice: "Necesito que me digan qué va a pasar con mi conexión, porque pagué un upgrade en ese vuelo." Espera certezas que tú aún no tienes.' },
        { pax: 'Sra. Oquendo', emoji: '😠', emotion: 'Indignada', situation: 'Una pasajera business te llama para reclamar que el IFE no funciona, que su meal no llegó a tiempo, y que el pasajero de atrás ha estado empujando su asiento durante 40 minutos. Dice que "esto no es lo que se espera de LATAM". Quiere una solución integral, no respuestas parciales.' },
      ]
    },
    airport: {
      basico: [
        { pax: 'Sra. Rojas', emoji: '😊', emotion: 'Curiosa', situation: 'Una pasajera se acerca al counter preguntando si puede hacer el check-in de sus dos maletas de 23 kg cada una. Su vuelo sale en 2 horas.' },
        { pax: 'Sr. Pérez', emoji: '😐', emotion: 'Neutro', situation: 'Un pasajero pregunta dónde queda la sala de embarque para su vuelo a Lima y si ya están habilitadas las puertas de salida.' },
        { pax: 'Sra. Torres', emoji: '😊', emotion: 'Amable', situation: 'Una pasajera pregunta si puede cambiar su asiento de la fila 25 a uno más adelante del avión, ya que tiene una conexión corta al llegar.' },
      ],
      intermedio: [
        { pax: 'Sra. Fuentes', emoji: '😰', emotion: 'Preocupada', situation: 'Una pasajera llega al counter con su hijo de 8 años. Dice que olvidó el documento de autorización de viaje del menor. Su vuelo cierra en 40 minutos. Está al borde del llanto.' },
        { pax: 'Sr. Ríos', emoji: '😤', emotion: 'Molesto', situation: 'El pasajero llegó al aeropuerto y dice que su asiento fue cambiado sin aviso. Originalmente tenía asiento de ventana y ahora está en el medio de la fila. Su tono es firme y exige explicación.' },
        { pax: 'Sr. Núñez', emoji: '😟', emotion: 'Confundido', situation: 'Un pasajero adulto mayor llega con una reserva impresa de hace 6 meses. El vuelo fue reprogramado y él no fue notificado a tiempo. No entiende por qué su tarjeta de embarque no funciona.' },
      ],
      avanzado: [
        { pax: 'Familia Torres', emoji: '😫', emotion: 'Agotada', situation: 'Una familia de 4 personas (2 adultos y 2 niños pequeños) llega al aeropuerto tras un vuelo cancelado de otra aerolínea. Piden ser reubicados en el próximo vuelo LATAM disponible, pero los 4 asientos juntos ya no están disponibles. Los niños lloran. Los padres exigen solución inmediata. Hay lista de espera.' },
        { pax: 'Sr. Villareal', emoji: '😠', emotion: 'Exigente', situation: 'Un pasajero LATAM Black llega 8 minutos después del cierre de puerta. Exige que lo dejen abordar, menciona su categoría de viajero frecuente y amenaza con publicar la experiencia en redes. La puerta ya está cerrada operativamente.' },
      ]
    },
    contact: {
      basico: [
        { pax: 'Sr. Vega', emoji: '😊', emotion: 'Amable', situation: 'Un pasajero llama para consultar cómo puede agregar equipaje adicional a su reserva para un vuelo que sale en 5 días. Tiene el código de reserva a mano.' },
        { pax: 'Sra. Ibarra', emoji: '😐', emotion: 'Directa', situation: 'Una pasajera llama preguntando cuánto cuesta cambiar la fecha de su vuelo y si es posible hacerlo por esta vía telefónica.' },
        { pax: 'Sr. Gutiérrez', emoji: '😊', emotion: 'Curioso', situation: 'Un pasajero llama para preguntar si su perro de raza pequeña puede viajar en cabina y cuáles son los requisitos necesarios.' },
      ],
      intermedio: [
        { pax: 'Sr. Castro', emoji: '😟', emotion: 'Confundido', situation: 'El pasajero recibió un correo de LATAM indicando que su vuelo fue reprogramado. No entiende el nuevo itinerario y cree que perdió su conexión. Su tono es nervioso y un poco agresivo. La información en el sistema es correcta y la conexión sí funciona.' },
        { pax: 'Sra. Navarro', emoji: '😔', emotion: 'Decepcionada', situation: 'Una pasajera llama para reclamar que sus millas no fueron acreditadas después de un vuelo hace 3 semanas. Dice que es socia hace 12 años y que "nunca le había pasado esto". Espera un reconocimiento genuino, no solo una solución técnica.' },
        { pax: 'Sr. Espinoza', emoji: '😟', emotion: 'Preocupado', situation: 'El pasajero llama para decir que compró el seguro de viaje pero al revisar los términos no sabe si cubre su condición médica preexistente. Tiene el vuelo en 4 días.' },
      ],
      avanzado: [
        { pax: 'Sr. Montoya', emoji: '😠', emotion: 'Muy molesto', situation: 'El pasajero llama furioso porque su equipaje no llegó en su vuelo de hace 2 días. Ya hizo el reporte pero dice que nadie lo contactó. Tiene una reunión de negocios importante mañana y necesita su ropa. Pide compensación inmediata Y solución en las próximas horas. El sistema muestra que el equipaje está en el aeropuerto de origen pero el vuelo de reenvío es al día siguiente.' },
        { pax: 'Sra. Quintero', emoji: '😤', emotion: 'Indignada', situation: 'Una pasajera llama llorando. Viajaba para ver a su madre hospitalizada y su vuelo fue cancelado. Le ofrecieron un vuelo alternativo 8 horas después. Dice que eso es inaceptable y que LATAM "no tiene corazón". Quiere que alguien tome responsabilidad real, no que le lean un guion.' },
      ]
    }
  },
  pt: {
    cabin: {
      basico: [
        { pax: 'Sr. Vargas', emoji: '😐', emotion: 'Tranquilo', situation: 'O passageiro solicita um cobertor adicional durante o voo e menciona que está com frio. É o único que pede neste momento na cabine.' },
        { pax: 'Sra. Lima', emoji: '😊', emotion: 'Amável', situation: 'Uma passageira pergunta a que horas aproximadamente vamos pousar e se o aeroporto de destino tem serviço de táxi disponível.' },
        { pax: 'Sr. Dias', emoji: '😊', emotion: 'Curioso', situation: 'Um passageiro pede um copo d\'água extra e pergunta se pode reclinar o assento durante o serviço de refeição.' },
      ],
      intermedio: [
        { pax: 'Sr. Morales', emoji: '😟', emotion: 'Ansioso', situation: 'O passageiro espera há 20 minutos pela sua refeição especial vegetariana e não recebeu nada. Diz: "Perguntei no embarque e me disseram que estava confirmado." O tom é preocupado, mas contido.' },
        { pax: 'Sra. Chen', emoji: '😔', emotion: 'Triste', situation: 'Uma passageira viaja sozinha pela primeira vez em muito tempo. Sem pedir diretamente, comenta que está nervosa e com saudade da família no destino.' },
        { pax: 'Sr. Ibáñez', emoji: '😣', emotion: 'Desconfortável', situation: 'O passageiro tem uma lesão no joelho e pede para mudar para outro assento com mais espaço. A cabine está quase cheia.' },
      ],
      avanzado: [
        { pax: 'Sr. Andrade', emoji: '😤', emotion: 'Frustrado', situation: 'O passageiro tem uma conexão em 55 minutos. Acabou de saber que o voo está atrasado 30 minutos. Está visivelmente agitado e diz: "Preciso saber o que vai acontecer com minha conexão, porque paguei um upgrade naquele voo." Espera certezas que você ainda não tem.' },
        { pax: 'Sra. Oquendo', emoji: '😠', emotion: 'Indignada', situation: 'Uma passageira business chama você para reclamar que o IFE não funciona, que a refeição não chegou no tempo certo e que o passageiro de trás ficou empurrando o assento dela por 40 minutos. Diz que "isso não é o que se espera da LATAM". Quer uma solução integral, não respostas parciais.' },
      ]
    },
    airport: {
      basico: [
        { pax: 'Sra. Rojas', emoji: '😊', emotion: 'Curiosa', situation: 'Uma passageira se aproxima do balcão perguntando se pode fazer o check-in de duas malas de 23 kg cada. O voo parte em 2 horas.' },
        { pax: 'Sr. Pérez', emoji: '😐', emotion: 'Neutro', situation: 'Um passageiro pergunta onde fica o portão de embarque para seu voo a Lima e se os portões já estão abertos.' },
        { pax: 'Sra. Torres', emoji: '😊', emotion: 'Amável', situation: 'Uma passageira pergunta se pode trocar o assento da fileira 25 por um mais à frente do avião, pois tem uma conexão curta ao chegar.' },
      ],
      intermedio: [
        { pax: 'Sra. Fuentes', emoji: '😰', emotion: 'Preocupada', situation: 'Uma passageira chega ao balcão com o filho de 8 anos. Diz que esqueceu a autorização de viagem do menor. O voo fecha em 40 minutos. Está à beira do choro.' },
        { pax: 'Sr. Ríos', emoji: '😤', emotion: 'Irritado', situation: 'O passageiro chegou ao aeroporto e diz que seu assento foi trocado sem aviso. Originalmente tinha janela e agora está no meio da fileira. O tom é firme e exige explicação.' },
        { pax: 'Sr. Núñez', emoji: '😟', emotion: 'Confuso', situation: 'Um passageiro idoso chega com uma reserva impressa de 6 meses atrás. O voo foi reprogramado e ele não foi notificado a tempo. Não entende por que o cartão de embarque não funciona.' },
      ],
      avanzado: [
        { pax: 'Família Torres', emoji: '😫', emotion: 'Esgotada', situation: 'Uma família de 4 pessoas (2 adultos e 2 crianças pequenas) chega ao aeroporto após um voo cancelado de outra companhia. Pedem para ser realocados no próximo voo LATAM disponível, mas os 4 assentos juntos não estão mais disponíveis. As crianças choram. Os pais exigem solução imediata. Há lista de espera.' },
        { pax: 'Sr. Villareal', emoji: '😠', emotion: 'Exigente', situation: 'Um passageiro LATAM Black chega 8 minutos após o fechamento do portão. Exige embarcar, menciona sua categoria de viajeiro frequente e ameaça publicar a experiência nas redes sociais. O portão já está fechado operacionalmente.' },
      ]
    },
    contact: {
      basico: [
        { pax: 'Sr. Vega', emoji: '😊', emotion: 'Amável', situation: 'Um passageiro liga para saber como adicionar bagagem extra à reserva para um voo que parte em 5 dias. Tem o código de reserva em mãos.' },
        { pax: 'Sra. Ibarra', emoji: '😐', emotion: 'Direta', situation: 'Uma passageira liga perguntando quanto custa mudar a data do voo e se é possível fazê-lo por telefone.' },
        { pax: 'Sr. Gutiérrez', emoji: '😊', emotion: 'Curioso', situation: 'Um passageiro liga para perguntar se seu cachorro de raça pequena pode viajar na cabine e quais são os requisitos necessários.' },
      ],
      intermedio: [
        { pax: 'Sr. Castro', emoji: '😟', emotion: 'Confuso', situation: 'O passageiro recebeu um e-mail da LATAM informando que o voo foi reprogramado. Não entende o novo itinerário e acha que perdeu a conexão. O tom é nervoso e um pouco agressivo. As informações no sistema estão corretas e a conexão funciona.' },
        { pax: 'Sra. Navarro', emoji: '😔', emotion: 'Decepcionada', situation: 'Uma passageira liga para reclamar que suas milhas não foram creditadas após um voo há 3 semanas. Diz que é sócia há 12 anos e que "isso nunca aconteceu antes". Espera reconhecimento genuíno, não apenas uma solução técnica.' },
        { pax: 'Sr. Espinoza', emoji: '😟', emotion: 'Preocupado', situation: 'O passageiro liga para dizer que comprou o seguro de viagem, mas ao ler os termos não sabe se cobre sua condição médica preexistente. O voo é em 4 dias.' },
      ],
      avanzado: [
        { pax: 'Sr. Montoya', emoji: '😠', emotion: 'Muito irritado', situation: 'O passageiro liga furioso porque a bagagem não chegou no voo de 2 dias atrás. Já fez o relatório, mas diz que ninguém entrou em contato. Tem uma reunião de negócios importante amanhã e precisa de sua roupa. Pede compensação imediata E solução nas próximas horas. O sistema mostra que a bagagem está no aeroporto de origem, mas o voo de reenvio é amanhã.' },
        { pax: 'Sra. Quintero', emoji: '😤', emotion: 'Indignada', situation: 'Uma passageira liga chorando. Viajava para ver a mãe hospitalizada e o voo foi cancelado. Ofereceram um voo alternativo 8 horas depois. Diz que isso é inaceitável e que a LATAM "não tem coração". Quer que alguém assuma responsabilidade real, não que leiam um roteiro.' },
      ]
    }
  }
};

export function getLevelXP(level: LevelId): number {
  return { basico: 50, intermedio: 100, avanzado: 200 }[level];
}

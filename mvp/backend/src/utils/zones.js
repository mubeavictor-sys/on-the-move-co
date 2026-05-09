const PHASE_1_ZONES = [
  'CBD', 'Westlands', 'Karen', 'Kilimani', 'Kileleshwa', 'Lavington', 
  'Riverside', 'Parklands', 'Highridge', 'South B', 'South C', 'Langata'
];

const PHASE_2_ZONES = [
  'Rongai', 'Kasarani', 'Embakasi', 'Ngong', 'Ruiru', 'Kikuyu', 'Athi River'
];

const isPhase1 = (zone) => PHASE_1_ZONES.includes(zone);

module.exports = {
  PHASE_1_ZONES,
  PHASE_2_ZONES,
  isPhase1
};

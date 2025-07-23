
const RATING_TIERS = [
    { min: 0, max: 1199, name: 'Newbie', color: '#b7b3b3ff' },
    { min: 1200, max: 1399, name: 'Pupil', color: '#5ecc5eff' },
    { min: 1400, max: 1599, name: 'Specialist', color: '#1cc9bdff' },
    { min: 1600, max: 1899, name: 'Expert', color: '#6692b3ff' },
    { min: 1900, max: 2099, name: 'Candidate Master', color: '#AA00AA' },
    { min: 2100, max: 2299, name: 'Master', color: '#FF8C00' },
    { min: 2300, max: 2399, name: 'International Master', color: '#FF8C00' },
    { min: 2400, max: 2599, name: 'Grandmaster', color: '#FF0000' },
    { min: 2600, max: 2999, name: 'International Grandmaster', color: '#FF0000' },
    { min: 3000, max: 4000, name: 'Legendary Grandmaster', color: '#FF0000' }
];

export default RATING_TIERS;
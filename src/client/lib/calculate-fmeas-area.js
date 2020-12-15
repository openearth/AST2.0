export default function calculateFmeasArea(A_tot, A_p, Frac_RA, FMeas_areas = []) {
  const sum = list => list.reduce((a, b) => a + b, 0)
  const e = Math.exp

  const FMeas = Array.isArray(FMeas_areas)
    ? sum(FMeas_areas)
    : FMeas_areas

  const result = (A_p * e(FMeas / A_p) + Frac_RA * (A_tot - A_p)) / (A_p + Frac_RA * (A_tot - A_p))

  return isNaN(result)
    ? 0
    : result
}

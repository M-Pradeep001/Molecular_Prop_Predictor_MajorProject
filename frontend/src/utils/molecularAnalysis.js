/**
 * AI Molecular Behavior Analysis Engine
 * Translates raw quantum properties into human-readable scientific insights
 * based on multi-property reasoning and chemical physics principles.
 */

const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function analyzeMolecularBehavior(properties) {
  const { 
    homo = 0, 
    lumo = 0, 
    gap = 0, 
    dipole = 0, 
    polar = 0 
  } = properties || {};

  const summaryParts = [];
  const behaviors = [];
  const tags = [];
  const applications = [];

  // 1. STABILITY & REACTION DYNAMICS (GAP Driven)
  if (gap > 7.0) {
    behaviors.push("Thermodynamically inert with extremely tight electronic binding.");
    tags.push("Ultra-Stable", "High-Gap Insulator");
    summaryParts.push("is exceptionally stable, with a wide HOMO-LUMO gap that prevents easy electronic excitation.");
  } else if (gap > 4.5) {
    behaviors.push("Robust electronic structure suitable for standard ambient conditions.");
    tags.push("Chemically Stable", "Wide-Gap");
    summaryParts.push("exhibits robust thermodynamic stability, maintaining a significant energy barrier against chemical degradation.");
  } else if (gap > 2.0) {
    behaviors.push("Chemically versatile with accessible excited states.");
    tags.push("Moderately Reactive", "Semiconductive");
    summaryParts.push("possesses a moderate energy gap, suggesting a balanced profile between structural stability and electronic reactivity.");
  } else {
    behaviors.push("High kinetic reactivity; likely to participate in rapid electron transfer.");
    tags.push("Highly Reactive", "Narrow-Gap");
    summaryParts.push("resides in a highly active state due to its narrow energy gap, making it prone to immediate electronic or chemical transitions.");
  }

  // 2. POLARITY & INTERACTION (Dipole Driven)
  if (dipole > 4.5) {
    behaviors.push("Strong permanent dipole suggests intense electrostatic interactions.");
    tags.push("Highly Polar", "Solvophilic");
    summaryParts.push("Its intense dipole moment indicates a strongly polarized structure, facilitating powerful intermolecular forces.");
  } else if (dipole > 1.5) {
    behaviors.push("Moderate polarization enables selective hydrogen bonding or dipole-dipole pairing.");
    tags.push("Polar", "Interactive");
    summaryParts.push("A moderate dipole presence suggests the molecule is capable of meaningful interactions with polar environments.");
  } else {
    behaviors.push("Minimal charge centers; interactions are dominated by dispersion forces.");
    tags.push("Non-Polar", "Lipophilic");
    summaryParts.push("The near-neutral dipole profile indicates a non-polar nature, relying primarily on weak van der Waals forces for interaction.");
  }

  // 3. ELECTRONIC RESPONSE (Polarizability Driven)
  if (polar > 90) {
    behaviors.push("Highly deformable electronic cloud; extremely responsive to external fields.");
    tags.push("Electronically Soft", "NLO Active");
    summaryParts.push("Highly polarizable, the molecule possesses a 'soft' electronic cloud that responds significantly to external perturbations.");
  } else if (polar > 50) {
    behaviors.push("Standard electronic response with localized charge stability.");
    tags.push("Moderate Polarizability");
    summaryParts.push("It shows a balanced electronic response, with charge density that is neither too rigid nor excessively deformable.");
  } else {
    behaviors.push("Rigid electronic structure with localized, tightly held electron density.");
    tags.push("Electronically Hard", "Stiff Cloud");
    summaryParts.push("The compact, 'hard' electronic structure resists distortion even under significant external fields.");
  }

  // 4. MULTI-PROPERTY REASONING (The "Brain" Logic)
  
  // High Gap + Low Dipole = Perfect Dielectric
  if (gap > 6.0 && dipole < 1.0) {
    applications.push("High-performance Dielectric", "Electrical Insulator", "Electronic Packaging Material");
  }
  
  // Low Gap + High Polarizability = Organic Electronics
  if (gap < 3.5 && polar > 75) {
    applications.push("Organic Semiconductor", "Photovoltaic Donor", "OLED Active Layer");
  }

  // High Dipole + Small Gap = Active Catalyst/Lead
  if (dipole > 3.0 && gap < 5.0) {
    applications.push("Homogeneous Catalyst", "Pharmacological Lead", "Reaction Intermediate");
  }

  // High Polarizability + moderate gap = Optical Materials
  if (polar > 80 && gap > 3.0) {
    applications.push("Non-linear Optical material", "High-Refractive Index dye");
  }

  // Small Gap + High Dipole = Molecular Sensor
  if (gap < 3.0 && dipole > 3.0) {
    applications.push("Solvatochromic Probe", "Chemical Sensor");
  }

  // Default if none caught
  if (applications.length === 0) {
    applications.push("Specialty chemical synthesis", "Laboratory research lead");
  }

  // 5. FINAL ASSEMBLY
  const intro = selectRandom([
    "Quantum analysis indicates that this molecule",
    "Electronic structure modeling shows that the system",
    "Physical profiling reveals that this molecular structure",
    "Computational evidence suggests that the molecule"
  ]);

  return {
    summary: `${intro} ${summaryParts.join(' ')}`,
    behaviors: behaviors,
    tags: [...new Set(tags)], // Unique tags
    applications: [...new Set(applications)] // Unique applications
  };
}

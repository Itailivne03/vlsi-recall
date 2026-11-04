/* Formula-sheet path: the 63 questions grouped and ordered like the course formula sheet. */
window.SHEET_PATH = [
  {
    key: 'A', title: 'I–V characteristics and MOS structure',
    formulas: [
      '\\[I_D^{\\,triode}=\\mu_nC_{ox}\\tfrac{W}{L}\\Big[(V_{GS}-V_{TH})V_{DS}-\\tfrac12V_{DS}^2\\Big]\\]',
      '\\[I_D^{\\,sat}=\\tfrac12\\mu_nC_{ox}\\tfrac{W}{L}(V_{GS}-V_{TH})^2(1+\\lambda V_{DS})\\qquad V_{D,sat}=V_{OV}\\]',
      '\\[R_{on}=\\frac{1}{\\mu_nC_{ox}\\frac{W}{L}V_{OV}}\\qquad L_{eff}=L_{drawn}-2L_D\\]'
    ],
    points: [
      'Region test: compare \\(V_{GS}\\) with \\(V_{TH}\\) (is there a channel?) and \\(V_{DS}\\) with \\(V_{OV}\\) (is it pinched off?).',
      'NMOS p-substrate to the lowest potential (GND), PMOS n-well to the highest (\\(V_{DD}\\)) so every S/D junction stays reverse-biased.',
      'PMOS: same equations with magnitudes, \\(\\mu_p\\approx0.5\\mu_n\\). Only the gate creates a channel, never the drain.',
      'From two saturation points: \\(\\sqrt{I_2/I_1}=(V_2-V_{TH})/(V_1-V_{TH})\\), then \\(K=2I_D/V_{OV}^2\\).'
    ],
    ids: [1, 2, 27, 28, 6, 11, 12, 39]
  },
  {
    key: 'A.2', title: 'Small-signal parameters and identities',
    formulas: [
      '\\[g_m=\\mu_nC_{ox}\\tfrac{W}{L}V_{OV}=\\frac{2I_D}{V_{OV}}=\\sqrt{2\\mu_nC_{ox}\\tfrac{W}{L}I_D}\\]',
      '\\[r_o=\\frac{1}{\\lambda I_D}=\\frac{V_A}{I_D}\\qquad g_{mb}=\\eta g_m,\\ \\ \\eta=\\frac{\\gamma}{2\\sqrt{2\\Phi_F+V_{SB}}}\\]',
      '\\[A_0=g_mr_o\\approx\\frac{2}{\\lambda V_{OV}}\\]'
    ],
    points: [
      '\\(I_D/V_{OV}\\) is half of \\(g_m\\), not \\(g_m\\).',
      'Fixed \\(W/L\\): \\(g_m\\propto V_{OV}\\). Fixed \\(I_D\\): \\(g_m\\propto1/V_{OV}\\). Fixed \\(V_{OV}\\): \\(g_m\\propto I_D\\).',
      'All saturation lines meet at \\(V_{DS}=-V_A=-1/\\lambda\\); \\(\\lambda\\propto1/L\\), so longer devices give more \\(r_o\\) and gain.',
      'From a curve: \\(r_o=\\Delta V_{DS}/\\Delta I_D\\), \\(V_A=I_Dr_o-V_{DS}\\).'
    ],
    ids: [3, 26, 16, 23, 14, 53, 37]
  },
  {
    key: 'B', title: 'CS, CD and CG stages',
    formulas: [
      '\\[\\text{CS: }A_v=-g_m(R_D\\parallel r_o)\\qquad R_{out}=R_D\\parallel r_o\\]',
      '\\[\\text{CD: }A_v=\\frac{g_mR}{1+(g_m+g_{mb})R},\\ R=R_S\\parallel r_o\\qquad R_{out}=\\tfrac{1}{g_m}\\parallel\\tfrac{1}{g_{mb}}\\parallel r_o\\parallel R_S\\]',
      '\\[\\text{CG: }R_{in}=\\frac{r_o+R_D}{1+(g_m+g_{mb})r_o}\\approx\\frac{1}{g_m+g_{mb}}\\qquad A_v\\approx+(g_m+g_{mb})(R_D\\parallel r_o)\\]'
    ],
    points: [
      'Method: small-signal model, DC sources to AC ground, KCL/KVL; for \\(R_{in}\\)/\\(R_{out}\\) apply a test source \\(v_x\\) and compute \\(v_x/i_x\\).',
      'CS inverts; CD and CG do not. CD gain is below 1. CG has low input resistance.',
      'Looking into the drain with \\(R_S\\) at the source: \\(r_o+(1+(g_m+g_{mb})r_o)R_S\\).',
      'Load line \\(V_{DS}=V_{DD}-I_DR_D\\); CS leaves saturation at \\(V_{out}=V_{in}-V_{TH}\\).'
    ],
    ids: [4, 5, 17, 55, 18, 24, 25, 54, 57]
  },
  {
    key: 'C', title: 'Miller’s theorem and Thévenin',
    formulas: [
      '\\[Z_1=\\frac{Z}{1-A_v}\\qquad Z_2=\\frac{Z}{1-1/A_v}\\]',
      '\\[C_{in}=C_{GS}+(1+A)C_{GD}\\qquad f_p=\\frac{1}{2\\pi R_{sig}C_{in}}\\]'
    ],
    points: [
      '\\(A_v\\) is measured with \\(Z\\) in place. Only the two node currents are preserved.',
      'Thévenin with dependent sources: zero only independent sources, keep dependent ones active, \\(R_{TH}=V_X/I_X\\).'
    ],
    ids: [19, 20, 21, 22]
  },
  {
    key: 'D', title: 'Silicon numbers and the pn junction',
    formulas: [
      '\\[n_i=5.2\\times10^{15}\\,T^{3/2}e^{-E_g/2kT}\\qquad np=n_i^2\\]'
    ],
    points: [
      'Si atoms \\(5\\times10^{22}\\,\\text{cm}^{-3}\\); \\(n_i\\approx10^{10}\\,\\text{cm}^{-3}\\) at 300 K; \\(E_g=1.12\\) eV. Doubling T raises \\(n_i\\) by about \\(10^5\\).',
      'Group V donors (P) give n-type and a fixed positive ion; group III acceptors (B) give p-type.',
      'At equilibrium fixed ions form a space charge whose field balances diffusion; the Fermi level is flat. Reverse bias widens the depletion region.'
    ],
    ids: [9, 10, 31, 32]
  },
  {
    key: 'VT', title: 'Threshold, body effect, short channel and temperature',
    formulas: [
      '\\[V_{TH}=\\Phi_{MS}+2\\Phi_F+\\frac{Q_{dep}}{C_{ox}}-\\frac{Q_{ox}}{C_{ox}}\\qquad \\Phi_F=\\frac{kT}{q}\\ln\\frac{N_{sub}}{n_i}\\]',
      '\\[V_{TH}=V_{TH0}+\\gamma\\left(\\sqrt{2\\Phi_F+V_{SB}}-\\sqrt{2\\Phi_F}\\right)\\]',
      '\\[V_{OV,ZTC}=\\frac{2|dV_T/dT|\\,T}{3/2}\\approx0.8\\text{ V}\\]'
    ],
    points: [
      'I–V derivation: inversion charge carries current; \\(Q_n(y)=C_{ox}[V_{GS}-V(y)-V_{TH}]\\); \\(v=\\mu E\\).',
      'Heavier doping and thicker oxide raise \\(|V_T|\\); temperature, positive \\(Q_{ox}\\) and short L lower it.',
      'Short channel: \\(V_T\\) roll-off (DIBL), velocity saturation (less current at high \\(V_{OV}\\)).',
      'Above ZTC the current falls with temperature; below it the current rises.'
    ],
    ids: [33, 34, 35, 36, 42, 56, 13, 59, 58]
  },
  {
    key: 'E', title: 'Gate capacitances',
    formulas: [
      '\\[\\text{Triode: }C_{GS}=C_{GD}=\\tfrac12WLC_{ox}+WC_{ov}\\]',
      '\\[\\text{Saturation: }C_{GS}=\\tfrac23WLC_{ox}+WC_{ov},\\quad C_{GD}=WC_{ov}\\]'
    ],
    points: [
      'Off: only overlaps to S and D, and \\(C_{ox}\\) in series with \\(C_{dep}\\) to the bulk.',
      'C1 gate–channel, C2 depletion, C3/C4 overlaps, C5/C6 junctions \\(C_{SB}\\), \\(C_{DB}\\).',
      'C–V curve: \\(C_{ox}\\) in accumulation and strong inversion, a dip in depletion.'
    ],
    ids: [38, 40, 41, 43, 44, 45]
  },
  {
    key: 'F', title: 'Performance measures',
    formulas: [
      '\\[\\omega_T=\\frac{g_m}{C_{gg}}\\approx\\frac32\\cdot\\frac{\\mu V_{OV}}{L^2}\\qquad A_0=g_mr_o\\]',
      '\\[\\text{given: }\\ \\omega_{max}=\\tfrac12\\sqrt{\\frac{\\omega_T}{r_gC_{gd}}},\\ \\ f_{max}=f\\sqrt{G_p}\\qquad SS=nU_T\\ln10,\\ \\ n\\ge1\\]',
      '\\[\\frac{g_m}{I_D}=\\frac{2}{V_{OV}}\\ \\text{(strong)},\\ \\frac{1}{nU_T}\\ \\text{(weak)}\\qquad \\frac{g_m}{I_D}\\cdot\\frac{g_m}{C_{gs}}=\\frac{3\\mu}{L^2}\\]'
    ],
    points: [
      'Higher \\(V_{OV}\\) raises \\(\\omega_T\\) at the cost of current; shorter L raises it at the cost of intrinsic gain.',
      'SS below about 60 mV/dec at 300 K is unphysical.',
      'At fixed \\(I_D\\): \\(g_m\\propto\\sqrt W\\), \\(C_{gs}\\propto W\\), so \\(f_T\\propto1/\\sqrt W\\).',
      'Sizing: \\(g_m\\) → choose \\(g_m/I_D\\) and L → \\(I_D\\) → \\(W=I_D/(I_D/W)\\) from the table.'
    ],
    ids: [46, 47, 48, 15, 49, 52, 63, 50, 62, 60, 51, 61]
  },
  {
    key: 'G', title: 'SPICE',
    formulas: [],
    points: [
      '.op: capacitors open, inductors short, Newton–Raphson; it seeds every other analysis.',
      '.ac: linearized around the operating point, no distortion. .tran: starts from the operating point, companion models per time step.',
      'Spectre MOS line: <code>m1 (d g s b) model w=… l=…</code>; NMOS bulk to 0.'
    ],
    ids: [7, 8, 29, 30]
  }
];

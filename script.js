/* Neuroscape — Interactive behavior */

// ── Neuron part data ──
const neuronParts = {
  dendrites: {
    title: 'Dendrites',
    description: `Tree-like branching extensions that receive incoming signals from other neurons. Their name comes from the Greek dendron (tree). Dendrites are covered in thousands of tiny protrusions called dendritic spines, each hosting a synapse.`,
    fact: 'A single cortical pyramidal neuron can have up to 30,000 synapses on its dendritic tree.'
  },
  soma: {
    title: 'Soma (Cell Body)',
    description: `The metabolic hub of the neuron containing the nucleus and most organelles. It integrates all incoming dendritic signals and synthesizes proteins, neurotransmitters, and structural components needed throughout the cell.`,
    fact: 'The soma is typically 10–50 μm in diameter — barely visible to the naked eye.'
  },
  nucleus: {
    title: 'Nucleus',
    description: `The command center housing DNA that encodes proteins essential for neural function — ion channels, receptors, and neurotransmitter synthesis enzymes. Mature neurons rarely divide, maintaining a specialized gene expression profile.`,
    fact: 'Neuronal nuclei are unusually large and euchromatic, reflecting high transcriptional activity.'
  },
  'axon-hillock': {
    title: 'Axon Hillock',
    description: `The cone-shaped trigger zone where the axon emerges from the soma. It has the highest density of voltage-gated sodium channels and is where the decision to fire an action potential is made.`,
    fact: 'The axon hillock has up to 50× more sodium channels per unit area than the soma membrane.'
  },
  axon: {
    title: 'Axon',
    description: `A long projection conducting electrical impulses away from the soma. Axons can exceed a meter in length and use both anterograde and retrograde transport to move organelles and molecular cargo.`,
    fact: 'The longest axon in the human body runs from the base of the spine to the big toe (~1 meter).'
  },
  myelin: {
    title: 'Myelin Sheath',
    description: `A fatty insulating layer wrapped by glial cells that increases conduction velocity through saltatory conduction. Myelin is approximately 40% water and 60% lipids, giving white matter its characteristic pale color.`,
    fact: 'Myelination increases conduction speed up to 100× compared to unmyelinated fibers.'
  },
  nodes: {
    title: 'Nodes of Ranvier',
    description: `Gaps between myelin segments packed with voltage-gated sodium channels. Action potentials regenerate at each node, effectively "jumping" along the axon in saltatory conduction.`,
    fact: 'Nodes of Ranvier are only 1–2 μm wide but are critical for rapid signal transmission.'
  },
  'axon-terminals': {
    title: 'Axon Terminals',
    description: `Bulbous presynaptic endings where neurotransmitter-filled vesicles await release. Calcium influx during an action potential triggers vesicle fusion and neurotransmitter release into the synaptic cleft.`,
    fact: 'A single motor neuron can form over 1,000 neuromuscular junctions via its terminal boutons.'
  },
  synapse: {
    title: 'Synapse',
    description: `The junction where a neuron communicates with another cell. Neurotransmitters diffuse across the ~20–40 nm synaptic cleft and bind postsynaptic receptors. Synaptic strength changes underlie learning and memory.`,
    fact: 'The human brain contains more synapses than there are stars in the Milky Way galaxy.'
  }
};

// ── Interactive diagram ──
const detailPanel = document.getElementById('detail-panel');
const parts = document.querySelectorAll('.neuron-part');
const anatomyCards = document.querySelectorAll('.anatomy-card');

function showPart(partId) {
  const data = neuronParts[partId];
  if (!data) return;

  detailPanel.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <div class="detail-fact">${data.fact}</div>
  `;

  parts.forEach(p => p.classList.toggle('active', p.dataset.part === partId));
  anatomyCards.forEach(card => {
    const cardId = card.id.replace('card-', '');
    card.classList.toggle('highlight', cardId === partId);
  });
}

parts.forEach(part => {
  part.addEventListener('click', () => showPart(part.dataset.part));
  part.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showPart(part.dataset.part);
    }
  });
});

anatomyCards.forEach(card => {
  card.addEventListener('click', () => {
    const partId = card.id.replace('card-', '');
    showPart(partId);
    document.getElementById('anatomy').scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Mobile nav ──
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── Scroll reveal ──
const revealElements = document.querySelectorAll(
  '.section-header, .info-card, .type-card, .flow-step, .anatomy-card, .glial-card, .deep-card, .fact-card, .prose'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ── Neural network background canvas ──
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animId;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDist = 140;

    nodes.forEach((node, i) => {
      if (!prefersReducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  if (prefersReducedMotion) return;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
})();

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--synapse)'
            : '';
        });
      }
    });
  },
  { threshold: 0.3, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))}px 0px -60% 0px` }
);

sections.forEach(s => navObserver.observe(s));

let budget        = 0;
let currencySymbol = 'Rs';
let currencyCode  = 'PKR';
let items         = [];
let idCounter     = 0;
let activeFilter  = 'all';
let editingId     = null;

const CAT = {
  food:          { emoji: '🍔', label: 'Food',        color: '#ef4444' },
  transport:     { emoji: '🚗', label: 'Transport',   color: '#f59e0b' },
  shopping:      { emoji: '🛍️', label: 'Shopping',    color: '#3b6ef8' },
  health:        { emoji: '💊', label: 'Health',      color: '#22c55e' },
  bills:         { emoji: '⚡', label: 'Bills',       color: '#8b5cf6' },
  education:     { emoji: '📚', label: 'Education',   color: '#06b6d4' },
  entertainment: { emoji: '🎮', label: 'Fun',         color: '#ec4899' },
  other:         { emoji: '📦', label: 'Other',       color: '#9ca3af' },
};

const TIPS = [
  'Try the 50/30/20 rule — 50% for needs, 30% for wants, and 20% straight into savings.',
  'Review your biggest category every week. Even trimming 10% adds up fast.',
  'Always log expenses immediately — small amounts are easy to forget but add up quickly.',
  'Set aside your savings first before you start spending. Pay yourself first!',
  'Tracking consistently is the #1 habit of people who meet their financial goals.',
  'High-priority expenses should always be budgeted before discretionary spending.',
  'Consider whether each purchase is a need or a want before you add it.',
  'Great job tracking! Awareness of your spending is the first step to financial freedom.',
];
let tipIdx = 0;

function setQuick(val) {
  document.getElementById('budget-input').value = val;
}

function startTracking() {
  const inp = document.getElementById('budget-input');
  const val = parseFloat(inp.value);
  if (!val || val <= 0) {
    showToast('Please enter a valid budget amount.', 'warning');
    return;
  }

  const sel = document.getElementById('currency-select');
  currencyCode   = sel.value;
  currencySymbol = sel.options[sel.selectedIndex].dataset.sym;

  budget    = val;
  items     = [];
  idCounter = 0;
  editingId = null;
  activeFilter = 'all';

  document.getElementById('screen-setup').classList.remove('active');
  document.getElementById('screen-dashboard').classList.add('active');

  document.getElementById('nav-date').textContent = new Date().toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  document.getElementById('curr-sym-label').textContent = currencySymbol;

  updateStats();
  renderItems();
  renderBreakdown();
  updateTip();

  showToast(`Budget set to ${fmt(budget)}. Start adding expenses!`, 'success');
}

function resetBudget() {
  if (items.length > 0 && !confirm('Reset everything and start fresh?')) return;

  document.getElementById('screen-dashboard').classList.remove('active');
  document.getElementById('screen-setup').classList.add('active');
  document.getElementById('budget-input').value = '';
  items     = [];
  idCounter = 0;
  editingId = null;
}

function addItem() {
  const name     = document.getElementById('item-name').value.trim();
  const cat      = document.getElementById('item-cat').value;
  const priority = document.getElementById('item-priority').value;
  const amount   = parseFloat(document.getElementById('item-amount').value);
  const qty      = parseInt(document.getElementById('item-qty').value) || 1;

  // Validation
  if (!name) {
    showToast('Please enter an item name.', 'warning');
    document.getElementById('item-name').focus();
    return;
  }
  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount.', 'warning');
    document.getElementById('item-amount').focus();
    return;
  }

  const total  = amount * qty;
  const spent  = getTotalSpent();

  if (editingId !== null) {

    const old = items.find(i => i.id === editingId);
    const spentWithout = spent - (old ? old.total : 0);

    if (spentWithout + total > budget) {
      showToast(`This would exceed your remaining budget of ${fmt(budget - spentWithout)}.`, 'error');
      return;
    }

    const idx = items.findIndex(i => i.id === editingId);
    if (idx !== -1) {
      items[idx] = { ...items[idx], name, cat, priority, amount, qty, total };
    }
    showToast(`"${name}" updated successfully.`, 'success');
    stopEditing();

  } else {
    if (spent + total > budget) {
      showToast(`This exceeds your remaining budget of ${fmt(budget - spent)}.`, 'error');
      return;
    }
    items.push({ id: ++idCounter, name, cat, priority, amount, qty, total, date: new Date() });
    showToast(`"${name}" added — ${fmt(total)}.`, 'success');
    clearForm();
  }

  updateStats();
  renderItems();
  renderBreakdown();
  updateTip();
}

function editItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  editingId = id;

  document.getElementById('item-name').value     = item.name;
  document.getElementById('item-cat').value      = item.cat;
  document.getElementById('item-priority').value = item.priority;
  document.getElementById('item-amount').value   = item.amount;
  document.getElementById('item-qty').value      = item.qty;

  document.getElementById('btn-add').textContent = '💾 Save Changes';
  document.getElementById('btn-add').classList.add('editing');
  document.getElementById('btn-cancel').style.display = 'block';

  document.getElementById('item-name').focus();
  showToast('Editing item — make your changes and save.', 'warning');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  stopEditing();
  clearForm();
  showToast('Edit cancelled.', 'warning');
}

function stopEditing() {
  editingId = null;
  document.getElementById('btn-add').textContent = '➕ Add Expense';
  document.getElementById('btn-add').classList.remove('editing');
  document.getElementById('btn-cancel').style.display = 'none';
}

function clearForm() {
  document.getElementById('item-name').value   = '';
  document.getElementById('item-amount').value = '';
  document.getElementById('item-qty').value    = '1';
}

function deleteItem(id) {
  const item  = items.find(i => i.id === id);
  const card  = document.getElementById('row-' + id);

  if (card) {
    card.style.transition = 'opacity .25s, transform .25s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(30px)';
    setTimeout(() => finishDelete(id, item), 260);
  } else {
    finishDelete(id, item);
  }
}

function finishDelete(id, item) {
  items = items.filter(i => i.id !== id);
  updateStats();
  renderItems();
  renderBreakdown();
  updateTip();
  if (item) showToast(`"${item.name}" removed.`, 'warning');
  if (editingId === id) stopEditing();
}

function getTotalSpent() {
  return items.reduce((s, i) => s + i.total, 0);
}

function updateStats() {
  const spent     = getTotalSpent();
  const remaining = budget - spent;
  const pct       = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  document.getElementById('s-budget').textContent    = fmt(budget);
  document.getElementById('s-spent').textContent     = fmt(spent);
  document.getElementById('s-remaining').textContent = fmt(remaining);
  document.getElementById('s-items').textContent     = items.length;

  document.getElementById('prog-pct').textContent          = pct.toFixed(1) + '%';
  document.getElementById('prog-budget-label').textContent  = fmt(budget);

  const bar = document.getElementById('prog-bar');
  bar.style.width = pct + '%';
  bar.className   = 'progress-bar' + (pct >= 90 ? ' danger' : pct >= 70 ? ' warn' : '');

  const remCard = document.querySelector('.card-remaining .sc-value');
  if (remCard) {
    remCard.style.color = pct >= 90 ? 'var(--red)' : pct >= 70 ? 'var(--amber)' : 'var(--green)';
  }
}

function filterCat(el) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  activeFilter = el.dataset.cat;
  renderItems();
}

function renderItems() {
  const sort = document.getElementById('sort-select').value;
  let list   = activeFilter === 'all'
    ? [...items]
    : items.filter(i => i.cat === activeFilter);

  // Sort
  switch (sort) {
    case 'newest': list.sort((a, b) => b.id - a.id); break;
    case 'oldest': list.sort((a, b) => a.id - b.id); break;
    case 'high':   list.sort((a, b) => b.total - a.total); break;
    case 'low':    list.sort((a, b) => a.total - b.total); break;
  }

  const container = document.getElementById('items-container');

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧾</div>
        <p>${activeFilter === 'all'
          ? 'No expenses added yet.<br>Fill in the form above to get started.'
          : 'No items in this category.'
        }</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(item => {
    const meta = CAT[item.cat] || CAT.other;
    const priClass = { high: 'tag-pri-high', medium: 'tag-pri-medium', low: 'tag-pri-low' }[item.priority] || 'tag-pri-medium';
    const priLabel = { high: 'High', medium: 'Medium', low: 'Low' }[item.priority] || 'Medium';

    return `
      <div class="item-row" id="row-${item.id}">
        <div class="item-emoji">${meta.emoji}</div>
        <div class="item-info">
          <div class="item-name">${esc(item.name)}</div>
          <div class="item-tags">
            <span class="tag tag-cat">${meta.label}</span>
            <span class="tag ${priClass}">${priLabel}</span>
            ${item.qty > 1 ? `<span class="tag-qty">× ${item.qty}</span>` : ''}
          </div>
        </div>
        <div class="item-amount">${fmt(item.total)}</div>
        <div class="item-actions">
          <button class="icon-btn edit-btn" title="Edit" onclick="editItem(${item.id})">✏️</button>
          <button class="icon-btn del-btn"  title="Delete" onclick="deleteItem(${item.id})">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderBreakdown() {
  const el    = document.getElementById('breakdown-container');
  const spent = getTotalSpent();

  if (!items.length) {
    el.innerHTML = '<p class="empty-text">Add expenses to see a breakdown by category.</p>';
    return;
  }

  // Aggregate by category
  const totals = {};
  items.forEach(i => { totals[i.cat] = (totals[i.cat] || 0) + i.total; });
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  el.innerHTML = sorted.map(([cat, total]) => {
    const meta = CAT[cat] || CAT.other;
    const pct  = spent > 0 ? (total / spent * 100) : 0;
    return `
      <div class="breakdown-row">
        <div class="bd-dot" style="background:${meta.color}"></div>
        <div class="bd-label">${meta.label}</div>
        <div class="bd-right">
          <div class="bd-amt">${fmt(total)}</div>
          <div class="bd-pct">${pct.toFixed(1)}%</div>
        </div>
      </div>
      <div class="bd-bar-wrap">
        <div class="bd-bar" style="width:${pct}%; background:${meta.color}"></div>
      </div>
    `;
  }).join('');
}

function updateTip() {
  const spent = getTotalSpent();
  const pct   = budget > 0 ? (spent / budget * 100) : 0;
  let tip;

  if (pct >= 95) {
    tip = '🚨 You\'ve nearly used your entire budget. Avoid any further non-essential spending.';
  } else if (pct >= 80) {
    tip = '⚠️ You\'ve used over 80% of your budget. Only spend on essential items from here.';
  } else if (pct >= 60) {
    tip = '📊 You\'ve crossed 60% of your budget. Great time to review your spending.';
  } else if (!items.length) {
    tip = 'Add your first expense and we\'ll provide personalized budget tips here.';
  } else {
    tipIdx = (tipIdx + 1) % TIPS.length;
    tip = TIPS[tipIdx];
  }

  document.getElementById('tip-text').textContent = tip;
}

function showToast(msg, type = 'success') {
  const area  = document.getElementById('toast-area');
  const icons = { success: '✅', warning: '⚠️', error: '❌' };
  const toast = document.createElement('div');

  toast.className = `toast t-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  area.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('t-out');
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

function fmt(n) {
  return `${currencySymbol} ${Number(n).toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('screen-setup').classList.contains('active')) {
    startTracking();
  }
  if (e.key === 'Enter' && document.getElementById('screen-dashboard').classList.contains('active')) {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input') addItem();
  }
  if (e.key === 'Escape' && editingId !== null) cancelEdit();
});

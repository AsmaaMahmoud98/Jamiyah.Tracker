const { useState, useEffect, useMemo } = React;

const STORAGE_KEY = 'jamiya-tracker-data';

// ---------- Icon Set ----------
function Icon({ children, size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}
const IconUsers = (p) => <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Icon>;
const IconUserPlus = (p) => <Icon {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></Icon>;
const IconPlus = (p) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
const IconX = (p) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const IconEdit = (p) => <Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></Icon>;
const IconTrash = (p) => <Icon {...p}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></Icon>;
const IconAlertCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" /></Icon>;
const IconCheckCircle = (p) => <Icon {...p}><path d="M21.5 11.1V12a9.5 9.5 0 1 1-5.6-8.7" /><polyline points="22 4 12 14.5 9 11.5" /></Icon>;
const IconCoins = (p) => <Icon {...p}><circle cx="12" cy="12" r="8" /><path d="M9.5 9.3c0-1 .9-1.5 2-1.5s2.2.5 2.2 1.4c0 1.8-4.2 1-4.2 3.1 0 1 1 1.7 2.3 1.7s2.1-.6 2.1-1.5" /><line x1="12" y1="6.5" x2="12" y2="7.8" /><line x1="12" y1="16.2" x2="12" y2="17.5" /></Icon>;
const IconBanknote = (p) => <Icon {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><line x1="6" y1="12" x2="6.01" y2="12" /><line x1="18" y1="12" x2="18.01" y2="12" /></Icon>;
const IconArrowLeftRight = (p) => <Icon {...p}><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="M16 21l4-4-4-4" /><path d="M20 17H4" /></Icon>;
const IconChevronDown = (p) => <Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>;
const IconChevronUp = (p) => <Icon {...p}><polyline points="18 15 12 9 6 15" /></Icon>;
const IconRepeat = (p) => <Icon {...p}><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></Icon>;

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const JAMIYA_COLORS = [
  '#145C4B', '#CA9B3D', '#3D5A80', '#6B4E71',
  '#8A6D3B', '#2C3E66', '#4C6B3D', '#9C5A3C'
];

const PAYMENT_METHODS = ['نقداً', 'InstaPay', 'فودافون كاش', 'تحويل بنكي'];

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getMonthLabel(startMonth, index) {
  if (!startMonth) return `شهر ${index + 1}`;
  const [y, m] = startMonth.split('-').map(Number);
  const total = (m - 1) + index;
  const year = y + Math.floor(total / 12);
  const monthIdx = ((total % 12) + 12) % 12;
  return `${ARABIC_MONTHS[monthIdx]} ${year}`;
}

function fmt(n) {
  const v = Number(n) || 0;
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function emptyData() {
  return { jamiyas: {}, order: [], lastActiveId: null };
}

function clone(d) {
  return JSON.parse(JSON.stringify(d));
}

// حساب المبالغ والتحصيلات والسلفيات للدورة
function getCyclePayments(jamiya, cycle, cycleIndex) {
  const items = [];
  
  const recipientShare = cycle.shareId ? jamiya.shares.find(s => s.id === cycle.shareId) : null;
  const recipientMemberIds = recipientShare ? recipientShare.holders.map(h => h.memberId) : [];

  jamiya.shares.forEach((share) => {
    share.holders.forEach((h) => {
      if (recipientMemberIds.includes(h.memberId)) {
        return;
      }

      const member = jamiya.members.find((m) => m.id === h.memberId);
      let fullAmount = jamiya.monthlyShareAmount * (h.percentage / 100);

      const loans = jamiya.loans || [];
      loans.forEach((loan) => {
        // يتم تطبيق التعديل في شهر الرد فقط
        if (Number(loan.repayCycleIdx) === Number(cycleIndex)) {
          if (h.memberId === loan.borrowerId) fullAmount += Number(loan.amount);
          if (h.memberId === loan.lenderId) fullAmount -= Number(loan.amount);
        }
      });

      const key = `${share.id}::${h.memberId}`;
      const p = cycle.payments ? cycle.payments[key] : null;

      let paidAmount = 0;
      let isPaid = false;
      let paymentType = 'full';
      let date = null;
      let method = PAYMENT_METHODS[0];

      if (p) {
        if (typeof p === 'boolean' || p.paid !== undefined) {
          isPaid = !!p.paid;
          paidAmount = isPaid ? (p.amount !== undefined ? p.amount : fullAmount) : (p.amount || 0);
          paymentType = p.type || (paidAmount < fullAmount && paidAmount > 0 ? 'partial' : 'full');
          date = p.date || null;
          method = p.method || PAYMENT_METHODS[0];
        }
      }

      items.push({
        key,
        shareId: share.id,
        shareLabel: share.label,
        memberId: h.memberId,
        memberName: member ? member.name : 'عضو محذوف',
        percentage: h.percentage,
        fullAmount,
        paidAmount,
        remainingAmount: Math.max(0, fullAmount - paidAmount),
        paid: isPaid,
        paymentType,
        date,
        method
      });
    });
  });

  return items;
}

function holderPercentSum(holders) {
  if (!holders || !Array.isArray(holders)) return 0;
  return holders.reduce((s, h) => s + (Number(h.percentage) || 0), 0);
}

// ---------- Small UI Helpers ----------

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-[#5B6660] mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-[#DCD8CE] bg-white px-3 py-2 text-[#1C2321] outline-none focus:border-[#145C4B] focus:ring-1 focus:ring-[#145C4B] transition';

function ProgressBar({ value, max, color = '#145C4B' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="w-full h-2 rounded-full bg-[#EAE7DD] overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className={`w-full ${wide ? 'sm:max-w-lg' : 'sm:max-w-sm'} bg-[#FBFAF6] rounded-t-2xl sm:rounded-2xl max-h-[88vh] overflow-y-auto shadow-xl`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE7DD] sticky top-0 bg-[#FBFAF6]">
          <h3 className="text-base font-bold text-[#1C2321]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#EAE7DD] text-[#5B6660]">
            <IconX size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', full, type = 'button', disabled }) {
  const base = 'px-4 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-[#145C4B] text-white hover:bg-[#0F4C3D]',
    ghost: 'bg-transparent text-[#145C4B] hover:bg-[#E7F0EC] border border-[#145C4B]/30',
    danger: 'bg-[#B33A3A] text-white hover:bg-[#9A2F2F]',
    soft: 'bg-[#EAE7DD] text-[#1C2321] hover:bg-[#DFDBCF]'
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${full ? 'w-full' : ''}`}>
      {children}
    </button>
  );
}

function Avatar({ name, color }) {
  const initial = (name || '?').trim().charAt(0);
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ background: color || '#145C4B' }}
    >
      {initial}
    </div>
  );
}

// ---------- Main Application Component ----------

function loadInitialData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return emptyData();
}

function App() {
  const [data, setData] = useState(loadInitialData);
  const [activeId, setActiveId] = useState(() => {
    const d = loadInitialData();
    return d.lastActiveId && d.jamiyas[d.lastActiveId] ? d.lastActiveId : (d.order[0] || null);
  });
  const [tab, setTab] = useState('overview');
  const [modal, setModal] = useState(null);
  const [expandedCycle, setExpandedCycle] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  const jamiya = data && activeId ? data.jamiyas[activeId] : null;

  const currentCycleIndex = useMemo(() => {
    if (!jamiya) return -1;
    const idx = jamiya.cycles.findIndex((c) => !c.payoutDelivered);
    return idx !== -1 ? idx : Math.max(0, jamiya.cycles.length - 1);
  }, [jamiya]);

  function update(fn) {
    setData((prev) => {
      const d = clone(prev);
      fn(d);
      return d;
    });
  }

  function switchTo(id) {
    setActiveId(id);
    setTab('overview');
    update((d) => { d.lastActiveId = id; });
  }

  function saveJamiya(form, editId) {
    if (editId) {
      update((d) => {
        const j = d.jamiyas[editId];
        j.name = form.name; j.color = form.color;
        j.monthlyShareAmount = Number(form.amount);
        j.currency = form.currency || 'ج.م';
        j.startMonth = form.startMonth;
      });
    } else {
      const id = uid('jam');
      update((d) => {
        d.jamiyas[id] = {
          id, name: form.name, color: form.color,
          monthlyShareAmount: Number(form.amount), currency: form.currency || 'ج.م',
          startMonth: form.startMonth, members: [], shares: [], cycles: [], loans: []
        };
        d.order.push(id);
        d.lastActiveId = id;
      });
      setActiveId(id);
    }
    setModal(null);
  }

  function deleteJamiya(id) {
    update((d) => {
      delete d.jamiyas[id];
      d.order = d.order.filter((x) => x !== id);
      if (d.lastActiveId === id) d.lastActiveId = d.order[0] || null;
    });
    setActiveId((prev) => (prev === id ? (data.order.filter((x) => x !== id)[0] || null) : prev));
    setModal(null);
  }

  function saveMember(form, editId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      if (editId) {
        const m = j.members.find((x) => x.id === editId);
        m.name = form.name; m.phone = form.phone;
      } else {
        j.members.push({ id: uid('mem'), name: form.name, phone: form.phone || '' });
      }
    });
    setModal(null);
  }

  function deleteMember(memberId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.members = j.members.filter((m) => m.id !== memberId);
      j.shares.forEach((s) => { s.holders = s.holders.filter((h) => h.memberId !== memberId); });
    });
    setModal(null);
  }

  function addShare() {
    const shareId = uid('shr');
    update((d) => {
      const j = d.jamiyas[activeId];
      j.shares.push({ id: shareId, label: `سهم ${j.shares.length + 1}`, holders: [] });
      j.cycles.push({ id: uid('cyc'), shareId: null, payments: {}, payoutDelivered: false, payoutDate: null, receivedStatus: {} });
    });
    setModal({ type: 'share', mode: 'edit', shareId });
  }

  function saveShareLabel(shareId, label) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.shares.find((s) => s.id === shareId).label = label;
    });
  }

  function saveShareHolders(shareId, holders) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.shares.find((s) => s.id === shareId).holders = holders;
    });
    setModal(null);
  }

  function deleteShare(shareId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.shares = j.shares.filter((s) => s.id !== shareId);
      j.cycles.forEach((c) => { if (c.shareId === shareId) c.shareId = null; });
      j.cycles.pop();
    });
    setModal(null);
  }

  function assignShareToCycle(cycleId, shareId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.cycles.forEach((c) => { if (c.id !== cycleId && c.shareId === shareId) c.shareId = null; });
      const target = j.cycles.find((c) => c.id === cycleId);
      target.shareId = shareId || null;
    });
  }

  function savePaymentDetails(cycleId, shareId, memberId, payData) {
    update((d) => {
      const j = d.jamiyas[activeId];
      const c = j.cycles.find((x) => x.id === cycleId);
      const key = `${shareId}::${memberId}`;
      c.payments[key] = {
        paid: payData.paidAmount > 0,
        amount: payData.paidAmount,
        type: payData.type,
        date: payData.paidAmount > 0 ? (payData.date || todayISO()) : null,
        method: payData.method || PAYMENT_METHODS[0]
      };
    });
    setModal(null);
  }

  function toggleMemberReceived(cycleId, memberId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      const c = j.cycles.find((x) => x.id === cycleId);
      if (!c.receivedStatus) c.receivedStatus = {};
      c.receivedStatus[memberId] = !c.receivedStatus[memberId];
    });
  }

  function markPayoutDelivered(cycleId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      const c = j.cycles.find((x) => x.id === cycleId);
      c.payoutDelivered = !c.payoutDelivered;
      c.payoutDate = c.payoutDelivered ? todayISO() : null;
    });
  }

  function saveLoan(loanData) {
    update((d) => {
      const j = d.jamiyas[activeId];
      if (!j.loans) j.loans = [];
      j.loans.push({
        id: uid('loan'),
        borrowerId: loanData.borrowerId,
        lenderId: loanData.lenderId,
        amount: Number(loanData.amount),
        borrowCycleIdx: Number(loanData.borrowCycleIdx),
        repayCycleIdx: Number(loanData.repayCycleIdx),
        repaid: false
      });
    });
    setModal(null);
  }

  function deleteLoan(loanId) {
    update((d) => {
      const j = d.jamiyas[activeId];
      j.loans = (j.loans || []).filter(l => l.id !== loanId);
    });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F5F1]">
      {(!data.order.length) ? (
        <EmptyState onAdd={() => setModal({ type: 'jamiya', mode: 'add' })} />
      ) : (
        <>
          <Header
            data={data} activeId={activeId} switchTo={switchTo}
            onAdd={() => setModal({ type: 'jamiya', mode: 'add' })}
          />
          {jamiya && (
            <>
              <JamiyaBar
                jamiya={jamiya}
                onEdit={() => setModal({ type: 'jamiya', mode: 'edit', editId: jamiya.id })}
                onDelete={() => setModal({
                  type: 'confirm', title: 'حذف الجمعية',
                  message: `هل أنت متأكد من حذف جمعية "${jamiya.name}"؟ سيتم فقدان كل البيانات المرتبطة بها.`,
                  onConfirm: () => deleteJamiya(jamiya.id)
                })}
              />
              <TabsNav tab={tab} setTab={setTab} />
              <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
                {tab === 'overview' && (
                  <Overview
                    jamiya={jamiya}
                    currentCycleIndex={currentCycleIndex}
                    onOpenPaymentModal={(cycleId, item) => setModal({ type: 'payment', cycleId, item })}
                    onToggleReceived={toggleMemberReceived}
                    onOpenLoanModal={() => setModal({ type: 'loan' })}
                    onDeleteLoan={deleteLoan}
                  />
                )}
                {tab === 'members' && (
                  <MembersTab
                    jamiya={jamiya}
                    onAdd={() => setModal({ type: 'member', mode: 'add' })}
                    onEdit={(m) => setModal({ type: 'member', mode: 'edit', editId: m.id, initial: m })}
                    onDelete={(m) => setModal({
                      type: 'confirm', title: 'حذف عضو',
                      message: `هل تريد حذف "${m.name}"؟ سيتم إزالته من أي سهم مشارك فيه.`,
                      onConfirm: () => deleteMember(m.id)
                    })}
                  />
                )}
                {tab === 'shares' && (
                  <SharesTab
                    jamiya={jamiya}
                    onAdd={addShare}
                    onEditHolders={(s) => setModal({ type: 'share', mode: 'edit', shareId: s.id })}
                    onRename={(s, label) => saveShareLabel(s.id, label)}
                    onDelete={(s) => setModal({
                      type: 'confirm', title: 'حذف السهم',
                      message: `هل تريد حذف "${s.label}"؟`,
                      onConfirm: () => deleteShare(s.id)
                    })}
                  />
                )}
                {tab === 'schedule' && (
                  <ScheduleTab
                    jamiya={jamiya}
                    currentCycleIndex={currentCycleIndex}
                    expandedCycle={expandedCycle}
                    setExpandedCycle={setExpandedCycle}
                    assignShareToCycle={assignShareToCycle}
                    onOpenPaymentModal={(cycleId, item) => setModal({ type: 'payment', cycleId, item })}
                    onToggleReceived={toggleMemberReceived}
                    markPayoutDelivered={markPayoutDelivered}
                  />
                )}
              </main>
            </>
          )}
        </>
      )}

      {/* Modals */}
      {modal && modal.type === 'jamiya' && (
        <JamiyaModal
          initial={modal.editId ? data.jamiyas[modal.editId] : null}
          onClose={() => setModal(null)}
          onSave={(form) => saveJamiya(form, modal.editId)}
        />
      )}
      {modal && modal.type === 'member' && (
        <MemberModal
          initial={modal.initial}
          onClose={() => setModal(null)}
          onSave={(form) => saveMember(form, modal.editId)}
        />
      )}
      {modal && modal.type === 'share' && jamiya && (
        <ShareHoldersModal
          jamiya={jamiya}
          share={jamiya.shares.find((s) => s.id === modal.shareId)}
          onClose={() => setModal(null)}
          onSave={(holders) => saveShareHolders(modal.shareId, holders)}
        />
      )}
      {modal && modal.type === 'payment' && jamiya && (
        <PaymentModal
          jamiya={jamiya}
          item={modal.item}
          onClose={() => setModal(null)}
          onSave={(payData) => savePaymentDetails(modal.cycleId, modal.item.shareId, modal.item.memberId, payData)}
        />
      )}
      {modal && modal.type === 'loan' && jamiya && (
        <LoanModal
          jamiya={jamiya}
          onClose={() => setModal(null)}
          onSave={saveLoan}
        />
      )}
      {modal && modal.type === 'confirm' && (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          <p className="text-sm text-[#3E463F] mb-5">{modal.message}</p>
          <div className="flex gap-2">
            <Btn variant="danger" full onClick={modal.onConfirm}>تأكيد الحذف</Btn>
            <Btn variant="soft" full onClick={() => setModal(null)}>إلغاء</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Header / Navigation ----------

function EmptyState({ onAdd }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#145C4B] flex items-center justify-center mb-4">
        <IconCoins className="text-white" size={28} />
      </div>
      <h1 className="text-xl font-extrabold text-[#1C2321] mb-2">إدارة الجمعيات</h1>
      <p className="text-[#5B6660] text-sm mb-6 max-w-xs">
        نظّم جمعيتك الشهرية، قسّم الأسهَم، تتبع الدفع والاستلام ونظام السلف بكل سهولة.
      </p>
      <Btn onClick={onAdd}>
        <span className="flex items-center gap-2"><IconPlus size={18} /> إنشاء جمعية جديدة</span>
      </Btn>
    </div>
  );
}

function Header({ data, activeId, switchTo, onAdd }) {
  return (
    <div className="sticky top-0 z-30 bg-[#F6F5F1]/95 backdrop-blur border-b border-[#EAE7DD]">
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {data.order.map((id) => {
          const j = data.jamiyas[id];
          const active = id === activeId;
          return (
            <button
              key={id}
              onClick={() => switchTo(id)}
              className={`flex items-center gap-2 shrink-0 px-3 py-2 rounded-full text-sm font-bold transition border ${
                active ? 'text-white border-transparent' : 'bg-white text-[#3E463F] border-[#EAE7DD]'
              }`}
              style={active ? { background: j.color } : {}}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: active ? '#fff' : j.color }} />
              {j.name}
            </button>
          );
        })}
        <button onClick={onAdd} className="shrink-0 p-2 rounded-full bg-white border border-[#EAE7DD] text-[#145C4B]">
          <IconPlus size={18} />
        </button>
      </div>
    </div>
  );
}

function JamiyaBar({ jamiya, onEdit, onDelete }) {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-2 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-extrabold text-[#1C2321]">{jamiya.name}</h2>
        <p className="text-xs text-[#5B6660]">
          {fmt(jamiya.monthlyShareAmount)} {jamiya.currency} / السهم شهرياً · {jamiya.shares.length} سهم
        </p>
      </div>
      <div className="flex gap-1">
        <button onClick={onEdit} className="p-2 rounded-full hover:bg-[#EAE7DD] text-[#5B6660]"><IconEdit size={16} /></button>
        <button onClick={onDelete} className="p-2 rounded-full hover:bg-[#EAE7DD] text-[#B33A3A]"><IconTrash size={16} /></button>
      </div>
    </div>
  );
}

function TabsNav({ tab, setTab }) {
  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'members', label: 'الأعضاء' },
    { id: 'shares', label: 'الأسهَم' },
    { id: 'schedule', label: 'الجدول الشهرى' }
  ];
  return (
    <div className="max-w-2xl mx-auto px-4 mt-3 flex gap-1 border-b border-[#EAE7DD]">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`px-3 py-2 text-sm font-bold border-b-2 -mb-px transition ${
            tab === t.id ? 'border-[#145C4B] text-[#145C4B]' : 'border-transparent text-[#5B6660]'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Tab 1: Overview (نظرة عامة) ----------

function Overview({ jamiya, currentCycleIndex, onOpenPaymentModal, onToggleReceived, onOpenLoanModal, onDeleteLoan }) {
  const totalShares = jamiya.shares.length;
  const totalMembers = jamiya.members.length;
  const monthlyPot = jamiya.monthlyShareAmount * totalShares;
  const remaining = jamiya.cycles.filter((c) => !c.payoutDelivered).length;

  const cycle = currentCycleIndex >= 0 ? jamiya.cycles[currentCycleIndex] : null;
  const items = cycle ? getCyclePayments(jamiya, cycle, currentCycleIndex) : [];
  
  const collected = items.reduce((s, i) => s + i.paidAmount, 0);
  const due = items.reduce((s, i) => s + i.fullAmount, 0);

  const recipientShare = cycle && cycle.shareId ? jamiya.shares.find((s) => s.id === cycle.shareId) : null;
  const loans = jamiya.loans || [];

  if (totalShares === 0) {
    return (
      <div className="text-center py-16 text-[#5B6660]">
        <IconAlertCircle className="mx-auto mb-2 text-[#CA9B3D]" size={28} />
        <p className="text-sm">لا يوجد أسهم في هذه الجمعية بعد. ابدأ من تبويب "الأسهَم".</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon={<IconUsers size={16} />} label="الأعضاء" value={totalMembers} />
        <StatCard icon={<IconCoins size={16} />} label="الأسهَم" value={totalShares} />
        <StatCard icon={<IconClock size={16} />} label="أدوار متبقية" value={remaining} />
      </div>

      {/* قسم السلفيات */}
      <div className="bg-white rounded-2xl border border-[#EAE7DD] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IconRepeat className="text-[#CA9B3D]" size={18} />
            <h3 className="font-bold text-sm text-[#1C2321]">نظام السلفيات بين الأعضاء</h3>
          </div>
          <Btn variant="ghost" onClick={onOpenLoanModal}>
            <span className="flex items-center gap-1 text-xs"><IconPlus size={14} /> إضافة سلفة</span>
          </Btn>
        </div>

        {loans.length === 0 ? (
          <p className="text-xs text-[#5B6660] text-center py-2">لا توجد سلفيات مسجلة حالياً.</p>
        ) : (
          <div className="space-y-2">
            {loans.map((loan) => {
              const borrower = jamiya.members.find(m => m.id === loan.borrowerId);
              const lender = jamiya.members.find(m => m.id === loan.lenderId);
              return (
                <div key={loan.id} className="bg-[#FBF9F3] p-2.5 rounded-lg border border-[#EAE7DD] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1C2321]">
                      استلف <span className="text-[#145C4B]">{borrower ? borrower.name : '—'}</span> مبلغ <span className="text-[#CA9B3D]">{fmt(loan.amount)} {jamiya.currency}</span> من <span className="text-[#3D5A80]">{lender ? lender.name : '—'}</span>
                    </p>
                    <p className="text-[11px] text-[#5B6660] mt-0.5">
                      شهر الاستلاف: {getMonthLabel(jamiya.startMonth, loan.borrowCycleIdx)} | شهر الرد: {getMonthLabel(jamiya.startMonth, loan.repayCycleIdx)}
                    </p>
                  </div>
                  <button onClick={() => onDeleteLoan(loan.id)} className="p-1 text-[#B33A3A] hover:bg-[#FBEFEF] rounded">
                    <IconTrash size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* جدول التحصيل للشهر الجاري */}
      {cycle ? (
        <div className="bg-white rounded-2xl border border-[#145C4B] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-[#EAE7DD] pb-2">
            <div>
              <span className="text-xs font-bold text-[#CA9B3D] bg-[#FBF3E1] px-2.5 py-1 rounded-full">
                الشهر الجاري: {getMonthLabel(jamiya.startMonth, currentCycleIndex)}
              </span>
            </div>
            <span className="text-xs font-bold text-[#145C4B]">إجمالي الدور: {fmt(monthlyPot)} {jamiya.currency}</span>
          </div>

          {/* تفاصيل المستلم لهذا الشهر */}
          {recipientShare ? (
            <div className="bg-[#E7F0EC]/50 p-3 rounded-xl mb-4 border border-[#145C4B]/20">
              <div className="flex items-center gap-2 mb-2">
                <IconBanknote className="text-[#145C4B]" size={18} />
                <p className="text-sm font-bold text-[#1C2321]">
                  المستلم هذا الشهر: {recipientShare.label}
                </p>
              </div>

              {/* بطاقات الشركاء في السهم مع حساب المبلغ المستحق الفعلي ضرباً بنسبة المشاركة في المبلغ الإجمالي المطلوب تحصيله */}
              <div className="space-y-1.5 pt-1">
                {recipientShare.holders.map((h) => {
                  const m = jamiya.members.find((mm) => mm.id === h.memberId);
                  // التعديل الحسابي المطلوبة: ضرب نسبة العضو في السهم X المبلغ الإجمالي المطلوب تحصيله (due)
                  const actualShareAmount = (due * h.percentage) / 100;
                  const isReceived = !!(cycle.receivedStatus && cycle.receivedStatus[h.memberId]);

                  return (
                    <div key={h.memberId} className="bg-white p-2.5 rounded-lg border border-[#EAE7DD] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#1C2321]">
                          {m ? m.name : '—'} <span className="text-[11px] font-normal text-[#5B6660]">({h.percentage}%)</span>
                        </p>
                        <p className="text-xs font-bold text-[#145C4B] mt-0.5">
                          المبلغ المستحق الفعلي: {fmt(actualShareAmount)} {jamiya.currency}
                        </p>
                      </div>

                      <button
                        onClick={() => onToggleReceived(cycle.id, h.memberId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          isReceived
                            ? 'bg-[#145C4B] text-white'
                            : 'bg-[#EAE7DD] text-[#3E463F] hover:bg-[#DFDBCF]'
                        }`}
                      >
                        <IconCheck size={14} />
                        {isReceived ? 'تم الاستلام' : 'تم'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#B33A3A] mb-3 flex items-center gap-1">
              <IconAlertCircle size={15} /> لم يتم تحديد المستلم لهذا الشهر بعد.
            </p>
          )}

          {/* شريط الإنجاز */}
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs text-[#5B6660]">
              <span>المحصل فعلياً: {fmt(collected)} {jamiya.currency}</span>
              <span>الإجمالي المطلوب تحصيله: {fmt(due)} {jamiya.currency}</span>
            </div>
            <ProgressBar value={collected} max={due} color={jamiya.color} />
          </div>

          {/* قائمة التحصيل */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#3E463F] mb-2">قائمة التحصيل لهذا الشهر:</h4>
            {items.map((it) => (
              <div key={it.key} className="flex items-center justify-between p-2 rounded-lg bg-[#FBF9F3] border border-[#EAE7DD]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPaymentModal(cycle.id, it)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      it.paid ? 'bg-[#145C4B] text-white' : 'border border-[#DCD8CE] bg-white text-transparent'
                    }`}
                  >
                    <IconCheck size={14} />
                  </button>
                  <div>
                    <p className="text-xs font-bold text-[#1C2321]">{it.memberName} <span className="text-[10px] font-normal text-[#5B6660]">({it.shareLabel})</span></p>
                    <p className="text-[10px] text-[#5B6660]">
                      المستحق: {fmt(it.fullAmount)} {jamiya.currency} | المدفوع: {fmt(it.paidAmount)} {jamiya.currency}
                    </p>
                  </div>
                </div>

                <div className="text-left flex items-center gap-2">
                  {it.remainingAmount > 0 ? (
                    <span className="text-[10px] font-bold text-[#B33A3A] bg-[#FBEFEF] px-2 py-0.5 rounded-full">
                      متبقي: {fmt(it.remainingAmount)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#145C4B] bg-[#E7F0EC] px-2 py-0.5 rounded-full">
                      مكتمل ({it.method})
                    </span>
                  )}
                  <button onClick={() => onOpenPaymentModal(cycle.id, it)} className="p-1 hover:bg-[#EAE7DD] rounded text-[#5B6660]">
                    <IconEdit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE7DD] p-6 text-center">
          <IconCheckCircle className="mx-auto mb-2 text-[#145C4B]" size={26} />
          <p className="text-sm text-[#3E463F]">تم تسليم كافة الأدوار بالكامل 🎉</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-[#EAE7DD] p-3 text-center">
      <div className="flex items-center justify-center text-[#145C4B] mb-1">{icon}</div>
      <p className="text-lg font-extrabold text-[#1C2321] leading-none">{value}</p>
      <p className="text-[11px] text-[#5B6660] mt-1">{label}</p>
    </div>
  );
}

// ---------- Tab 2: Members (الأعضاء) ----------

function MembersTab({ jamiya, onAdd, onEdit, onDelete }) {
  function memberLoad(memberId) {
    let total = 0;
    const holdings = [];
    jamiya.shares.forEach((s) => {
      const h = s.holders.find((x) => x.memberId === memberId);
      if (h) {
        const amt = jamiya.monthlyShareAmount * (h.percentage / 100);
        total += amt;
        holdings.push({ label: s.label, percentage: h.percentage, amount: amt });
      }
    });
    return { total, holdings };
  }

  return (
    <div className="space-y-3">
      <Btn onClick={onAdd}><span className="flex items-center gap-2"><IconUserPlus size={16} /> إضافة عضو</span></Btn>

      {jamiya.members.length === 0 && (
        <p className="text-sm text-[#5B6660] text-center py-8">لا يوجد أعضاء. قم بإضافة أعضاء للجمعية.</p>
      )}

      {jamiya.members.map((m) => {
        const { total, holdings } = memberLoad(m.id);
        return (
          <div key={m.id} className="bg-white rounded-xl border border-[#EAE7DD] p-3">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} color={jamiya.color} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1C2321] text-sm">{m.name}</p>
                {m.phone && <p className="text-xs text-[#5B6660]">{m.phone}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => onEdit(m)} className="p-1.5 rounded-full hover:bg-[#EAE7DD] text-[#5B6660]"><IconEdit size={14} /></button>
                <button onClick={() => onDelete(m)} className="p-1.5 rounded-full hover:bg-[#EAE7DD] text-[#B33A3A]"><IconTrash size={14} /></button>
              </div>
            </div>
            {holdings.length > 0 ? (
              <div className="mt-2 pr-12 flex flex-wrap gap-1">
                {holdings.map((h, i) => (
                  <span key={i} className="text-[11px] bg-[#F0EFE8] text-[#3E463F] px-2 py-0.5 rounded-full">
                    {h.label} · {h.percentage}% ({fmt(h.amount)} {jamiya.currency})
                  </span>
                ))}
                <span className="text-[11px] font-bold text-[#145C4B] px-2 py-0.5">
                  الالتزام الشهري: {fmt(total)} {jamiya.currency}
                </span>
              </div>
            ) : (
              <p className="mt-2 pr-12 text-[11px] text-[#5B6660]">غير مشارك في أي سهم حالياً</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Tab 3: Shares (الأسهم) ----------

function SharesTab({ jamiya, onAdd, onEditHolders, onRename, onDelete }) {
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState('');

  return (
    <div className="space-y-3">
      <Btn onClick={onAdd}><span className="flex items-center gap-2"><IconPlus size={16} /> سهم جديد</span></Btn>

      {jamiya.shares.length === 0 && (
        <p className="text-sm text-[#5B6660] text-center py-8">لا يوجد أسهم. كل سهم قيمته {fmt(jamiya.monthlyShareAmount)} {jamiya.currency} شهرياً ويمكن تقسيمه على أكثر من عضو.</p>
      )}

      {jamiya.shares.map((s) => {
        const sum = holderPercentSum(s.holders);
        const complete = s.holders.length > 0 && Math.round(sum) === 100;
        return (
          <div key={s.id} className="bg-white rounded-xl border border-[#EAE7DD] p-3">
            <div className="flex items-center justify-between mb-2">
              {renaming === s.id ? (
                <input
                  autoFocus
                  className="text-sm font-bold border-b border-[#145C4B] bg-transparent outline-none flex-1 ml-2"
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={() => { onRename(s, renameVal || s.label); setRenaming(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                />
              ) : (
                <button onClick={() => { setRenaming(s.id); setRenameVal(s.label); }} className="font-bold text-[#1C2321] text-sm text-right">
                  {s.label}
                </button>
              )}
              <div className="flex items-center gap-1">
                {complete ? (
                  <span className="text-[11px] text-[#145C4B] bg-[#E7F0EC] px-2 py-0.5 rounded-full">مكتمل 100%</span>
                ) : (
                  <span className="text-[11px] text-[#B33A3A] bg-[#FBEFEF] px-2 py-0.5 rounded-full">{Math.round(sum)}% فقط</span>
                )}
                <button onClick={() => onDelete(s)} className="p-1.5 rounded-full hover:bg-[#EAE7DD] text-[#B33A3A]"><IconTrash size={14} /></button>
              </div>
            </div>

            {s.holders.length > 0 ? (
              <div className="space-y-1.5 mb-2">
                {s.holders.map((h) => {
                  const m = jamiya.members.find((mm) => mm.id === h.memberId);
                  const amt = jamiya.monthlyShareAmount * (h.percentage / 100);
                  return (
                    <div key={h.memberId} className="flex items-center gap-2 text-xs">
                      <span className="w-24 shrink-0 text-[#3E463F]">{m ? m.name : 'عضو محذوف'}</span>
                      <div className="flex-1"><ProgressBar value={h.percentage} max={100} color={jamiya.color} /></div>
                      <span className="w-10 text-left text-[#5B6660]">{h.percentage}%</span>
                      <span className="w-20 text-left text-[#5B6660]">{fmt(amt)} {jamiya.currency}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#5B6660] mb-2">لم يتم إضافة أعضاء لهذا السهم بعد</p>
            )}

            <button onClick={() => onEditHolders(s)} className="text-xs font-bold text-[#145C4B] flex items-center gap-1">
              <IconArrowLeftRight size={13} /> تقسيم السهم / تعديل المشاركين
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Tab 4: Schedule (الجدول الشهري) ----------

function ScheduleTab({ jamiya, currentCycleIndex, expandedCycle, setExpandedCycle, assignShareToCycle, onOpenPaymentModal, onToggleReceived, markPayoutDelivered }) {
  if (jamiya.cycles.length === 0) {
    return <p className="text-sm text-[#5B6660] text-center py-8">سيظهر الجدول الشهري هنا فور إضافة أسهم.</p>;
  }

  return (
    <div className="space-y-3">
      {jamiya.cycles.map((cycle, idx) => {
        const items = getCyclePayments(jamiya, cycle, idx);
        const collected = items.reduce((s, i) => s + i.paidAmount, 0);
        const due = items.reduce((s, i) => s + i.fullAmount, 0);
        const pot = jamiya.monthlyShareAmount * jamiya.shares.length;
        const share = cycle.shareId ? jamiya.shares.find((s) => s.id === cycle.shareId) : null;
        const isCurrent = idx === currentCycleIndex;
        const isExpanded = expandedCycle === cycle.id || (expandedCycle === null && isCurrent);
        const assignedElsewhere = (shareId) => jamiya.cycles.some((c) => c.id !== cycle.id && c.shareId === shareId);

        return (
          <div
            key={cycle.id}
            className={`bg-white rounded-xl border p-3 ${isCurrent ? 'border-[#145C4B]' : 'border-[#EAE7DD]'} ${cycle.payoutDelivered ? 'opacity-70' : ''}`}
          >
            <button className="w-full flex items-center justify-between" onClick={() => setExpandedCycle(isExpanded ? '__none__' : cycle.id)}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#8A6D3B] bg-[#FBF3E1] w-6 h-6 rounded-full flex items-center justify-center">{idx + 1}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1C2321]">{getMonthLabel(jamiya.startMonth, idx)}</p>
                  <p className="text-[11px] text-[#5B6660]">{share ? share.label : 'لم يحدد السهم'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cycle.payoutDelivered && <IconCheckCircle size={16} className="text-[#145C4B]" />}
                {isExpanded ? <IconChevronUp size={16} className="text-[#5B6660]" /> : <IconChevronDown size={16} className="text-[#5B6660]" />}
              </div>
            </button>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-[#EAE7DD] space-y-3">
                <Field label="صاحب الدور هذا الشهر">
                  <select
                    className={inputCls}
                    value={cycle.shareId || ''}
                    onChange={(e) => assignShareToCycle(cycle.id, e.target.value || null)}
                  >
                    <option value="">— اختر السهم —</option>
                    {jamiya.shares.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}{assignedElsewhere(s.id) ? ' (مسند لشهر آخر)' : ''}
                      </option>
                    ))}
                  </select>
                </Field>

                {share && (
                  <div className="bg-[#F0EFE8] rounded-lg p-2.5 space-y-2">
                    <p className="text-xs font-bold text-[#3E463F]">مبلغ الاستلام الكلي: {fmt(pot)} {jamiya.currency}</p>
                    <div className="space-y-1.5 border-t border-[#DCD8CE] pt-1.5">
                      {share.holders.map((h) => {
                        const m = jamiya.members.find((mm) => mm.id === h.memberId);
                        const isReceived = !!(cycle.receivedStatus && cycle.receivedStatus[h.memberId]);
                        // تم أيضاً التحديث هنا لحساب المبلغ الفعلي المستحق تسليمه بناءً على إجمالي المبالغ المطلوبة في الدورة
                        const actualShareAmount = (due * h.percentage) / 100;

                        return (
                          <div key={h.memberId} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-[#EAE7DD]">
                            <div>
                              <span className="font-bold text-[#1C2321]">{m ? m.name : '—'}</span>
                              <span className="text-[10px] text-[#5B6660] mr-1">({h.percentage}%)</span>
                              <p className="text-[11px] font-bold text-[#145C4B]">المستحق الفعلي: {fmt(actualShareAmount)} {jamiya.currency}</p>
                            </div>
                            <button
                              onClick={() => onToggleReceived(cycle.id, h.memberId)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                                isReceived
                                  ? 'bg-[#145C4B] text-white'
                                  : 'bg-[#EAE7DD] text-[#3E463F] hover:bg-[#DFDBCF]'
                              }`}
                            >
                              <IconCheck size={12} />
                              {isReceived ? 'تم الاستلام' : 'تم'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-xs text-[#5B6660] mb-1">
                    <span>التحصيل: {fmt(collected)} {jamiya.currency}</span>
                    <span>{fmt(due)} {jamiya.currency}</span>
                  </div>
                  <ProgressBar value={collected} max={due} color={jamiya.color} />
                </div>

                <div className="space-y-1.5">
                  {items.map((it) => (
                    <div key={it.key} className="flex items-center gap-2 p-1.5 rounded border border-[#EAE7DD]/60">
                      <button
                        onClick={() => onOpenPaymentModal(cycle.id, it)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          it.paid ? 'bg-[#145C4B] text-white' : 'border border-[#DCD8CE] text-transparent'
                        }`}
                      >
                        <IconCheck size={12} />
                      </button>
                      <span className="text-xs text-[#1C2321] flex-1">{it.memberName} <span className="text-[#5B6660]">· {it.shareLabel}</span></span>
                      <span className="text-xs text-[#5B6660]">{fmt(it.paidAmount)} / {fmt(it.fullAmount)}</span>
                      <button onClick={() => onOpenPaymentModal(cycle.id, it)} className="p-1 text-[#5B6660]">
                        <IconEdit size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {share && (
                  <Btn variant={cycle.payoutDelivered ? 'soft' : 'primary'} full onClick={() => markPayoutDelivered(cycle.id)}>
                    {cycle.payoutDelivered ? 'إلغاء تأكيد التسليم' : 'تأكيد تسليم الدور'}
                  </Btn>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Modals Component Definitions ----------

function PaymentModal({ jamiya, item, onClose, onSave }) {
  const [payType, setPayType] = useState(item.paymentType || 'full');
  const [amount, setAmount] = useState(item.paidAmount || (payType === 'full' ? item.fullAmount : 0));
  const [method, setMethod] = useState(item.method || PAYMENT_METHODS[0]);
  const [date, setDate] = useState(item.date || todayISO());

  useEffect(() => {
    if (payType === 'full') {
      setAmount(item.fullAmount);
    }
  }, [payType]);

  const remaining = Math.max(0, item.fullAmount - (Number(amount) || 0));

  function handleSave() {
    onSave({
      type: payType,
      paidAmount: payType === 'full' ? item.fullAmount : Number(amount),
      method,
      date
    });
  }

  return (
    <Modal title={`تسجيل تحصيل: ${item.memberName}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[#F0EFE8] p-2.5 rounded-lg text-xs">
          <p>السهم: <b>{item.shareLabel}</b></p>
          <p>القيمة المستحقة كاملة: <b>{fmt(item.fullAmount)} {jamiya.currency}</b></p>
        </div>

        <Field label="نوع التحصيل">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPayType('full')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                payType === 'full' ? 'bg-[#145C4B] text-white border-[#145C4B]' : 'bg-white text-[#3E463F] border-[#DCD8CE]'
              }`}
            >
              كامل ({fmt(item.fullAmount)})
            </button>
            <button
              type="button"
              onClick={() => setPayType('partial')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                payType === 'partial' ? 'bg-[#145C4B] text-white border-[#145C4B]' : 'bg-white text-[#3E463F] border-[#DCD8CE]'
              }`}
            >
              جزئي
            </button>
          </div>
        </Field>

        {payType === 'partial' && (
          <Field label="المبلغ المدفوع فعلياً">
            <input
              type="number"
              className={inputCls}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ المدفوع"
            />
            <p className="text-xs text-[#B33A3A] mt-1 font-bold">
              المبلغ المتبقي: {fmt(remaining)} {jamiya.currency}
            </p>
          </Field>
        )}

        <Field label="طريقة الدفع">
          <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>

        <Field label="تاريخ التحصيل">
          <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>

        <Btn full onClick={handleSave}>حفظ التحصيل</Btn>
      </div>
    </Modal>
  );
}

function LoanModal({ jamiya, onClose, onSave }) {
  const [borrowerId, setBorrowerId] = useState(jamiya.members[0]?.id || '');
  const [lenderId, setLenderId] = useState(jamiya.members[1]?.id || jamiya.members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [borrowCycleIdx, setBorrowCycleIdx] = useState(0);
  const [repayCycleIdx, setRepayCycleIdx] = useState(1);

  const valid = borrowerId && lenderId && borrowerId !== lenderId && Number(amount) > 0;

  return (
    <Modal title="إضافة سلفة جديدة" onClose={onClose}>
      <div className="space-y-3">
        <Field label="العضو المستلف">
          <select className={inputCls} value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)}>
            {jamiya.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </Field>

        <Field label="المقرض (مين سلفه)">
          <select className={inputCls} value={lenderId} onChange={(e) => setLenderId(e.target.value)}>
            {jamiya.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </Field>

        <Field label="مبلغ السلفة">
          <input type="number" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="مثال: 500" />
        </Field>

        <Field label="شهر الاستلاف">
          <select className={inputCls} value={borrowCycleIdx} onChange={(e) => setBorrowCycleIdx(e.target.value)}>
            {jamiya.cycles.map((_, idx) => (
              <option key={idx} value={idx}>{getMonthLabel(jamiya.startMonth, idx)}</option>
            ))}
          </select>
        </Field>

        <Field label="شهر رد السلفة">
          <select className={inputCls} value={repayCycleIdx} onChange={(e) => setRepayCycleIdx(e.target.value)}>
            {jamiya.cycles.map((_, idx) => (
              <option key={idx} value={idx}>{getMonthLabel(jamiya.startMonth, idx)}</option>
            ))}
          </select>
        </Field>

        <Btn full disabled={!valid} onClick={() => onSave({ borrowerId, lenderId, amount, borrowCycleIdx, repayCycleIdx })}>
          تسجيل السلفة
        </Btn>
      </div>
    </Modal>
  );
}

function JamiyaModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    color: initial?.color || JAMIYA_COLORS[0],
    amount: initial?.monthlyShareAmount || '',
    currency: initial?.currency || 'ج.م',
    startMonth: initial?.startMonth || new Date().toISOString().slice(0, 7)
  });
  const valid = form.name.trim() && Number(form.amount) > 0 && form.startMonth;

  return (
    <Modal title={initial ? 'تعديل الجمعية' : 'جمعية جديدة'} onClose={onClose}>
      <Field label="اسم الجمعية">
        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: جمعية الشغل" />
      </Field>
      <Field label="قيمة السهم شهرياً">
        <input type="number" min="0" className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="1000" />
      </Field>
      <Field label="العملة">
        <input className={inputCls} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
      </Field>
      <Field label="أول شهر في الجمعية">
        <input type="month" className={inputCls} value={form.startMonth} onChange={(e) => setForm({ ...form, startMonth: e.target.value })} />
      </Field>
      <Field label="اللون">
        <div className="flex gap-2 flex-wrap">
          {JAMIYA_COLORS.map((c) => (
            <button
              key={c} type="button" onClick={() => setForm({ ...form, color: c })}
              className="w-8 h-8 rounded-full border-2"
              style={{ background: c, borderColor: form.color === c ? '#1C2321' : 'transparent' }}
            />
          ))}
        </div>
      </Field>
      <Btn full disabled={!valid} onClick={() => onSave(form)}>حفظ</Btn>
    </Modal>
  );
}

function MemberModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({ name: initial?.name || '', phone: initial?.phone || '' });
  return (
    <Modal title={initial ? 'تعديل عضو' : 'إضافة عضو'} onClose={onClose}>
      <Field label="الاسم">
        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم العضو" />
      </Field>
      <Field label="رقم الموبايل (اختياري)">
        <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" />
      </Field>
      <Btn full disabled={!form.name.trim()} onClick={() => onSave(form)}>حفظ</Btn>
    </Modal>
  );
}

function ShareHoldersModal({ jamiya, share, onClose, onSave }) {
  const [holders, setHolders] = useState(share ? clone(share.holders) : []);
  const sum = holderPercentSum(holders);
  const available = jamiya.members.filter((m) => !holders.some((h) => h.memberId === m.id));

  function addHolder() {
    if (available.length === 0) return;
    const remaining = Math.max(0, 100 - sum);
    setHolders([...holders, { memberId: available[0].id, percentage: remaining || 0 }]);
  }
  function updateHolder(idx, patch) {
    setHolders(holders.map((h, i) => (i === idx ? { ...h, ...patch } : h)));
  }
  function removeHolder(idx) {
    setHolders(holders.filter((_, i) => i !== idx));
  }

  return (
    <Modal title={`مشاركين ${share ? share.label : ''}`} onClose={onClose} wide>
      {jamiya.members.length === 0 ? (
        <p className="text-sm text-[#5B6660]">قم بإضافة أعضاء أولاً من تبويب "الأعضاء" لتستطيع إضافتهم هنا.</p>
      ) : (
        <>
          <p className="text-xs text-[#5B6660] mb-3">
            وزّع النسبة بين شخص أو أكثر. كل نسبة تحدد النصيب في الدفع الشهري والإنصبة في الاستلام.
          </p>
          <div className="space-y-2 mb-3">
            {holders.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  className={inputCls + ' flex-1'}
                  value={h.memberId}
                  onChange={(e) => updateHolder(idx, { memberId: e.target.value })}
                >
                  {jamiya.members
                    .filter((m) => m.id === h.memberId || !holders.some((x) => x.memberId === m.id))
                    .map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <input
                  type="number" min="0" max="100"
                  className={inputCls + ' w-20 text-center'}
                  value={h.percentage}
                  onChange={(e) => updateHolder(idx, { percentage: Number(e.target.value) })}
                />
                <span className="text-xs text-[#5B6660]">%</span>
                <button onClick={() => removeHolder(idx)} className="p-1.5 rounded-full hover:bg-[#EAE7DD] text-[#B33A3A]">
                  <IconX size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addHolder}
            disabled={available.length === 0}
            className="text-sm font-bold text-[#145C4B] flex items-center gap-1 mb-4 disabled:opacity-40"
          >
            <IconPlus size={15} /> إضافة شريك في السهم
          </button>

          <div className={`text-sm font-bold mb-4 ${Math.round(sum) === 100 ? 'text-[#145C4B]' : 'text-[#B33A3A]'}`}>
            الإجمالي: {sum}% {Math.round(sum) !== 100 && '(يجب أن يكون الإجمالي 100%)'}
          </div>

          <Btn full onClick={() => onSave(holders)}>حفظ</Btn>
        </>
      )}
    </Modal>
  );
}

// ---------- Mount App ----------
const rootEl = document.getElementById('root');
ReactDOM.createRoot(rootEl).render(<App />);

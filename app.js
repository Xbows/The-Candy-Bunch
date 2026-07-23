// ==========================================================================
// The Candy Bunch - Daily Sheet with Manual Delivery Fee & Destination
// ==========================================================================

const USERS = {
  'User 1': '1111',
  'User 2': '2222',
  'User 3': '3333'
};

const INITIAL_SAMPLE_ORDERS = [
  {
    id: '2026-07-25_111',
    cakeNo: '111',
    date: '2026-07-25',
    customerName: 'Cynthia Francis bechaalany',
    pickup: 'NO',
    time: '15:00',
    price: '45.00',
    destination: 'sahel alma',
    deliveryFee: '5.00', // Delivery Fee
    topper: 'NO',
    instructions: '2 dz (éclair and tart)',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: 'User 1',
    signedAt: '2026-07-25 10:15 AM'
  },
  {
    id: '2026-07-25_116',
    cakeNo: '116',
    date: '2026-07-25',
    customerName: 'Carelle Khairallah',
    pickup: 'NO',
    time: '18:00',
    price: '55.00',
    destination: 'soul beit misk',
    deliveryFee: '7.00',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Paid Whish',
    partialAmount: '',
    signedBy: 'User 2',
    signedAt: '2026-07-25 11:30 AM'
  },
  {
    id: '2026-07-25_117',
    cakeNo: '117',
    date: '2026-07-25',
    customerName: 'Guya Tohme',
    pickup: 'NO',
    time: '09:00',
    price: '40.00',
    destination: 'Antoura keserwen',
    deliveryFee: '6.00',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Paid Cash',
    partialAmount: '',
    signedBy: 'User 3',
    signedAt: '2026-07-25 09:00 AM'
  },
  {
    id: '2026-07-25_130',
    cakeNo: '130',
    date: '2026-07-25',
    customerName: 'Sahar (micheline)',
    pickup: 'NO',
    time: '10:00',
    price: '85.00',
    destination: 'Micheline keserwany babel dbayeh',
    deliveryFee: '10.00',
    topper: 'NO',
    instructions: 'and a fake cake, tower prof',
    paymentStatus: 'Partial Paid',
    partialAmount: '30.00',
    signedBy: 'User 1',
    signedAt: '2026-07-25 12:00 PM'
  },
  {
    id: '2026-07-25_144',
    cakeNo: '144',
    date: '2026-07-25',
    customerName: 'Mir',
    pickup: 'NO',
    time: '10:00',
    price: '50.00',
    destination: 'Zouk Mosbeh',
    deliveryFee: '5.00',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Paid Cash',
    partialAmount: '',
    signedBy: 'User 2',
    signedAt: '2026-07-25 01:45 PM'
  }
];

class CandyBunchApp {
  constructor() {
    this.orders = this.loadOrders();
    this.selectedDate = '2026-07-25';
    this.currentTab = 'dailySheet';
    this.pendingAuthOrderId = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadOrders() {
    const saved = localStorage.getItem('candy_bunch_v5_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing orders:', e);
      }
    }
    return [...INITIAL_SAMPLE_ORDERS];
  }

  saveOrders() {
    localStorage.setItem('candy_bunch_v5_orders', JSON.stringify(this.orders));
    this.render();
  }

  initElements() {
    // Navigation Tabs
    this.tabSheetBtn = document.getElementById('tabSheetBtn');
    this.tabArchivesBtn = document.getElementById('tabArchivesBtn');
    this.pageDailySheet = document.getElementById('pageDailySheet');
    this.pageArchives = document.getElementById('pageArchives');

    // Header Actions
    this.addOrderBtn = document.getElementById('addOrderBtn');
    this.printBtn = document.getElementById('printBtn');
    this.resetSampleDataBtn = document.getElementById('resetSampleDataBtn');

    // Date Switcher Controls
    this.activeDateTitle = document.getElementById('activeDateTitle');
    this.tableDateSubtitle = document.getElementById('tableDateSubtitle');
    this.selectedDateInput = document.getElementById('selectedDateInput');
    this.prevDayBtn = document.getElementById('prevDayBtn');
    this.nextDayBtn = document.getElementById('nextDayBtn');
    this.todayBtn = document.getElementById('todayBtn');

    // Order Modal & Form
    this.modal = document.getElementById('orderModal');
    this.orderForm = document.getElementById('orderForm');
    this.modalHeading = document.getElementById('modalHeading');
    this.editOrderIdInput = document.getElementById('editOrderId');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.cancelModalBtn = document.getElementById('cancelModalBtn');

    // Form Inputs
    this.inputCakeNo = document.getElementById('inputCakeNo');
    this.inputDate = document.getElementById('inputDate');
    this.inputCustomerName = document.getElementById('inputCustomerName');
    this.inputPrice = document.getElementById('inputPrice');
    this.inputTime = document.getElementById('inputTime');
    this.inputDestination = document.getElementById('inputDestination');
    this.inputDeliveryFee = document.getElementById('inputDeliveryFee');
    this.inputInstructions = document.getElementById('inputInstructions');
    this.partialAmountGroup = document.getElementById('partialAmountGroup');
    this.inputPartialAmount = document.getElementById('inputPartialAmount');

    // Auth Password Modal
    this.authModal = document.getElementById('authModal');
    this.authForm = document.getElementById('authForm');
    this.authPasswordInput = document.getElementById('authPassword');
    this.authErrorMsg = document.getElementById('authErrorMsg');
    this.authPartialAmountGroup = document.getElementById('authPartialAmountGroup');
    this.authPartialAmountInput = document.getElementById('authPartialAmount');
    this.closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    this.cancelAuthModalBtn = document.getElementById('cancelAuthModalBtn');

    // Filters & Search
    this.searchInput = document.getElementById('searchInput');
    this.filterPayment = document.getElementById('filterPayment');
    this.filterPickup = document.getElementById('filterPickup');

    // Table & Stats
    this.tableBody = document.getElementById('tableBody');
    this.emptyState = document.getElementById('emptyState');
    this.statTotalOrders = document.getElementById('statTotalOrders');
    this.statPaidWhish = document.getElementById('statPaidWhish');
    this.statPaidCash = document.getElementById('statPaidCash');
    this.statPartialPaid = document.getElementById('statPartialPaid');
    this.statNotPaid = document.getElementById('statNotPaid');
    this.printSheetDate = document.getElementById('printSheetDate');

    // Archives Page Elements
    this.archivesGrid = document.getElementById('archivesGrid');
    this.archiveJumpDate = document.getElementById('archiveJumpDate');
  }

  bindEvents() {
    this.tabSheetBtn.addEventListener('click', () => this.switchTab('dailySheet'));
    this.tabArchivesBtn.addEventListener('click', () => this.switchTab('archives'));

    this.selectedDateInput.value = this.selectedDate;
    this.selectedDateInput.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      this.render();
    });

    this.prevDayBtn.addEventListener('click', () => this.changeDateByDays(-1));
    this.nextDayBtn.addEventListener('click', () => this.changeDateByDays(1));
    this.todayBtn.addEventListener('click', () => {
      this.selectedDate = new Date().toISOString().split('T')[0];
      this.selectedDateInput.value = this.selectedDate;
      this.render();
    });

    this.archiveJumpDate.addEventListener('change', (e) => {
      if (e.target.value) {
        this.selectedDate = e.target.value;
        this.selectedDateInput.value = this.selectedDate;
        this.switchTab('dailySheet');
      }
    });

    // Toggle partial amount field visibility
    const paymentRadios = this.orderForm.querySelectorAll('input[name="inputPayment"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'Partial Paid') {
          this.partialAmountGroup.classList.remove('hidden');
        } else {
          this.partialAmountGroup.classList.add('hidden');
        }
      });
    });

    const authPaymentRadios = this.authForm.querySelectorAll('input[name="targetPayment"]');
    authPaymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'Partial Paid') {
          this.authPartialAmountGroup.classList.remove('hidden');
        } else {
          this.authPartialAmountGroup.classList.add('hidden');
        }
      });
    });

    this.addOrderBtn.addEventListener('click', () => this.openOrderModal());
    this.closeModalBtn.addEventListener('click', () => this.closeOrderModal());
    this.cancelModalBtn.addEventListener('click', () => this.closeOrderModal());
    this.orderForm.addEventListener('submit', (e) => this.handleOrderFormSubmit(e));

    this.closeAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    this.cancelAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    this.authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));

    this.printBtn.addEventListener('click', () => {
      this.printSheetDate.textContent = `Date: ${this.formatFullDate(this.selectedDate)}`;
      window.print();
    });

    this.resetSampleDataBtn.addEventListener('click', () => {
      if (confirm('Reload default sample cake orders?')) {
        this.orders = [...INITIAL_SAMPLE_ORDERS];
        this.saveOrders();
      }
    });

    this.searchInput.addEventListener('input', () => this.render());
    this.filterPayment.addEventListener('change', () => this.render());
    this.filterPickup.addEventListener('change', () => this.render());
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    if (tabName === 'dailySheet') {
      this.tabSheetBtn.classList.add('active');
      this.tabArchivesBtn.classList.remove('active');
      this.pageDailySheet.classList.remove('hidden');
      this.pageArchives.classList.add('hidden');
    } else {
      this.tabArchivesBtn.classList.add('active');
      this.tabSheetBtn.classList.remove('active');
      this.pageArchives.classList.remove('hidden');
      this.pageDailySheet.classList.add('hidden');
      this.renderArchives();
    }
  }

  changeDateByDays(offset) {
    const [year, month, day] = this.selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + offset);

    const newYear = d.getFullYear();
    const newMonth = String(d.getMonth() + 1).padStart(2, '0');
    const newDay = String(d.getDate()).padStart(2, '0');

    this.selectedDate = `${newYear}-${newMonth}-${newDay}`;
    this.selectedDateInput.value = this.selectedDate;
    this.render();
  }

  openOrderModal(orderToEdit = null) {
    this.orderForm.reset();
    this.partialAmountGroup.classList.add('hidden');

    if (orderToEdit) {
      this.modalHeading.textContent = `Edit Cake Order #${orderToEdit.cakeNo}`;
      this.editOrderIdInput.value = orderToEdit.id;
      this.inputCakeNo.value = orderToEdit.cakeNo;
      this.inputDate.value = orderToEdit.date;
      this.inputCustomerName.value = orderToEdit.customerName;
      this.inputPrice.value = orderToEdit.price || '';
      this.inputTime.value = orderToEdit.time;
      this.inputDestination.value = orderToEdit.destination || '';
      this.inputDeliveryFee.value = orderToEdit.deliveryFee || '';
      this.inputInstructions.value = orderToEdit.instructions;
      this.inputPartialAmount.value = orderToEdit.partialAmount || '';

      const pickupRadio = this.orderForm.querySelector(`input[name="inputPickup"][value="${orderToEdit.pickup}"]`);
      if (pickupRadio) pickupRadio.checked = true;

      const topperRadio = this.orderForm.querySelector(`input[name="inputTopper"][value="${orderToEdit.topper}"]`);
      if (topperRadio) topperRadio.checked = true;

      const paymentRadio = this.orderForm.querySelector(`input[name="inputPayment"][value="${orderToEdit.paymentStatus}"]`);
      if (paymentRadio) {
        paymentRadio.checked = true;
        if (orderToEdit.paymentStatus === 'Partial Paid') {
          this.partialAmountGroup.classList.remove('hidden');
        }
      }

    } else {
      this.modalHeading.textContent = `New Cake Order (${this.formatFullDate(this.selectedDate)})`;
      this.editOrderIdInput.value = '';
      this.inputDate.value = this.selectedDate;
      this.inputTime.value = '10:00';
    }

    this.modal.classList.remove('hidden');
  }

  closeOrderModal() {
    this.modal.classList.add('hidden');
  }

  handleOrderFormSubmit(e) {
    e.preventDefault();

    const editId = this.editOrderIdInput.value;
    const pickupVal = this.orderForm.querySelector('input[name="inputPickup"]:checked')?.value || 'NO';
    const topperVal = this.orderForm.querySelector('input[name="inputTopper"]:checked')?.value || 'NO';
    const paymentVal = this.orderForm.querySelector('input[name="inputPayment"]:checked')?.value || 'Not Decided';

    const existingOrder = editId ? this.orders.find(o => o.id === editId) : null;

    if (existingOrder && (existingOrder.paymentStatus !== paymentVal || (paymentVal === 'Partial Paid' && existingOrder.partialAmount !== this.inputPartialAmount.value.trim()))) {
      this.closeOrderModal();
      this.openAuthModal(existingOrder.id, paymentVal, this.inputPartialAmount.value.trim());
      return;
    }

    const targetDate = this.inputDate.value;
    const cakeNo = this.inputCakeNo.value.trim();

    const orderData = {
      id: editId || `${targetDate}_${cakeNo}_${Date.now()}`,
      cakeNo: cakeNo,
      date: targetDate,
      customerName: this.inputCustomerName.value.trim(),
      pickup: pickupVal,
      time: this.inputTime.value,
      price: this.inputPrice.value.trim(),
      destination: this.inputDestination.value.trim(),
      deliveryFee: this.inputDeliveryFee.value.trim(),
      topper: topperVal,
      instructions: this.inputInstructions.value.trim(),
      paymentStatus: paymentVal,
      partialAmount: paymentVal === 'Partial Paid' ? this.inputPartialAmount.value.trim() : '',
      signedBy: existingOrder ? existingOrder.signedBy : 'User 1',
      signedAt: existingOrder ? existingOrder.signedAt : this.getFormattedTimestamp()
    };

    if (editId) {
      const idx = this.orders.findIndex(o => o.id === editId);
      if (idx !== -1) this.orders[idx] = orderData;
    } else {
      this.orders.unshift(orderData);
    }

    this.selectedDate = targetDate;
    this.selectedDateInput.value = targetDate;

    this.saveOrders();
    this.closeOrderModal();
  }

  openAuthModal(orderId, suggestedNextStatus = null, prefilledPartialAmount = '') {
    this.pendingAuthOrderId = orderId;
    this.authForm.reset();
    this.authErrorMsg.classList.add('hidden');
    this.authPartialAmountGroup.classList.add('hidden');

    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const targetStatus = suggestedNextStatus || this.getNextPaymentStatus(order.paymentStatus);
    const targetRadio = this.authForm.querySelector(`input[name="targetPayment"][value="${targetStatus}"]`);
    if (targetRadio) {
      targetRadio.checked = true;
      if (targetStatus === 'Partial Paid') {
        this.authPartialAmountGroup.classList.remove('hidden');
        this.authPartialAmountInput.value = prefilledPartialAmount || order.partialAmount || '';
      }
    }

    this.authModal.classList.remove('hidden');
    this.authPasswordInput.focus();
  }

  closeAuthModal() {
    this.authModal.classList.add('hidden');
    this.pendingAuthOrderId = null;
  }

  getNextPaymentStatus(current) {
    if (current === 'Not Decided') return 'Paid Whish';
    if (current === 'Paid Whish') return 'Paid Cash';
    if (current === 'Paid Cash') return 'Partial Paid';
    if (current === 'Partial Paid') return 'Not Paid';
    return 'Not Decided';
  }

  handleAuthSubmit(e) {
    e.preventDefault();

    const selectedUser = this.authForm.querySelector('input[name="authUser"]:checked')?.value;
    const enteredPassword = this.authPasswordInput.value.trim();
    const newPaymentStatus = this.authForm.querySelector('input[name="targetPayment"]:checked')?.value;
    const partialAmt = this.authPartialAmountInput.value.trim();

    if (enteredPassword !== USERS[selectedUser]) {
      this.authErrorMsg.classList.remove('hidden');
      this.authPasswordInput.value = '';
      this.authPasswordInput.focus();
      return;
    }

    const order = this.orders.find(o => o.id === this.pendingAuthOrderId);
    if (order) {
      order.paymentStatus = newPaymentStatus;
      order.partialAmount = newPaymentStatus === 'Partial Paid' ? partialAmt : '';
      order.signedBy = selectedUser;
      order.signedAt = this.getFormattedTimestamp();
      this.saveOrders();
    }

    this.closeAuthModal();
  }

  getFormattedTimestamp() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${now.toISOString().split('T')[0]} ${timeStr}`;
  }

  deleteOrder(id) {
    if (confirm('Are you sure you want to delete this cake order?')) {
      this.orders = this.orders.filter(o => o.id !== id);
      this.saveOrders();
    }
  }

  formatFullDate(dateString) {
    if (!dateString) return '';
    try {
      const [y, m, d] = dateString.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  }

  formatTime12Hr(time24) {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  }

  getOrdersForActiveDate() {
    const search = this.searchInput.value.toLowerCase().trim();
    const paymentFilter = this.filterPayment.value;
    const pickupFilter = this.filterPickup.value;

    return this.orders.filter(order => {
      if (order.date !== this.selectedDate) return false;

      const matchSearch = !search ||
        order.cakeNo.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        (order.price && order.price.toLowerCase().includes(search)) ||
        (order.deliveryFee && order.deliveryFee.toLowerCase().includes(search)) ||
        (order.partialAmount && order.partialAmount.toLowerCase().includes(search)) ||
        order.destination.toLowerCase().includes(search) ||
        order.instructions.toLowerCase().includes(search);

      const matchPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
      const matchPickup = pickupFilter === 'ALL' || order.pickup === pickupFilter;

      return matchSearch && matchPayment && matchPickup;
    });
  }

  updateStats() {
    const dateOrders = this.orders.filter(o => o.date === this.selectedDate);
    const total = dateOrders.length;
    const whish = dateOrders.filter(o => o.paymentStatus === 'Paid Whish').length;
    const cash = dateOrders.filter(o => o.paymentStatus === 'Paid Cash').length;
    const partial = dateOrders.filter(o => o.paymentStatus === 'Partial Paid').length;
    const unpaid = dateOrders.filter(o => o.paymentStatus === 'Not Paid' || o.paymentStatus === 'Not Decided').length;

    this.statTotalOrders.textContent = total;
    this.statPaidWhish.textContent = whish;
    this.statPaidCash.textContent = cash;
    this.statPartialPaid.textContent = partial;
    this.statNotPaid.textContent = unpaid;
  }

  renderArchives() {
    const dateMap = {};

    this.orders.forEach(order => {
      if (!dateMap[order.date]) {
        dateMap[order.date] = { date: order.date, total: 0, whish: 0, cash: 0, partial: 0, unpaid: 0 };
      }
      dateMap[order.date].total++;
      if (order.paymentStatus === 'Paid Whish') dateMap[order.date].whish++;
      else if (order.paymentStatus === 'Paid Cash') dateMap[order.date].cash++;
      else if (order.paymentStatus === 'Partial Paid') dateMap[order.date].partial++;
      else dateMap[order.date].unpaid++;
    });

    const sortedDates = Object.values(dateMap).sort((a, b) => b.date.localeCompare(a.date));

    this.archivesGrid.innerHTML = '';

    if (sortedDates.length === 0) {
      this.archivesGrid.innerHTML = `<p class="text-muted">No historical day logs recorded yet.</p>`;
      return;
    }

    sortedDates.forEach(day => {
      const card = document.createElement('div');
      card.className = 'archive-card';
      card.innerHTML = `
        <div>
          <h3 class="archive-date-title">${this.formatFullDate(day.date)}</h3>
          <div class="archive-stats-summary">
            <span class="archive-stat-tag"><strong>${day.total}</strong> Orders</span>
            <span class="archive-stat-tag" style="color: #6B21A8;">Whish: ${day.whish}</span>
            <span class="archive-stat-tag" style="color: #137333;">Cash: ${day.cash}</span>
            <span class="archive-stat-tag" style="color: #92400E;">Partial: ${day.partial}</span>
            <span class="archive-stat-tag" style="color: #C5221F;">Unpaid/Blank: ${day.unpaid}</span>
          </div>
        </div>
        <div class="archive-actions">
          <button class="btn btn-pink-subtle open-day-btn" data-date="${day.date}">
            <i class="ri-folder-open-line"></i> Open Day Sheet
          </button>
        </div>
      `;

      card.querySelector('.open-day-btn').addEventListener('click', () => {
        this.selectedDate = day.date;
        this.selectedDateInput.value = day.date;
        this.switchTab('dailySheet');
      });

      this.archivesGrid.appendChild(card);
    });
  }

  render() {
    this.activeDateTitle.textContent = this.formatFullDate(this.selectedDate);
    this.tableDateSubtitle.textContent = this.formatFullDate(this.selectedDate);

    this.updateStats();
    const activeDateOrders = this.getOrdersForActiveDate();

    this.tableBody.innerHTML = '';

    if (activeDateOrders.length === 0) {
      this.emptyState.classList.remove('hidden');
    } else {
      this.emptyState.classList.add('hidden');

      activeDateOrders.forEach(order => {
        const tr = document.createElement('tr');

        let paymentClass = 'blank';
        let paymentIcon = 'ri-subtract-line';
        let paymentLabel = 'Not Decided';

        if (order.paymentStatus === 'Paid Whish') {
          paymentClass = 'whish';
          paymentIcon = 'ri-smartphone-line';
          paymentLabel = 'Paid Whish';
        } else if (order.paymentStatus === 'Paid Cash') {
          paymentClass = 'cash';
          paymentIcon = 'ri-money-dollar-circle-line';
          paymentLabel = 'Paid Cash';
        } else if (order.paymentStatus === 'Partial Paid') {
          paymentClass = 'partial';
          paymentIcon = 'ri-pie-chart-line';
          const amtStr = order.partialAmount ? ` ($${order.partialAmount})` : '';
          paymentLabel = `Partial Paid${amtStr}`;
        } else if (order.paymentStatus === 'Not Paid') {
          paymentClass = 'unpaid';
          paymentIcon = 'ri-time-line';
          paymentLabel = 'Not Paid';
        }

        const priceDisplay = order.price ? `$${order.price}` : '<span style="color:#aaa;">—</span>';

        // Format Destination & Delivery Fee cell
        let destinationDisplay = '<span style="color:#aaa;">—</span>';
        if (order.pickup === 'YES') {
          destinationDisplay = order.destination ? `${order.destination} <span class="badge-no">Store Pickup</span>` : '<span class="badge-no">Store Pickup</span>';
        } else {
          const feeBadge = order.deliveryFee ? `<span class="delivery-fee-badge"><i class="ri-truck-line"></i> +$${order.deliveryFee} Fee</span>` : '';
          destinationDisplay = `${order.destination || 'Delivery'} ${feeBadge}`;
        }

        tr.innerHTML = `
          <td><span class="cake-number">${order.cakeNo}</span></td>
          <td>${this.formatFullDate(order.date).split(',')[0]}, ${order.date}</td>
          <td><strong>${order.customerName}</strong></td>
          <td style="text-align: center;">
            ${order.pickup === 'YES' ? '<span class="badge-yes">Yes</span>' : '<span class="badge-no">No</span>'}
          </td>
          <td><strong>${this.formatTime12Hr(order.time)}</strong></td>
          <td><span class="price-text">${priceDisplay}</span></td>
          <td>${destinationDisplay}</td>
          <td style="text-align: center;">
            ${order.topper === 'YES' ? '<span class="badge-yes">Yes</span>' : '<span class="badge-no">No</span>'}
          </td>
          <td>${order.instructions ? order.instructions : '<span style="color:#aaa;">—</span>'}</td>
          <td style="text-align: center;">
            <span class="payment-badge ${paymentClass}" title="Click to change payment status (Password Protected)">
              <i class="${paymentIcon}"></i> ${paymentLabel}
            </span>
          </td>
          <td>
            <span class="signed-user"><i class="ri-shield-check-fill" style="color:#10B981;"></i> ${order.signedBy || 'User 1'}</span>
            <span class="signed-time">${order.signedAt || '—'}</span>
          </td>
          <td style="text-align: center;" class="no-print">
            <div class="action-btns">
              <button class="btn-table-action edit" title="Edit Order">
                <i class="ri-edit-line"></i>
              </button>
              <button class="btn-table-action delete" title="Delete Order">
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
          </td>
        `;

        tr.querySelector('.payment-badge').addEventListener('click', () => this.openAuthModal(order.id));
        tr.querySelector('.btn-table-action.edit').addEventListener('click', () => this.openOrderModal(order));
        tr.querySelector('.btn-table-action.delete').addEventListener('click', () => this.deleteOrder(order.id));

        this.tableBody.appendChild(tr);
      });
    }

    if (this.currentTab === 'archives') {
      this.renderArchives();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.candyBunchApp = new CandyBunchApp();
});

// ==========================================================================
// The Candy Bunch - Clean Paper Log Sheet Integration (Fresh Data Reset)
// ==========================================================================

const USERS = {
  'User 1': '1111',
  'User 2': '2222',
  'User 3': '3333'
};

// Exact 5 Orders from the Physical Paper Order Sheet
const INITIAL_PAPER_ORDERS = [
  {
    id: '2026-07-25_111',
    cakeNo: '111',
    date: '2026-07-25',
    customerName: 'Cynthia Francis bechaalany',
    pickup: 'NO',
    time: '15:00',
    price: '',
    destination: 'sahel alma',
    deliveryFee: '',
    topper: 'NO',
    instructions: '2 dz (éclair and tart)',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: '',
    signedAt: '',
    leftStore: false,
    handedOutBy: '',
    handedOutAt: '',
    rescheduledTo: '',
    rescheduledFrom: ''
  },
  {
    id: '2026-07-25_116',
    cakeNo: '116',
    date: '2026-07-25',
    customerName: 'Carelle Khairallah',
    pickup: 'NO',
    time: '18:00',
    price: '',
    destination: 'soul beit misk',
    deliveryFee: '',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: '',
    signedAt: '',
    leftStore: false,
    handedOutBy: '',
    handedOutAt: '',
    rescheduledTo: '',
    rescheduledFrom: ''
  },
  {
    id: '2026-07-25_117',
    cakeNo: '117',
    date: '2026-07-25',
    customerName: 'Guya Tohme',
    pickup: 'NO',
    time: '09:00',
    price: '',
    destination: 'Antoura keserwen',
    deliveryFee: '',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: '',
    signedAt: '',
    leftStore: false,
    handedOutBy: '',
    handedOutAt: '',
    rescheduledTo: '',
    rescheduledFrom: ''
  },
  {
    id: '2026-07-25_130',
    cakeNo: '130',
    date: '2026-07-25',
    customerName: 'Sahar (micheline)',
    pickup: 'NO',
    time: '10:00',
    price: '',
    destination: 'Micheline keserwany babel dbayeh',
    deliveryFee: '',
    topper: 'NO',
    instructions: 'and a fake cake, tower prof',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: '',
    signedAt: '',
    leftStore: false,
    handedOutBy: '',
    handedOutAt: '',
    rescheduledTo: '',
    rescheduledFrom: ''
  },
  {
    id: '2026-07-25_144',
    cakeNo: '144',
    date: '2026-07-25',
    customerName: 'Mir',
    pickup: 'NO',
    time: '10:00',
    price: '',
    destination: '',
    deliveryFee: '',
    topper: 'NO',
    instructions: '',
    paymentStatus: 'Not Decided',
    partialAmount: '',
    signedBy: '',
    signedAt: '',
    leftStore: false,
    handedOutBy: '',
    handedOutAt: '',
    rescheduledTo: '',
    rescheduledFrom: ''
  }
];

class CandyBunchApp {
  constructor() {
    this.orders = this.loadOrders();
    this.selectedDate = '2026-07-25';
    this.currentTab = 'dailySheet';
    this.pendingAuthOrderId = null;
    this.pendingHandoutOrderId = null;
    this.pendingRescheduleOrderId = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadOrders() {
    // Force reset to clean paper sheet data for v7
    const savedV7 = localStorage.getItem('candy_bunch_v7_orders');

    if (savedV7) {
      try {
        const parsed = JSON.parse(savedV7);
        if (Array.isArray(parsed) && parsed.length >= 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored v7 orders:', e);
      }
    }

    // Clear older cached data keys
    localStorage.removeItem('candy_bunch_v6_orders');
    localStorage.removeItem('candy_bunch_v5_orders');
    localStorage.removeItem('candy_bunch_orders');

    // Store clean fresh paper log sheet orders
    localStorage.setItem('candy_bunch_v7_orders', JSON.stringify(INITIAL_PAPER_ORDERS));
    return [...INITIAL_PAPER_ORDERS];
  }

  saveOrders() {
    localStorage.setItem('candy_bunch_v7_orders', JSON.stringify(this.orders));
    this.render();
  }

  initElements() {
    this.tabSheetBtn = document.getElementById('tabSheetBtn');
    this.tabArchivesBtn = document.getElementById('tabArchivesBtn');
    this.pageDailySheet = document.getElementById('pageDailySheet');
    this.pageArchives = document.getElementById('pageArchives');

    this.addOrderBtn = document.getElementById('addOrderBtn');
    this.printBtn = document.getElementById('printBtn');
    this.resetSampleDataBtn = document.getElementById('resetSampleDataBtn');

    this.activeDateTitle = document.getElementById('activeDateTitle');
    this.tableDateSubtitle = document.getElementById('tableDateSubtitle');
    this.selectedDateInput = document.getElementById('selectedDateInput');
    this.prevDayBtn = document.getElementById('prevDayBtn');
    this.nextDayBtn = document.getElementById('nextDayBtn');
    this.todayBtn = document.getElementById('todayBtn');

    this.modal = document.getElementById('orderModal');
    this.orderForm = document.getElementById('orderForm');
    this.modalHeading = document.getElementById('modalHeading');
    this.editOrderIdInput = document.getElementById('editOrderId');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.cancelModalBtn = document.getElementById('cancelModalBtn');

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

    this.authModal = document.getElementById('authModal');
    this.authForm = document.getElementById('authForm');
    this.authPasswordInput = document.getElementById('authPassword');
    this.authErrorMsg = document.getElementById('authErrorMsg');
    this.authPartialAmountGroup = document.getElementById('authPartialAmountGroup');
    this.authPartialAmountInput = document.getElementById('authPartialAmount');
    this.closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
    this.cancelAuthModalBtn = document.getElementById('cancelAuthModalBtn');

    this.handoutModal = document.getElementById('handoutModal');
    this.handoutForm = document.getElementById('handoutForm');
    this.handoutPasswordInput = document.getElementById('handoutPassword');
    this.handoutErrorMsg = document.getElementById('handoutErrorMsg');
    this.closeHandoutModalBtn = document.getElementById('closeHandoutModalBtn');
    this.cancelHandoutModalBtn = document.getElementById('cancelHandoutModalBtn');

    this.rescheduleModal = document.getElementById('rescheduleModal');
    this.rescheduleForm = document.getElementById('rescheduleForm');
    this.rescheduleCurrentDateDisplay = document.getElementById('rescheduleCurrentDateDisplay');
    this.rescheduleNewDateInput = document.getElementById('rescheduleNewDate');
    this.rescheduleReasonInput = document.getElementById('rescheduleReason');
    this.closeRescheduleModalBtn = document.getElementById('closeRescheduleModalBtn');
    this.cancelRescheduleModalBtn = document.getElementById('cancelRescheduleModalBtn');

    this.searchInput = document.getElementById('searchInput');
    this.filterPayment = document.getElementById('filterPayment');
    this.filterPickup = document.getElementById('filterPickup');

    this.tableBody = document.getElementById('tableBody');
    this.emptyState = document.getElementById('emptyState');
    this.statTotalOrders = document.getElementById('statTotalOrders');
    this.statOrdersRemaining = document.getElementById('statOrdersRemaining');
    this.statPaidWhish = document.getElementById('statPaidWhish');
    this.statPaidCash = document.getElementById('statPaidCash');
    this.statPartialPaid = document.getElementById('statPartialPaid');
    this.statNotPaid = document.getElementById('statNotPaid');
    this.statTotalDeliveryFees = document.getElementById('statTotalDeliveryFees');
    this.printSheetDate = document.getElementById('printSheetDate');

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

    this.addOrderBtn.addEventListener('click', () => this.openOrderModal());
    this.closeModalBtn.addEventListener('click', () => this.closeOrderModal());
    this.cancelModalBtn.addEventListener('click', () => this.closeOrderModal());
    this.orderForm.addEventListener('submit', (e) => this.handleOrderFormSubmit(e));

    this.closeAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    this.cancelAuthModalBtn.addEventListener('click', () => this.closeAuthModal());
    this.authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));

    this.closeHandoutModalBtn.addEventListener('click', () => this.closeHandoutModal());
    this.cancelHandoutModalBtn.addEventListener('click', () => this.closeHandoutModal());
    this.handoutForm.addEventListener('submit', (e) => this.handleHandoutSubmit(e));

    this.closeRescheduleModalBtn.addEventListener('click', () => this.closeRescheduleModal());
    this.cancelRescheduleModalBtn.addEventListener('click', () => this.closeRescheduleModal());
    this.rescheduleForm.addEventListener('submit', (e) => this.handleRescheduleSubmit(e));

    this.printBtn.addEventListener('click', () => {
      this.printSheetDate.textContent = `Date: ${this.formatFullDate(this.selectedDate)}`;
      window.print();
    });

    this.resetSampleDataBtn.addEventListener('click', () => {
      if (confirm('Clear all custom edits and reset to clean paper log sheet data?')) {
        this.orders = [...INITIAL_PAPER_ORDERS];
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
      this.inputCakeNo.value = orderToEdit.cakeNo || '';
      this.inputDate.value = orderToEdit.date || this.selectedDate;
      this.inputCustomerName.value = orderToEdit.customerName || '';
      this.inputPrice.value = orderToEdit.price || '';
      this.inputTime.value = orderToEdit.time || '10:00';
      this.inputDestination.value = orderToEdit.destination || '';
      this.inputDeliveryFee.value = orderToEdit.deliveryFee || '';
      this.inputInstructions.value = orderToEdit.instructions || '';
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
      signedBy: existingOrder ? (existingOrder.signedBy || '') : '',
      signedAt: existingOrder ? (existingOrder.signedAt || '') : '',
      leftStore: existingOrder ? !!existingOrder.leftStore : false,
      handedOutBy: existingOrder ? (existingOrder.handedOutBy || '') : '',
      handedOutAt: existingOrder ? (existingOrder.handedOutAt || '') : '',
      rescheduledTo: existingOrder ? (existingOrder.rescheduledTo || '') : '',
      rescheduledFrom: existingOrder ? (existingOrder.rescheduledFrom || '') : ''
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

  toggleLeftStoreStatus(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.leftStore) {
      if (confirm('Undo order departure status?')) {
        order.leftStore = false;
        order.handedOutBy = '';
        order.handedOutAt = '';
        this.saveOrders();
      } else {
        this.render();
      }
    } else {
      this.openHandoutModal(orderId);
    }
  }

  openHandoutModal(orderId) {
    this.pendingHandoutOrderId = orderId;
    this.handoutForm.reset();
    this.handoutErrorMsg.classList.add('hidden');
    this.handoutModal.classList.remove('hidden');
    this.handoutPasswordInput.focus();
  }

  closeHandoutModal() {
    this.handoutModal.classList.add('hidden');
    this.pendingHandoutOrderId = null;
    this.render();
  }

  handleHandoutSubmit(e) {
    e.preventDefault();

    const selectedUser = this.handoutForm.querySelector('input[name="handoutUser"]:checked')?.value;
    const enteredPassword = this.handoutPasswordInput.value.trim();

    if (enteredPassword !== USERS[selectedUser]) {
      this.handoutErrorMsg.classList.remove('hidden');
      this.handoutPasswordInput.value = '';
      this.handoutPasswordInput.focus();
      return;
    }

    const order = this.orders.find(o => o.id === this.pendingHandoutOrderId);
    if (order) {
      order.leftStore = true;
      order.handedOutBy = selectedUser;
      order.handedOutAt = this.getFormattedTimeOnly();
      this.saveOrders();
    }

    this.closeHandoutModal();
  }

  openRescheduleModal(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    this.pendingRescheduleOrderId = orderId;
    this.rescheduleForm.reset();
    this.rescheduleCurrentDateDisplay.value = this.formatFullDate(order.date);
    this.rescheduleNewDateInput.value = '';

    this.rescheduleModal.classList.remove('hidden');
    this.rescheduleNewDateInput.focus();
  }

  closeRescheduleModal() {
    this.rescheduleModal.classList.add('hidden');
    this.pendingRescheduleOrderId = null;
  }

  handleRescheduleSubmit(e) {
    e.preventDefault();

    const newDate = this.rescheduleNewDateInput.value;
    const reason = this.rescheduleReasonInput.value.trim();

    const originalOrder = this.orders.find(o => o.id === this.pendingRescheduleOrderId);
    if (!originalOrder) return;

    const originalDate = originalOrder.date;

    if (newDate === originalDate) {
      alert('Please select a different date to reschedule to!');
      return;
    }

    originalOrder.rescheduledTo = newDate;

    const newRescheduledOrder = {
      ...originalOrder,
      id: `${newDate}_${originalOrder.cakeNo}_rescheduled_${Date.now()}`,
      date: newDate,
      rescheduledFrom: originalDate,
      rescheduledTo: '',
      instructions: reason ? `${originalOrder.instructions ? originalOrder.instructions + ' | ' : ''}Rescheduled: ${reason}` : (originalOrder.instructions || ''),
      leftStore: false,
      handedOutBy: '',
      handedOutAt: ''
    };

    this.orders.unshift(newRescheduledOrder);
    this.saveOrders();
    this.closeRescheduleModal();
  }

  getFormattedTimestamp() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${now.toISOString().split('T')[0]} ${timeStr}`;
  }

  getFormattedTimeOnly() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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
    const [hours, minutes] = (time24 || '').split(':');
    if (!hours || !minutes) return time24 || '';
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  }

  getOrdersForActiveDate() {
    const search = (this.searchInput.value || '').toLowerCase().trim();
    const paymentFilter = this.filterPayment.value;
    const pickupFilter = this.filterPickup.value;

    return this.orders.filter(order => {
      if (order.date !== this.selectedDate) return false;

      const cakeNoStr = (order.cakeNo || '').toString().toLowerCase();
      const customerStr = (order.customerName || '').toLowerCase();
      const priceStr = (order.price || '').toString().toLowerCase();
      const feeStr = (order.deliveryFee || '').toString().toLowerCase();
      const partialStr = (order.partialAmount || '').toString().toLowerCase();
      const destStr = (order.destination || '').toLowerCase();
      const instrStr = (order.instructions || '').toLowerCase();

      const matchSearch = !search ||
        cakeNoStr.includes(search) ||
        customerStr.includes(search) ||
        priceStr.includes(search) ||
        feeStr.includes(search) ||
        partialStr.includes(search) ||
        destStr.includes(search) ||
        instrStr.includes(search);

      const matchPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
      const matchPickup = pickupFilter === 'ALL' || order.pickup === pickupFilter;

      return matchSearch && matchPayment && matchPickup;
    });
  }

  updateStats() {
    const dateOrders = this.orders.filter(o => o.date === this.selectedDate);
    const total = dateOrders.length;
    const remainingCount = dateOrders.filter(o => !o.leftStore && !o.rescheduledTo).length;

    const whish = dateOrders.filter(o => o.paymentStatus === 'Paid Whish').length;
    const cash = dateOrders.filter(o => o.paymentStatus === 'Paid Cash').length;
    const partial = dateOrders.filter(o => o.paymentStatus === 'Partial Paid').length;
    const unpaid = dateOrders.filter(o => o.paymentStatus === 'Not Paid' || o.paymentStatus === 'Not Decided').length;

    let totalDeliveryFeesSum = 0;
    dateOrders.forEach(o => {
      if (o.pickup === 'NO' && o.deliveryFee) {
        const fee = parseFloat(o.deliveryFee);
        if (!isNaN(fee)) totalDeliveryFeesSum += fee;
      }
    });

    this.statTotalOrders.textContent = total;
    this.statOrdersRemaining.textContent = `${remainingCount} Left`;
    this.statPaidWhish.textContent = whish;
    this.statPaidCash.textContent = cash;
    this.statPartialPaid.textContent = partial;
    this.statNotPaid.textContent = unpaid;
    this.statTotalDeliveryFees.textContent = `$${totalDeliveryFeesSum.toFixed(2)}`;
  }

  renderArchives() {
    const dateMap = {};

    this.orders.forEach(order => {
      if (!dateMap[order.date]) {
        dateMap[order.date] = { date: order.date, total: 0, whish: 0, cash: 0, partial: 0, unpaid: 0, deliveryFees: 0 };
      }
      dateMap[order.date].total++;
      if (order.paymentStatus === 'Paid Whish') dateMap[order.date].whish++;
      else if (order.paymentStatus === 'Paid Cash') dateMap[order.date].cash++;
      else if (order.paymentStatus === 'Partial Paid') dateMap[order.date].partial++;
      else dateMap[order.date].unpaid++;

      if (order.pickup === 'NO' && order.deliveryFee) {
        const fee = parseFloat(order.deliveryFee);
        if (!isNaN(fee)) dateMap[order.date].deliveryFees += fee;
      }
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
            <span class="archive-stat-tag" style="color: #2563EB;">Delivery Fees: <strong>$${day.deliveryFees.toFixed(2)}</strong></span>
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
    try {
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

          if (order.leftStore) {
            tr.className = 'row-left-store';
          }

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

          let destinationDisplay = '<span style="color:#aaa;">—</span>';
          if (order.pickup === 'YES') {
            destinationDisplay = order.destination ? `${order.destination} <span class="badge-no">Store Pickup</span>` : '<span class="badge-no">Store Pickup</span>';
          } else {
            const feeBadge = order.deliveryFee ? `<span class="delivery-fee-badge"><i class="ri-truck-line"></i> +$${order.deliveryFee} Fee</span>` : '';
            destinationDisplay = `${order.destination || 'Delivery'} ${feeBadge}`;
          }

          let portalBadgeHtml = '';
          if (order.rescheduledTo) {
            portalBadgeHtml = `<br><span class="portal-badge to" data-target="${order.rescheduledTo}" title="Click to view destination date sheet"><i class="ri-arrow-right-line"></i> Rescheduled to ${order.rescheduledTo}</span>`;
          } else if (order.rescheduledFrom) {
            portalBadgeHtml = `<br><span class="portal-badge from" data-target="${order.rescheduledFrom}" title="Click to view original date sheet"><i class="ri-arrow-left-line"></i> Rescheduled from ${order.rescheduledFrom}</span>`;
          }

          let signedByHtml = order.signedBy ? `<span class="signed-user"><i class="ri-shield-check-fill" style="color:#10B981;"></i> ${order.signedBy}</span><span class="signed-time">${order.signedAt || '—'}</span>` : '<span style="color:#aaa;">—</span>';

          let handoutCellHtml = `
            <div class="left-store-box">
              <input type="checkbox" class="left-store-checkbox" ${order.leftStore ? 'checked' : ''} title="Check when order leaves store">
              ${order.leftStore ? `<span class="handout-signature-tag">by ${order.handedOutBy || 'Staff'} ${order.handedOutAt ? '@ ' + order.handedOutAt : ''}</span>` : ''}
            </div>
          `;

          tr.innerHTML = `
            <td><span class="cake-number">${order.cakeNo || '0'}</span></td>
            <td>${this.formatFullDate(order.date).split(',')[0]}, ${order.date}</td>
            <td><strong>${order.customerName || 'Customer'}</strong> ${portalBadgeHtml}</td>
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
              ${signedByHtml}
            </td>
            <td style="text-align: center;">
              ${handoutCellHtml}
            </td>
            <td style="text-align: center;" class="no-print">
              <div class="action-btns">
                <button class="btn-table-action reschedule" title="Reschedule Order">
                  <i class="ri-history-line"></i>
                </button>
                <button class="btn-table-action edit" title="Edit Order">
                  <i class="ri-edit-line"></i>
                </button>
                <button class="btn-table-action delete" title="Delete Order">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </td>
          `;

          const portalBtn = tr.querySelector('.portal-badge');
          if (portalBtn) {
            portalBtn.addEventListener('click', () => {
              const targetDate = portalBtn.getAttribute('data-target');
              if (targetDate) {
                this.selectedDate = targetDate;
                this.selectedDateInput.value = targetDate;
                this.render();
              }
            });
          }

          const leftStoreChk = tr.querySelector('.left-store-checkbox');
          leftStoreChk.addEventListener('change', () => this.toggleLeftStoreStatus(order.id));

          tr.querySelector('.payment-badge').addEventListener('click', () => this.openAuthModal(order.id));
          tr.querySelector('.btn-table-action.reschedule').addEventListener('click', () => this.openRescheduleModal(order.id));
          tr.querySelector('.btn-table-action.edit').addEventListener('click', () => this.openOrderModal(order));
          tr.querySelector('.btn-table-action.delete').addEventListener('click', () => this.deleteOrder(order.id));

          this.tableBody.appendChild(tr);
        });
      }

      if (this.currentTab === 'archives') {
        this.renderArchives();
      }
    } catch (err) {
      console.error('Error rendering dashboard orders:', err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.candyBunchApp = new CandyBunchApp();
});

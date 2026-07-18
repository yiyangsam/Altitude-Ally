import type { Order, User } from './DataContext';

function escapeCsvValue(value: unknown) {
  let text = String(value ?? '');
  if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function findOrderCustomer(order: Order, users: User[]) {
  if (order.user_id) {
    const linkedCustomer = users.find(user => user.id === order.user_id);
    if (linkedCustomer) return linkedCustomer;
  }

  const nameMatches = users.filter(user => user.name === order.customerName);
  return nameMatches.length === 1 ? nameMatches[0] : undefined;
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function buildOrdersCsv(orders: Order[], users: User[]) {
  const headers = [
    'Customer Name',
    'Email',
    'Phone',
    'Address',
    'Date Ordered',
    'Items Ordered',
    'Price (THB)'
  ];

  const rows = orders.map(order => {
    const customer = findOrderCustomer(order, users);
    return [
      customer?.name || order.customerName,
      customer?.email || '',
      customer?.phone || '',
      customer?.address || '',
      formatOrderDate(order.date),
      order.items.join(' | '),
      Number(order.total).toFixed(2)
    ];
  });

  return [headers, ...rows]
    .map(row => row.map(escapeCsvValue).join(','))
    .join('\r\n');
}

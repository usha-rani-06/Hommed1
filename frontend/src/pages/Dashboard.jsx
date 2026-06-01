import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

const currency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const formatAddress = (address = {}) =>
  [
    address.fullName,
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
    address.country
  ]
    .filter(Boolean)
    .join(', ');

const toDateKey = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toMonthKey = (value) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const buildAnalytics = (orders, range) => {
  const buckets = new Map();

  for (const order of orders) {
    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) continue;

    let key = '';
    let label = '';

    if (range === 'month') {
      key = toMonthKey(date);
      label = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    } else if (range === 'year') {
      key = String(date.getFullYear());
      label = key;
    } else {
      key = toDateKey(date);
      label = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }

    const current = buckets.get(key) || {
      key,
      label,
      orders: 0,
      revenue: 0
    };

    current.orders += 1;
    current.revenue += Number(order?.totals?.total || 0);
    buckets.set(key, current);
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-12);
};

const buildLinePath = (rows, key, width = 640, height = 240, padding = 28) => {
  if (!rows.length) return { linePath: '', areaPath: '', points: [], maxValue: 1 };

  const maxValue = Math.max(...rows.map((row) => Number(row[key] || 0)), 1);
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const stepX = rows.length > 1 ? chartWidth / (rows.length - 1) : 0;

  const points = rows.map((row, index) => {
    const value = Number(row[key] || 0);
    const x = padding + stepX * index;
    const y = padding + chartHeight - (value / maxValue) * chartHeight;
    return { x, y, value, label: row.label };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${height - padding} Z`;

  return { linePath, areaPath, points, maxValue };
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [range, setRange] = useState('day');
  const [selectedOrderDate, setSelectedOrderDate] = useState('');
  const [openOrderId, setOpenOrderId] = useState('');
  const [isCompact, setIsCompact] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));

  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';
  const adminToken = localStorage.getItem('adminToken') || '';

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const loadOrders = useCallback(
    async (soft = false) => {
      if (!adminToken) {
        navigate('/admin/login', { replace: true });
        return;
      }

      if (soft) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        setError('');
        const data = await apiRequest('/admin/orders', {
          method: 'GET',
          token: adminToken
        });

        const nextOrders = Array.isArray(data.orders) ? data.orders : [];
        setOrders(nextOrders);
        if (openOrderId && !nextOrders.some((order) => order.id === openOrderId)) {
          setOpenOrderId('');
        }
      } catch (err) {
        const message = String(err?.message || '');
        if (message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('invalid token') || message.toLowerCase().includes('token expired')) {
          handleLogout();
          return;
        }
        setError(message || 'Failed to load orders');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [adminToken, navigate, handleLogout, openOrderId]
  );

  useEffect(() => {
    loadOrders(false);
    const id = window.setInterval(() => loadOrders(true), 15000);
    return () => window.clearInterval(id);
  }, [loadOrders]);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getOrderDateKey = useCallback((value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return toDateKey(date);
  }, []);

  const filteredOrders = useMemo(() => {
    if (!selectedOrderDate) return orders;
    return orders.filter((order) => getOrderDateKey(order.createdAt) === selectedOrderDate);
  }, [orders, selectedOrderDate, getOrderDateKey]);

  const openOrder = useMemo(
    () => filteredOrders.find((order) => order.id === openOrderId) || null,
    [filteredOrders, openOrderId]
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order?.totals?.total || 0), 0),
    [orders]
  );

  const analyticsData = useMemo(() => buildAnalytics(orders, range), [orders, range]);
  const analyticsRevenue = useMemo(
    () => analyticsData.reduce((sum, row) => sum + row.revenue, 0),
    [analyticsData]
  );
  const analyticsOrders = useMemo(
    () => analyticsData.reduce((sum, row) => sum + row.orders, 0),
    [analyticsData]
  );
  const orderTrend = useMemo(() => buildLinePath(analyticsData, 'orders'), [analyticsData]);
  const incomeTrend = useMemo(() => buildLinePath(analyticsData, 'revenue'), [analyticsData]);

  return (
    <main style={{ minHeight: '76vh', background: '#f8f4ec', padding: '24px 16px 40px', fontFamily: '"Geist", "Poppins", Arial, sans-serif' }}>
      <section style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '220px minmax(0, 1fr)', gap: '16px' }}>
        <aside style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: isCompact ? 'row' : 'column', flexWrap: isCompact ? 'wrap' : 'nowrap', gap: '10px', minHeight: isCompact ? 'auto' : '420px', position: isCompact ? 'static' : 'sticky', top: '16px' }}>
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            style={{
              height: '46px',
              borderRadius: '10px',
              border: '1px solid #d6c3a8',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeView === 'dashboard' ? '#b57a08' : '#fff',
              color: activeView === 'dashboard' ? '#fff' : '#5b4a34'
            }}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveView('orders')}
            style={{
              height: '46px',
              borderRadius: '10px',
              border: '1px solid #d6c3a8',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeView === 'orders' ? '#b57a08' : '#fff',
              color: activeView === 'orders' ? '#fff' : '#5b4a34'
            }}
          >
            Orders
          </button>
          <div style={{ marginTop: isCompact ? '0' : 'auto', width: isCompact ? '100%' : 'auto' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{ width: '100%', height: '46px', border: 'none', borderRadius: '10px', background: '#a53024', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </aside>

        <section style={{ display: 'grid', gap: '16px' }}>
          <header style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.1 }}>{activeView === 'dashboard' ? 'Dashboard' : 'Orders'}</h1>
                <p style={{ margin: '6px 0 0', color: '#5e564d', fontSize: '14px' }}>
                  Signed in as <strong>{adminEmail}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                {activeView === 'dashboard' && (
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    style={{ height: '40px', borderRadius: '10px', border: '1px solid #cfb188', padding: '0 12px', background: '#fff' }}
                  >
                    <option value="day">Daily</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                )}

                {activeView === 'orders' && (
                  <>
                    <input
                      type="date"
                      value={selectedOrderDate}
                      onChange={(e) => setSelectedOrderDate(e.target.value)}
                      style={{ height: '40px', borderRadius: '10px', border: '1px solid #cfb188', padding: '0 12px', background: '#fff' }}
                    />
                    {selectedOrderDate && (
                      <button
                        type="button"
                        onClick={() => setSelectedOrderDate('')}
                        style={{ height: '40px', border: '1px solid #cfb188', borderRadius: '10px', background: '#fff', padding: '0 14px', cursor: 'pointer', fontWeight: 600, color: '#7b5300' }}
                      >
                        Clear
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={() => loadOrders(true)}
                  disabled={refreshing}
                  style={{ height: '40px', border: '1px solid #cfb188', borderRadius: '10px', background: '#fff9ef', padding: '0 14px', cursor: 'pointer', fontWeight: 600, color: '#7b5300' }}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </header>

          {error && (
            <div style={{ background: '#fff1ef', border: '1px solid #f0c2bc', borderRadius: '12px', padding: '12px 14px', color: '#943f33', fontSize: '14px', fontWeight: 600 }}>
              {error}
            </div>
          )}

          {loading ? (
            <section style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', color: '#5e564d' }}>
              Loading orders...
            </section>
          ) : activeView === 'dashboard' ? (
            <section style={{ display: 'grid', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#fff', border: '1px solid #eadcc8', borderRadius: '12px', padding: '12px' }}>
                  <small style={{ color: '#857760' }}>Total Orders</small>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{orders.length}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #eadcc8', borderRadius: '12px', padding: '12px' }}>
                  <small style={{ color: '#857760' }}>Total Revenue</small>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{currency(totalRevenue)}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #eadcc8', borderRadius: '12px', padding: '12px' }}>
                  <small style={{ color: '#857760' }}>{range === 'day' ? 'Daily' : range === 'month' ? 'Monthly' : 'Yearly'} Orders</small>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{analyticsOrders}</div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #eadcc8', borderRadius: '12px', padding: '12px' }}>
                  <small style={{ color: '#857760' }}>{range === 'day' ? 'Daily' : range === 'month' ? 'Monthly' : 'Yearly'} Revenue</small>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{currency(analyticsRevenue)}</div>
                </div>
              </div>

              {!analyticsData.length ? (
                <div style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '24px', textAlign: 'center', color: '#6f675c' }}>
                  No analytics data available.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr', gap: '12px' }}>
                  <article style={{ background: 'linear-gradient(180deg, #2f2116 0%, #22170f 100%)', border: '1px solid #8c6a48', borderRadius: '14px', padding: '14px', color: '#f2e2c8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '16px' }}>Orders Graph</h2>
                      <small style={{ color: '#ddc7a8' }}>{range === 'day' ? 'Per Day' : range === 'month' ? 'Per Month' : 'Per Year'}</small>
                    </div>
                    <svg viewBox="0 0 640 240" style={{ width: '100%', height: '240px', display: 'block', background: 'linear-gradient(180deg, #3a2a1d 0%, #291c13 100%)', borderRadius: '10px' }}>
                      {[0, 1, 2, 3, 4].map((line) => {
                        const y = 28 + ((240 - 56) * line) / 4;
                        return <line key={`og-${line}`} x1="28" y1={y} x2="612" y2={y} stroke="#6f5539" strokeWidth="1" />;
                      })}
                      <path d={orderTrend.areaPath} fill="rgba(169, 121, 72, 0.24)" />
                      <path d={orderTrend.linePath} stroke="#c6894a" strokeWidth="4" fill="none" strokeLinecap="round" />
                      {orderTrend.points.map((point, idx) => (
                        <circle key={`op-${idx}`} cx={point.x} cy={point.y} r="4" fill="#efd7b2" />
                      ))}
                    </svg>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                      {analyticsData.map((row) => (
                        <span key={`ol-${row.key}`} style={{ fontSize: '11px', color: '#ead6b8', border: '1px solid #8d6c48', borderRadius: '999px', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                          {row.label}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#ddc7a8' }}>Peak Orders: <strong style={{ color: '#fff8e8' }}>{orderTrend.maxValue}</strong></div>
                      <div style={{ fontSize: '12px', color: '#ddc7a8' }}>Periods: <strong style={{ color: '#fff8e8' }}>{analyticsData.length}</strong></div>
                      <div style={{ fontSize: '12px', color: '#ddc7a8', textAlign: 'right' }}>Total: <strong style={{ color: '#fff8e8' }}>{analyticsOrders}</strong></div>
                    </div>
                  </article>

                  <article style={{ background: 'linear-gradient(180deg, #2f2116 0%, #22170f 100%)', border: '1px solid #8c6a48', borderRadius: '14px', padding: '14px', color: '#f2e2c8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '16px' }}>Income Graph</h2>
                      <small style={{ color: '#ddc7a8' }}>{range === 'day' ? 'Per Day' : range === 'month' ? 'Per Month' : 'Per Year'}</small>
                    </div>
                    <svg viewBox="0 0 640 240" style={{ width: '100%', height: '240px', display: 'block', background: 'linear-gradient(180deg, #3a2a1d 0%, #291c13 100%)', borderRadius: '10px' }}>
                      {[0, 1, 2, 3, 4].map((line) => {
                        const y = 28 + ((240 - 56) * line) / 4;
                        return <line key={`ig-${line}`} x1="28" y1={y} x2="612" y2={y} stroke="#6f5539" strokeWidth="1" />;
                      })}
                      <path d={incomeTrend.areaPath} fill="rgba(220, 182, 129, 0.28)" />
                      <path d={incomeTrend.linePath} stroke="#f0cb93" strokeWidth="4" fill="none" strokeLinecap="round" />
                      {incomeTrend.points.map((point, idx) => (
                        <circle key={`ip-${idx}`} cx={point.x} cy={point.y} r="4" fill="#fff0d9" />
                      ))}
                    </svg>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                      {analyticsData.map((row) => (
                        <span key={`il-${row.key}`} style={{ fontSize: '11px', color: '#ead6b8', border: '1px solid #8d6c48', borderRadius: '999px', padding: '3px 8px', whiteSpace: 'nowrap' }}>
                          {row.label}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#ddc7a8' }}>Peak Income: <strong style={{ color: '#fff8e8' }}>{currency(incomeTrend.maxValue)}</strong></div>
                      <div style={{ fontSize: '12px', color: '#ddc7a8' }}>Periods: <strong style={{ color: '#fff8e8' }}>{analyticsData.length}</strong></div>
                      <div style={{ fontSize: '12px', color: '#ddc7a8', textAlign: 'right' }}>Total: <strong style={{ color: '#fff8e8' }}>{currency(analyticsRevenue)}</strong></div>
                    </div>
                  </article>
                </div>
              )}
            </section>
          ) : !filteredOrders.length ? (
            <section style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '28px 20px', textAlign: 'center', color: '#5e564d' }}>
              {selectedOrderDate ? `No orders found for ${selectedOrderDate}.` : 'No orders found.'}
            </section>
          ) : (
            <section style={{ background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '0 0 12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1.3fr 1fr 1fr 56px' : '1.5fr 1fr 1fr 56px', gap: '8px', alignItems: 'center', background: '#f8efe0', borderBottom: '1px solid #eadbc6', padding: '12px 14px', fontSize: '12px', letterSpacing: '.05em', textTransform: 'uppercase', color: '#7a6546', fontWeight: 700 }}>
                <span>Order ID</span>
                <span>Date</span>
                <span>User Name</span>
                <span style={{ textAlign: 'right' }}>Open</span>
              </div>

              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isCompact ? '1.3fr 1fr 1fr 56px' : '1.5fr 1fr 1fr 56px',
                    gap: '8px',
                    alignItems: 'center',
                    padding: '12px 14px',
                    margin: '10px 12px 0',
                    border: '1px solid #e9dcc8',
                    borderRadius: '12px',
                    background: index % 2 ? '#fffaf2' : '#ffffff',
                    fontSize: '15px'
                  }}
                >
                  <strong style={{ color: '#20160d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.orderNumber || order.id}</strong>
                  <span style={{ color: '#6d5a43', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '-'}
                  </span>
                  <span style={{ color: '#7b5300', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.user?.name || '-'}</span>
                  <button
                    type="button"
                    onClick={() => setOpenOrderId(order.id)}
                    aria-label="Open order details popup"
                    style={{ justifySelf: 'end', width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #d9c39e', background: '#fff9ef', color: '#7b5300', fontWeight: 800, fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}
                  >
                    &gt;
                  </button>
                </div>
              ))}
            </section>
          )}
        </section>
      </section>

      {openOrder && (
        <div
          onClick={() => setOpenOrderId('')}
          style={{ position: 'fixed', inset: 0, background: 'rgba(32, 20, 8, .52)', zIndex: 1200, display: 'grid', placeItems: 'center', padding: '16px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(920px, 100%)', maxHeight: '90vh', overflowY: 'auto', background: '#fff', border: '1px solid #e6d7c1', borderRadius: '14px', padding: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '10px', marginBottom: '12px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '28px' }}>{openOrder.orderNumber || openOrder.id}</h2>
                <p style={{ margin: 0, color: '#5e564d' }}>{openOrder.createdAt ? new Date(openOrder.createdAt).toLocaleString() : 'No date'}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenOrderId('')}
                style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #d9c39e', background: '#fff', cursor: 'pointer', color: '#7b5300', fontWeight: 800 }}
              >
                X
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
              <div style={{ border: '1px solid #efe2cf', borderRadius: '10px', padding: '10px', background: '#fffdf9' }}>
                <div style={{ fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#9a825f', marginBottom: '6px', fontWeight: 700 }}>Customer</div>
                <div style={{ color: '#1f1a14', fontSize: '28px', fontWeight: 800, lineHeight: 1.08 }}>{openOrder.user?.name || '-'}</div>
                <div style={{ color: '#5a4732', fontSize: '15px', fontWeight: 500 }}>{openOrder.user?.email || '-'}</div>
                <div style={{ color: '#6d5a43', fontSize: '15px', fontWeight: 600 }}>{openOrder.user?.phone || '-'}</div>
              </div>

              <div style={{ border: '1px solid #efe2cf', borderRadius: '10px', padding: '10px', background: '#fffdf9' }}>
                <div style={{ fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#9a825f', marginBottom: '6px', fontWeight: 700 }}>Payment</div>
                <div style={{ textTransform: 'uppercase', fontWeight: 800, color: '#7b5300', fontSize: '26px', lineHeight: 1.05 }}>{openOrder.paymentMethod || 'COD'}</div>
                <div style={{ color: '#6d5a43', fontSize: '15px' }}>Items: <strong style={{ color: '#2c2012' }}>{(openOrder.items || []).length}</strong></div>
                <div style={{ color: '#2f6d30', fontWeight: 800, fontSize: '18px' }}>Total: {currency(openOrder.totals?.total)}</div>
                <div style={{ color: '#5e564d', fontSize: '15px' }}>
                  Status: <strong style={{ color: '#8a5e01', textTransform: 'uppercase' }}>{openOrder.status || 'processing'}</strong>
                </div>
              </div>

              <div style={{ border: '1px solid #efe2cf', borderRadius: '10px', padding: '10px', background: '#fffdf9' }}>
                <div style={{ fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', color: '#9a825f', marginBottom: '6px', fontWeight: 700 }}>Shipping Address</div>
                <div style={{ color: '#3a2f21', fontSize: '15px', lineHeight: 1.5 }}>
                  {formatAddress(openOrder.shippingAddress) || '-'}
                </div>
                <div style={{ color: '#6d5a43', fontSize: '15px', marginTop: '6px', fontWeight: 600 }}>{openOrder.shippingAddress?.phone || ''}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f2e8d9', marginTop: '12px', paddingTop: '12px', display: 'grid', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2c2012' }}>Ordered Items</h3>
              {(openOrder.items || []).map((item, idx) => (
                <div key={`${openOrder.id}-${item.productId || idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', alignItems: 'center', fontSize: '14px', border: '1px solid #e7d8c1', borderRadius: '10px', padding: '10px', background: '#fffdf9' }}>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ display: 'block', color: '#2c2012', fontSize: '25px', lineHeight: 1.08 }}>{item.name || 'Product'}</strong>
                    <small style={{ color: '#846d4f', fontSize: '15px' }}>Product ID: {item.productId || '-'}</small>
                  </div>
                  <span style={{ color: '#6b583f', fontSize: '15px', fontWeight: 600 }}>x{item.qty || 1}</span>
                  <strong style={{ color: '#7b5300', fontSize: '25px', lineHeight: 1.05 }}>{currency((item.price || 0) * (item.qty || 1))}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

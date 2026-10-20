import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import moment from 'moment-timezone';
import { Icon } from "@iconify/react";
import classes from "./Dashboard.module.scss";

interface QuoteItem {
  _id: string;
  customer: string;
  user: string;
  create_date: string;
  amount: number;
}

interface DashboardStats {
  quoteCount: number;
  customerCount: number;
  latestQuotes: QuoteItem[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    quoteCount: 0,
    customerCount: 0,
    latestQuotes: [],
  });
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Chào buổi sáng' : (hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối');
  });
  const [recentTotal, setRecentTotal] = useState(0);

  const colors = ['#43a047', '#1e88e5', '#fb8c00', '#8e24aa', '#e53935'];

  const avatarColor = (index: number) => colors[index % colors.length];

  const barWidth = (amount: number) => {
    const max = Math.max(0, ...stats.latestQuotes.map(q => q.amount || 0));
    return max ? Math.max(3, Math.round((amount || 0) / max * 100)) : 0;
  };

  const formatNumber = (num: number) => num.toLocaleString('vi-VN');

  const fetchStats = async () => {
    try {
      const [quoteCount, customerCount, latestQuotes] = await Promise.all([
        apiClient.get('/quotes/count'),
        apiClient.get('/customers/count'),
        apiClient.get('/quotes?pageSize=5&pageNumber=1'),
      ]);
      setStats({
        quoteCount: quoteCount.data?.count || 0,
        customerCount: customerCount.data?.count || 0,
        latestQuotes: latestQuotes.data?.data || [],
      });
      const total = (latestQuotes.data?.data || []).reduce((sum: number, q: QuoteItem) => sum + (q.amount || 0), 0);
      setRecentTotal(total);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className={classes.loading}>Đang tải...</div>;
  }

  return (
    <section className={classes.dashboard}>
      <div className={classes.hero}>
        <div className={classes.heroText}>
          <span className={classes.heroTag}><Icon icon="solar:sun-bold" width="14" /> {greeting}</span>
          <h1>Xin chào, 👋</h1>
          <p>Tổng quan hoạt động kinh doanh của bạn hôm nay.</p>
        </div>
        <div className={classes.heroDate}>
          <Icon icon="solar:calendar-bold" width="14" />
          {moment(today).locale('vi').format('dddd, DD/MM/YYYY')}
        </div>
      </div>

      <div className={classes.row}>
        <div className={`${classes.col} ${classes.colMd4} ${classes.colSm6}`}>
          <div className={`${classes.card} ${classes.cardGreen}`}>
            <div className={classes.cardIcon}>
              <Icon icon="solar:document-text-bold" width="24" />
            </div>
            <div className={classes.cardBody}>
              <span className={classes.cardLabel}>Báo giá</span>
              <span className={classes.cardValue}>{formatNumber(stats.quoteCount)}</span>
              <span className={classes.cardSub}>Tổng số báo giá đã tạo</span>
            </div>
          </div>
        </div>

        <div className={`${classes.col} ${classes.colMd4} ${classes.colSm6}`}>
          <a href="/crm/customers" className={classes.cardLink}>
            <div className={`${classes.card} ${classes.cardBlue}`}>
              <div className={classes.cardIcon}>
                <Icon icon="solar:users-group-rounded-bold" width="24" />
              </div>
              <div className={classes.cardBody}>
                <span className={classes.cardLabel}>Khách hàng</span>
                <span className={classes.cardValue}>{formatNumber(stats.customerCount)}</span>
                <span className={classes.cardSub}>Xem danh sách khách hàng</span>
              </div>
              <div className={classes.cardArrow}>
                <Icon icon="solar:arrow-right-bold" width="16" />
              </div>
            </div>
          </a>
        </div>

        <div className={`${classes.col} ${classes.colMd4} ${classes.colSm12}`}>
          <div className={`${classes.card} ${classes.cardOrange}`}>
            <div className={classes.cardIcon}>
              <Icon icon="solar:wallet-money-bold" width="24" />
            </div>
            <div className={classes.cardBody}>
              <span className={classes.cardLabel}>Giá trị gần đây</span>
              <span className={classes.cardValue}>{formatNumber(recentTotal)} VNĐ</span>
              <span className={classes.cardSub}>{stats.latestQuotes.length} báo giá mới nhất</span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.row}>
        <div className={`${classes.col} ${classes.colMd8}`}>
          <section className={classes.panel}>
            <div className={classes.panelHead}>
              <h4><Icon icon="solar:clock-circle-bold" width="16" /> Báo giá gần đây</h4>
              <span className={classes.badge}>{stats.latestQuotes.length} mới nhất</span>
            </div>
            <div className={classes.tableWrapper}>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Người tạo</th>
                    <th>Ngày tạo</th>
                    <th className={classes.textRight}>Tổng tiền (VNĐ)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.latestQuotes.map((item, index) => (
                    <tr key={item._id}>
                      <td>
                        <span className={classes.avatar} style={{ background: avatarColor(index) }}>
                          {(item.customer || '?').charAt(0).toUpperCase()}
                        </span>
                        <b>{item.customer}</b>
                      </td>
                      <td>{item.user}</td>
                      <td><span className={classes.chip}>{moment(item.create_date).tz("Asia/Bangkok").format('DD/MM/YYYY')}</span></td>
                      <td className={classes.textRight}><b>{formatNumber(item.amount)}</b></td>
                    </tr>
                  ))}
                  {!stats.latestQuotes.length && (
                    <tr>
                      <td colSpan={4} className={classes.empty}>
                        <Icon icon="solar:archive-minimalistic-bold" width="24" />
                        <div>Chưa có báo giá</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className={`${classes.col} ${classes.colMd4}`}>
          <section className={classes.panel}>
            <div className={classes.panelHead}>
              <h4><Icon icon="solar:chart-bold" width="16" /> Giá trị theo báo giá</h4>
            </div>
            {stats.latestQuotes.length ? (
              <div className={classes.bars}>
                {stats.latestQuotes.map((item, index) => (
                  <div key={item._id} className={classes.barRow}>
                    <div className={classes.barLabel} title={item.customer}>{item.customer}</div>
                    <div className={classes.barTrack}>
                      <div
                        className={classes.barFill}
                        style={{ width: `${barWidth(item.amount)}%`, background: avatarColor(index) }}
                      ></div>
                    </div>
                    <div className={classes.barValue}>{formatNumber(item.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={classes.empty}>
                <Icon icon="solar:chart-bold" width="24" />
                <div>Chưa có dữ liệu</div>
              </div>
            )}
          </section>

          <section className={`${classes.panel} ${classes.actions}`}>
            <div className={classes.panelHead}>
              <h4><Icon icon="solar:bolt-bold" width="16" /> Thao tác nhanh</h4>
            </div>
            <div className={classes.actionsBody}>
              <a href="/crm/customers" className={classes.action}><Icon icon="solar:users-group-rounded-bold" width="16" /> Khách hàng</a>
              <a href="/crm/works" className={classes.action}><Icon icon="solar:briefcase-bold" width="16" /> Công việc</a>
              <a href="/crm/quote" className={classes.action}><Icon icon="solar:document-text-bold" width="16" /> Tạo báo giá</a>
              <a href="/crm/appointment" className={classes.action}><Icon icon="solar:calendar-bold" width="16" /> Lịch hẹn</a>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

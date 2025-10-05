import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Page from '../components/layout/Page';

export default function Demo() {
  const features = [
    { title: 'Seat Selection', desc: 'Visual seat maps per route/bus.' },
    { title: 'Real-time Availability', desc: 'Prevent overbooking with live stock.' },
    { title: 'Simple Payments', desc: 'Cards & vouchers (roadmap-ready).' },
    { title: 'Exports & Reports', desc: 'Daily/weekly CSV & Excel.' },
    { title: 'Admin CRUD', desc: 'Users, routes, tickets, reservas.' },
    { title: 'Mobile-first', desc: 'Optimized for phones and tablets.' },
  ];

  return (
    <Page>
      <section className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            <span className="text-yellow-400">Bus</span> Reservation
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            Minimal, fast, and reliable bookings for intercity buses. Built for real operations.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button as={Link} to="/login">Try Login</Button>
            <Button as={Link} to="/register" variant="ghost">Create Account</Button>
            <Button as={Link} to="/users" variant="link">Admin Demo →</Button>
          </div>
        </div>

        <Card title="Highlights">
          <div className="grid grid-cols-2 gap-4">
            {features.map((f,i)=>(
              <div key={i} className="bg-black/60 border border-white/10 rounded-xl p-4">
                <div className="text-yellow-400 font-semibold">{f.title}</div>
                <div className="text-white/70 text-sm mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="text-white/50 text-xs mt-4">
            Demo content. Wire payments and auth to go live.
          </div>
        </Card>
      </section>
    </Page>
  );
}

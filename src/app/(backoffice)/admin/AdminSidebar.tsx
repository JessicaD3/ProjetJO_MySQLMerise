"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

function Item({ href, icon, label }: { href: string; icon: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <li>
      <Link href={href} className={active ? "active" : ""}>
        <i className={icon}></i> <span>{label}</span>
      </Link>
    </li>
  );
}

export default function AdminSidebar({ login, role }: { login: string; role: string }) {
  const avatar = (login?.[0] ?? "A").toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          MILAN<span>CORTINA</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{avatar}</div>
        <div className="user-info">
          <h4>{login}</h4>
          <p>{role}</p>
        </div>
      </div>

      <ul className="sidebar-nav">
        <Item href="/admin" icon="fas fa-tachometer-alt" label="Tableau de bord" />
        <Item href="/admin/pays" icon="fas fa-flag" label="Pays" />
        <Item href="/admin/sports" icon="fas fa-skiing" label="Sports" />
        <Item href="/admin/sites" icon="fas fa-map-marker-alt" label="Sites" />
        <Item href="/admin/athletes" icon="fas fa-users" label="Athlètes" />
        <Item href="/admin/epreuves" icon="fas fa-calendar-alt" label="Épreuves" />
        <Item href="/admin/participations" icon="fas fa-link" label="Participations" />
        <Item href="/admin/resultats" icon="fas fa-stopwatch" label="Résultats" />
        <Item href="/admin/medailles" icon="fas fa-medal" label="Médailles" />
        <Item href="/admin/billetterie" icon="fas fa-ticket-alt" label="Billetterie" />
      </ul>

      <div className="sidebar-footer">
        <div className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> <span><LogoutButton /></span>
        </div>
      </div>
    </aside>
  );
}
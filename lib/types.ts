export type ReportStatus = "pending" | "terverifikasi" | "diproses" | "selesai" | "ditolak";

export type ReportCategory = "sampah" | "limbah-cair" | "bau-warna" | "tanggul";

export type OfficerRole = "super_admin" | "korwil" | "petugas_lapangan";

export interface SubReport {
  id: string;
  reporterName: string;
  category: ReportCategory;
  categoryLabel: string;
  description: string;
  images: string[];
  createdAt: string;
  lat: number;
  lng: number;
}

export interface StatusTimeline {
  status: ReportStatus;
  label: string;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Report {
  id: string;
  ticketNo: string;
  riverName: string;
  region: string;
  category: ReportCategory;
  categoryLabel: string;
  locationDetail: string;
  lat: number;
  lng: number;
  description: string;
  reporterName: string;
  isAnonymous: boolean;
  upvotes: number;
  voteThreshold: number;
  urgencyScore: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  beforeImages: string[];
  afterImage?: string;
  officerNote?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  rejectionReason?: string;
  subReports: SubReport[];
  timeline: StatusTimeline[];
}

export interface Officer {
  id: string;
  name: string;
  nip: string;
  role: OfficerRole;
  roleLabel: string;
  region: string;
  phone: string;
  email: string;
  activeWorkload: number;
  completedTasks: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  ticketNo: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
}

export interface SystemConfig {
  globalThreshold: number;
  geofencingRadiusMeters: number;
  autoEscalationEnabled: boolean;
}

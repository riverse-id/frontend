import React, { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// -----------------------------------------------------------------------
// KONFIGURASI WARNA STATUS SUNGAI
// -----------------------------------------------------------------------
// "default"  -> hijau, belum pernah dilaporkan
// "tercemar" -> merah, laporan limbah cair / bau / bahaya pencemaran
// "sampah"   -> oranye, laporan sampah plastik menumpuk
const RIVER_STATUS_STYLE = {
  default: {
    color: "#22c55e", // hijau
    weight: 5,
    opacity: 0.9,
    label: "Belum Dilaporkan",
  },
  tercemar: {
    color: "#ef4444", // merah
    weight: 6,
    opacity: 0.95,
    label: "Tercemar / Bahaya",
  },
  sampah: {
    color: "#f97316", // oranye
    weight: 6,
    opacity: 0.95,
    label: "Banyak Sampah",
  },
};

// Style default kalau status tidak dikenali, fallback ke hijau
function getRiverStyle(feature) {
  const status = feature?.properties?.status || "default";
  const style = RIVER_STATUS_STYLE[status] || RIVER_STATUS_STYLE.default;
  return {
    color: style.color,
    weight: style.weight,
    opacity: style.opacity,
    lineCap: "round",
    lineJoin: "round",
  };
}

// -----------------------------------------------------------------------
// MARKER LAPORAN TITIK (opsional, tetap dipertahankan di atas garis sungai)
// -----------------------------------------------------------------------
const REPORT_STATUS_COLOR = {
  pending: "#f97316", // oranye
  terverifikasi: "#ef4444", // merah
  diproses: "#3b82f6", // biru
  selesai: "#22c55e", // hijau
};

function createReportIcon(status) {
  const color = REPORT_STATUS_COLOR[status] || "#6b7280";
  return L.divIcon({
    className: "river-report-marker",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 9999px;
      background:${color}; border:3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// Data dummy titik laporan (gantikan dengan data asli dari backend)
const DUMMY_REPORTS = [
  {
    id: "rpt-001",
    lat: -6.2380,
    lng: 106.8540,
    status: "terverifikasi",
    judul: "Limbah cair diduga industri",
    lokasi: "Kali Ciliwung - Manggarai",
  },
  {
    id: "rpt-002",
    lat: -6.2500,
    lng: 106.8480,
    status: "diproses",
    judul: "Bau menyengat dilaporkan warga",
    lokasi: "Kali Ciliwung - Kalibata",
  },
  {
    id: "rpt-003",
    lat: -6.2290,
    lng: 106.8760,
    status: "selesai",
    judul: "Pembersihan sampah plastik selesai",
    lokasi: "Kali Cipinang - Jatinegara",
  },
  {
    id: "rpt-004",
    lat: -6.2820,
    lng: 106.7300,
    status: "pending",
    judul: "Laporan baru menunggu verifikasi",
    lokasi: "Kali Pesanggrahan - Bintaro",
  },
];

// -----------------------------------------------------------------------
// KOMPONEN UTAMA
// -----------------------------------------------------------------------
export default function RiverStatusMap({
  geojsonUrl = "/data/rivers-dummy.geojson", // ganti ke endpoint API asli
  reports = DUMMY_REPORTS,
  activeFilter = "semua", // "semua" | "terverifikasi" | "diproses" | "selesai"
  onSelectRiverSegment, // callback(feature) saat segmen sungai diklik
  onSelectReport, // callback(report) saat marker laporan diklik
  center = [-6.2088, 106.8456],
  zoom = 11,
}) {
  const [riverData, setRiverData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(geojsonUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRiverData(data);
      })
      .catch((err) => {
        console.error("Gagal memuat data sungai:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [geojsonUrl]);

  const onEachRiverFeature = useCallback(
    (feature, layer) => {
      const { nama_sungai, status, keterangan } = feature.properties;
      const label =
        (RIVER_STATUS_STYLE[status] || RIVER_STATUS_STYLE.default).label;

      layer.bindPopup(
        `<div style="font-family: sans-serif; min-width:180px;">
          <strong>${nama_sungai}</strong><br/>
          <span style="color:${getRiverStyle(feature).color}; font-weight:600;">
            ${label}
          </span>
          <p style="margin:6px 0 0; font-size:13px; color:#444;">
            ${keterangan || ""}
          </p>
        </div>`
      );

      layer.on({
        click: () => onSelectRiverSegment?.(feature),
        mouseover: (e) => e.target.setStyle({ weight: 9 }),
        mouseout: (e) => e.target.setStyle(getRiverStyle(feature)),
      });
    },
    [onSelectRiverSegment]
  );

  const filteredReports = reports.filter((r) =>
    activeFilter === "semua" ? true : r.status === activeFilter
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        // Sesuaikan dengan basemap yang sudah kamu pakai (CARTO/OSM)
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
      />

      {riverData && (
        <GeoJSON
          data={riverData}
          style={getRiverStyle}
          onEachFeature={onEachRiverFeature}
        />
      )}

      {filteredReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={createReportIcon(report.status)}
          eventHandlers={{
            click: () => onSelectReport?.(report),
          }}
        >
          <Popup>
            <strong>{report.judul}</strong>
            <br />
            {report.lokasi}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// -----------------------------------------------------------------------
// KOMPONEN LEGENDA (opsional, tempel di pojok peta)
// -----------------------------------------------------------------------
export function RiverMapLegend() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "10px 16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
        fontFamily: "sans-serif",
        fontSize: 13,
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <strong style={{ marginRight: 4 }}>Legenda Sungai:</strong>
      {Object.entries(RIVER_STATUS_STYLE).map(([key, val]) => (
        <span key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 20,
              height: 4,
              borderRadius: 2,
              background: val.color,
              display: "inline-block",
            }}
          />
          {val.label}
        </span>
      ))}
    </div>
  );
}
